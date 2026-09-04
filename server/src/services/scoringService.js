/**
 * Lead Quality Scoring Engine
 * Evaluates verified leads and calculates a quality score (0–100) and tier (Hot, Warm, Cold).
 */

function calculateLeadScore(lead) {
  let score = 0;
  const breakdown = [];

  // 1. Phone OTP Verification (+30 pts)
  if (lead.status === "Verified" || lead.isVerified) {
    score += 30;
    breakdown.push({ criteria: "6-Digit OTP Phone Verified", points: 30 });
  } else {
    breakdown.push({ criteria: "Phone Number Unverified", points: 0 });
  }

  // 2. Relocation Route Completeness (+20 pts)
  const pickup = lead.pickupCity || lead.originCity;
  const dest = lead.destinationCity;
  if (pickup && dest) {
    score += 20;
    breakdown.push({ criteria: "Complete Route Info (Pickup & Destination)", points: 20 });
  } else if (pickup || dest) {
    score += 10;
    breakdown.push({ criteria: "Partial Route Info", points: 10 });
  }

  // 3. Service Type & Scope (+15 to +20 pts)
  const service = lead.serviceType || lead.moveSize || "";
  if (service.includes("3BHK") || service.includes("4+BHK") || service.includes("Office")) {
    score += 20;
    breakdown.push({ criteria: `High-Volume Service (${service})`, points: 20 });
  } else if (service) {
    score += 15;
    breakdown.push({ criteria: `Standard Service (${service})`, points: 15 });
  }

  // 4. Moving Date Urgency (+15 pts)
  const moveDate = lead.movingDate || lead.moveDate;
  if (moveDate) {
    const moveDateObj = new Date(moveDate);
    const today = new Date();
    const diffDays = Math.ceil((moveDateObj - today) / (1000 * 60 * 60 * 24));

    if (diffDays >= 0 && diffDays <= 7) {
      score += 15;
      breakdown.push({ criteria: "Urgent Relocation Window (within 7 days)", points: 15 });
    } else if (diffDays > 7 && diffDays <= 30) {
      score += 10;
      breakdown.push({ criteria: "Standard Window (within 30 days)", points: 10 });
    } else {
      score += 5;
      breakdown.push({ criteria: "Future Relocation (>30 days out)", points: 5 });
    }
  }

  // 5. Additional Requirements / Special Instructions (+15 pts)
  const notes = lead.additionalRequirements || lead.notes || "";
  if (notes && notes.trim().length > 0) {
    score += 15;
    breakdown.push({ criteria: "Specific Requirements Declared", points: 15 });
  }

  // Score boundaries (0 - 100)
  score = Math.min(100, Math.max(0, score));

  // Determine Quality Classification: Hot, Warm, Cold
  let leadQuality = "Cold";
  if (score >= 75) {
    leadQuality = "Hot";
  } else if (score >= 50) {
    leadQuality = "Warm";
  }

  return {
    score,
    leadQuality,
    breakdown
  };
}

module.exports = {
  calculateLeadScore
};
