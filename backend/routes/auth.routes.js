const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth.controller");
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post("/register", authController.register);
router.post("/verify-otp", authController.verifyOtp);
router.post("/resend-otp", authController.resendOtp);
router.post("/login", authController.login);
router.post("/logout", authMiddleware, authController.logout);
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-reset-otp", authController.verifyResetOtp);
router.post("/reset-password", authController.resetPassword);
router.post("/admin/login", authController.adminLogin);
router.post("/admin/logout", adminMiddleware, authController.adminLogout);
router.put('/profile', authMiddleware, authController.updateProfile);
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile/image', authMiddleware, authController.updateProfileImage);

// Admin: get all users
router.get('/admin/users', adminMiddleware, authController.getAllUsers);

module.exports = router;