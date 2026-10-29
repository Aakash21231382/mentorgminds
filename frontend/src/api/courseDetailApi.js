import axiosInstance from './axiosInstance';

export const courseDetailApi = {
  // Career + Navbar linked course detail by slug
  getCourseDetailBySlug: (slug) =>
    axiosInstance.get(`/course-detail/slug/${slug}`),

  // Online course detail by slug
  getOnlineCourseDetailBySlug: (slug) =>
    axiosInstance.get(`/online-courses/detail/slug/${slug}`),
};
