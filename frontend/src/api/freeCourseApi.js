import axiosInstance from './axiosInstance';

export const freeCourseApi = {
  getPublicFreeCourses: () => axiosInstance.get('/free-courses/public'),
};
