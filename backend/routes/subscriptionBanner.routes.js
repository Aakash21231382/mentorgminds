const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/subscriptionBanner.controller');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public — frontend fetch kare
router.get('/',  ctrl.getSubscriptionBanner);

// Admin — save kare
router.post('/', adminMiddleware, ctrl.upsertSubscriptionBanner);
router.put('/',  adminMiddleware, ctrl.upsertSubscriptionBanner);

module.exports = router;
