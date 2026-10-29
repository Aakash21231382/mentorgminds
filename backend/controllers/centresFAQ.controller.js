const sql = require('mssql');
const { config } = require('../config/database');

// Get All FAQs (Admin)
exports.getAllFAQs = async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute('sp_GetAllCentresFAQ');
    
    // Parse BulletPoints JSON string to array
    const faqs = result.recordset.map(faq => ({
      ...faq,
      BulletPoints: faq.BulletPoints ? JSON.parse(faq.BulletPoints) : null
    }));
    
    res.json({
      success: true,
      data: faqs
    });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch FAQs',
      error: error.message
    });
  }
};

// Get Active FAQs (Frontend)
exports.getActiveFAQs = async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute('sp_GetActiveCentresFAQ');
    
    // Parse BulletPoints JSON string to array
    const faqs = result.recordset.map(faq => ({
      ...faq,
      bulletPoints: faq.BulletPoints ? JSON.parse(faq.BulletPoints) : null
    }));
    
    res.json({
      success: true,
      data: faqs
    });
  } catch (error) {
    console.error('Error fetching active FAQs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch FAQs',
      error: error.message
    });
  }
};

// Upsert FAQ
exports.upsertFAQ = async (req, res) => {
  try {
    const { 
      id, 
      question, 
      answer, 
      subHeading, 
      introText, 
      bulletPoints, 
      outroText, 
      displayOrder, 
      isActive 
    } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: 'Question and answer are required'
      });
    }

    // Convert bulletPoints array to JSON string
    const bulletPointsJson = bulletPoints ? JSON.stringify(bulletPoints) : null;

    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('Id', sql.Int, id || null)
      .input('Question', sql.NVarChar(500), question)
      .input('Answer', sql.NVarChar(sql.MAX), answer)
      .input('SubHeading', sql.NVarChar(200), subHeading || null)
      .input('IntroText', sql.NVarChar(sql.MAX), introText || null)
      .input('BulletPoints', sql.NVarChar(sql.MAX), bulletPointsJson)
      .input('OutroText', sql.NVarChar(sql.MAX), outroText || null)
      .input('DisplayOrder', sql.Int, displayOrder || 0)
      .input('IsActive', sql.Bit, isActive !== undefined ? isActive : true)
      .execute('sp_UpsertCentresFAQ');

    res.json({
      success: true,
      message: result.recordset[0].Message,
      id: result.recordset[0].Id
    });
  } catch (error) {
    console.error('Error upserting FAQ:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save FAQ',
      error: error.message
    });
  }
};

// Delete FAQ
exports.deleteFAQ = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('Id', sql.Int, id)
      .execute('sp_DeleteCentresFAQ');

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
    console.error('Error deleting FAQ:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete FAQ',
      error: error.message
    });
  }
};

// Toggle FAQ Status
exports.toggleFAQStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('Id', sql.Int, id)
      .execute('sp_ToggleCentresFAQStatus');

    res.json({
      success: true,
      isActive: result.recordset[0].IsActive
    });
  } catch (error) {
    console.error('Error toggling FAQ status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle status',
      error: error.message
    });
  }
};
