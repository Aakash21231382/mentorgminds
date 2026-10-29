const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/successSection.controller');
const adminMiddleware = require('../middleware/adminMiddleware');

// ── Public ────────────────────────────────────────────────────
router.get('/config', ctrl.getConfig);
router.get('/stories', ctrl.getStories);

// ── Admin ─────────────────────────────────────────────────────
router.post('/config', adminMiddleware, ctrl.upsertConfig);
router.put('/config', adminMiddleware, ctrl.upsertConfig);

router.get('/stories/:id', adminMiddleware, ctrl.getStoryById);
router.post('/stories', adminMiddleware, ctrl.addStory);
router.put('/stories/:id', adminMiddleware, ctrl.updateStory);
router.delete('/stories/:id', adminMiddleware, ctrl.deleteStory);
router.patch('/stories/:id/toggle', adminMiddleware, ctrl.toggleStory);

module.exports = router;
