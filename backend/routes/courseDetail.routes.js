const express = require('express');
const router = express.Router();
const cd = require('../controllers/courseDetail.controller');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public
router.get('/slug/:slug', cd.getCourseDetailBySlug);

// Admin — Slug-based (Navbar Dropdown Items ke liye)
router.get('/slug-admin/:slug', adminMiddleware, cd.getCourseDetailBySlugAdmin);
router.post('/slug/:slug', adminMiddleware, cd.upsertCourseDetailBySlug);

// Admin — NavbarLink based (Manage Navbar Details button ke liye)
router.get('/navbar/:navbarLinkId', adminMiddleware, cd.getCourseDetailByNavbarId);
router.post('/navbar/:navbarLinkId', adminMiddleware, cd.upsertCourseDetail);

// Admin — FooterLink based (Manage Footer Details button ke liye)
router.get('/footer-link/:footerLinkId', adminMiddleware, cd.getCourseDetailByFooterLinkId);
router.post('/footer-link/:footerLinkId', adminMiddleware, cd.upsertCourseDetail);

// Admin — CareerCourse based
router.get('/all', adminMiddleware, cd.getAllCourseDetails);
router.get('/:careerCourseId', adminMiddleware, cd.getCourseDetailById);
router.post('/', adminMiddleware, cd.upsertCourseDetail);
router.put('/:careerCourseId', adminMiddleware, cd.upsertCourseDetail);
router.delete('/:careerCourseId', adminMiddleware, cd.deleteCourseDetail);

module.exports = router;
