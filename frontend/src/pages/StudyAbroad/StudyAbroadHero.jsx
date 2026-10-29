import React, { useState } from "react";
import "../../assets/css/studyaborad/StudyAbroadHero.css";
import CounselingModal from "../../component/CounselingModal";
import { MdKeyboardArrowRight } from "react-icons/md";
import T from "../../context/T";

const StudyAbroadHero = () => {
  const [showCounselingModal, setShowCounselingModal] = useState(false);

  return (
    <>
      <section className="hero-wrapper">
        <div className="hero-container container">

          {/* Top Hero Section */}
          <div className="hero-main">

            <div className="hero-left">

              <h1 className="hero-title">
                <T>Study Abroad Programs:</T>{" "}
                <span className="hero-subtitle">
                  <T>Our path, Your destination</T>
                </span>
              </h1>

              <p className="hero-desc">
                <T>
                  Trusted overseas education consultants guiding you to top
                  study abroad programs & opportunities.
                </T>
              </p>

              <button
                className="hero-btn"
                onClick={() => setShowCounselingModal(true)}
              >
                <T>Book 1:1 Counseling</T>

                <span className="btn-arrow">
                  <MdKeyboardArrowRight size={28} />
                </span>
              </button>

            </div>

            <div className="hero-right">
              <img
                src="https://d2o2utebsixu4k.cloudfront.net/hero%2055-2ff25ebaf8ec42088789e8e3dbdd22cc.webp"
                alt="Study Abroad Destination"
                className="hero-image"
              />
            </div>

          </div>

          {/* Bottom Stats Section */}
          <div className="hero-stats">

            <div className="stat-card1">
              <h2 className="stat-number">300+</h2>

              <p className="stat-label">
                <T>Universities</T>
              </p>
            </div>

            <div className="stat-divider"></div>

            <div className="stat-card1">
              <h2 className="stat-number">98%</h2>

              <p className="stat-label">
                <T>Admit Rate</T>
              </p>
            </div>

            <div className="stat-divider"></div>

            <div className="stat-card1">
              <h2 className="stat-number">20,000+</h2>

              <p className="stat-label">
                <T>Enrolled Learners</T>
              </p>
            </div>

            <div className="stat-divider"></div>

            <div className="stat-card1">
              <h2 className="stat-number">₹20 Lakhs</h2>

              <p className="stat-label">
                <T>Avg Cost Savings</T>
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Counseling Modal */}
      {showCounselingModal && (
        <CounselingModal
          onClose={() => setShowCounselingModal(false)}
        />
      )}
    </>
  );
};

export default StudyAbroadHero;