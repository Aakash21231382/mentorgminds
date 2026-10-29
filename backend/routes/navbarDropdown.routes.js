const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/navbarDropdown.controller');
const adminMiddleware = require('../middleware/adminMiddleware');

// ── Public — frontend ke liye ─────────────────────────────────
router.get('/public/:navbarLinkId', ctrl.getPublicDropdown);
router.get('/public-all', ctrl.getAllPublicDropdowns);

// ── Groups — Admin only ───────────────────────────────────────
router.get('/groups/:navbarLinkId', adminMiddleware, ctrl.getGroups);
router.post('/groups/:navbarLinkId', adminMiddleware, ctrl.addGroup);
router.put('/groups/:id', adminMiddleware, ctrl.updateGroup);
router.delete('/groups/:id', adminMiddleware, ctrl.deleteGroup);
router.patch('/groups/:id/toggle', adminMiddleware, ctrl.toggleGroup);

// ── Items — Admin only ────────────────────────────────────────
router.get('/items/:groupId', adminMiddleware, ctrl.getItems);
router.get('/items/detail/:id', adminMiddleware, ctrl.getItemById);
router.post('/items/:groupId', adminMiddleware, ctrl.addItem);
router.put('/items/:id', adminMiddleware, ctrl.updateItem);
router.delete('/items/:id', adminMiddleware, ctrl.deleteItem);
router.patch('/items/:id/toggle', adminMiddleware, ctrl.toggleItem);

module.exports = router;
