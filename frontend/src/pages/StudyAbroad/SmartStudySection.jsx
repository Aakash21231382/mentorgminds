import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../assets/css/studyaborad/SmartStudySection.css";
import CounselingModal from "../../component/CounselingModal";
import { MdKeyboardArrowRight } from "react-icons/md";
import T from "../../context/T";

const SmartStudySection = () => {
  const [showCounselingModal, setShowCounselingModal] = useState(false);

  const cardsData = [
    {
      leftValue: "1:18",
      desc: "Term 1 credits accepted at 18 global universities.",
      rightTheme: "theme-green",
    },
    {
      leftValue: "No",
      desc: "GRE/GMAT not required. EPT waivers are available.",
      rightTheme: "theme-orange",
    },
    {
      leftValue: "12/12",
      desc: "Intakes every month. Start your journey anytime.",
      rightTheme: "theme-amber",
    },
    {
      leftValue: "₹50 Lac*",
      desc: "Savings on tuition and living expenses.",
      rightTheme: "theme-red",
    },
  ];

  return (
    <section className="smart-study-wrapper">
      <div className="smart-study-container container">
        {/* Left Content */}
        <div className="smart-study-left">
          <h2 className="smart-title">
            <T>The</T>{" "}
            <span className="highlight-text">
              <T>Smartest</T>
            </span>{" "}
            <T>way to Study abroad</T>
          </h2>

          <p className="smart-desc">
            <T>
              Most students take a traditional path but what if you can earn the
              same degree, only faster & more flexibly?
            </T>
          </p>

          <div className="smart-cta-group">
            <button
              className="btn-primary"
              onClick={() => setShowCounselingModal(true)}
            >
              <T>Talk to our counselor</T>

              <span className="arrow">
                <MdKeyboardArrowRight size={28} />
              </span>
            </button>

            <Link to="/study-abroad/programs" className="btn-secondary">
              <T>Explore courses</T>

              <span className="arrow">
                <MdKeyboardArrowRight size={28} />
              </span>
            </Link>
          </div>
        </div>

        {/* Right Cards Grid */}
        <div className="smart-study-grid">
          {cardsData.map((item, index) => (
            <div className="dual-card" key={index}>
              <div className="dual-card-left">
                <h3>{item.leftValue === "No" ? <T>No</T> : item.leftValue}</h3>
              </div>

              <div className={`dual-card-right ${item.rightTheme}`}>
                <p>
                  <T>{item.desc}</T>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCounselingModal && (
        <CounselingModal onClose={() => setShowCounselingModal(false)} />
      )}
    </section>
  );
};

export default SmartStudySection;
