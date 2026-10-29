import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import T from "../context/T";
import "../assets/css/login.css";
import NavLogo1 from "../assets/images/NavLogo1.png";
import { authApi } from "../api/authApi";
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await authApi.login(credentials);

      if (response.success) {
        localStorage.setItem("token", response.token);
        if (response.user) {
          localStorage.setItem("user", JSON.stringify(response.user));
          window.dispatchEvent(new Event("userUpdated"));
        }
        toast.success("Login successful! Welcome back 👋");
        navigate("/"); 
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-page">
      <div className="login-card">

        <div className="login-header">
          <img src={NavLogo1} alt="Mentoring Minds" className="login-logo" />
          <h2><T>Welcome Back</T></h2>
          <p><T>Log in to your account to continue your learning journey</T></p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group-custom">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group-custom">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
            <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="forgot-password-wrapper">
            <Link to="/forgot-password" className="forgot-link">
              <T>Forgot Password?</T>
            </Link>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            <T>{loading ? "LOGGING IN..." : "LOG IN"}</T>
          </button>
        </form>

        <div className="login-footer">
          <T>Don't have an account?</T>{" "}
          <Link to="/signup"><T>Sign Up</T></Link>
        </div>

      </div>
    </section>
  );
};

export default Login;