const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const companies = [
  {
    companyName: "Agarwal Express Packers & Movers",
    mobile: "+91 98765 43210",
    email: "contact@agarwalexpress.in",
    rating: 4.8,
    reviewCount: 342,
    coverage: JSON.stringify(["Mumbai", "Delhi NCR", "Bangalore", "Pune", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad"]),
    serviceTypes: JSON.stringify(["Household Relocation (1BHK)", "Household Relocation (2BHK)", "Household Relocation (3BHK)", "Household Relocation (4+BHK)", "Office Shifting", "Vehicle Transport", "Warehouse Storage"]),
    status: "Active",
    fleetSize: 45
  },
  {
    companyName: "SafeShift Relocations India",
    mobile: "+91 98220 11223",
    email: "support@safeshift.co.in",
    rating: 4.7,
    reviewCount: 215,
    coverage: JSON.stringify(["Mumbai", "Pune", "Bangalore", "Hyderabad", "Ahmedabad", "Surat"]),
    serviceTypes: JSON.stringify(["Household Relocation (1BHK)", "Household Relocation (2BHK)", "Household Relocation (3BHK)", "Household Relocation (4+BHK)", "Vehicle Transport"]),
    status: "Active",
    fleetSize: 28
  },
  {
    companyName: "Urban Cargo Movers & Packers",
    mobile: "+91 97118 99887",
    email: "info@urbancargomovers.com",
    rating: 4.6,
    reviewCount: 189,
    coverage: JSON.stringify(["Delhi NCR", "Jaipur", "Chandigarh", "Lucknow", "Mumbai", "Bangalore"]),
    serviceTypes: JSON.stringify(["Household Relocation (1BHK)", "Household Relocation (2BHK)", "Household Relocation (3BHK)", "Office Shifting", "Warehouse Storage"]),
    status: "Active",
    fleetSize: 32
  },
  {
    companyName: "MetroRelocate Logistics",
    mobile: "+91 99400 33445",
    email: "booking@metrorelocate.com",
    rating: 4.5,
    reviewCount: 156,
    coverage: JSON.stringify(["Chennai", "Bangalore", "Hyderabad", "Kochi", "Coimbatore"]),
    serviceTypes: JSON.stringify(["Household Relocation (1BHK)", "Household Relocation (2BHK)", "Household Relocation (3BHK)"]),
    status: "Active",
    fleetSize: 18
  },
  {
    companyName: "SpeedCarrier Logistics & Freight",
    mobile: "+91 93310 77665",
    email: "dispatch@speedcarrier.in",
    rating: 4.9,
    reviewCount: 410,
    coverage: JSON.stringify(["Mumbai", "Delhi NCR", "Bangalore", "Kolkata", "Hyderabad", "Pune", "Chennai"]),
    serviceTypes: JSON.stringify(["Household Relocation (3BHK)", "Household Relocation (4+BHK)", "Office Shifting", "Vehicle Transport", "Warehouse Storage"]),
    status: "Active",
    fleetSize: 60
  },
  {
    companyName: "Apex Global Shifting",
    mobile: "+91 98450 66778",
    email: "help@apexglobalshifting.com",
    rating: 4.4,
    reviewCount: 98,
    coverage: JSON.stringify(["Bangalore", "Hyderabad", "Pune", "Mumbai"]),
    serviceTypes: JSON.stringify(["Household Relocation (1BHK)", "Household Relocation (2BHK)", "Vehicle Transport"]),
    status: "Active",
    fleetSize: 15
  },
  {
    companyName: "Gati-Style Express Movers",
    mobile: "+91 98100 55443",
    email: "inquiry@gatiexpressmovers.com",
    rating: 4.7,
    reviewCount: 275,
    coverage: JSON.stringify(["Mumbai", "Delhi NCR", "Bangalore", "Hyderabad", "Ahmedabad", "Pune", "Kolkata"]),
    serviceTypes: JSON.stringify(["Household Relocation (1BHK)", "Household Relocation (2BHK)", "Household Relocation (3BHK)", "Office Shifting", "Warehouse Storage"]),
    status: "Active",
    fleetSize: 40
  },
  {
    companyName: "SwiftWing Movers & Logistics",
    mobile: "+91 97400 12345",
    email: "contact@swiftwingmovers.in",
    rating: 4.3,
    reviewCount: 84,
    coverage: JSON.stringify(["Bangalore", "Chennai", "Hyderabad", "Pune"]),
    serviceTypes: JSON.stringify(["Household Relocation (1BHK)", "Household Relocation (2BHK)"]),
    status: "Inactive", // 1 sample inactive company to test status filter
    fleetSize: 12
  }
];

const sampleLeads = [
  {
    customerName: "Rahul Sharma",
    mobile: "+91 98123 45678",
    email: "rahul.sharma@example.com",
    pickupCity: "Mumbai",
    destinationCity: "Bangalore",
    movingDate: "2026-09-15",
    serviceType: "Household Relocation (3BHK)",
    additionalRequirements: "Requires wooden crating for TV and sofa set.",
    status: "Verified",
    leadScore: 90,
    leadQuality: "Hot"
  },
  {
    customerName: "Priya Sundaram",
    mobile: "+91 98401 99887",
    email: "priya.s@example.com",
    pickupCity: "Chennai",
    destinationCity: "Hyderabad",
    movingDate: "2026-09-22",
    serviceType: "Household Relocation (2BHK)",
    additionalRequirements: "Fragile glassware packing required.",
    status: "Verified",
    leadScore: 85,
    leadQuality: "Hot"
  },
  {
    customerName: "Amitabh Verma",
    mobile: "+91 97110 54321",
    email: "averma@example.com",
    pickupCity: "Delhi NCR",
    destinationCity: "Pune",
    movingDate: "2026-10-01",
    serviceType: "Office Shifting",
    additionalRequirements: "15 workstations, server racks, conference tables.",
    status: "Verified",
    leadScore: 95,
    leadQuality: "Hot"
  },
  {
    customerName: "Vikram Malhotra",
    mobile: "+91 99887 76655",
    email: "vmalhotra@example.com",
    pickupCity: "Pune",
    destinationCity: "Mumbai",
    movingDate: "2026-09-10",
    serviceType: "Household Relocation (1BHK)",
    additionalRequirements: "Awaiting OTP verification.",
    status: "Pending",
    leadScore: 40,
    leadQuality: "Cold"
  },
  {
    customerName: "Neha Patel",
    mobile: "+91 98980 11223",
    email: "neha.patel@example.com",
    pickupCity: "Ahmedabad",
    destinationCity: "Bangalore",
    movingDate: "2026-09-18",
    serviceType: "Household Relocation (2BHK)",
    additionalRequirements: "Vehicle transport for scooter required.",
    status: "Verified",
    leadScore: 78,
    leadQuality: "Hot"
  },
  {
    customerName: "Test Fake Inquiry",
    mobile: "+91 90000 00000",
    email: "fake@test.com",
    pickupCity: "Delhi NCR",
    destinationCity: "Mumbai",
    movingDate: "2026-09-30",
    serviceType: "Vehicle Transport",
    additionalRequirements: "Flagged invalid details",
    status: "Fake",
    leadScore: 20,
    leadQuality: "Cold"
  },
  {
    customerName: "Rahul Sharma (Copy)",
    mobile: "+91 98123 45678",
    email: "rahul.sharma@example.com",
    pickupCity: "Mumbai",
    destinationCity: "Bangalore",
    movingDate: "2026-09-15",
    serviceType: "Household Relocation (3BHK)",
    additionalRequirements: "Duplicate entry submitted twice",
    status: "Duplicate",
    leadScore: 30,
    leadQuality: "Cold"
  },
  {
    customerName: "Sanjay Gupta",
    mobile: "+91 98777 66554",
    email: "sgupta@example.com",
    pickupCity: "Kolkata",
    destinationCity: "Hyderabad",
    movingDate: "2026-09-28",
    serviceType: "Household Relocation (2BHK)",
    additionalRequirements: "Re-attempting phone verification",
    status: "Re-attempt",
    leadScore: 55,
    leadQuality: "Warm"
  }
];

async function main() {
  console.log("🌱 Starting Database Seeding...");

  // Clean existing tables
  await prisma.leadCompanyMatch.deleteMany({});
  await prisma.otpVerification.deleteMany({});
  await prisma.lead.deleteMany({});
  await prisma.company.deleteMany({});

  console.log("🧹 Cleaned existing database tables.");

  // Insert companies
  const createdCompanies = [];
  for (const company of companies) {
    const c = await prisma.company.create({ data: company });
    createdCompanies.push(c);
  }
  console.log(`✅ Seeded ${createdCompanies.length} companies.`);

  // Insert sample leads and generate matches for verified ones
  for (const leadData of sampleLeads) {
    const lead = await prisma.lead.create({ data: leadData });
    
    // Create an OTP verification record for each lead
    await prisma.otpVerification.create({
      data: {
        leadId: lead.id,
        otp: "123456",
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        verifiedAt: lead.status === "Verified" ? new Date() : null
      }
    });

    // If lead is Verified, generate matches
    if (lead.status === "Verified") {
      for (const comp of createdCompanies) {
        if (comp.status !== "Active") continue;

        let coverage = [];
        let serviceTypes = [];
        try { coverage = JSON.parse(comp.coverage); } catch (e) {}
        try { serviceTypes = JSON.parse(comp.serviceTypes); } catch (e) {}

        const pickupMatch = coverage.includes(lead.pickupCity);
        const destMatch = coverage.includes(lead.destinationCity);
        const serviceMatch = serviceTypes.some(s => s.toLowerCase().includes(lead.serviceType.toLowerCase()) || lead.serviceType.toLowerCase().includes(s.toLowerCase()));

        if (pickupMatch || destMatch) {
          let matchScore = 65;
          const reasons = [];

          if (pickupMatch && destMatch) {
            matchScore += 20;
            reasons.push(`Direct coverage between ${lead.pickupCity} and ${lead.destinationCity}`);
          } else if (pickupMatch) {
            reasons.push(`Pickup hub in ${lead.pickupCity}`);
          } else if (destMatch) {
            reasons.push(`Destination network in ${lead.destinationCity}`);
          }

          if (serviceMatch) {
            matchScore += 10;
            reasons.push(`Supports ${lead.serviceType}`);
          }

          if (comp.rating >= 4.7) {
            matchScore += 5;
            reasons.push(`Top-rated company (${comp.rating}★)`);
          }

          matchScore = Math.min(100, matchScore);

          await prisma.leadCompanyMatch.create({
            data: {
              leadId: lead.id,
              companyId: comp.id,
              matchScore,
              matchReasons: JSON.stringify(reasons),
              notificationStatus: "Recommended"
            }
          });
        }
      }
    }
  }

  console.log(`✅ Seeded ${sampleLeads.length} sample leads with OTP records and company matches.`);
  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
