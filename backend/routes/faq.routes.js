const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/faq.controller');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public
router.get('/data', ctrl.getAllData);

// Admin — protected
router.get('/settings',     adminMiddleware, ctrl.getSettings);
router.post('/settings',    adminMiddleware, ctrl.saveSettings);
router.get('/',             adminMiddleware, ctrl.getItems);
router.post('/',            adminMiddleware, ctrl.addItem);
router.put('/:id',          adminMiddleware, ctrl.updateItem);
router.delete('/:id',       adminMiddleware, ctrl.deleteItem);
router.patch('/:id/toggle', adminMiddleware, ctrl.toggleItem);

module.exports = router;
