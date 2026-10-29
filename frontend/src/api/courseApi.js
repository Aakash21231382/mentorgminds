import axiosInstance from './axiosInstance';

export const courseApi = {
    getCourseBySlug: async (slug) => {
        return axiosInstance.get(`/courses/slug/${slug}`);
    }
};
