const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { calculateLeadScore } = require('../services/scoringService');
const { matchCompaniesForLead } = require('../services/matchingService');

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send / Resend OTP
 */
async function sendOtp(req, res) {
  try {
    const leadId = req.body.leadId || req.params.id;

    if (!leadId) {
      return res.status(400).json({ success: false, error: "leadId is required" });
    }

    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) {
      return res.status(404).json({ success: false, error: "Lead not found" });
    }

    const otpCode = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Save in OtpVerification table
    await prisma.otpVerification.create({
      data: {
        leadId,
        otp: otpCode,
        expiresAt
      }
    });

    console.log(`[OTP SERVICE] Generated 6-digit OTP ${otpCode} for Lead ${leadId} (${lead.mobile})`);

    return res.json({
      success: true,
      message: `OTP sent to ${lead.mobile}`,
      leadId: lead.id,
      testOtpCode: otpCode
    });
  } catch (error) {
    console.error("Error in sendOtp:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Verify OTP (Handles POST /api/leads/:id/verify-otp and POST /api/otp/verify)
 */
async function verifyOtp(req, res) {
  try {
    const leadId = req.params.id || req.body.leadId;
    const otpCode = req.body.otp || req.body.otpCode;

    if (!leadId || !otpCode) {
      return res.status(400).json({ success: false, error: "leadId and OTP code are required" });
    }

    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) {
      return res.status(404).json({ success: false, error: "Lead not found" });
    }

    // Find latest valid OTP record
    const otpRecord = await prisma.otpVerification.findFirst({
      where: { leadId },
      orderBy: { createdAt: "desc" }
    });

    if (!otpRecord || otpRecord.otp !== otpCode.toString().trim()) {
      return res.status(400).json({ success: false, error: "Invalid OTP code. Please try again." });
    }

    if (otpRecord.expiresAt && new Date() > new Date(otpRecord.expiresAt)) {
      return res.status(400).json({ success: false, error: "OTP code has expired. Please request a new OTP." });
    }

    // Mark OTP as verified
    await prisma.otpVerification.update({
      where: { id: otpRecord.id },
      data: { verifiedAt: new Date() }
    });

    // Update Lead status to Verified and calculate score
    const updatedLeadData = {
      status: "Verified"
    };

    const tempLeadObj = { ...lead, ...updatedLeadData };
    const scoreResult = calculateLeadScore(tempLeadObj);
    updatedLeadData.leadScore = scoreResult.score;
    updatedLeadData.leadQuality = scoreResult.leadQuality;

    const verifiedLead = await prisma.lead.update({
      where: { id: leadId },
      data: updatedLeadData
    });

    // Run logistics company matching engine
    const companyMatches = await matchCompaniesForLead(leadId);

    return res.json({
      success: true,
      message: "Phone number verified successfully!",
      lead: verifiedLead,
      scoreBreakdown: scoreResult.breakdown,
      matchingCompanies: companyMatches
    });
  } catch (error) {
    console.error("Error in verifyOtp:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = {
  sendOtp,
  verifyOtp
};
