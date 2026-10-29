const sql = require('mssql');
const { config } = require('../config/database');

// Get All Why Choose Items (Admin)
exports.getAllWhyChoose = async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute('sp_GetAllCentresWhyChoose');
    
    res.json({
      success: true,
      data: result.recordset
    });
  } catch (error) {
    console.error('Error fetching why choose items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch why choose items',
      error: error.message
    });
  }
};

// Get Active Why Choose Items (Frontend)
exports.getActiveWhyChoose = async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute('sp_GetActiveCentresWhyChoose');
    
    res.json({
      success: true,
      data: result.recordset
    });
  } catch (error) {
    console.error('Error fetching active why choose items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch why choose items',
      error: error.message
    });
  }
};

// Upsert Why Choose Item
exports.upsertWhyChoose = async (req, res) => {
  try {
    const { id, image, title, description, displayOrder, isActive } = req.body;

    if (!image || !title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Image, title, and description are required'
      });
    }

    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('Id', sql.Int, id || null)
      .input('Image', sql.NVarChar(500), image)
      .input('Title', sql.NVarChar(200), title)
      .input('Description', sql.NVarChar(sql.MAX), description)
      .input('DisplayOrder', sql.Int, displayOrder || 0)
      .input('IsActive', sql.Bit, isActive !== undefined ? isActive : true)
      .execute('sp_UpsertCentresWhyChoose');

    res.json({
      success: true,
      message: result.recordset[0].Message,
      id: result.recordset[0].Id
    });
  } catch (error) {
    console.error('Error upserting why choose item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save why choose item',
      error: error.message
    });
  }
};

// Delete Why Choose Item
exports.deleteWhyChoose = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('Id', sql.Int, id)
      .execute('sp_DeleteCentresWhyChoose');

    if (result.recordset[0].Success) {
      res.json({
        success: true,
        message: result.recordset[0].Message
      });
    } else {
      res.status(404).json({
        success: false,
        message: result.recordset[0].Message
      });
    }
  } catch (error) {
    console.error('Error deleting why choose item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete why choose item',
      error: error.message
    });
  }
};

// Toggle Why Choose Status
exports.toggleWhyChooseStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('Id', sql.Int, id)
      .execute('sp_ToggleCentresWhyChooseStatus');

    res.json({
      success: true,
      isActive: result.recordset[0].IsActive
    });
  } catch (error) {
    console.error('Error toggling why choose status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle status',
      error: error.message
    });
  }
};
