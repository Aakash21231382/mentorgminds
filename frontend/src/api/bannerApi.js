import axiosInstance from './axiosInstance';

export const bannerApi = {
  getBanners: () => axiosInstance.get('/banners'),
};
