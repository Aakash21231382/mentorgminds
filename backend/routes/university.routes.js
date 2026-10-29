const express = require('express');
const router = express.Router();
const universityController = require('../controllers/university.controller');
const adminMiddleware = require('../middleware/adminMiddleware');

// ── Old API (kept) ───────────────────────────────────────────
router.get('/section', universityController.getSection);
router.put('/section', adminMiddleware, universityController.updateSection);
router.get('/logos', universityController.getLogos);
router.get('/logos/:id', adminMiddleware, universityController.getLogoById);
router.post('/logos', adminMiddleware, universityController.addLogo);
router.put('/logos/:id', adminMiddleware, universityController.updateLogo);
router.delete('/logos/:id', adminMiddleware, universityController.deleteLogo);
router.patch('/logos/:id/toggle', adminMiddleware, universityController.toggleLogo);
router.patch('/logos/:id/order', adminMiddleware, universityController.reorderLogo);

// ── New Slides API ───────────────────────────────────────────
router.get('/slides', universityController.getSlides);                              // public
router.post('/slides', adminMiddleware, universityController.addSlide);
router.put('/slides/:id', adminMiddleware, universityController.updateSlide);
router.delete('/slides/:id', adminMiddleware, universityController.deleteSlide);
router.patch('/slides/:id/toggle', adminMiddleware, universityController.toggleSlide);

// Slide logos
router.post('/slides/:slideId/logos', adminMiddleware, universityController.addSlideLogo);
router.put('/slides/logos/:logoId', adminMiddleware, universityController.updateSlideLogo);
router.delete('/slides/logos/:logoId', adminMiddleware, universityController.deleteSlideLogo);

module.exports = router;
