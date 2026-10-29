import axiosInstance from './axiosInstance';

export const instructorApi = {
  getInstructorSection: () => axiosInstance.get('/instructors/section'),
  getInstructors:       () => axiosInstance.get('/instructors'),
};
