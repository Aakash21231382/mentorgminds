const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/courseOverview.controller');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public — frontend ke liye
router.get('/data', ctrl.getAllData);

// Admin — protected
router.get('/settings',     adminMiddleware, ctrl.getSettings);
router.post('/settings',    adminMiddleware, ctrl.saveSettings);
router.get('/',             adminMiddleware, ctrl.getSections);
router.post('/',            adminMiddleware, ctrl.addSection);
router.put('/:id',          adminMiddleware, ctrl.updateSection);
router.delete('/:id',       adminMiddleware, ctrl.deleteSection);
router.patch('/:id/toggle', adminMiddleware, ctrl.toggleSection);

module.exports = router;
