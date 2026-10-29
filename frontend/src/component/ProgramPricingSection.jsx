import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaShieldAlt,
  FaCreditCard,
  FaHeadset,
  FaLock,
  FaTag,
  FaAward,
  FaLaptopCode,
  FaBriefcase,
  FaRobot,
  FaBolt
} from "react-icons/fa";
import RazorpayCheckoutModal from "./RazorpayCheckoutModal";
import TalkToExpertModal from "./TalkToExpertModal";
import { lmsApi } from "../api/lmsApi";
import T from "../context/T";
import "../assets/css/ProgramPricingSection.css";

const ProgramPricingSection = ({
  detail,
  slug,
  courseId = 1,
  courseType = "online"
}) => {
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showExpertModal, setShowExpertModal] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  if (detail && detail.ShowPricing === false) return null;

  const programTitle = detail
    ? `${detail.University || ""} ${detail.HeroTitleNormal || ""} ${detail.HeroTitleOrange || ""}`.trim()
    : "Executive Certification Program";

  const currentPrice = Number(detail?.Price || detail?.price || detail?.Fees || detail?.fee || 4999);
  const originalPrice = Number(detail?.OriginalPrice || detail?.originalPrice || (currentPrice > 0 ? Math.round(currentPrice * 1.5) : 9999));
  const discountPercent = originalPrice > currentPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;
  const scholarshipBadge = detail?.ScholarshipText || detail?.scholarshipText || (discountPercent > 0 ? `${discountPercent}% Scholarship Active` : "Early Bird Scholarship Active");
  const emiPerMonth = Math.round(currentPrice / 6);
  const emiText = detail?.EmiOptionsText || detail?.emiOptionsText || `Or pay in flexible installments starting at ₹${emiPerMonth}/mo with 0% No-Cost EMI`;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && courseId) {
      lmsApi.checkEnrollment(courseId, courseType)
        .then(res => {
          if (res.success && res.isEnrolled) setIsEnrolled(true);
        })
        .catch(() => { });
    }
  }, [courseId, courseType]);

  const handleEnrollClick = () => {
    if (isEnrolled) {
      navigate(`/learn/${slug || courseId}`);
    } else {
      setShowPaymentModal(true);
    }
  };

  return (
    <>
      <section className="pricing-section" id="admission-pricing">
        <div className="container">

          {/* Header */}
          <div className="pricing-header-center">
            <div className="pricing-badge">
              <FaTag /> <T>ADMISSION & PROGRAM FEES</T>
            </div>
            <h2 className="pricing-title">
              <T>Invest in Your Future with Flexible Learning Plans</T>
            </h2>
            <p className="pricing-subtitle">
              <T>Get complete access to live interactive lectures, hands-on production assignments, verified certifications, and 1:1 career placement support.</T>
            </p>
          </div>

          {/* Pricing Card */}
          <div className="pricing-card-wrapper">

            {/* Left Column: Price & CTAs */}
            <div className="pricing-card-left">
              <div>
                <div className="pricing-tag-live">
                  <FaBolt /> <T>{scholarshipBadge}</T>
                </div>

                <h3 className="pricing-prog-name">{programTitle}</h3>

                <div className="pricing-amount-box">
                  <div className="pricing-current-price">
                    <span>₹{currentPrice.toLocaleString("en-IN")}</span>
                    {originalPrice > currentPrice && (
                      <span className="pricing-original-price">₹{originalPrice.toLocaleString("en-IN")}</span>
                    )}
                    {discountPercent > 0 && (
                      <span className="pricing-discount-badge">{discountPercent}% OFF</span>
                    )}
                  </div>
                  <p className="pricing-emi-text">
                    <T>{emiText}</T>
                  </p>
                </div>
              </div>

              <div className="pricing-actions-col">
                <button className="btn-pricing-enroll" onClick={handleEnrollClick}>
                  <FaCreditCard />
                  <T>{isEnrolled ? "Go to Classroom" : "Enroll Now with Razorpay"}</T>
                </button>
                <button className="btn-pricing-expert" onClick={() => setShowExpertModal(true)}>
                  <FaHeadset />
                  <T>Talk to Admission Advisor</T>
                </button>
              </div>
            </div>

            {/* Right Column: Feature Checklist */}
            <div className="pricing-card-right">
              <div>
                <h4 className="pricing-features-title">
                  <T>What's Included in This Program:</T>
                </h4>

                <ul className="pricing-features-list">
                  <li className="pricing-feature-item">
                    <FaCheckCircle className="feature-check-icon" />
                    <span><strong>100% Live & Recorded Masterclasses</strong> with lifetime video access.</span>
                  </li>
                  <li className="pricing-feature-item">
                    <FaCheckCircle className="feature-check-icon" />
                    <span><strong>1:1 Code Reviews & Project Mentorship</strong> from senior industry engineers.</span>
                  </li>
                  <li className="pricing-feature-item">
                    <FaCheckCircle className="feature-check-icon" />
                    <span><strong>24/7 AI Doubt Mentor & In-Browser Code Sandbox</strong> for live coding practice.</span>
                  </li>
                  <li className="pricing-feature-item">
                    <FaCheckCircle className="feature-check-icon" />
                    <span><strong>Official Verified Certificate</strong> with cryptographically verifiable QR code.</span>
                  </li>
                  <li className="pricing-feature-item">
                    <FaCheckCircle className="feature-check-icon" />
                    <span><strong>Dedicated Placement Support & Job Portal Access</strong> with 500+ hiring partners.</span>
                  </li>
                </ul>
              </div>

              {/* Trust Badges */}
              <div className="pricing-trust-bar">
                <div className="pricing-trust-item">
                  <FaShieldAlt className="text-success" />
                  <span>100% Secure Checkout</span>
                </div>
                <div className="pricing-trust-item">
                  <FaLock className="text-muted" />
                  <span>256-Bit SSL Encrypted</span>
                </div>
                <div className="pricing-trust-item">
                  <FaAward className="text-warning" />
                  <span>7-Day Refund Guarantee</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Razorpay Test Modal */}
      {showPaymentModal && (
        <RazorpayCheckoutModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          courseId={courseId}
          courseType={courseType}
          courseTitle={programTitle}
          originalPrice={currentPrice}
          onSuccess={() => {
            setIsEnrolled(true);
            navigate(`/learn/${slug || courseId}`);
          }}
        />
      )}

      {/* Talk to Expert Modal */}
      {showExpertModal && (
        <TalkToExpertModal onClose={() => setShowExpertModal(false)} />
      )}
    </>
  );
};

export default ProgramPricingSection;
