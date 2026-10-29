const express = require("express");
const router = express.Router();
const lmsController = require("../controllers/lms.controller");
const authMiddleware = require("../middleware/authMiddleware");

// Optional Auth Helper middleware for public previews with user progress
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const jwt = require('jsonwebtoken');
        try {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        } catch (e) {
            // Ignore invalid token on optional routes
        }
    }
    next();
};

// 1. Enrollment & My Courses
router.get("/my-courses", authMiddleware, lmsController.getMyCourses);
router.get("/check-enrollment/:courseId", authMiddleware, lmsController.checkEnrollment);
router.post("/enroll", authMiddleware, lmsController.enrollUser);

// 2. Curriculum & Lessons
router.get("/course-curriculum/:courseId", optionalAuth, lmsController.getCourseCurriculum);
router.post("/lesson-progress", authMiddleware, lmsController.updateLessonProgress);

// 3. Quizzes & Submissions
router.get("/quiz/:quizId", optionalAuth, lmsController.getQuiz);
router.post("/quiz/:quizId/submit", authMiddleware, lmsController.submitQuiz);

// 4. Notes & Doubts
router.get("/notes/:lessonId", authMiddleware, lmsController.getLessonNotes);
router.post("/notes", authMiddleware, lmsController.addLessonNote);
router.delete("/notes/:noteId", authMiddleware, lmsController.deleteLessonNote);

router.get("/doubts/:lessonId", lmsController.getLessonDoubts);
router.post("/doubts", authMiddleware, lmsController.postLessonDoubt);

// 5. Certificates
router.post("/certificates/generate", authMiddleware, lmsController.generateCertificate);
router.get("/certificates/my-certificates", authMiddleware, lmsController.getMyCertificates);
router.get("/certificates/verify/:certNumber", lmsController.verifyCertificatePublic);

// 6. Reviews
router.get("/reviews/:courseId", lmsController.getCourseReviews);
router.post("/reviews", authMiddleware, lmsController.addCourseReview);

// 7. Orders & Coupons
router.post("/coupons/apply", lmsController.applyCoupon);
router.post("/orders/create", authMiddleware, lmsController.createOrder);
router.get("/orders/my-orders", authMiddleware, lmsController.getMyOrders);

// 8. Razorpay Payment Gateway (Test Mode)
router.post("/payment/create-order", authMiddleware, lmsController.createRazorpayOrder);
router.post("/payment/verify", authMiddleware, lmsController.verifyRazorpayPayment);

// 9. AI 24/7 Doubt Assistant
router.post("/ai/ask", optionalAuth, lmsController.askAIAssistant);

// 10. Project Assignments
router.get("/assignments/course/:courseId", optionalAuth, lmsController.getCourseAssignments);
router.post("/assignments/:assignmentId/submit", authMiddleware, lmsController.submitAssignment);

// 11. Live Masterclasses
router.get("/live-classes", optionalAuth, lmsController.getLiveClasses);

// 12. Gamification & Leaderboard
router.get("/gamification/leaderboard", optionalAuth, lmsController.getLeaderboard);
router.get("/gamification/my-stats", authMiddleware, lmsController.getUserXPStats);

// 13. Notifications
router.get("/notifications", optionalAuth, lmsController.getNotifications);
router.patch("/notifications/:notificationId/read", authMiddleware, lmsController.markNotificationRead);

// 14. Jobs Portal
router.get("/jobs", optionalAuth, lmsController.getJobListings);
router.post("/jobs/:jobId/apply", authMiddleware, lmsController.applyJob);

module.exports = router;
