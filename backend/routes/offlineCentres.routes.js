const express = require("express");
const router = express.Router();
const {
  getAllOfflineCentres,
  getCitiesWithCount,
  getCentresByCity,
  upsertOfflineCentre,
  deleteOfflineCentre,
} = require("../controllers/offlineCentres.controller");

// Public routes (for frontend)
router.get("/public/cities", getCitiesWithCount); // Get cities with count
router.get("/public/city/:cityName", getCentresByCity); // Get centres by city

// Admin routes
router.get("/admin/all", getAllOfflineCentres); // Get all centres
router.post("/admin/upsert", upsertOfflineCentre); // Add or update centre
router.delete("/admin/:id", deleteOfflineCentre); // Delete centre

module.exports = router;
