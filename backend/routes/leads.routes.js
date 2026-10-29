const express = require('express');
const router = express.Router();
const leadsController = require('../controllers/leads.controller');
const adminMiddleware = require('../middleware/adminMiddleware');

// ── Public — anyone can submit ────────────────────────────────
router.post('/callback', leadsController.submitCallback);
router.post('/admission', leadsController.submitAdmission);

// ── Admin only — view & manage ────────────────────────────────
router.get('/callbacks', adminMiddleware, leadsController.getCallbacks);
// Static route MUST be before /:id/read to avoid Express treating "read-all" as an id
router.patch('/callbacks/read-all', adminMiddleware, leadsController.markAllCallbacksRead);
router.patch('/callbacks/:id/read', adminMiddleware, leadsController.markCallbackRead);

router.get('/admissions', adminMiddleware, leadsController.getAdmissions);
router.patch('/admissions/:id/read', adminMiddleware, leadsController.markAdmissionRead);
router.patch('/admissions/:id/status', adminMiddleware, leadsController.updateAdmissionStatus);

// ── Combined unread count (for header bell) ───────────────────
router.get('/unread-count', adminMiddleware, leadsController.getUnreadCount);

module.exports = router;
