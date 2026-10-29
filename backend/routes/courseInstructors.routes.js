const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/courseInstructors.controller');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public
router.get('/data', ctrl.getAllData);

// Admin — settings
router.get('/settings',  adminMiddleware, ctrl.getSettings);
router.post('/settings', adminMiddleware, ctrl.saveSettings);

// Admin — tabs
router.get('/tabs',              adminMiddleware, ctrl.getTabs);
router.post('/tabs',             adminMiddleware, ctrl.addTab);
router.put('/tabs/:id',          adminMiddleware, ctrl.updateTab);
router.delete('/tabs/:id',       adminMiddleware, ctrl.deleteTab);
router.patch('/tabs/:id/toggle', adminMiddleware, ctrl.toggleTab);

// Admin — cards
router.get('/tabs/:tabId/cards',       adminMiddleware, ctrl.getCards);
router.post('/tabs/:tabId/cards',      adminMiddleware, ctrl.addCard);
router.put('/cards/:cardId',           adminMiddleware, ctrl.updateCard);
router.delete('/cards/:cardId',        adminMiddleware, ctrl.deleteCard);
router.patch('/cards/:cardId/toggle',  adminMiddleware, ctrl.toggleCard);

module.exports = router;
