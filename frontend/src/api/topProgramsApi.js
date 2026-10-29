import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper - unwrap response.data
const get = (url) => axios.get(url).then(r => r.data);

export const topProgramsApi = {
  // Get all active categories
  getCategories: () => get(`${API_URL}/top-program-categories/public`),
  
  // Get programs by category slug
  getProgramsByCategory: (categorySlug) => 
    get(`${API_URL}/top-programs/public/category/${categorySlug}`),
  
  // Get program details by slug
  getProgramBySlug: (slug) => 
    get(`${API_URL}/top-programs/public/slug/${slug}`),
};
