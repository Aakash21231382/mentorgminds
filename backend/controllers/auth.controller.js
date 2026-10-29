const authService = require("../services/auth.service");

const register = async (req, res) => {
    try {
        const result = await authService.register(req.body);
        return res.status(201).json(result);
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const result = await authService.verifyOtp(req.body);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const result = await authService.login(req.body);
        return res.status(200).json(result);
    } catch (error) {
        const statusCode = error.message.includes("Invalid") || error.message.includes("verify") ? 401 : 400;
        return res.status(statusCode).json({ success: false, message: error.message });
    }
};

// User Logout — JWT stateless hai, client apna token delete kare
const logout = (req, res) => {
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

const forgotPassword = async (req, res) => {
    try {
        const result = await authService.forgotPassword(req.body);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

const verifyResetOtp = async (req, res) => {
    try {
        const result = await authService.verifyResetOtp(req.body);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const result = await authService.resetPassword(req.body);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await authService.getUserProfileService(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        delete user.PasswordHash;
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Get Profile Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updatedUser = await authService.updateUserProfileService(userId, req.body);
        res.status(200).json({ success: true, message: "Profile updated successfully!", user: updatedUser });
    } catch (err) {
        console.error("Profile Update Error:", err);
        res.status(500).json({ success: false, message: "Failed to update profile", error: err.message });
    }
};

const adminLogin = async (req, res) => {
    try {
        const result = await authService.adminLogin(req.body);
        return res.status(200).json(result);
    } catch (error) {
        const statusCode = error.message.includes("Invalid") || error.message.includes("denied") ? 401 : 400;
        return res.status(statusCode).json({ success: false, message: error.message });
    }
};

// Admin Logout — JWT stateless hai, client apna adminToken delete kare
const adminLogout = (req, res) => {
    res.status(200).json({ success: true, message: 'Admin logged out successfully' });
};

const resendOtp = async (req, res) => {
    try {
        const result = await authService.resendOtp(req.body);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

const updateProfileImage = async (req, res) => {
    try {
        const userId = req.user.id;
        const { image_url } = req.body;
        if (!image_url) {
            return res.status(400).json({ success: false, message: "Image URL is required." });
        }
        const result = await authService.updateProfileImageService(userId, image_url);
        res.status(200).json({
            success: true,
            message: "Profile image updated successfully!",
            profile_image: result.profile_image
        });
    } catch (err) {
        console.error("Profile Image Update Error:", err);
        res.status(500).json({ success: false, message: "Failed to update profile image." });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const { sql, config } = require('../config/database');
        const pool = await sql.connect(config);
        const result = await pool.request().execute('sp_GetAllUsers');
        res.status(200).json({ success: true, users: result.recordset });
    } catch (error) {
        console.error("Get All Users Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

module.exports = {
    register,
    verifyOtp,
    resendOtp,
    login,
    logout,
    adminLogin,
    adminLogout,
    forgotPassword,
    verifyResetOtp,
    resetPassword,
    updateProfile,
    getProfile,
    updateProfileImage,
    getAllUsers,
};
