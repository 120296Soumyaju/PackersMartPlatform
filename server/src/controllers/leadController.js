const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { calculateLeadScore } = require('../services/scoringService');
const { matchCompaniesForLead } = require('../services/matchingService');

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Submit Customer Lead Form (POST /api/leads)
 */
async function createLead(req, res) {
  try {
    const {
      customerName,
      mobile,
      phone,
      email,
      pickupCity,
      originCity,
      destinationCity,
      serviceType,
      moveSize,
      movingDate,
      moveDate,
      additionalRequirements,
      notes
    } = req.body;

    const finalName = customerName;
    const finalMobile = mobile || phone;
    const finalPickup = pickupCity || originCity;
    const finalDest = destinationCity;
    const finalService = serviceType || moveSize;
    const finalMovingDate = movingDate || moveDate;
    const finalNotes = additionalRequirements || notes || null;

    if (!finalName || !finalMobile || !finalPickup || !finalDest || !finalService || !finalMovingDate) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields (Customer Name, Mobile Number, Pickup City, Destination City, Service Type, Moving Date)"
      });
    }

    const initialData = {
      customerName: finalName,
      mobile: finalMobile,
      email: email || null,
      pickupCity: finalPickup,
      destinationCity: finalDest,
      serviceType: finalService,
      movingDate: finalMovingDate,
      additionalRequirements: finalNotes,
      status: "Pending"
    };

    const scoreResult = calculateLeadScore(initialData);
    initialData.leadScore = scoreResult.score;
    initialData.leadQuality = scoreResult.leadQuality;

    const newLead = await prisma.lead.create({
      data: initialData
    });

    const otpCode = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.otpVerification.create({
      data: {
        leadId: newLead.id,
        otp: otpCode,
        expiresAt
      }
    });

    console.log(`[LEAD CONTROLLER] Lead created ${newLead.id} for ${newLead.customerName} (${newLead.mobile}). OTP: ${otpCode}`);

    return res.status(201).json({
      success: true,
      message: "Lead created successfully. OTP generated.",
      lead: newLead,
      testOtpCode: otpCode
    });
  } catch (error) {
    console.error("Error in createLead:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Get all submitted leads (GET /api/leads)
 */
async function getLeads(req, res) {
  try {
    const { status, leadQuality, search, sortBy } = req.query;

    const where = {};

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (leadQuality && leadQuality !== "ALL") {
      where.leadQuality = leadQuality;
    }

    if (search) {
      where.OR = [
        { customerName: { contains: search } },
        { mobile: { contains: search } },
        { pickupCity: { contains: search } },
        { destinationCity: { contains: search } },
        { serviceType: { contains: search } }
      ];
    }

    let orderBy = { createdAt: "desc" };
    if (sortBy === "score_desc") orderBy = { leadScore: "desc" };
    if (sortBy === "score_asc") orderBy = { leadScore: "asc" };

    const leads = await prisma.lead.findMany({
      where,
      orderBy,
      include: {
        matches: {
          include: {
            company: true
          }
        }
      }
    });

    return res.json({
      success: true,
      count: leads.length,
      leads
    });
  } catch (error) {
    console.error("Error in getLeads:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Get lead details by ID (GET /api/leads/:id)
 */
async function getLeadById(req, res) {
  try {
    const { id } = req.params;

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        matches: {
          include: {
            company: true
          },
          orderBy: { matchScore: "desc" }
        },
        otpVerifications: {
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!lead) {
      return res.status(404).json({ success: false, error: "Lead not found" });
    }

    const scoreResult = calculateLeadScore(lead);

    return res.json({
      success: true,
      lead,
      scoreBreakdown: scoreResult.breakdown
    });
  } catch (error) {
    console.error("Error in getLeadById:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Update lead status (PATCH /api/leads/:id/status)
 * Supported statuses: Pending, Verified, Fake, Duplicate, Re-attempt
 */
async function updateLeadStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const validStatuses = ["Pending", "Verified", "Fake", "Duplicate", "Re-attempt"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Allowed statuses: ${validStatuses.join(", ")}`
      });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (notes) updateData.additionalRequirements = notes;

    const lead = await prisma.lead.update({
      where: { id },
      data: updateData,
      include: {
        matches: {
          include: { company: true }
        }
      }
    });

    // If marked Verified, auto trigger company matching engine if no matches exist
    if (status === "Verified" && lead.matches.length === 0) {
      await matchCompaniesForLead(lead.id);
    }

    return res.json({
      success: true,
      message: `Lead status updated to ${status}`,
      lead
    });
  } catch (error) {
    console.error("Error in updateLeadStatus:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Get matching companies for lead (GET /api/leads/:id/matching-companies)
 */
async function getMatchingCompanies(req, res) {
  try {
    const { id } = req.params;

    let matches = await prisma.leadCompanyMatch.findMany({
      where: { leadId: id },
      include: { company: true },
      orderBy: { matchScore: "desc" }
    });

    if (matches.length === 0) {
      matches = await matchCompaniesForLead(id);
    }

    return res.json({
      success: true,
      leadId: id,
      count: matches.length,
      matchingCompanies: matches
    });
  } catch (error) {
    console.error("Error in getMatchingCompanies:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = {
  createLead,
  getLeads,
  getLeadById,
  updateLeadStatus,
  getMatchingCompanies
};
