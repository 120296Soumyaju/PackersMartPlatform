const express = require('express');
const router = express.Router();

const {
  createLead,
  getLeads,
  getLeadById,
  updateLeadStatus,
  getMatchingCompanies
} = require('../controllers/leadController');

const { sendOtp, verifyOtp } = require('../controllers/otpController');
const { getDashboardStats } = require('../controllers/dashboardController');

// Section 7 Table Exact APIs

// 1. Create Lead
router.post('/leads', createLead);

// 2. Verify OTP (Exact match: POST /api/leads/:id/verify-otp & fallback POST /api/otp/verify)
router.post('/leads/:id/verify-otp', verifyOtp);
router.post('/otp/verify', verifyOtp);
router.post('/otp/send', sendOtp);

// 3. Get Leads
router.get('/leads', getLeads);

// 4. Get Lead Details
router.get('/leads/:id', getLeadById);

// 5. Update Lead Status
router.patch('/leads/:id/status', updateLeadStatus);

// 6. Get Matching Companies
router.get('/leads/:id/matching-companies', getMatchingCompanies);

// 7. Get Dashboard Statistics (Exact match: GET /api/dashboard & GET /api/dashboard/stats)
router.get('/dashboard', getDashboardStats);
router.get('/dashboard/stats', getDashboardStats);

module.exports = router;
