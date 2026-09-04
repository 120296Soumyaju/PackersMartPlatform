const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Logistics Company Matching Engine
 * Matches a verified lead against active companies based on Pickup City, Destination City, and Service Type.
 */
async function matchCompaniesForLead(leadId) {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId }
  });

  if (!lead) {
    throw new Error(`Lead with ID ${leadId} not found`);
  }

  // Fetch active companies
  const companies = await prisma.company.findMany({
    where: { status: "Active" }
  });

  const matches = [];

  for (const company of companies) {
    let coverage = [];
    try { coverage = JSON.parse(company.coverage); } catch (e) {}

    let serviceTypes = [];
    try { serviceTypes = JSON.parse(company.serviceTypes); } catch (e) {}

    const pickupMatch = coverage.some(
      c => c.toLowerCase() === (lead.pickupCity || "").toLowerCase()
    );
    const destMatch = coverage.some(
      c => c.toLowerCase() === (lead.destinationCity || "").toLowerCase()
    );

    // Skip if company doesn't serve pickup or destination city
    if (!pickupMatch && !destMatch) {
      continue;
    }

    let matchScore = 60;
    const reasons = [];

    if (pickupMatch && destMatch) {
      matchScore += 25;
      reasons.push(`Direct route coverage: ${lead.pickupCity} ➔ ${lead.destinationCity}`);
    } else if (pickupMatch) {
      matchScore += 10;
      reasons.push(`Active pickup hub in ${lead.pickupCity}`);
    } else if (destMatch) {
      matchScore += 10;
      reasons.push(`Established delivery hub in ${lead.destinationCity}`);
    }

    // Check service type compatibility
    const serviceMatch = serviceTypes.some(
      s => s.toLowerCase().includes((lead.serviceType || "").toLowerCase()) ||
           (lead.serviceType || "").toLowerCase().includes(s.toLowerCase())
    );
    if (serviceMatch) {
      matchScore += 10;
      reasons.push(`Supports service requirement: ${lead.serviceType}`);
    }

    // Rating weighting
    if (company.rating >= 4.7) {
      matchScore += 5;
      reasons.push(`Top-rated company (${company.rating}★ with ${company.reviewCount}+ reviews)`);
    }

    matchScore = Math.min(100, Math.max(0, matchScore));

    matches.push({
      leadId: lead.id,
      companyId: company.id,
      matchScore,
      matchReasons: JSON.stringify(reasons),
      notificationStatus: "Recommended"
    });
  }

  // Sort by highest match score
  matches.sort((a, b) => b.matchScore - a.matchScore);

  // Clear existing matches for this lead
  await prisma.leadCompanyMatch.deleteMany({
    where: { leadId }
  });

  // Save matches
  const createdMatches = [];
  for (const match of matches) {
    const created = await prisma.leadCompanyMatch.create({
      data: match,
      include: {
        company: true
      }
    });
    createdMatches.push(created);
  }

  return createdMatches;
}

module.exports = {
  matchCompaniesForLead
};
