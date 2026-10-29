import axiosInstance from './axiosInstance';

export const technologyApi = {
  // Curriculum
  getCurriculumData:          () => axiosInstance.get('/curriculum/data'),

  // Course Projects
  getCourseProjectsData:      () => axiosInstance.get('/course-projects/data'),

  // Tools & Technologies
  getToolsTechData:           () => axiosInstance.get('/tools-tech/data'),

  // Course Instructors
  getCourseInstructorsData:   () => axiosInstance.get('/course-instructors/data'),

  // Curriculum Comparison
  getCurriculumCompData:      () => axiosInstance.get('/curriculum-comparison/data'),

  // Skills Comparison
  getSkillsCompData:          () => axiosInstance.get('/skills-comparison/data'),

  // Achieve Goals
  getAchieveGoalsData:        () => axiosInstance.get('/achieve-goals/data'),

  // Course Overview
  getCourseOverviewData:      () => axiosInstance.get('/course-overview/data'),

  // FAQ
  getFaqData:                 () => axiosInstance.get('/faq/data'),
};
