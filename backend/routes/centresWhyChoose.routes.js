const express = require('express');
const router = express.Router();
const centresWhyChooseController = require('../controllers/centresWhyChoose.controller');

// Admin routes
router.get('/admin', centresWhyChooseController.getAllWhyChoose);
router.post('/admin', centresWhyChooseController.upsertWhyChoose);
router.delete('/admin/:id', centresWhyChooseController.deleteWhyChoose);
router.patch('/admin/:id/toggle', centresWhyChooseController.toggleWhyChooseStatus);

// Frontend route
router.get('/', centresWhyChooseController.getActiveWhyChoose);

module.exports = router;
