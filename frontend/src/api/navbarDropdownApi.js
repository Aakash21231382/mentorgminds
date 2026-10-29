import axiosInstance from './axiosInstance';

export const navbarDropdownApi = {
    getPublicDropdown: (navbarLinkId) => axiosInstance.get(`/navbar-dropdown/public/${navbarLinkId}`),
    getAllPublicDropdowns: () => axiosInstance.get('/navbar-dropdown/public-all'),
};
