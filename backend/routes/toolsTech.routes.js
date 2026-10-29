const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/toolsTech.controller');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/data',              ctrl.getAllData);                       // public
router.get('/settings',          adminMiddleware, ctrl.getSettings);
router.post('/settings',         adminMiddleware, ctrl.saveSettings);
router.get('/',                  adminMiddleware, ctrl.getTools);
router.post('/',                 adminMiddleware, ctrl.addTool);
router.put('/:id',               adminMiddleware, ctrl.updateTool);
router.delete('/:id',            adminMiddleware, ctrl.deleteTool);
router.patch('/:id/toggle',      adminMiddleware, ctrl.toggleTool);

module.exports = router;
