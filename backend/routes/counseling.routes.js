const express = require('express');
const router = express.Router();
const counselingController = require('../controllers/counseling.controller.js');
const adminMiddleware = require('../middleware/adminMiddleware');

// ✅ Public route - Submit counseling booking
router.post('/submit', counselingController.submitCounselingBooking);

// ✅ Admin routes - Manage counseling bookings
router.get('/admin/all', adminMiddleware, counselingController.getAllCounselingBookings);
router.put('/admin/status/:id', adminMiddleware, counselingController.updateBookingStatus);

module.exports = router;
