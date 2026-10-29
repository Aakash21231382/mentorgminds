const { sql, config } = require("../config/database");

// Get all centres grouped by city (for admin)
const getAllOfflineCentres = async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute("sp_GetOfflineCentres");

    res.status(200).json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error("Error fetching offline centres:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch offline centres",
      error: error.message,
    });
  }
};

// Get unique cities with centre count (for frontend display)
const getCitiesWithCount = async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute("sp_GetOfflineCitiesWithCount");

    res.status(200).json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error("Error fetching cities with count:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cities",
      error: error.message,
    });
  }
};

// Get centres by city name
const getCentresByCity = async (req, res) => {
  try {
    const { cityName } = req.params;

    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("CityName", sql.NVarChar(100), cityName)
      .execute("sp_GetOfflineCentresByCity");

    res.status(200).json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error("Error fetching centres by city:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch centres by city",
      error: error.message,
    });
  }
};

// Add or update centre
const upsertOfflineCentre = async (req, res) => {
  try {
    const {
      id,
      cityName,
      cityImage,
      locationName,
      locationAddress,
      locationImage,
      mapLink,
      contactNumber,
      displayOrder,
      isActive,
    } = req.body;

    // Validation
    if (!cityName || !locationName) {
      return res.status(400).json({
        success: false,
        message: "City name and location name are required",
      });
    }

    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("Id", sql.Int, id || null)
      .input("CityName", sql.NVarChar(100), cityName)
      .input("CityImage", sql.NVarChar(sql.MAX), cityImage || null)
      .input("LocationName", sql.NVarChar(200), locationName)
      .input("LocationAddress", sql.NVarChar(500), locationAddress || null)
      .input("LocationImage", sql.NVarChar(sql.MAX), locationImage || null)
      .input("MapLink", sql.NVarChar(sql.MAX), mapLink || null)
      .input("ContactNumber", sql.NVarChar(20), contactNumber || null)
      .input("DisplayOrder", sql.Int, displayOrder || 0)
      .input("IsActive", sql.Bit, isActive !== undefined ? isActive : true)
      .execute("sp_UpsertOfflineCentre");

    res.status(200).json({
      success: true,
      message: id ? "Centre updated successfully" : "Centre added successfully",
      data: result.recordset[0],
    });
  } catch (error) {
    console.error("Error upserting offline centre:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save offline centre",
      error: error.message,
    });
  }
};

// Delete centre
const deleteOfflineCentre = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("Id", sql.Int, id)
      .execute("sp_DeleteOfflineCentre");

    if (result.recordset[0].DeletedRows > 0) {
      res.status(200).json({
        success: true,
        message: "Centre deleted successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Centre not found",
      });
    }
  } catch (error) {
    console.error("Error deleting offline centre:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete offline centre",
      error: error.message,
    });
  }
};

module.exports = {
  getAllOfflineCentres,
  getCitiesWithCount,
  getCentresByCity,
  upsertOfflineCentre,
  deleteOfflineCentre,
};
