-- =============================================================================
-- PackersMart Platform Relational Database Schema (SQL Export)
-- Aligned with 1-Day Full-Stack Assessment Specification (Section 8)
-- RDBMS: MySQL / PostgreSQL / SQLite Compatible ANSI SQL
-- =============================================================================

DROP TABLE IF EXISTS "lead_company_matches";
DROP TABLE IF EXISTS "otp_verifications";
DROP TABLE IF EXISTS "leads";
DROP TABLE IF EXISTS "companies";

-- -----------------------------------------------------------------------------
-- 1. Table: leads
-- -----------------------------------------------------------------------------
CREATE TABLE "leads" (
    "id" VARCHAR(36) NOT NULL PRIMARY KEY,
    "customer_name" VARCHAR(255) NOT NULL,
    "mobile" VARCHAR(20) NOT NULL,
    "email" VARCHAR(255),
    "pickup_city" VARCHAR(100) NOT NULL,
    "destination_city" VARCHAR(100) NOT NULL,
    "service_type" VARCHAR(100) NOT NULL,
    "moving_date" VARCHAR(20) NOT NULL,
    "additional_requirements" TEXT,
    "status" VARCHAR(50) NOT NULL DEFAULT 'Pending', -- Pending, Verified, Fake, Duplicate, Re-attempt
    "lead_score" INT NOT NULL DEFAULT 0, -- 0 to 100
    "lead_quality" VARCHAR(20) NOT NULL DEFAULT 'Cold', -- Hot, Warm, Cold
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_leads_status" ON "leads"("status");
CREATE INDEX "idx_leads_quality" ON "leads"("lead_quality");

-- -----------------------------------------------------------------------------
-- 2. Table: otp_verifications
-- -----------------------------------------------------------------------------
CREATE TABLE "otp_verifications" (
    "id" VARCHAR(36) NOT NULL PRIMARY KEY,
    "lead_id" VARCHAR(36) NOT NULL,
    "otp" VARCHAR(10) NOT NULL,
    "expires_at" TIMESTAMP NOT NULL,
    "verified_at" TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE
);

CREATE INDEX "idx_otp_lead_id" ON "otp_verifications"("lead_id");

-- -----------------------------------------------------------------------------
-- 3. Table: companies
-- -----------------------------------------------------------------------------
CREATE TABLE "companies" (
    "id" VARCHAR(36) NOT NULL PRIMARY KEY,
    "company_name" VARCHAR(255) NOT NULL,
    "mobile" VARCHAR(20) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "coverage" TEXT NOT NULL, -- JSON Array of Cities: ["Mumbai", "Delhi NCR", "Bangalore"]
    "service_types" TEXT NOT NULL, -- JSON Array of Services: ["Household Relocation", "Office Shifting"]
    "rating" DECIMAL(3,2) NOT NULL DEFAULT 4.50,
    "status" VARCHAR(20) NOT NULL DEFAULT 'Active', -- Active, Inactive
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_companies_status" ON "companies"("status");

-- -----------------------------------------------------------------------------
-- 4. Table: lead_company_matches
-- -----------------------------------------------------------------------------
CREATE TABLE "lead_company_matches" (
    "id" VARCHAR(36) NOT NULL PRIMARY KEY,
    "lead_id" VARCHAR(36) NOT NULL,
    "company_id" VARCHAR(36) NOT NULL,
    "match_score" INT NOT NULL, -- 0 - 100 Percentage match score
    "match_reasons" TEXT, -- JSON Array of match rationales
    "notification_status" VARCHAR(50) NOT NULL DEFAULT 'Recommended', -- Recommended, Contacted
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE,
    FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE
);

CREATE INDEX "idx_matches_lead_id" ON "lead_company_matches"("lead_id");
CREATE INDEX "idx_matches_company_id" ON "lead_company_matches"("company_id");
