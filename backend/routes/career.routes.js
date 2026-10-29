const express = require('express');
const router = express.Router();
const careerController = require('../controllers/career.controller');
const adminMiddleware = require('../middleware/adminMiddleware');

// ── Public — frontend ke liye ─────────────────────────────────
router.get('/public', careerController.getPublicCareerData);

// ── Categories — Admin only ───────────────────────────────────
router.get('/categories', adminMiddleware, careerController.getCategories);
router.post('/categories', adminMiddleware, careerController.addCategory);
router.put('/categories/:id', adminMiddleware, careerController.updateCategory);
router.delete('/categories/:id', adminMiddleware, careerController.deleteCategory);
router.patch('/categories/:id/toggle', adminMiddleware, careerController.toggleCategory);

// ── Courses — Admin only ──────────────────────────────────────
router.get('/courses/category/:categoryId', adminMiddleware, careerController.getCourses);
router.get('/courses/:id', adminMiddleware, careerController.getCourseById);
router.post('/courses', adminMiddleware, careerController.addCourse);
router.put('/courses/:id', adminMiddleware, careerController.updateCourse);
router.delete('/courses/:id', adminMiddleware, careerController.deleteCourse);
router.patch('/courses/:id/toggle', adminMiddleware, careerController.toggleCourse);

module.exports = router;
