import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/css/ProgramHero.css";
import T from "../context/T";
import TalkToExpertModal from "../component/TalkToExpertModal";
import RazorpayCheckoutModal from "../component/RazorpayCheckoutModal";
import { lmsApi } from "../api/lmsApi";
import { toast } from "react-toastify";

import IITImage from "../assets/images/IITKaragpur.png";
import { MdWatchLater } from "react-icons/md";
import { FaStar, FaPlayCircle, FaCheckCircle } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";

const ProgramHero = ({
  courseId = 1,
  slug = "1",
  courseType = "online",
  badge = "ADMISSIONS OPEN FOR 2026",
  university = "IIT Kharagpur",
  titleNormal = "Executive Post Graduate Certificate",
  titleOrange = "in AI-Native Software Engineering",
  description = "A production-first, AI-native engineering programme...",
  duration = "8 Months",
  mode = "100% Live Online",
  starts = "Dec 15, 2026",
  image = IITImage,
  reviewText = "This program bridged the gap between my traditional coding skills and the future of AI-driven systems.",
  reviewAuthor = "— Alumni, Class of '23",
  urgencyText = "Hurry! 441 people have already applied in the last 1 month",
  brochureUrl = null,
  price = 4999,
}) => {
  const navigate = useNavigate();
  const [showExpertModal, setShowExpertModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

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

  const handleEnrollOrLearn = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("Please login to enroll in this course.");
      navigate("/login");
      return;
    }

    if (isEnrolled) {
      navigate(`/learn/${slug || courseId}`);
      return;
    }

    try {
      setEnrolling(true);
      const res = await lmsApi.enrollUser({
        courseId,
        courseType,
        courseTitle: `${university} ${titleNormal} ${titleOrange}`
      });

      if (res.success) {
        setIsEnrolled(true);
        toast.success("Enrolled successfully! Taking you to the classroom 🚀");
        navigate(`/learn/${slug || courseId}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Enrollment failed.");
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <>
      <section className="program-hero-section">
        <div className="container program-hero-container">

          {/* Left Content */}
          <div className="prog-hero-left">
            <div className="prog-hero-tag">
              <GoDotFill size={16} /> <T>{badge}</T>
            </div>

            <h1 className="prog-hero-title">
              <span><T>{university}</T></span> <T>{titleNormal}</T> <span><T>{titleOrange}</T></span>
            </h1>

            <p className="prog-hero-desc">
              <T>{description}</T>
            </p>

            <div className="prog-info-grid">
              <div className="prog-info-card">
                <span className="prog-info-label"><T>DURATION</T></span>
                <span className="prog-info-value"><T>{duration}</T></span>
              </div>
              <div className="prog-info-card">
                <span className="prog-info-label"><T>MODE</T></span>
                <span className="prog-info-value"><T>{mode}</T></span>
              </div>
              <div className="prog-info-card">
                <span className="prog-info-label"><T>STARTS</T></span>
                <span className="prog-info-value"><T>{starts}</T></span>
              </div>
            </div>

            <div className="prog-hero-buttons">
              <button
                className="btn-apply-now"
                onClick={() => {
                  if (isEnrolled) {
                    navigate(`/learn/${slug || courseId}`);
                  } else {
                    setShowPaymentModal(true);
                  }
                }}
                disabled={enrolling}
              >
                <FaPlayCircle className="me-1" />
                <T>{isEnrolled ? "Go to Classroom" : "Enroll Now"}</T>
              </button>

              <button className="btn-enquire" onClick={() => setShowExpertModal(true)}>
                <T>Talk to Expert</T>
              </button>

              {brochureUrl && (
                <a href={brochureUrl} target="_blank" rel="noreferrer" className="btn-enquire">
                  <T>Download Brochure</T>
                </a>
              )}
            </div>

            <div className="prog-urgency">
              <span><MdWatchLater size={16} /></span> <T>{urgencyText}</T>
            </div>
          </div>

          {/* Right Content */}
          <div className="prog-hero-right">
            <div className="prog-image-wrapper">
              <img src={image} alt="Campus / Program" className="main-prog-img" />

              <div className="prog-floating-card">
                <div className="floating-star"><FaStar size={16} /></div>
                <div>
                  <span className="floating-title"><T>Ranked 6th in June 2023</T></span>
                  <p>"<T>{reviewText}</T>"</p>
                  <small><T>{reviewAuthor}</T></small>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Talk to Expert Modal */}
      {showExpertModal && (
        <TalkToExpertModal onClose={() => setShowExpertModal(false)} />
      )}

      {/* Razorpay Test Mode Checkout Modal */}
      {showPaymentModal && (
        <RazorpayCheckoutModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          courseId={courseId}
          courseType={courseType}
          courseTitle={`${university} ${titleNormal} ${titleOrange}`}
          originalPrice={Number(price || 4999)}
          onSuccess={() => {
            setIsEnrolled(true);
            navigate(`/learn/${slug || courseId}`);
          }}
        />
      )}
    </>
  );
};

export default ProgramHero;
