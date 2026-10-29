const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/awardsSection.controller');
const adminMiddleware = require('../middleware/adminMiddleware');

// ── Public ────────────────────────────────────────────────────
router.get('/config', ctrl.getConfig);
router.get('/cards',  ctrl.getCards);

// ── Admin ─────────────────────────────────────────────────────
router.post('/config', adminMiddleware, ctrl.upsertConfig);
router.put('/config',  adminMiddleware, ctrl.upsertConfig);

router.get('/cards/:id',          adminMiddleware, ctrl.getCardById);
router.post('/cards',             adminMiddleware, ctrl.addCard);
router.put('/cards/:id',          adminMiddleware, ctrl.updateCard);
router.delete('/cards/:id',       adminMiddleware, ctrl.deleteCard);
router.patch('/cards/:id/toggle', adminMiddleware, ctrl.toggleCard);

module.exports = router;
