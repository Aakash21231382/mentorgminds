import axiosInstance from './axiosInstance';
import axios from 'axios';

export const authApi = {
  register: (userData) => axiosInstance.post('/auth/register', userData),
  verifyOtp: (otpData) => axiosInstance.post('/auth/verify-otp', otpData),
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  logout: () => axiosInstance.post('/auth/logout'),
  forgotPassword: (emailData) => axiosInstance.post('/auth/forgot-password', emailData),
  verifyForgotOtp: (otpData) => axiosInstance.post('/auth/verify-reset-otp', otpData),
  resetPassword: (resetData) => axiosInstance.post('/auth/reset-password', resetData),
  resendOtp: (emailData) => axiosInstance.post('/auth/resend-otp', emailData),


  getProfile: () => axiosInstance.get('/auth/profile'),
  updateProfile: (profileData) => axiosInstance.put('/auth/profile', profileData),
  updateProfileImageUrl: (imageUrl) => axiosInstance.put('/auth/profile/image', { image_url: imageUrl }),

  // Image Upload — directly to CDN (same as admin banner upload)
  uploadProfileImage: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return axios.post('https://host0008-001-site1.qtempurl.com/api/uploadfile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  
  
};