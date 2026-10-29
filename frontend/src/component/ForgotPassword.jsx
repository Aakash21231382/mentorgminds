



import React, { useState } from "react";
import { Link } from "react-router-dom";
import T from "../context/T";
import { 
  FaEnvelope, 
  FaArrowLeft, 
  FaCheckCircle, 
  FaLock, 
  FaEye, 
  FaEyeSlash,
  FaKey
} from "react-icons/fa";
import { authApi } from "../api/authApi";
import { toast } from 'react-toastify';
import '../assets/css/ForgotPassword.css';

const ForgotPassword = () => {
  // Steps: 1 (Email) -> 2 (OTP) -> 3 (Reset Password) -> 4 (Success)
  const [step, setStep] = useState(1); 
  
  // Form States
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // API States
  const [loading, setLoading] = useState(false);

  // Step 1: Handle Email Submit (Send OTP)
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      await authApi.forgotPassword({ email });
      setStep(2);
      toast.success("OTP sent to your email!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Handle OTP Submit (Verify OTP)
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp.length === 6) { 
      try {
        setLoading(true);
        await authApi.verifyForgotOtp({ email, otp });
        setStep(3);
        toast.success("OTP verified successfully!");
      } catch (err) {
        toast.error(err.response?.data?.message || "Invalid or expired OTP.");
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Please enter a valid 6-digit OTP.");
    }
  };

  // Step 2b: Handle Resend OTP
  const handleResendOtp = async () => {
    try {
      setLoading(true);
      await authApi.forgotPassword({ email });
      toast.success("A new OTP has been sent to your email!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Handle Password Reset Submit (Save New Password)
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (newPassword.length >= 8) {
      try {
        setLoading(true);
        await authApi.resetPassword({ 
          email, otp, 
          new_password: newPassword, 
          confirm_password: confirmPassword 
        });
        setStep(4);
        toast.success("Password reset successfully!");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to reset password.");
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Password must be at least 8 characters long.");
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-card">

          {/* STEP 1: Enter Email */}
          {step === 1 && (
            <>
              <div className="forgot-header">
                <h2><T>Forgot Password?</T></h2>
                <p><T>Enter your email address to receive a verification OTP.</T></p>
              </div>

              <form onSubmit={handleEmailSubmit} className="forgot-form">
                <div className="input-group">
                  <label htmlFor="email"><T>Email Address</T></label>
                  <div className="input-wrapper">
                    <FaEnvelope className="input-icon" />
                    <input
                      type="email"
                      id="email"
                      placeholder="Enter your registered email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn-theme-submit" disabled={loading}>
                  <T>{loading ? "Sending..." : "Send OTP"}</T>
                </button>
              </form>
            </>
          )}

          {/* STEP 2: Verify OTP */}
          {step === 2 && (
            <>
              <div className="forgot-header">
                <h2><T>Verify OTP</T></h2>
                <p><T>Enter the 6-digit OTP sent to</T> <strong>{email}</strong></p>
              </div>

              <form onSubmit={handleOtpSubmit} className="forgot-form">
                <div className="input-group">
                  <label htmlFor="otp" className="text-center"><T>One Time Password</T></label>
                  <div className="input-wrapper">
                    <FaKey className="input-icon" />
                    <input
                      type="text"
                      id="otp"
                      className="otp-input"
                      placeholder="• • • • • •"
                      maxLength="6"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                      required
                    />
                  </div>
                  <div className="resend-text">
                    <T>Didn't receive code?</T> 
                    <button type="button" className="resend-btn" onClick={handleResendOtp} disabled={loading}>
                      <T>{loading ? "Sending..." : "Resend"}</T>
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn-theme-submit" disabled={loading}>
                  <T>{loading ? "Verifying..." : "Verify OTP"}</T>
                </button>
              </form>
            </>
          )}

          {/* STEP 3: Change Password */}
          {step === 3 && (
            <>
              <div className="forgot-header">
                <h2><T>Set New Password</T></h2>
                <p><T>Create a strong new password for your account.</T></p>
              </div>

              <form onSubmit={handleResetSubmit} className="forgot-form">
                <div className="input-group">
                  <label htmlFor="newPassword"><T>New Password</T></label>
                  <div className="input-wrapper">
                    <FaLock className="input-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="newPassword"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength="8"
                    />
                    <button 
                      type="button" 
                      className="eye-icon-btn" 
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="confirmPassword"><T>Confirm Password</T></label>
                  <div className="input-wrapper">
                    <FaLock className="input-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="confirmPassword"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength="8"
                    />
                  </div>
                </div>

                <button type="submit" className="btn-theme-submit" disabled={loading}>
                  <T>{loading ? "Updating..." : "Reset Password"}</T>
                </button>
              </form>
            </>
          )}

          {/* STEP 4: Success Message */}
          {step === 4 && (
            <div className="status-message-container">
              <FaCheckCircle className="status-icon success" />
              <h2><T>Password Updated!</T></h2>
              <p>
                <T>Your password has been changed successfully. You can now use your new password to log in.</T>
              </p>
              <Link to="/login" className="btn-theme-submit reset-link-btn">
                <T>Go to Login</T>
              </Link>
            </div>
          )}

          {/* Footer Navigation (Hide on Success Step) */}
          {step !== 4 && (
            <div className="back-to-login">
              {step > 1 ? (
                <button className="back-link btn-as-link" onClick={() => setStep(step - 1)}>
                  <FaArrowLeft /> <T>Back</T>
                </button>
              ) : (
                <Link to="/login" className="back-link">
                  <FaArrowLeft /> <T>Back to Login</T>
                </Link>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;