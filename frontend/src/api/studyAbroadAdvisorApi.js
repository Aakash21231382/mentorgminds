import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ✅ Submit study abroad advisor request
export const submitStudyAbroadAdvisor = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/study-abroad-advisor/submit`, formData);
    return response.data;
  } catch (error) {
    console.error('Error submitting study abroad advisor request:', error);
    throw error;
  }
};

// ✅ Get all study abroad advisor leads (admin only)
export const getAllStudyAbroadLeads = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/study-abroad-advisor/all`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching study abroad leads:', error);
    throw error;
  }
};

// ✅ Update lead status (admin only)
export const updateLeadStatus = async (id, status) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${API_URL}/study-abroad-advisor/status/${id}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating lead status:', error);
    throw error;
  }
};

// ✅ Delete study abroad lead (admin only)
export const deleteStudyAbroadLead = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/study-abroad-advisor/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting study abroad lead:', error);
    throw error;
  }
};

export default {
  submitStudyAbroadAdvisor,
  getAllStudyAbroadLeads,
  updateLeadStatus,
  deleteStudyAbroadLead
};
