import axiosInstance from './axiosInstance';

export const awardsApi = {
  getConfig: () => axiosInstance.get('/awards-section/config'),
  getCards:  () => axiosInstance.get('/awards-section/cards'),
};
