const express = require("express");
const router = express.Router();
const lmsAdminController = require("../controllers/lmsAdmin.controller");
const adminMiddleware = require("../middleware/adminMiddleware");

// All Admin LMS routes are protected by adminMiddleware
router.use(adminMiddleware);

// Platform Courses
router.get("/all-courses", lmsAdminController.getAllPlatformCourses);

// Modules & Lessons
router.get("/curriculum/:courseId", lmsAdminController.getCourseModules);
router.post("/modules", lmsAdminController.createModule);
router.put("/modules/:moduleId", lmsAdminController.updateModule);
router.delete("/modules/:moduleId", lmsAdminController.deleteModule);

router.post("/lessons", lmsAdminController.createLesson);
router.put("/lessons/:lessonId", lmsAdminController.updateLesson);
router.delete("/lessons/:lessonId", lmsAdminController.deleteLesson);

// Quizzes
router.get("/quizzes", lmsAdminController.getAllQuizzes);
router.post("/quizzes", lmsAdminController.createQuiz);
router.delete("/quizzes/:quizId", lmsAdminController.deleteQuiz);
router.post("/quizzes/:quizId/questions", lmsAdminController.addQuizQuestion);
router.delete("/quizzes/questions/:questionId", lmsAdminController.deleteQuizQuestion);

// Enrollments & Orders
router.get("/enrollments", lmsAdminController.getAllEnrollments);
router.get("/orders", lmsAdminController.getAllOrders);

// Coupons
router.get("/coupons", lmsAdminController.getAllCoupons);
router.post("/coupons", lmsAdminController.createCoupon);
router.delete("/coupons/:couponId", lmsAdminController.deleteCoupon);

// Reviews
router.get("/reviews", lmsAdminController.getAllReviews);
router.patch("/reviews/:reviewId/toggle", lmsAdminController.toggleReviewApproval);
router.delete("/reviews/:reviewId", lmsAdminController.deleteReview);

// Assignments & Grading
router.get("/assignments", lmsAdminController.getAllAssignments);
router.post("/assignments", lmsAdminController.createAssignment);
router.delete("/assignments/:assignmentId", lmsAdminController.deleteAssignment);
router.get("/submissions", lmsAdminController.getAllSubmissions);
router.patch("/submissions/:submissionId/grade", lmsAdminController.gradeSubmission);

// Live Classes
router.get("/live-classes", lmsAdminController.getAllLiveClasses);
router.post("/live-classes", lmsAdminController.createLiveClass);
router.patch("/live-classes/:liveClassId", lmsAdminController.updateLiveClass);
router.delete("/live-classes/:liveClassId", lmsAdminController.deleteLiveClass);

// Job Portal
router.get("/jobs", lmsAdminController.getAllJobs);
router.post("/jobs", lmsAdminController.createJob);
router.delete("/jobs/:jobId", lmsAdminController.deleteJob);
router.get("/job-applicants", lmsAdminController.getJobApplicants);
router.patch("/job-applicants/:applicationId/status", lmsAdminController.updateApplicationStatus);

module.exports = router;
