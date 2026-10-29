


import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhoneAlt, FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaKey } from "react-icons/fa";
import T from "../context/T";
import "../assets/css/signup.css";
import NavLogo1 from "../assets/images/NavLogo1.png";
import { authApi } from "../api/authApi";
import { toast } from 'react-toastify';

const Signup = () => {
  const navigate = useNavigate(); // Redirect ke liye
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // API Flow States
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  const [formData, setFormData] = useState({
    fullname: "", email: "", phone: "", password: "", confirmPassword: "",
  });

  // Timer logic for Resend OTP
  useEffect(() => {
    let interval;
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, timer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 1. Handle Registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    try {
      setLoading(true);
      const response = await authApi.register({
        full_name: formData.fullname,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirm_password: formData.confirmPassword
      });
      toast.success(response.message || "OTP has been sent to your email!");
      setIsOtpSent(true);
      setTimer(60);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter the OTP.");
      return;
    }
    try {
      setLoading(true);
      await authApi.verifyOtp({ email: formData.email, otp });
      toast.success("Email verified successfully! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      const response = await authApi.resendOtp({ email: formData.email });
      toast.success(response.message || "A new OTP has been sent!");
      setTimer(60);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="signup-page">
      <div className="signup-container-split">

        {/* Left Panel (No changes) */}
        <div className="signup-left-panel">
          <div className="brand-content">
            <img src={NavLogo1} alt="Mentoring Minds" className="split-logo" />
            <h2><T>Start your professional learning journey with us.</T></h2>
            <p><T>Get access to top-tier online courses, expert mentorship, and guaranteed placement assistance.</T></p>
            <div className="split-features">
              <div className="feature-item">
                <FaCheckCircle className="check-bullet" />
                <span><T>Real-world practical projects</T></span>
              </div>
              <div className="feature-item">
                <FaCheckCircle className="check-bullet" />
                <span><T>Unlimited AI mock interviews</T></span>
              </div>
              <div className="feature-item">
                <FaCheckCircle className="check-bullet" />
                <span><T>Priority access to top opportunities</T></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="signup-right-panel">
          <div className="signup-form-wrapper">
            
            {/* Conditional Header based on State */}
            <div className="signup-header">
              <h2><T>{isOtpSent ? "Verify Email" : "Create Account"}</T></h2>
              <p><T>{isOtpSent ? `Enter the 6-digit code sent to ${formData.email}` : "Please fill in your details to get started."}</T></p>
            </div>

            {/* Render OTP Form OR Registration Form */}
            {isOtpSent ? (
              <form onSubmit={handleVerifyOtp}>
                <div className="input-group-custom">
                  <FaKey className="input-icon"/>
                  <input 
                    type="text" 
                    placeholder="Enter OTP" 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)} 
                    maxLength="6"
                    required 
                  />
                </div>
                
                <button type="submit" className="signup-btn" disabled={loading}>
                  <T>{loading ? "Verifying..." : "Verify OTP"}</T>
                </button>

                <div className="signup-footer signup-otp-footer">
                  {timer > 0 ? (
                    <span><T>Resend OTP in</T> <strong>{timer}s</strong></span>
                  ) : (
                    <span 
                      onClick={handleResendOtp} 
                      className="resend-otp-btn"
                    >
                      <T>Resend OTP</T>
                    </span>
                  )}
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="input-group-custom">
                  <FaUser className="input-icon"/>
                  <input type="text" placeholder="Full Name" name="fullname" value={formData.fullname} onChange={handleChange} required />
                </div>
                <div className="input-group-custom">
                  <FaEnvelope className="input-icon"/>
                  <input type="email" placeholder="Email Address" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="input-group-custom">
                  <FaPhoneAlt className="input-icon"/>
                  <input type="tel" placeholder="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
                <div className="input-group-custom">
                  <FaLock className="input-icon"/>
                  <input type={showPassword ? "text" : "password"} placeholder="Password" name="password" value={formData.password} onChange={handleChange} required />
                  <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash/> : <FaEye/>}
                  </button>
                </div>
                <div className="input-group-custom">
                  <FaLock className="input-icon"/>
                  <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                  <button type="button" className="eye-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <FaEyeSlash/> : <FaEye/>}
                  </button>
                </div>
                <button type="submit" className="signup-btn" disabled={loading}>
                  <T>{loading ? "Creating Account..." : "Create Account"}</T>
                </button>
              </form>
            )}

            {/* Hide Login link if OTP is sent */}
            {!isOtpSent && (
              <div className="signup-footer">
                <T>Already have an account?</T>{" "}
                <Link to="/login"><T>Login</T></Link>
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
};

export default Signup;