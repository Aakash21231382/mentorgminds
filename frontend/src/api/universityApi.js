import axiosInstance from './axiosInstance';

export const universityApi = {
  getUniversitySlides: () => axiosInstance.get('/university/slides'),
};
