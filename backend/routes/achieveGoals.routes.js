const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/achieveGoals.controller');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public — frontend ke liye
router.get('/data', ctrl.getAllData);

// Admin — protected
router.get('/settings',     adminMiddleware, ctrl.getSettings);
router.post('/settings',    adminMiddleware, ctrl.saveSettings);
router.get('/',             adminMiddleware, ctrl.getTabs);
router.post('/',            adminMiddleware, ctrl.addTab);
router.put('/:id',          adminMiddleware, ctrl.updateTab);
router.delete('/:id',       adminMiddleware, ctrl.deleteTab);
router.patch('/:id/toggle', adminMiddleware, ctrl.toggleTab);

module.exports = router;
