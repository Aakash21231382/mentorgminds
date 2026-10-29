import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_URL = rawApiUrl.endsWith('/api') ? rawApiUrl.slice(0, -4) : rawApiUrl;

// ✅ Submit counseling booking
export const submitCounselingBooking = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/api/counseling/submit`, formData);
    return response.data;
  } catch (error) {
    console.error('Error submitting counseling booking:', error);
    throw error;
  }
};

// ✅ Get all counseling bookings (admin only)
export const getAllCounselingBookings = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/api/counseling/admin/all`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching counseling bookings:', error);
    throw error;
  }
};

// ✅ Update booking status (admin only)
export const updateBookingStatus = async (id, status) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${API_URL}/api/counseling/admin/status/${id}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};

export default {
  submitCounselingBooking,
  getAllCounselingBookings,
  updateBookingStatus
};
