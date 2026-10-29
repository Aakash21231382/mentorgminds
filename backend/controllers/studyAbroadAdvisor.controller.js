const { sql, config } = require('../config/database');

// ✅ Submit study abroad advisor request
const submitStudyAbroadAdvisor = async (req, res) => {
  try {
    const { 
      studyCountries, degree, visitCity,
      bachelorsCompleted, preferredStream, examStatus,
      fullName, email, phone, step 
    } = req.body;

    // Validation
    if (!fullName || !email || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Full name, email, and phone are required' 
      });
    }

    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('StudyCountries', sql.NVarChar(200), studyCountries || null)
      .input('Degree', sql.NVarChar(50), degree || null)
      .input('VisitCity', sql.NVarChar(100), visitCity || null)
      .input('BachelorsCompleted', sql.NVarChar(10), bachelorsCompleted || null)
      .input('PreferredStream', sql.NVarChar(100), preferredStream || null)
      .input('ExamStatus', sql.NVarChar(50), examStatus || null)
      .input('FullName', sql.NVarChar(150), fullName)
      .input('Email', sql.NVarChar(200), email)
      .input('Phone', sql.NVarChar(20), phone)
      .input('CurrentStep', sql.Int, step || 3)
      .execute('sp_InsertStudyAbroadAdvisor');

    res.json({
      success: true,
      message: 'Your request has been submitted successfully! Our study abroad advisor will contact you soon.',
      leadId: result.recordset[0] ? result.recordset[0].Id : null
    });
  } catch (error) {
    console.error('Error submitting study abroad advisor request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit your request. Please try again.' 
    });
  }
};

// ✅ Get all study abroad advisor leads (admin only)
const getAllStudyAbroadLeads = async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .execute('sp_GetAllStudyAbroadAdvisorLeads');

    res.json({
      success: true,
      leads: result.recordset
    });
  } catch (error) {
    console.error('Error fetching study abroad leads:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch study abroad leads' 
    });
  }
};

// ✅ Update lead status (admin only)
const updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ 
        success: false, 
        message: 'Status is required' 
      });
    }

    const pool = await sql.connect(config);
    await pool.request()
      .input('Id', sql.Int, parseInt(id))
      .input('Status', sql.NVarChar(50), status)
      .execute('sp_UpdateStudyAbroadLeadStatus');

    res.json({
      success: true,
      message: 'Lead status updated successfully'
    });
  } catch (error) {
    console.error('Error updating lead status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update lead status' 
    });
  }
};

// ✅ Delete study abroad lead (admin only)
const deleteStudyAbroadLead = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await sql.connect(config);
    await pool.request()
      .input('Id', sql.Int, parseInt(id))
      .execute('sp_DeleteStudyAbroadLead');

    res.json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting study abroad lead:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete lead' 
    });
  }
};

module.exports = {
  submitStudyAbroadAdvisor,
  getAllStudyAbroadLeads,
  updateLeadStatus,
  deleteStudyAbroadLead
};
