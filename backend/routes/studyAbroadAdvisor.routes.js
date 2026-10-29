const express = require('express');
const router = express.Router();
const {
  submitStudyAbroadAdvisor,
  getAllStudyAbroadLeads,
  updateLeadStatus,
  deleteStudyAbroadLead
} = require('../controllers/studyAbroadAdvisor.controller');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public route - submit study abroad advisor request
router.post('/submit', submitStudyAbroadAdvisor);

// Admin routes - manage study abroad leads
router.get('/all', adminMiddleware, getAllStudyAbroadLeads);
router.put('/status/:id', adminMiddleware, updateLeadStatus);
router.delete('/:id', adminMiddleware, deleteStudyAbroadLead);

module.exports = router;
