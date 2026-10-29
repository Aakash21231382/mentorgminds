const { sql, config } = require("../config/database");

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const showAll = req.query.showAll === "true";
    
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("ShowAll", sql.Bit, showAll ? 1 : 0)
      .execute("sp_GetTopProgramCategories");

    res.status(200).json({
      success: true,
      categories: result.recordset,
    });
  } catch (error) {
    console.error("Error fetching top program categories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

// Add or update category
const upsertCategory = async (req, res) => {
  try {
    const { id, name, slug, icon, displayOrder, isActive } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "Name and slug are required",
      });
    }

    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("Id", sql.Int, id || null)
      .input("Name", sql.NVarChar(100), name)
      .input("Slug", sql.NVarChar(150), slug)
      .input("Icon", sql.NVarChar(50), icon || null)
      .input("DisplayOrder", sql.Int, parseInt(displayOrder) || 0)
      .input("IsActive", sql.Bit, isActive !== undefined ? (isActive ? 1 : 0) : 1)
      .execute("sp_UpsertTopProgramCategory");

    res.status(200).json({
      success: true,
      message: id ? "Category updated successfully" : "Category added successfully",
      data: result.recordset[0],
    });
  } catch (error) {
    console.error("Error upserting category:", error);
    
    // Handle specific SQL errors
    if (error.number === 2627) { // Unique constraint violation
      return res.status(409).json({
        success: false,
        message: "Category with this name or slug already exists",
      });
    }
    
    // Check for custom RAISERROR messages
    if (error.message && error.message.includes('already exists')) {
      return res.status(409).json({
        success: false,
        message: "Category with this name or slug already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to save category",
      error: error.message,
    });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await sql.connect(config);
    await pool
      .request()
      .input("Id", sql.Int, id)
      .execute("sp_DeleteTopProgramCategory");

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error.message,
    });
  }
};

module.exports = {
  getAllCategories,
  upsertCategory,
  deleteCategory,
};
