const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/onlineCourse.controller');
const detailCtrl = require('../controllers/onlineCourseDetail.controller');
const adminMiddleware = require('../middleware/adminMiddleware');

// ── Public — frontend ke liye ─────────────────────────────────
router.get('/public', ctrl.getPublicOnlineCourseData);
router.get('/public/all', ctrl.getAllPublicOnlineCourses);
router.get('/detail/slug/:slug', detailCtrl.getOnlineCourseDetailBySlug);

// ── Categories — Admin only ───────────────────────────────────
router.get('/categories', adminMiddleware, ctrl.getCategories);
router.post('/categories', adminMiddleware, ctrl.addCategory);
router.put('/categories/:id', adminMiddleware, ctrl.updateCategory);
router.delete('/categories/:id', adminMiddleware, ctrl.deleteCategory);
router.patch('/categories/:id/toggle', adminMiddleware, ctrl.toggleCategory);

// ── Courses — Admin only ──────────────────────────────────────
router.get('/courses/category/:categoryId', adminMiddleware, ctrl.getCourses);
router.get('/courses/:id', adminMiddleware, ctrl.getCourseById);
router.post('/courses', adminMiddleware, ctrl.addCourse);
router.put('/courses/:id', adminMiddleware, ctrl.updateCourse);
router.delete('/courses/:id', adminMiddleware, ctrl.deleteCourse);
router.patch('/courses/:id/toggle', adminMiddleware, ctrl.toggleCourse);

// ── Course Detail — Admin only ────────────────────────────────
router.get('/detail/all', adminMiddleware, detailCtrl.getAllOnlineCourseDetails);
router.get('/detail/:onlineCourseId', adminMiddleware, detailCtrl.getOnlineCourseDetailById);
router.post('/detail', adminMiddleware, detailCtrl.upsertOnlineCourseDetail);
router.put('/detail/:onlineCourseId', adminMiddleware, detailCtrl.upsertOnlineCourseDetail);
router.delete('/detail/:onlineCourseId', adminMiddleware, detailCtrl.deleteOnlineCourseDetail);

module.exports = router;
