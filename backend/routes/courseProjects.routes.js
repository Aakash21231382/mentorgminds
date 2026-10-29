const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/courseProjects.controller');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/data',             ctrl.getAllData);                         // public
router.get('/settings',         adminMiddleware, ctrl.getSettings);
router.post('/settings',        adminMiddleware, ctrl.saveSettings);
router.get('/',                 adminMiddleware, ctrl.getProjects);
router.post('/',                adminMiddleware, ctrl.addProject);
router.put('/:id',              adminMiddleware, ctrl.updateProject);
router.delete('/:id',           adminMiddleware, ctrl.deleteProject);
router.patch('/:id/toggle',     adminMiddleware, ctrl.toggleProject);

module.exports = router;
