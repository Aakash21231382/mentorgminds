import { useState } from "react"; // useState import kiya
import T from "../context/T";
import { FaPhoneAlt } from "react-icons/fa";
import { FiUsers, FiCpu, FiBriefcase, FiZap, FiShield,
         FiCode, FiCloud, FiDatabase, FiActivity, FiGlobe } from "react-icons/fi";
import { FaLaptop, FaGraduationCap, FaRocket, FaAward,
         FaHandsHelping, FaUserTie, FaBrain, FaChartBar } from "react-icons/fa";
import { MdWork, MdSchool, MdSpeed, MdSecurity } from "react-icons/md";
import { BsStars, BsPeopleFill, BsGraphUp } from "react-icons/bs";
import "../assets/css/technology/CareerSupportPage.css";

// DHYAN DEIN: Modals ka path apne project structure ke hisaab se theek kar lena
import TalkToExpertModal from "./TalkToExpertModal"; 
import ApplyNowModal from "./ApplyNowModal";

// ── Icon resolver ─────────────────────────────────────────────
const ICON_MAP = {
    FiUsers, FiCpu, FiBriefcase, FiZap, FiShield,
    FiCode, FiCloud, FiDatabase, FiActivity, FiGlobe,
    FaLaptop, FaGraduationCap, FaRocket, FaAward,
    FaHandsHelping, FaUserTie, FaBrain, FaChartBar,
    MdWork, MdSchool, MdSpeed, MdSecurity,
    BsStars, BsPeopleFill, BsGraphUp,
};
const DynIcon  = ({ name, size = 22 }) => {
  const C = ICON_MAP[name];
  return C ? <C size={size} /> : null;
};

const parse = (v) => {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  try { return JSON.parse(v); } catch { return []; }
};

const CareerSupportPage = ({ detail }) => {
  const steps    = parse(detail?.CareerJourneySteps);
  const stats    = parse(detail?.CareerStats);
  const stories  = parse(detail?.SuccessStories);
  const learning = parse(detail?.LearningExperience);

  // 1. Dono buttons ke liye alag-alag modal states banayi hain
  const [isTalkModalOpen, setIsTalkModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  return (
    <div className="career-support-page container">

      {/* ── SECTION 1: Career Journey ── */}
      {(steps.length > 0 || stats.length > 0) && (
        <section className="career-journey-section container">
          <div>
            <div className="career-journey-header">
              <h2>
                <T>Your Career </T>
                <span><T>Support Journey</T></span>
              </h2>
              <p><T>We don't just teach, we get you hired.</T></p>
            </div>

            {steps.length > 0 && (
              <div className="journey-timeline">
                {steps.map((step, index) => {
                  const isLast = index === steps.length - 1;
                  const isEven = index % 2 === 1;
                  return (
                    <div className="timeline-item" key={index}>
                      <div className="timeline-node-wrapper">
                        <span className={`timeline-dot ${isLast ? 'active' : ''}`}>
                          {index + 1}
                        </span>
                        {!isLast && (
                          <svg className="curved-arrow" viewBox="0 0 120 40" fill="none">
                            <path
                              d={isEven ? 'M5 25 Q 60 -15 115 25' : 'M5 15 Q 60 55 115 15'}
                              stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" fill="none"
                            />
                            <polygon
                              points={isEven ? '112,19 120,25 111,27' : '112,21 120,15 111,13'}
                              fill="#CBD5E1"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="timeline-label"><T>{step.label}</T></span>
                    </div>
                  );
                })}
              </div>
            )}

            {stats.length > 0 && (
              <div className="journey-stats-grid">
                {stats.map((stat, i) => (
                  <div className="stat-card" key={i}>
                    <h3>{stat.value}</h3>
                    <p><T>{stat.label}</T></p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── SECTION 2: Success Stories ── */}
      {stories.length > 0 && (
        <section className="success-stories-section">
          <div className="container">
            <div className="success-stories-header">
              <h2><T>Success</T> <span><T>Stories</T></span></h2>
              <p><T>Hear from our alumni working at top tech firms</T></p>
            </div>
            <div className="stories-grid">
              {stories.map((story, i) => (
                <div className="story-card" key={i}>
                  <div className="story-author-row">
                    {story.image && <img src={story.image} alt={story.name} />}
                    <div className="story-author-info">
                      <h4><T>{story.name}</T></h4>
                      <span><T>{story.role}</T></span>
                    </div>
                  </div>
                  <p className="story-quote"><T>{story.quote}</T></p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 3: Learning Experience ── */}
      {learning.length > 0 && (
        <section className="learning-experience-section">
          <div className="container">
            <div className="learning-header">
              <h2><T>The Learning</T> <span><T>Experience</T></span></h2>
              <p><T>A premium educational environment designed for results</T></p>
            </div>
            <div className="learning-grid">
              {learning.map((item, i) => (
                <div className="learning-card" key={i}>
                  <div className="learning-icon-box">
                    <DynIcon name={item.icon} size={24} />
                  </div>
                  <h3><T>{item.title}</T></h3>
                  <p><T>{item.description}</T></p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 4: CTA ── */}
      <section className="ai-revolution-section">
        <div className="container">
          <div className="ai-cta-card">
            <h2>
              <T>Ready to lead the</T> <span><T>AI revolution</T></span>?
            </h2>
            <p><T>Limited seats available. Secure your future today.</T></p>
            <div className="ai-cta-buttons">
              
              {/* 2. Dono buttons par onClick lagaya hai aur respective state ko true kiya hai */}
              <button 
                className="btn-outline" 
                onClick={() => setIsTalkModalOpen(true)}
              >
                <T>Talk to Advisor</T>
              </button>
              
              <button 
                className="btn-solid" 
                onClick={() => setIsApplyModalOpen(true)}
              >
                <T>Start Application Now</T>
              </button>
              
            </div>
            <div className="ai-cta-help">
              <FaPhoneAlt className="phone-icon" />
              <span><T>Need Help? Call</T> <strong>+1-800-AI-READY</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Dono modals ko yahan render kiya hai. Close hone par state wapas false ho jayegi */}
      {isTalkModalOpen && (
        <TalkToExpertModal onClose={() => setIsTalkModalOpen(false)} />
      )}
      
      {isApplyModalOpen && (
        <ApplyNowModal onClose={() => setIsApplyModalOpen(false)} />
      )}

    </div>
  );
};

export default CareerSupportPage;