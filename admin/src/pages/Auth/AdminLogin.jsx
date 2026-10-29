import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { adminLoginApi } from "../../api/adminApi";
import { useAuth } from "../../context/AuthContext";
import "../../assets/css/admin-login.css";
import Logo from "../../assets/images/NavLogo1.png";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await adminLoginApi(formData.email, formData.password);

      if (result.success) {
        login(result.token, result.user);
        navigate("/admin/dashboard", { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-card">

        {/* Logo */}
        <div className="login-logo-area">
          <img src={Logo} alt="Mentoringminds Logo" className="login-main-logo" />
        </div>

        {/* Heading */}
        <div className="login-header">
          <h2>Admin Login</h2>
          <p>Sign in to your account to continue</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="login-error-alert">
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form-content">

          {/* Email */}
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-box">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <div className="input-box">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="login-submit-btn"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>

        <p className="login-copy">© {new Date().getFullYear()} Mentoringminds. All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default AdminLogin;
