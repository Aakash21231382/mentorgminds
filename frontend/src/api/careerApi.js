import axiosInstance from './axiosInstance';

export const careerApi = {
  // Home page + AllPrograms page
  getPublicCareerData: () => axiosInstance.get('/career/public'),

  // AllPrograms hero text
  getAllProgramsHero: () => axiosInstance.get('/instructors/hero/all-programs'),
};
