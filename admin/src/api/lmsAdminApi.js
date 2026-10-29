import axiosInstance from "./axiosInstance";

export const lmsAdminApi = {
  // Platform Courses
  getAllPlatformCourses: () => axiosInstance.get('/admin/lms/all-courses'),

  // Modules & Lessons Studio
  getCurriculum: (courseId, courseType = 'online') => 
    axiosInstance.get(`/admin/lms/curriculum/${courseId}?courseType=${courseType}`),
  createModule: (data) => axiosInstance.post('/admin/lms/modules', data),
  updateModule: (moduleId, data) => axiosInstance.put(`/admin/lms/modules/${moduleId}`, data),
  deleteModule: (moduleId) => axiosInstance.delete(`/admin/lms/modules/${moduleId}`),

  createLesson: (data) => axiosInstance.post('/admin/lms/lessons', data),
  updateLesson: (lessonId, data) => axiosInstance.put(`/admin/lms/lessons/${lessonId}`, data),
  deleteLesson: (lessonId) => axiosInstance.delete(`/admin/lms/lessons/${lessonId}`),

  // Quizzes & Questions Builder
  getAllQuizzes: () => axiosInstance.get('/admin/lms/quizzes'),
  createQuiz: (data) => axiosInstance.post('/admin/lms/quizzes', data),
  deleteQuiz: (quizId) => axiosInstance.delete(`/admin/lms/quizzes/${quizId}`),
  addQuestion: (quizId, data) => axiosInstance.post(`/admin/lms/quizzes/${quizId}/questions`, data),
  deleteQuestion: (questionId) => axiosInstance.delete(`/admin/lms/quizzes/questions/${questionId}`),

  // Enrollments & Orders
  getAllEnrollments: () => axiosInstance.get('/admin/lms/enrollments'),
  getAllOrders: () => axiosInstance.get('/admin/lms/orders'),

  // Coupons
  getAllCoupons: () => axiosInstance.get('/admin/lms/coupons'),
  createCoupon: (data) => axiosInstance.post('/admin/lms/coupons', data),
  deleteCoupon: (couponId) => axiosInstance.delete(`/admin/lms/coupons/${couponId}`),

  // Reviews Moderation
  getAllReviews: () => axiosInstance.get('/admin/lms/reviews'),
  toggleReviewApproval: (reviewId) => axiosInstance.patch(`/admin/lms/reviews/${reviewId}/toggle`),
  deleteReview: (reviewId) => axiosInstance.delete(`/admin/lms/reviews/${reviewId}`),

  // Assignments & Grading
  getAllAssignments: () => axiosInstance.get('/admin/lms/assignments'),
  createAssignment: (data) => axiosInstance.post('/admin/lms/assignments', data),
  deleteAssignment: (assignmentId) => axiosInstance.delete(`/admin/lms/assignments/${assignmentId}`),
  getAllSubmissions: () => axiosInstance.get('/admin/lms/submissions'),
  gradeSubmission: (submissionId, data) => axiosInstance.patch(`/admin/lms/submissions/${submissionId}/grade`, data),

  // Live Classes
  getAllLiveClasses: () => axiosInstance.get('/admin/lms/live-classes'),
  createLiveClass: (data) => axiosInstance.post('/admin/lms/live-classes', data),
  updateLiveClass: (liveClassId, data) => axiosInstance.patch(`/admin/lms/live-classes/${liveClassId}`, data),
  deleteLiveClass: (liveClassId) => axiosInstance.delete(`/admin/lms/live-classes/${liveClassId}`),

  // Job Board & Applicants
  getAllJobs: () => axiosInstance.get('/admin/lms/jobs'),
  createJob: (data) => axiosInstance.post('/admin/lms/jobs', data),
  deleteJob: (jobId) => axiosInstance.delete(`/admin/lms/jobs/${jobId}`),
  getJobApplicants: () => axiosInstance.get('/admin/lms/job-applicants'),
  updateApplicantStatus: (applicationId, status) => axiosInstance.patch(`/admin/lms/job-applicants/${applicationId}/status`, { status })
};

export default lmsAdminApi;
