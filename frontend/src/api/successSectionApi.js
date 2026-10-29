import axiosInstance from './axiosInstance';

export const successSectionApi = {
  getConfig:  () => axiosInstance.get('/success-section/config'),
  getStories: () => axiosInstance.get('/success-section/stories'),
};
