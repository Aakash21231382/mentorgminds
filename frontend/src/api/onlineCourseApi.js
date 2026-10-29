import axiosInstance from './axiosInstance';

export const onlineCourseApi = {
  // Home page slider
  getPublicOnlineCourses: () => axiosInstance.get('/online-courses/public'),

  // ViewAll page — all courses (client-side pagination)
  getAllPublicOnlineCourses: (pageSize = 999) =>
    axiosInstance.get(`/online-courses/public/all?pageSize=${pageSize}`),

  // Course detail by slug
  getOnlineCourseDetailBySlug: (slug) =>
    axiosInstance.get(`/online-courses/detail/slug/${slug}`),
};
