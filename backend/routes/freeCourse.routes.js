const express = require('express');
const router = express.Router();
const fc = require('../controllers/freeCourse.controller');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public
router.get('/public', fc.getPublicFreeCourses);

// Admin
router.get('/', adminMiddleware, fc.getAllFreeCourses);
router.post('/', adminMiddleware, fc.addFreeCourse);
router.put('/:id', adminMiddleware, fc.updateFreeCourse);
router.delete('/:id', adminMiddleware, fc.deleteFreeCourse);
router.patch('/:id/toggle', adminMiddleware, fc.toggleFreeCourse);

module.exports = router;
