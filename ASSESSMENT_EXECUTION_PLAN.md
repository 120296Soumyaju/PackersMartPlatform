# Stepwise Implementation Plan: Packers Mart 1-Day Assessment MVP

## Project Overview
Implement an end-to-end working MVP for Packers Mart's lead-to-booking workflow within a 1-day timeframe. The system captures customer relocation inquiries, validates phone numbers via a 6-digit OTP, scores verified leads, matches inquiries to seeded logistics vendors, and renders operational analytics on an administrative dashboard.

---

## 1. Selected Rapid Tech Stack
* **Frontend:** React (Vite) + Tailwind CSS + Lucide React (fast scaffolding, responsive design, zero CSS overhead).
* **Backend:** Node.js with Express (lightweight, modular routing, pure JSON REST APIs).
* **Database & ORM:** Prisma ORM with SQLite (or PostgreSQL) for zero-setup migrations, schema inspection, and seeding.
* **HTTP & State Management:** Axios for API consumption; React state hooks for local UI flows.

---

## 2. Directory Structure
```text
packersmart-mvp/
├── server/
│   ├── prisma/
│   │   ├── schema.prisma         # Relational database models
│   │   └── seed.js               # 5–10 logistics vendors seeder
│   ├── src/
│   │   ├── services/
│   │   │   ├── scoringService.js # Lead quality calculation logic
│   │   │   └── matchingService.js# Logistics company matching engine
│   │   ├── controllers/
│   │   │   ├── leadController.js # Lead CRUD & status updates
│   │   │   ├── otpController.js  # OTP generation & verification
│   │   │   └── dashboardController.js # Dynamic statistics aggregations
│   │   ├── routes/
│   │   │   └── api.js            # Central API route definitions
│   │   └── app.js                # Express app setup and middleware
│   ├── package.json
│   └── .env
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LeadForm.jsx      # Customer registration with validation
│   │   │   ├── OtpModal.jsx      # OTP verification screen
│   │   │   ├── DashboardStats.jsx# Summary KPI cards
│   │   │   ├── LeadTable.jsx     # Admin queue with status controls
│   │   │   └── CompanyMatchesModal.jsx # Matched companies viewer
│   │   ├── api/
│   │   │   └── axiosClient.js    # Base Axios configuration
│   │   ├── App.jsx               # View switcher (Customer View / Admin View)
│   │   └── main.jsx
│   ├── package.json
│   └── tailwind.config.js
├── schema.sql                    # SQL schema export for submission
└── README.md                     # Setup instructions, API list, scoring logic