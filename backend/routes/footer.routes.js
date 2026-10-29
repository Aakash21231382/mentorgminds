const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/footer.controller');
const adminMiddleware = require('../middleware/adminMiddleware');

// ── Public ──────────────────────────────────────────────────
router.get('/data', ctrl.getAllData);                          // frontend one-call fetch

// ── Admin — Columns ─────────────────────────────────────────
router.get('/columns',             adminMiddleware, ctrl.getColumns);
router.post('/columns',            adminMiddleware, ctrl.addColumn);
router.put('/columns/:id',         adminMiddleware, ctrl.updateColumn);
router.delete('/columns/:id',      adminMiddleware, ctrl.deleteColumn);
router.patch('/columns/:id/toggle',adminMiddleware, ctrl.toggleColumn);

// ── Admin — Links ────────────────────────────────────────────
router.get('/columns/:columnId/links',  adminMiddleware, ctrl.getLinksByColumn);
router.post('/columns/:columnId/links', adminMiddleware, ctrl.addLink);
router.put('/links/:id',                adminMiddleware, ctrl.updateLink);
router.delete('/links/:id',             adminMiddleware, ctrl.deleteLink);
router.patch('/links/:id/toggle',       adminMiddleware, ctrl.toggleLink);

module.exports = router;
