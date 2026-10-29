const express = require('express');
const router = express.Router();
const navbarController = require('../controllers/navbar.controller');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public — frontend navbar ke liye
router.get('/', navbarController.getNavbarLinks);

// Admin only — CRUD
router.post('/', adminMiddleware, navbarController.addNavbarLink);
router.put('/:id', adminMiddleware, navbarController.updateNavbarLink);
router.delete('/:id', adminMiddleware, navbarController.deleteNavbarLink);
router.patch('/:id/toggle', adminMiddleware, navbarController.toggleNavbarLinkStatus);

module.exports = router;
