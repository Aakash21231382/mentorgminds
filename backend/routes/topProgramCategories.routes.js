const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  upsertCategory,
  deleteCategory,
} = require("../controllers/topProgramCategories.controller");

// Public routes (for frontend)
router.get("/public", getAllCategories); // Get active categories

// Admin routes
router.get("/admin", getAllCategories); // Get all categories (including inactive)
router.post("/admin/upsert", upsertCategory); // Add or update category
router.delete("/admin/:id", deleteCategory); // Delete category

module.exports = router;
