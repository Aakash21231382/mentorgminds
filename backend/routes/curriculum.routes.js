const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/curriculum.controller');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public — frontend ke liye (settings + active cards)
router.get('/data',   ctrl.getAllData);

// Admin
router.get('/settings',    adminMiddleware, ctrl.getSettings);
router.post('/settings',   adminMiddleware, ctrl.saveSettings);
router.get('/',            adminMiddleware, ctrl.getCards);
router.post('/',           adminMiddleware, ctrl.addCard);
router.put('/:id',         adminMiddleware, ctrl.updateCard);
router.delete('/:id',      adminMiddleware, ctrl.deleteCard);
router.patch('/:id/toggle', adminMiddleware, ctrl.toggleCard);

module.exports = router;
