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

/**
 * @openapi
 * /leads:
 *   post:
 *     summary: Submit a new customer relocation lead inquiry
 *     tags:
 *       - Customer Leads
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LeadInput'
 *     responses:
 *       201:
 *         description: Lead created successfully. 6-digit OTP code generated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Lead created successfully. OTP generated." }
 *                 lead: { $ref: '#/components/schemas/Lead' }
 *                 testOtpCode: { type: string, example: "123456" }
 *       400:
 *         description: Missing required lead fields.
 */
router.post('/leads', createLead);

/**
 * @openapi
 * /leads/{id}/verify-otp:
 *   post:
 *     summary: Verify 6-digit OTP code for customer lead
 *     tags:
 *       - OTP Verification
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique Lead ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OtpVerifyInput'
 *     responses:
 *       200:
 *         description: OTP verified successfully. Lead status updated to Verified, quality score calculated, and company matches generated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Phone number verified successfully!" }
 *                 lead: { $ref: '#/components/schemas/Lead' }
 *                 matchingCompanies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/LeadCompanyMatch'
 *       400:
 *         description: Invalid or expired OTP code.
 */
router.post('/leads/:id/verify-otp', verifyOtp);
router.post('/otp/verify', verifyOtp);
router.post('/otp/send', sendOtp);

/**
 * @openapi
 * /leads:
 *   get:
 *     summary: Get all submitted leads with optional search and filters
 *     tags:
 *       - Admin Lead Management
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ALL, Pending, Verified, Fake, Duplicate, Re-attempt]
 *         description: Filter leads by status
 *       - in: query
 *         name: leadQuality
 *         schema:
 *           type: string
 *           enum: [ALL, Hot, Warm, Cold]
 *         description: Filter leads by quality classification
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search text matching customer name, mobile, city, or service type
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [newest, score_desc, score_asc]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of leads matching criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 count: { type: integer, example: 8 }
 *                 leads:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Lead'
 */
router.get('/leads', getLeads);

/**
 * @openapi
 * /leads/{id}:
 *   get:
 *     summary: Get detailed lead profile by ID
 *     tags:
 *       - Admin Lead Management
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique Lead ID
 *     responses:
 *       200:
 *         description: Lead details with score breakdown and company matches
 *       404:
 *         description: Lead not found
 */
router.get('/leads/:id', getLeadById);

/**
 * @openapi
 * /leads/{id}/status:
 *   patch:
 *     summary: Update lead status (Pending, Verified, Fake, Duplicate, Re-attempt)
 *     tags:
 *       - Admin Lead Management
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique Lead ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StatusUpdateInput'
 *     responses:
 *       200:
 *         description: Lead status updated successfully
 *       400:
 *         description: Invalid status value
 */
router.patch('/leads/:id/status', updateLeadStatus);

/**
 * @openapi
 * /leads/{id}/matching-companies:
 *   get:
 *     summary: Get suitable logistics company matches for a verified lead
 *     tags:
 *       - Company Matching Engine
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique Lead ID
 *     responses:
 *       200:
 *         description: Matched logistics companies list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 leadId: { type: string, example: "7e060972-62cf-4da9-ad6d-ba44c29902f7" }
 *                 count: { type: integer, example: 7 }
 *                 matchingCompanies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/LeadCompanyMatch'
 */
router.get('/leads/:id/matching-companies', getMatchingCompanies);

/**
 * @openapi
 * /dashboard:
 *   get:
 *     summary: Get real-time administrative dashboard statistics & metrics
 *     tags:
 *       - Admin Dashboard Statistics
 *     responses:
 *       200:
 *         description: Aggregated KPI statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalLeads: { type: integer, example: 8 }
 *                     verifiedLeads: { type: integer, example: 4 }
 *                     pendingLeads: { type: integer, example: 1 }
 *                     fakeLeads: { type: integer, example: 1 }
 *                     duplicateLeads: { type: integer, example: 1 }
 *                     avgLeadScore: { type: integer, example: 82 }
 *                     tierBreakdown:
 *                       type: object
 *                       properties:
 *                         Hot: { type: integer, example: 4 }
 *                         Warm: { type: integer, example: 2 }
 *                         Cold: { type: integer, example: 2 }
 *                     totalCompanies: { type: integer, example: 8 }
 *                     activeCompanies: { type: integer, example: 7 }
 *                     totalMatches: { type: integer, example: 25 }
 */
router.get('/dashboard', getDashboardStats);
router.get('/dashboard/stats', getDashboardStats);

module.exports = router;
