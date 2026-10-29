const { sql, config } = require('../config/database');

// ✅ Submit counseling booking request
const submitCounselingBooking = async (req, res) => {
  try {
    const { name, email, phone, preferredDate, preferredTime, programInterest, message } = req.body;

    // Validation
    if (!name || !email || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and phone are required' 
      });
    }

    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('Name', sql.NVarChar(150), name)
      .input('Email', sql.NVarChar(200), email)
      .input('Phone', sql.NVarChar(20), phone)
      .input('PreferredDate', sql.Date, preferredDate || null)
      .input('PreferredTime', sql.NVarChar(50), preferredTime || null)
      .input('ProgramInterest', sql.NVarChar(200), programInterest || null)
      .input('Message', sql.NVarChar(1000), message || null)
      .execute('sp_InsertCounselingBooking');

    res.json({
      success: true,
      message: 'Counseling booking submitted successfully! Our team will contact you soon.',
      bookingId: result.recordset[0]?.Id
    });
  } catch (error) {
    console.error('Error submitting counseling booking:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit counseling booking' 
    });
  }
};

// ✅ Get all counseling bookings (admin only)
const getAllCounselingBookings = async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .execute('sp_GetAllCounselingBookings');

    res.json({
      success: true,
      bookings: result.recordset
    });
  } catch (error) {
    console.error('Error fetching counseling bookings:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch counseling bookings' 
    });
  }
};

// ✅ Update booking status (admin only)
const updateBookingStatus = async (req, res) => {
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
      .execute('sp_UpdateCounselingBookingStatus');

    res.json({
      success: true,
      message: 'Booking status updated successfully'
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update booking status' 
    });
  }
};

module.exports = {
  submitCounselingBooking,
  getAllCounselingBookings,
  updateBookingStatus
};
