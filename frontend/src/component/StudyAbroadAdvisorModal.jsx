import React, { useState, useEffect } from 'react';
import '../assets/css/StudyAbroadAdvisorModal.css';
import { submitStudyAbroadAdvisor } from '../api/studyAbroadAdvisorApi';
import T from '../context/T';

const StudyAbroadAdvisorModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    // Step 1
    studyCountries: [],
    degree: '',
    visitCity: '',

    // Step 2
    bachelorsCompleted: '',
    preferredStream: '',
    examStatus: '',

    // Step 3
    fullName: '',
    email: '',
    phone: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  const countries = [
    'USA',
    'UK',
    'Canada',
    'Australia',
    'Germany',
    'France'
  ];

  const cities = [
    'Noida',
    'Delhi',
    'Bangalore',
    'Mumbai',
    'Pune',
    'Hyderabad'
  ];

  const streams = [
    'Management',
    'Engineering',
    'Computer Science',
    'Data Science',
    'Marketing',
    'Finance'
  ];

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    setError('');
  };

  const handleCountrySelect = (country) => {
    setFormData(prev => {
      const countries = prev.studyCountries.includes(country)
        ? prev.studyCountries.filter(c => c !== country)
        : prev.studyCountries.length < 2
        ? [...prev.studyCountries, country]
        : prev.studyCountries;

      return {
        ...prev,
        studyCountries: countries
      };
    });

    setError('');
  };

  const handleButtonSelect = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    setError('');
  };

  const validateStep1 = () => {
    if (formData.studyCountries.length === 0) {
      setError('Please select at least one country');
      return false;
    }

    if (!formData.degree) {
      setError('Please select a degree');
      return false;
    }

    if (!formData.visitCity) {
      setError('Please select a city');
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    if (!formData.bachelorsCompleted) {
      setError('Please select if you have completed bachelors');
      return false;
    }

    if (!formData.preferredStream) {
      setError('Please select your preferred stream');
      return false;
    }

    if (!formData.examStatus) {
      setError('Please select your exam status');
      return false;
    }

    return true;
  };

  const validateStep3 = () => {
    if (!formData.fullName.trim()) {
      setError('Please enter your full name');
      return false;
    }

    if (
      !formData.email.trim() ||
      !/\S+@\S+\.\S+/.test(formData.email)
    ) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!formData.phone.trim() || formData.phone.length < 10) {
      setError('Please enter a valid phone number');
      return false;
    }

    return true;
  };

  const handleContinue = () => {
    setError('');

    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    setError('');

    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep3()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const response = await submitStudyAbroadAdvisor({
        ...formData,
        studyCountries: formData.studyCountries.join(', '),
        step: currentStep
      });

      if (response.success) {
        setSubmitSuccess(true);

        setTimeout(() => {
          handleClose();
        }, 2500);
      }
    } catch (err) {
      console.error('Submission error:', err);

      setError(
        err.response?.data?.message ||
        'Failed to submit. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      studyCountries: [],
      degree: '',
      visitCity: '',
      bachelorsCompleted: '',
      preferredStream: '',
      examStatus: '',
      fullName: '',
      email: '',
      phone: ''
    });

    setCurrentStep(1);
    setSubmitSuccess(false);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="study-abroad-modal-overlay">

      <div
        className="study-abroad-modal-container"
        onClick={(e) => e.stopPropagation()}
      >

        <button
          className="study-abroad-modal-close"
          onClick={handleClose}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="study-abroad-modal-content">

          {/* Left Section */}
          <div className="study-abroad-modal-left">

            <div className="study-abroad-modal-header">
              <h2>
                <T>Guidance for Your</T>{" "}
                <span className="dream-career">
                  <T>Dream Career</T>
                </span>
              </h2>
            </div>

            <div className="study-abroad-features">

              <div className="study-abroad-feature-item">
                <span className="feature-bullet">♦</span>

                <div>
                  <h3>
                    <T>Trusted by 3,00,000+ Learners</T>
                  </h3>

                  <p>
                    <T>
                      Join a thriving community of students pursuing global
                      education goals.
                    </T>
                  </p>
                </div>
              </div>


              <div className="study-abroad-feature-item">
                <span className="feature-bullet">♦</span>

                <div>
                  <h3>
                    <T>360° Expert Support at Every Step</T>
                  </h3>

                  <p>
                    <T>
                      Get end-to-end guidance from application to enrollment
                      and beyond.
                    </T>
                  </p>
                </div>
              </div>


              <div className="study-abroad-feature-item">
                <span className="feature-bullet">♦</span>

                <div>
                  <h3>
                    <T>Access 1000+ Global University Partners</T>
                  </h3>

                  <p>
                    <T>
                      Explore a wide range of programs across leading
                      universities worldwide.
                    </T>
                  </p>
                </div>
              </div>

            </div>

          </div>


          {/* Right Section - Form */}
          <div className="study-abroad-modal-right">

            <div className="study-abroad-form-header">

              <h3>
                <T>Connect with a Study Abroad advisor</T>
              </h3>

              {/* Steps Indicator */}
              <div className="study-abroad-steps">

                <div
                  className={`step ${
                    currentStep >= 1 ? 'active' : ''
                  }`}
                >
                  <div className="step-circle">
                    {currentStep > 1 ? '✓' : '1'}
                  </div>

                  <span>
                    <T>Step 1</T>
                  </span>
                </div>

                <div className="step-line"></div>

                <div
                  className={`step ${
                    currentStep >= 2 ? 'active' : ''
                  }`}
                >
                  <div className="step-circle">
                    {currentStep > 2 ? '✓' : '2'}
                  </div>

                  <span>
                    <T>Step 2</T>
                  </span>
                </div>

                <div className="step-line"></div>

                <div
                  className={`step ${
                    currentStep >= 3 ? 'active' : ''
                  }`}
                >
                  <div className="step-circle">
                    {currentStep > 3 ? '✓' : '3'}
                  </div>

                  <span>
                    <T>Step 3</T>
                  </span>
                </div>

              </div>

            </div>


            {submitSuccess ? (

              <div className="study-abroad-success-message">

                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 60 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="30"
                    cy="30"
                    r="28"
                    fill="#4CAF50"
                    opacity="0.1"
                  />

                  <path
                    d="M20 30L26 36L40 22"
                    stroke="#4CAF50"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <h3>
                  <T>Thank You!</T>
                </h3>

                <p>
                  <T>
                    Your request has been submitted successfully. Our study
                    abroad advisor will contact you soon.
                  </T>
                </p>

              </div>

            ) : (

              <div className="study-abroad-form">

                {/* STEP 1 */}
                {currentStep === 1 && (
                  <div className="step-content">

                    <div className="form-question">

                      <label>
                        <T>
                          1. Which country are you planning to study in?
                          (Max 2 choices)
                        </T>
                      </label>

                      <select
                        name="studyCountries"
                        value=""
                        onChange={(e) => {
                          if (e.target.value) {
                            handleCountrySelect(e.target.value);
                            e.target.value = "";
                          }
                        }}
                        className="select-input"
                      >
                        <option value="">
                          <T>Select country</T>
                        </option>

                        {countries.map(country => (
                          <option
                            key={country}
                            value={country}
                            disabled={formData.studyCountries.includes(country)}
                          >
                            <T>{country}</T>
                          </option>
                        ))}
                      </select>

                      {/* Selected countries display */}
                      {formData.studyCountries.length > 0 && (
                        <div className="selected-countries-display">
                          {formData.studyCountries.map(country => (
                            <span
                              key={country}
                              className="selected-country-tag"
                            >
                              <T>{country}</T>
                              <button
                                type="button"
                                className="remove-country-btn"
                                onClick={() => handleCountrySelect(country)}
                              >
                                ✕
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                    </div>


                    <div className="form-question">

                      <label>
                        <T>
                          2. Which degree do you want to pursue?
                        </T>
                      </label>

                      <div className="button-group">

                        <button
                          type="button"
                          className={`option-btn ${
                            formData.degree === 'Masters'
                              ? 'selected'
                              : ''
                          }`}
                          onClick={() =>
                            handleButtonSelect('degree', 'Masters')
                          }
                        >
                          <T>Masters</T>
                        </button>

                        <button
                          type="button"
                          className={`option-btn ${
                            formData.degree === 'Bachelors'
                              ? 'selected'
                              : ''
                          }`}
                          onClick={() =>
                            handleButtonSelect('degree', 'Bachelors')
                          }
                        >
                          <T>Bachelors</T>
                        </button>

                      </div>

                    </div>


                    <div className="form-question">

                      <label>
                        <T>
                          3. Can you visit any of these cities to meet an
                          upGrad expert in person?
                        </T>
                      </label>

                      <select
                        name="visitCity"
                        value={formData.visitCity}
                        onChange={handleChange}
                        className="select-input"
                      >

                        <option value="">
                          <T>Select a city</T>
                        </option>

                        {cities.map(city => (
                          <option
                            key={city}
                            value={city}
                          >
                            <T>{city}</T>
                          </option>
                        ))}

                      </select>

                    </div>

                  </div>
                )}


                {/* STEP 2 */}
                {currentStep === 2 && (
                  <div className="step-content">

                    <div className="form-question">

                      <label>
                        <T>
                          4. Have you completed your bachelors?
                        </T>
                      </label>

                      <div className="button-group">

                        <button
                          type="button"
                          className={`option-btn ${
                            formData.bachelorsCompleted === 'Yes'
                              ? 'selected'
                              : ''
                          }`}
                          onClick={() =>
                            handleButtonSelect(
                              'bachelorsCompleted',
                              'Yes'
                            )
                          }
                        >
                          <T>Yes</T>
                        </button>

                        <button
                          type="button"
                          className={`option-btn ${
                            formData.bachelorsCompleted === 'No'
                              ? 'selected'
                              : ''
                          }`}
                          onClick={() =>
                            handleButtonSelect(
                              'bachelorsCompleted',
                              'No'
                            )
                          }
                        >
                          <T>No</T>
                        </button>

                      </div>

                    </div>


                    <div className="form-question">

                      <label>
                        <T>
                          5. What is your preferred stream?
                        </T>
                      </label>

                      <select
                        name="preferredStream"
                        value={formData.preferredStream}
                        onChange={handleChange}
                        className="select-input"
                      >

                        <option value="">
                          <T>Select stream</T>
                        </option>

                        {streams.map(stream => (
                          <option
                            key={stream}
                            value={stream}
                          >
                            <T>{stream}</T>
                          </option>
                        ))}

                      </select>

                    </div>


                    <div className="form-question">

                      <label>
                        <T>
                          6. Have you given any exam yet
                          (IELTS/GRE/GMAT/TOEFL/DUOLINGO)?
                        </T>
                      </label>

                      <div className="button-group-three">

                        <button
                          type="button"
                          className={`option-btn ${
                            formData.examStatus === 'Already Given'
                              ? 'selected'
                              : ''
                          }`}
                          onClick={() =>
                            handleButtonSelect(
                              'examStatus',
                              'Already Given'
                            )
                          }
                        >
                          <T>Already Given</T>
                        </button>

                        <button
                          type="button"
                          className={`option-btn ${
                            formData.examStatus === 'Booked'
                              ? 'selected'
                              : ''
                          }`}
                          onClick={() =>
                            handleButtonSelect(
                              'examStatus',
                              'Booked'
                            )
                          }
                        >
                          <T>Booked</T>
                        </button>

                        <button
                          type="button"
                          className={`option-btn ${
                            formData.examStatus === 'Planning'
                              ? 'selected'
                              : ''
                          }`}
                          onClick={() =>
                            handleButtonSelect(
                              'examStatus',
                              'Planning'
                            )
                          }
                        >
                          <T>Planning</T>
                        </button>

                      </div>

                    </div>

                  </div>
                )}


                {/* STEP 3 */}
                {currentStep === 3 && (
                  <form
                    className="step-content"
                    onSubmit={handleSubmit}
                  >

                    <div className="form-group">

                      <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />

                    </div>


                    <div className="form-group">

                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />

                    </div>


                    <div className="form-group phone-group">

                      <div className="phone-input-wrapper">

                        <div className="country-code">

                          <img
                            src="https://flagcdn.com/w20/in.png"
                            alt="India"
                          />

                          <span>+91</span>

                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M3 4.5L6 7.5L9 4.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>

                        </div>

                        <input
                          type="tel"
                          name="phone"
                          placeholder="Your phone number*"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />

                      </div>

                    </div>


                    <div className="spam-notice">

                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM8 12C7.4 12 7 11.6 7 11C7 10.4 7.4 10 8 10C8.6 10 9 10.4 9 11C9 11.6 8.6 12 8 12ZM9 8C9 8.6 8.6 9 8 9C7.4 9 7 8.6 7 8V5C7 4.4 7.4 4 8 4C8.6 4 9 4.4 9 5V8Z"
                          fill="#2196F3"
                        />
                      </svg>

                      <span>
                        <T>We don't spam</T>
                      </span>

                    </div>

                  </form>
                )}


                {error && (
                  <div className="error-message">
                    <T>{error}</T>
                  </div>
                )}


                {/* Navigation Buttons */}
                <div className="form-navigation">

                  {currentStep > 1 && (
                    <button
                      type="button"
                      className="back-btn"
                      onClick={handleBack}
                    >
                      <T>← Back</T>
                    </button>
                  )}


                  {currentStep < 3 ? (

                    <button
                      type="button"
                      className="continue-btn"
                      onClick={handleContinue}
                    >
                      <T>Continue →</T>
                    </button>

                  ) : (

                    <button
                      type="button"
                      className="submit-btn"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <T>Submitting...</T>
                      ) : (
                        <T>Submit →</T>
                      )}
                    </button>

                  )}

                </div>


                <p className="study-abroad-terms">

                  <T>
                    By submitting this form, you agree to the
                  </T>{" "}

                  <a href="/terms">
                    <T>T&C</T>
                  </a>{" "}

                  <T>and</T>{" "}

                  <a href="/privacy">
                    <T>Privacy Policy</T>
                  </a>

                </p>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default StudyAbroadAdvisorModal;