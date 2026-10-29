import axiosInstance from './axiosInstance';

export const offlineCentresApi = {
  // Get unique cities with centre count (for main display)
  getCitiesWithCount: async () => {
    try {
      const response = await axiosInstance.get('/offline-centres/public/cities');
      return response.data;
    } catch (error) {
      console.error('Error fetching cities:', error);
      throw error;
    }
  },

  // Get centres by city name (for detail page)
  getCentresByCity: async (cityName) => {
    try {
      const response = await axiosInstance.get(`/offline-centres/public/city/${cityName}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching centres by city:', error);
      throw error;
    }
  },
};

export default offlineCentresApi;
