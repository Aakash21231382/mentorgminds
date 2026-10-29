import React, { useState } from "react";
import {
  FaTimes,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaCommentDots,
} from "react-icons/fa";
import "../assets/css/CounselingModal.css";
import { submitCounselingBooking } from "../api/counselingApi";
import T from "../context/T";

const CounselingModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    programInterest: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await submitCounselingBooking(formData);

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(response.message || "Failed to submit booking");
      }
    } catch (err) {
      setError("Failed to submit booking. Please try again.");
      console.error("Counseling booking error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="counseling-modal-overlay">
      <div
        className="counseling-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button className="counseling-modal-close" onClick={onClose}>
          <FaTimes />
        </button>

        {/* Modal Header */}
        <div className="counseling-modal-header">
          <h2>
            <T>Book 1:1 Counseling</T>
          </h2>

          <p>
            <T>Get personalized guidance from our expert counselors</T>
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="counseling-success-message">
            <div className="success-icon">✓</div>

            <h3>
              <T>Booking Submitted Successfully!</T>
            </h3>

            <p>
              <T>
                Our team will contact you soon to schedule your counseling
                session.
              </T>
            </p>
          </div>
        )}

        {/* Form */}
        {!success && (
          <form className="counseling-modal-form" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="counseling-form-group">
              <label>
                <FaUser /> <T>Full Name</T> <span className="required">*</span>
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email */}
            <div className="counseling-form-group">
              <label>
                <FaEnvelope /> <T>Email Address</T>{" "}
                <span className="required">*</span>
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Phone */}
            <div className="counseling-form-group">
              <label>
                <FaPhone /> <T>Phone Number</T>{" "}
                <span className="required">*</span>
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
              />
            </div>

            {/* Date & Time Row */}
            <div className="counseling-form-row">
              <div className="counseling-form-group">
                <label>
                  <FaCalendarAlt /> <T>Preferred Date</T>
                </label>

                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="counseling-form-group">
                <label>
                  <FaClock /> <T>Preferred Time</T>
                </label>

                <select
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                >
                  <option value="">
                    <T>Select time</T>
                  </option>

                  <option value="Morning (9 AM - 12 PM)">
                    <T>Morning (9 AM - 12 PM)</T>
                  </option>

                  <option value="Afternoon (12 PM - 3 PM)">
                    <T>Afternoon (12 PM - 3 PM)</T>
                  </option>

                  <option value="Evening (3 PM - 6 PM)">
                    <T>Evening (3 PM - 6 PM)</T>
                  </option>
                </select>
              </div>
            </div>

            {/* Program Interest */}
            <div className="counseling-form-group">
              <label>
                <FaGraduationCap /> <T>Program Interest</T>
              </label>

              <select
                name="programInterest"
                value={formData.programInterest}
                onChange={handleChange}
              >
                <option value="">
                  <T>Select a program</T>
                </option>

                <option value="MBA">
                  <T>MBA</T>
                </option>

                <option value="Data Science">
                  <T>Data Science</T>
                </option>

                <option value="AI & Machine Learning">
                  <T>AI & Machine Learning</T>
                </option>

                <option value="Software Engineering">
                  <T>Software Engineering</T>
                </option>

                <option value="Study Abroad">
                  <T>Study Abroad</T>
                </option>

                <option value="Executive Programs">
                  <T>Executive Programs</T>
                </option>

                <option value="Other">
                  <T>Other</T>
                </option>
              </select>
            </div>

            {/* Message */}
            <div className="counseling-form-group">
              <label>
                <FaCommentDots /> <T>Message (Optional)</T>
              </label>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us more about your goals and questions..."
                rows="4"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="counseling-error-message">
                <T>{error}</T>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="counseling-submit-btn"
              disabled={loading}
            >
              {loading ? <T>Submitting...</T> : <T>Book Counseling Session</T>}
            </button>

            <p className="counseling-privacy-note">
              <T>
                Your information is secure and will only be used to contact you
                about your counseling session.
              </T>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default CounselingModal;
