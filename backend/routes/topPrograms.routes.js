const express = require("express");
const router = express.Router();
const {
  getAllPrograms,
  getProgramsByCategory,
  getProgramBySlug,
  getProgramDetails,
  upsertProgram,
  deleteProgram,
  upsertProgramDetails,
} = require("../controllers/topPrograms.controller");

// Public routes (for frontend)
router.get("/public/category/:categorySlug", getProgramsByCategory); // Get programs by category
router.get("/public/slug/:slug", getProgramBySlug); // Get program details by slug

// Admin routes
router.get("/admin/all", getAllPrograms); // Get all programs
router.get("/admin/detail/:id", getProgramDetails); // Get program details by ID
router.post("/admin/upsert", upsertProgram); // Add or update program
router.delete("/admin/:id", deleteProgram); // Delete program
router.post("/admin/details", upsertProgramDetails); // Save program details

module.exports = router;
