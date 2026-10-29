const express = require('express');
const router = express.Router();
const centresFAQController = require('../controllers/centresFAQ.controller');

// Admin routes
router.get('/admin', centresFAQController.getAllFAQs);
router.post('/admin', centresFAQController.upsertFAQ);
router.delete('/admin/:id', centresFAQController.deleteFAQ);
router.patch('/admin/:id/toggle', centresFAQController.toggleFAQStatus);

// Frontend route
router.get('/', centresFAQController.getActiveFAQs);

module.exports = router;
