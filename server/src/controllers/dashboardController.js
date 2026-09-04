const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Get Dashboard Statistics (GET /api/dashboard & GET /api/dashboard/stats)
 * Section 6 Requirements: Total Leads, Verified Leads, Fake Leads, Duplicate Leads, Pending Leads, Hot/Warm/Cold counts, Matched Companies count.
 */
async function getDashboardStats(req, res) {
  try {
    const totalLeads = await prisma.lead.count();
    const verifiedLeads = await prisma.lead.count({ where: { status: "Verified" } });
    const pendingLeads = await prisma.lead.count({ where: { status: "Pending" } });
    const fakeLeads = await prisma.lead.count({ where: { status: "Fake" } });
    const duplicateLeads = await prisma.lead.count({ where: { status: "Duplicate" } });
    const reattemptLeads = await prisma.lead.count({ where: { status: "Re-attempt" } });

    // Quality Classifications (Hot, Warm, Cold)
    const hotLeads = await prisma.lead.count({ where: { leadQuality: "Hot" } });
    const warmLeads = await prisma.lead.count({ where: { leadQuality: "Warm" } });
    const coldLeads = await prisma.lead.count({ where: { leadQuality: "Cold" } });

    // Average Lead Score
    const scoreAgg = await prisma.lead.aggregate({
      _avg: { leadScore: true }
    });
    const avgLeadScore = Math.round(scoreAgg._avg.leadScore || 0);

    // Logistics Companies count
    const totalCompanies = await prisma.company.count();
    const activeCompanies = await prisma.company.count({ where: { status: "Active" } });

    // Total Matched Companies Recommendations generated
    const totalMatches = await prisma.leadCompanyMatch.count();
    const leadsWithMatchesCount = await prisma.lead.count({
      where: {
        matches: {
          some: {}
        }
      }
    });

    return res.json({
      success: true,
      stats: {
        totalLeads,
        verifiedLeads,
        pendingLeads,
        fakeLeads,
        duplicateLeads,
        reattemptLeads,
        avgLeadScore,
        tierBreakdown: {
          Hot: hotLeads,
          Warm: warmLeads,
          Cold: coldLeads
        },
        totalCompanies,
        activeCompanies,
        totalMatches,
        leadsWithMatchesCount
      }
    });
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = {
  getDashboardStats
};
