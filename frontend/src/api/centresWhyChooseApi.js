import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const centresWhyChooseApi = {
  // Get active why choose items for frontend
  getActive: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/centres-whychoose`);
      return response.data;
    } catch (error) {
      console.error('Error fetching why choose items:', error);
      throw error;
    }
  }
};
