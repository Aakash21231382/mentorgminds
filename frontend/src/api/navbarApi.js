import axiosInstance from './axiosInstance';

export const navbarApi = {
    // Frontend baseURL already includes /api, so just /navbar
    getNavbarLinks: async () => {
        // axiosInstance interceptor returns response.data directly
        return axiosInstance.get('/navbar');
    }
};
