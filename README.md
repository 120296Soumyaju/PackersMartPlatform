# PackersMart Platform MVP: 1-Day Full-Stack Developer Assessment

An end-to-end working MVP built for the **PackersMart Lead-to-Booking Workflow Assessment Task**. The system captures customer relocation inquiries, performs 6-digit OTP phone verification, calculates lead quality scores (`Hot`, `Warm`, `Cold`), matches verified leads to active logistics companies, and provides administrative monitoring via an interactive dashboard.

---

## 📋 Evaluation Checklist & Core Flow

```text
Customer Lead Form ➔ OTP Verification ➔ Verified Lead ➔ Admin Lead Queue ➔ Lead Quality ➔ Company Matching ➔ Dashboard
```

| Assessment Section | Requirement | Status | Implementation Details |
| :--- | :--- | :---: | :--- |
| **1. Lead Registration** | Customer Name, Mobile, Email, Pickup City, Destination City, Service Type, Moving Date, Requirements | ✅ | Multi-step form with inline validation (`LeadForm.jsx`) |
| **2. OTP Verification** | 6-digit OTP with expiry time; sets status to `Verified` on success | ✅ | `OtpVerification` model & verification dialog (`OtpModal.jsx`) |
| **3. Admin Dashboard** | Admin queue supporting `Pending`, `Verified`, `Fake`, `Duplicate`, `Re-attempt` | ✅ | Searchable queue table with live status control dropdowns (`LeadTable.jsx`) |
| **4. Lead Quality** | Score calculation (0–100) classifying leads as `Hot`, `Warm`, or `Cold` | ✅ | Multi-signal scoring engine (`scoringService.js`) |
| **5. Company Matching** | 5–10 companies seeded; matched by Pickup City, Destination, and Service Type | ✅ | 8 seeded logistics companies + rule-based matching engine (`matchingService.js`) |
| **6. Dashboard Stats** | Total Leads, Verified, Fake, Duplicate, Pending, Hot/Warm/Cold counts, Company matches | ✅ | Dynamic real-time statistics cards (`DashboardStats.jsx`) |
| **7. REST APIs** | Section 7 endpoint specifications (`/api/leads`, `/api/leads/:id/verify-otp`, `/api/dashboard`, etc.) | ✅ | Pure JSON REST API routes (`api.js`) |

---

## 🏗️ Selected Technology Stack

- **Frontend:** React 18 (Vite), Tailwind CSS, Lucide React icons, Axios
- **Backend:** Node.js, Express.js, REST JSON APIs
- **Database & ORM:** Prisma ORM with SQLite (`dev.db`) for zero-setup local execution
- **Database SQL Export:** Standard ANSI SQL export provided in [`schema.sql`](file:///f:/PackersMartPlatform/schema.sql)

---

## 📁 Project Structure

```text
PackersMartPlatform/
├── server/                       # Node.js / Express Backend
│   ├── prisma/
│   │   ├── schema.prisma         # Relational schema (Lead, OtpVerification, Company, LeadCompanyMatch)
│   │   └── seed.js               # 8 Logistics Companies & Sample Leads Seeder
│   ├── src/
│   │   ├── services/
│   │   │   ├── scoringService.js  # Lead Quality Scoring (Hot, Warm, Cold)
│   │   │   └── matchingService.js # Pickup / Destination / Service Matching Engine
│   │   ├── controllers/
│   │   │   ├── leadController.js  # Lead CRUD & status management
│   │   │   ├── otpController.js   # 6-digit OTP generation & verification
│   │   │   └── dashboardController.js # Dynamic statistics aggregations
│   │   ├── routes/
│   │   │   └── api.js            # Express API Route definitions
│   │   └── app.js                # Express Server Listener
│   └── package.json
├── client/                       # React / Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── LeadForm.jsx      # Customer Lead Form with validation
│   │   │   ├── OtpModal.jsx      # 6-Digit OTP verification modal
│   │   │   ├── DashboardStats.jsx# Section 6 Statistics cards
│   │   │   ├── LeadTable.jsx     # Section 3 Admin queue & status switcher
│   │   │   └── CompanyMatchesModal.jsx # Company recommendations viewer
│   │   ├── api/
│   │   │   └── axiosClient.js
│   │   ├── App.jsx               # Application layout & portal switcher
│   │   └── index.css
│   └── package.json
├── schema.sql                    # SQL DDL File (Section 8 suggested tables)
└── README.md                     # Documentation
```

---

## ⚡ Setup & Execution Instructions

### 1. Backend Server Setup (`server/`)
```bash
cd server
npm install
npx prisma db push
node prisma/seed.js
npm run dev
```
*Backend API will run on **`http://localhost:5000`**.*

### 2. Frontend Application Setup (`client/`)
```bash
cd client
npm install
npm run dev
```
*Frontend Portal will run on **`http://localhost:3000`**.*

---

## 🧠 Business Logic Explanation

### 1. Lead Quality Scoring (`scoringService.js`)
Calculates a composite quality score between `0 and 100`:
- **OTP Verification (+30 pts):** Phone number verified via 6-digit OTP.
- **Route Information (+20 pts):** Pickup City and Destination City provided.
- **Service Type Weighting (+15 to +20 pts):** High-volume services (3BHK, 4+BHK, Office Shifting) receive +20 pts.
- **Moving Date Window (+15 pts):** Relocation within 7 days (+15 pts) vs 30 days (+10 pts).
- **Special Requirements (+15 pts):** Additional requirements/instructions declared.

**Lead Quality Classification:**
- 🔥 **Hot:** Score `>= 75`
- ⚡ **Warm:** Score `50 - 74`
- ❄️ **Cold:** Score `< 50`

### 2. Company Matching Engine (`matchingService.js`)
Rule-based matching algorithm that connects verified leads with companies where:
1. `Company.status` is **Active**.
2. Company `coverage` includes **Pickup City** or **Destination City**.
3. Company `serviceTypes` supports the lead's **Service Type**.
4. Applies match scoring based on direct route availability (+25 pts), service compatibility (+10 pts), and company rating (`>= 4.7★` +5 pts).

---

## 🔌 API Endpoint Reference (Section 7 Specification)

| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| `POST` | `/api/leads` | Create a new lead inquiry |
| `POST` | `/api/leads/:id/verify-otp` | Verify 6-digit OTP for lead |
| `GET` | `/api/leads` | Get all submitted leads with status filters |
| `GET` | `/api/leads/:id` | Get single lead details |
| `PATCH` | `/api/leads/:id/status` | Update lead status (`Pending`, `Verified`, `Fake`, `Duplicate`, `Re-attempt`) |
| `GET` | `/api/leads/:id/matching-companies` | Get suitable company matches for lead |
| `GET` | `/api/dashboard` | Get dynamic dashboard statistics |
