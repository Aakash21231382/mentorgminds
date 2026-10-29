const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/instructor.controller');
const adminMiddleware = require('../middleware/adminMiddleware');

// ── Public ────────────────────────────────────────────────────
router.get('/section', ctrl.getSection);
router.get('/', ctrl.getInstructors);
router.get('/hero/all-programs', ctrl.getAllProgramsHero);

// ── Admin ─────────────────────────────────────────────────────
router.post('/section', adminMiddleware, ctrl.upsertSection);
router.put('/section', adminMiddleware, ctrl.upsertSection);

router.post('/', adminMiddleware, ctrl.addInstructor);
router.put('/:id', adminMiddleware, ctrl.updateInstructor);
router.delete('/:id', adminMiddleware, ctrl.deleteInstructor);
router.patch('/:id/toggle', adminMiddleware, ctrl.toggleInstructor);
router.get('/:id', adminMiddleware, ctrl.getInstructorById);

router.post('/hero/all-programs', adminMiddleware, ctrl.upsertAllProgramsHero);
router.put('/hero/all-programs', adminMiddleware, ctrl.upsertAllProgramsHero);

module.exports = router;
