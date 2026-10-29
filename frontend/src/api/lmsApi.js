import axiosInstance from './axiosInstance';

export const lmsApi = {
  // Student Enrolled Courses
  getMyCourses: () => axiosInstance.get('/lms/my-courses'),
  checkEnrollment: (courseId, courseType = 'online') => 
    axiosInstance.get(`/lms/check-enrollment/${courseId}?courseType=${courseType}`),
  enrollUser: (data) => axiosInstance.post('/lms/enroll', data),

  // Course Classroom & Lessons
  getCourseCurriculum: (courseId, courseType = 'online') => 
    axiosInstance.get(`/lms/course-curriculum/${courseId}?courseType=${courseType}`),
  updateLessonProgress: (data) => axiosInstance.post('/lms/lesson-progress', data),

  // Quiz
  getQuiz: (quizId) => axiosInstance.get(`/lms/quiz/${quizId}`),
  submitQuiz: (quizId, answers) => axiosInstance.post(`/lms/quiz/${quizId}/submit`, { answers }),

  // Notes & Doubts
  getLessonNotes: (lessonId) => axiosInstance.get(`/lms/notes/${lessonId}`),
  addLessonNote: (data) => axiosInstance.post('/lms/notes', data),
  deleteLessonNote: (noteId) => axiosInstance.delete(`/lms/notes/${noteId}`),

  getLessonDoubts: (lessonId) => axiosInstance.get(`/lms/doubts/${lessonId}`),
  postLessonDoubt: (data) => axiosInstance.post('/lms/doubts', data),

  // Certificates
  generateCertificate: (data) => axiosInstance.post('/lms/certificates/generate', data),
  getMyCertificates: () => axiosInstance.get('/lms/certificates/my-certificates'),
  verifyCertificate: (certNumber) => axiosInstance.get(`/lms/certificates/verify/${certNumber}`),

  // Reviews
  getCourseReviews: (courseId, courseType = 'online') => 
    axiosInstance.get(`/lms/reviews/${courseId}?courseType=${courseType}`),
  addCourseReview: (data) => axiosInstance.post('/lms/reviews', data),

  // Orders & Coupons
  applyCoupon: (data) => axiosInstance.post('/lms/coupons/apply', data),
  createOrder: (data) => axiosInstance.post('/lms/orders/create', data),
  getMyOrders: () => axiosInstance.get('/lms/orders/my-orders'),

  // Razorpay Payment Gateway (Test Mode)
  createRazorpayOrder: (data) => axiosInstance.post('/lms/payment/create-order', data),
  verifyRazorpayPayment: (data) => axiosInstance.post('/lms/payment/verify', data),

  // AI 24/7 Doubt Assistant
  askAIAssistant: (data) => axiosInstance.post('/lms/ai/ask', data),

  // Project Assignments
  getCourseAssignments: (courseId) => axiosInstance.get(`/lms/assignments/course/${courseId}`),
  submitAssignment: (assignmentId, data) => axiosInstance.post(`/lms/assignments/${assignmentId}/submit`, data),

  // Live Masterclasses
  getLiveClasses: (courseId) => axiosInstance.get(`/lms/live-classes${courseId ? `?courseId=${courseId}` : ''}`),

  // Gamification & Leaderboard
  getLeaderboard: () => axiosInstance.get('/lms/gamification/leaderboard'),
  getUserXPStats: () => axiosInstance.get('/lms/gamification/my-stats'),

  // In-App Notifications
  getNotifications: () => axiosInstance.get('/lms/notifications'),
  markNotificationRead: (notificationId) => axiosInstance.patch(`/lms/notifications/${notificationId}/read`),

  // Career & Job Board
  getJobListings: () => axiosInstance.get('/lms/jobs'),
  applyJob: (jobId, data) => axiosInstance.post(`/lms/jobs/${jobId}/apply`, data)
};

export default lmsApi;
