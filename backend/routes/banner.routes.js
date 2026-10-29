const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/banner.controller');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public — frontend carousel
router.get('/', bannerController.getBanners);

// Admin only (all JSON — images are CDN URLs from frontend)
router.get('/:id', adminMiddleware, bannerController.getBannerById);
router.post('/', adminMiddleware, bannerController.addBanner);
router.put('/:id', adminMiddleware, bannerController.updateBanner);
router.delete('/:id', adminMiddleware, bannerController.deleteBanner);
router.patch('/:id/toggle', adminMiddleware, bannerController.toggleBanner);

module.exports = router;                          
