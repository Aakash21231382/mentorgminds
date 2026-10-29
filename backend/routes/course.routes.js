const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public — frontend detail page
router.get('/slug/:slug', courseController.getCourseBySlug);

// Admin — manage course details (all JSON, no file upload — images are CDN URLs)
router.get('/all', adminMiddleware, courseController.getAllCourses);
router.get('/navbar/:navbarLinkId', adminMiddleware, courseController.getCourseByNavbarId);
router.post('/navbar/:navbarLinkId', adminMiddleware, courseController.upsertCourseDetails);
router.put('/navbar/:navbarLinkId', adminMiddleware, courseController.upsertCourseDetails);
router.delete('/navbar/:navbarLinkId', adminMiddleware, courseController.deleteCourseDetails);

module.exports = router;
