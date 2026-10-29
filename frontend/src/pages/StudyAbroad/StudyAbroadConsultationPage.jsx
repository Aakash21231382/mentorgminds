import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitStudyAbroadAdvisor } from "../../api/studyAbroadAdvisorApi";
import "../../assets/css/studyaborad/StudyAbroadConsultationModal.css";
import { FaArrowRight } from "react-icons/fa";
import T from "../../context/T";

const StudyAbroadConsultationPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Step 1
    studyCountries: "",
    degree: "",
    visitCity: "",

    // Step 2
    bachelorsCompleted: "",
    preferredStream: "",
    examStatus: "",

    // Step 3
    fullName: "",
    email: "",
    phone: "",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState("");

  const countries = [
    "USA",
    "UK",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Ireland",
    "Singapore",
    "New Zealand",
  ];

  const cities = [
    "Noida",
    "Delhi",
    "Bangalore",
    "Mumbai",
    "Pune",
    "Hyderabad",
    "Chennai",
    "Kolkata",
  ];

  const streams = [
    "Management / MBA",
    "Computer Science & IT",
    "Engineering",
    "Data Science & AI",
    "Marketing",
    "Finance & Accounting",
    "Healthcare & Life Sciences",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleFieldSelect = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setError("");
  };

  const validateStep1 = () => {
    if (!formData.studyCountries) {
      setError("Please select your preferred destination country.");
      return false;
    }

    if (!formData.degree) {
      setError("Please select the degree you want to pursue.");
      return false;
    }

    if (!formData.visitCity) {
      setError("Please select your nearest city.");
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    if (!formData.bachelorsCompleted) {
      setError("Please specify if you completed your Bachelor’s degree.");
      return false;
    }

    if (!formData.preferredStream) {
      setError("Please select your preferred study stream.");
      return false;
    }

    if (!formData.examStatus) {
      setError("Please select your current exam status.");
      return false;
    }

    return true;
  };

  const validateStep3 = () => {
    if (!formData.fullName.trim()) {
      setError("Please enter your full name.");
      return false;
    }

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (!formData.phone.trim() || formData.phone.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return false;
    }

    return true;
  };

  const handleContinue = () => {
    setError("");

    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    setError("");

    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep3()) return;

    setIsSubmitting(true);
    setError("");

    try {
      const response = await submitStudyAbroadAdvisor({
        ...formData,
        step: currentStep,
      });

      if (response?.success || response) {
        setSubmitSuccess(true);

        setTimeout(() => {
          navigate("/study/abroad");
        }, 2500);
      }
    } catch (err) {
      console.error("Submission Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to submit details. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate("/study/abroad");
  };

  return (
    <div className="consultation-page-wrapper">
      <div className="consultation-card-container p-0 container">
        <div className="row g-0">
          {/* Left Hero Pane */}
          <div className="col-12 col-lg-5 consultation-hero-pane p-5">
            <h2>
              <T>Secure your personalized</T>{" "}
              <span>
                <T>study abroad plan</T>
              </span>
            </h2>

            <p>
              <T>
                Get comprehensive guidance on destinations, top universities,
                scholarships, and visa pathways tailored to your profile.
              </T>
            </p>
          </div>

          {/* Right Form Pane */}
          <div className="col-12 col-lg-7 consultation-form-pane p-5">
            {submitSuccess ? (
              <div className="submission-success-pane">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <circle
                    cx="30"
                    cy="30"
                    r="28"
                    fill="#22c55e"
                    fillOpacity="0.15"
                  />

                  <path
                    d="M20 30L26 36L40 22"
                    stroke="#22c55e"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <h3>
                  <T>Thank You!</T>
                </h3>

                <p>
                  <T>
                    Your details have been submitted. Our overseas education
                    advisor will contact you shortly.
                  </T>
                </p>
              </div>
            ) : (
              <>
                <div className="consultation-instruction">
                  <T>
                    Enter your details, and our experts will connect with you to
                    guide you through the process.
                  </T>
                </div>

                {/* Step Indicators */}
                <div className="step-progress-wrapper">
                  <span
                    className={`step-indicator-pill ${
                      currentStep === 1 ? "active" : ""
                    }`}
                  >
                    <T>1. Target</T>
                  </span>

                  <span
                    className={`step-indicator-pill ${
                      currentStep === 2 ? "active" : ""
                    }`}
                  >
                    <T>2. Background</T>
                  </span>

                  <span
                    className={`step-indicator-pill ${
                      currentStep === 3 ? "active" : ""
                    }`}
                  >
                    <T>3. Contact</T>
                  </span>
                </div>

                {/* STEP 1 */}
                {currentStep === 1 && (
                  <div className="step-content-pane">
                    {/* Country Dropdown */}
                    <div className="form-input-group">
                      <label className="form-field-label">
                        <T>Which country are you planning to study in?</T>
                      </label>

                      <select
                        name="studyCountries"
                        value={formData.studyCountries}
                        onChange={handleChange}
                        className="field-select"
                      >
                        <option value="">
                          <T>Select a preferred country</T>
                        </option>

                        {countries.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Degree Preference */}
                    <div className="form-input-group">
                      <label className="form-field-label">
                        <T>Which degree do you want to pursue?</T>
                      </label>

                      <div className="option-grid-2">
                        {["Masters", "Bachelors"].map((deg) => (
                          <button
                            key={deg}
                            type="button"
                            className={`pill-choice-btn ${
                              formData.degree === deg ? "selected" : ""
                            }`}
                            onClick={() => handleFieldSelect("degree", deg)}
                          >
                            <T>{deg}</T>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* City Dropdown */}
                    <div className="form-input-group">
                      <label className="form-field-label">
                        <T>
                          Can you visit any of these cities to meet an expert in
                          person?
                        </T>
                      </label>

                      <select
                        name="visitCity"
                        value={formData.visitCity}
                        onChange={handleChange}
                        className="field-select"
                      >
                        <option value="">
                          <T>Select nearest city</T>
                        </option>

                        {cities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* STEP 2 */}
                {currentStep === 2 && (
                  <div className="step-content-pane">
                    {/* Bachelors Completed */}
                    <div className="form-input-group">
                      <label className="form-field-label">
                        <T>Have you completed your bachelor's degree?</T>
                      </label>

                      <div className="option-grid-2">
                        {["Yes", "No"].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            className={`pill-choice-btn ${
                              formData.bachelorsCompleted === opt
                                ? "selected"
                                : ""
                            }`}
                            onClick={() =>
                              handleFieldSelect("bachelorsCompleted", opt)
                            }
                          >
                            <T>{opt}</T>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Stream Selection */}
                    <div className="form-input-group">
                      <label className="form-field-label">
                        <T>What is your preferred study stream?</T>
                      </label>

                      <select
                        name="preferredStream"
                        value={formData.preferredStream}
                        onChange={handleChange}
                        className="field-select"
                      >
                        <option value="">
                          <T>Select course stream</T>
                        </option>

                        {streams.map((stream) => (
                          <option key={stream} value={stream}>
                            {stream}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Exam Status */}
                    <div className="form-input-group">
                      <label className="form-field-label">
                        <T>Have you given any entrance/English exam yet?</T>
                      </label>

                      <div className="option-grid-3">
                        {["Already Given", "Booked", "Planning"].map(
                          (status) => (
                            <button
                              key={status}
                              type="button"
                              className={`pill-choice-btn ${
                                formData.examStatus === status ? "selected" : ""
                              }`}
                              onClick={() =>
                                handleFieldSelect("examStatus", status)
                              }
                            >
                              <T>{status}</T>
                            </button>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3 */}
                {currentStep === 3 && (
                  <form className="step-content-pane" onSubmit={handleSubmit}>
                    <div className="form-input-group">
                      <label className="form-field-label">
                        <T>Full Name</T>
                      </label>

                      <input
                        type="text"
                        name="fullName"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="field-input"
                        required
                      />
                    </div>

                    <div className="form-input-group">
                      <label className="form-field-label">
                        <T>Email Address</T>
                      </label>

                      <input
                        type="email"
                        name="email"
                        placeholder="e.g. name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="field-input"
                        required
                      />
                    </div>

                    <div className="form-input-group">
                      <label className="form-field-label">
                        <T>Phone Number</T>
                      </label>

                      <div className="phone-field-wrapper">
                        <div className="phone-flag-prefix">
                          <img
                            src="https://flagcdn.com/w20/in.png"
                            alt="India"
                          />
                          <span>+91</span>
                        </div>

                        <input
                          type="tel"
                          name="phone"
                          placeholder="10-digit mobile number"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </form>
                )}

                {error && (
                  <div className="form-validation-error">
                    <T>{error}</T>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="form-actions-row">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      className="btn-outline-back"
                      onClick={handleBack}
                    >
                      <T>Back</T>
                    </button>
                  )}

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      className="btn-brand-primary"
                      onClick={handleContinue}
                    >
                      <T>Continue</T>
                      <FaArrowRight className="ms-2" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn-brand-primary"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <T>Submitting...</T> : <T>Submit &gt;</T>}
                    </button>
                  )}
                </div>

                <p className="form-footer-terms">
                  <T>By submitting, you agree to our</T>{" "}
                  <a href="/terms" className="text-decoration-none text-black">
                    <T>Terms</T>
                  </a>
                  <FaArrowRight className="ms-2" />{" "}
                  <a
                    className="text-decoration-none text-black"
                    href="/privacy"
                  >
                    <T>Privacy Policy</T>
                  </a>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyAbroadConsultationPage;
