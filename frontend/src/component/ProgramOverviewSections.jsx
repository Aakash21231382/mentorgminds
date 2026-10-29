import { useState } from "react";
import T from "../context/T";
import "../assets/css/ProgramOverviewSections.css";
import { FaArrowRight, FaLinkedin,
         FaLightbulb, FaHourglassHalf, FaLaptop, FaTools,
         FaHandsHelping, FaWrench, FaUserTie, FaGraduationCap, FaRocket,
         FaShieldAlt, FaUsers, FaBolt, FaCode, FaChartBar, FaDatabase,
         FaCloud, FaMicrochip, FaBrain, FaLayerGroup, FaFlask, FaAward,
         FaUsersCog, FaStar, FaCheckCircle as FaCheck } from "react-icons/fa";
import { FiChevronDown, FiChevronUp, FiArrowUpRight,
         FiZap, FiUsers, FiCompass, FiCheckCircle,
         FiActivity, FiShoppingCart, FiCpu, FiShield, FiBriefcase,
         FiCode, FiCloud, FiDatabase, FiTrendingUp, FiBox, FiGlobe, FiLayers } from "react-icons/fi";
import { IoTimerOutline } from "react-icons/io5";
import { AiOutlineFileProtect, AiOutlineRobot, AiOutlineExperiment } from "react-icons/ai";
import { BsStars, BsLightningCharge, BsPeopleFill, BsGraphUp, BsCpu, BsCodeSlash } from "react-icons/bs";
import { MdWork, MdSchool, MdSpeed, MdAutoGraph, MdSecurity, MdDeveloperMode } from "react-icons/md";
import { GiArtificialIntelligence, GiBrain, GiProcessor } from "react-icons/gi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// ── Icon resolver — all registered icons ───────────────
const ICON_MAP = {
    // Feather Icons
    FiZap, FiUsers, FiCompass, FiCheckCircle, FiActivity,
    FiShoppingCart, FiCpu, FiShield, FiBriefcase,
    FiCode, FiCloud, FiDatabase, FiTrendingUp, FiBox, FiGlobe, FiLayers,
    // Font Awesome
    FaLightbulb, FaHourglassHalf, FaLaptop, FaTools, FaHandsHelping,
    FaWrench, FaUserTie, FaGraduationCap, FaRocket, FaShieldAlt,
    FaUsers, FaBolt, FaCode, FaChartBar, FaDatabase, FaCloud,
    FaMicrochip, FaBrain, FaLayerGroup, FaFlask, FaAward, FaUsersCog, FaStar,
    // IO5
    IoTimerOutline,
    // Ant Design Icons (react-icons/ai)
    AiOutlineFileProtect, AiOutlineRobot, AiOutlineExperiment,
    // Bootstrap Icons
    BsStars, BsLightningCharge, BsPeopleFill, BsGraphUp, BsCpu, BsCodeSlash,
    // Material Design
    MdWork, MdSchool, MdSpeed, MdAutoGraph, MdSecurity, MdDeveloperMode,
    // Game Icons
    GiArtificialIntelligence, GiBrain, GiProcessor,
};
const DynIcon = ({ name, size = 22, ...rest }) => {
  const C = ICON_MAP[name];
  return C ? <C size={size} {...rest} /> : null;
};

// ── Parse helper ──────────────────────────────────────────────
const parse = (v) => {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  try { return JSON.parse(v); } catch { return []; }
};

// ── Objectives parser (comma string or array) ─────────────────
const parseObjectives = (v) => {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') return v.split(',').map(s => s.trim()).filter(Boolean);
  return [];
};

const ProgramOverviewSections = ({ detail }) => {
  const [openModuleId,    setOpenModuleId]    = useState(null);
  const [activeCapstone,  setActiveCapstone]  = useState(null);

  // ── Data from detail prop (dynamic) ───────────────────────
  const alumniList      = parse(detail?.AlumniCompanies);
  const legacyCards     = parse(detail?.LegacyCards);
  const aiHighlights    = parse(detail?.AiHighlights);
  const quickHighlights = parse(detail?.QuickHighlights);
  const journey         = parse(detail?.LearningJourney);
  const curriculum      = parse(detail?.Curriculum);
  const tools           = parse(detail?.Tools);
  const realProjects    = parse(detail?.RealWorldProjects);
  const capstones       = parse(detail?.CapstoneProjects);
  const mentors         = parse(detail?.Mentors);
  const credFeatures    = parse(detail?.CredentialFeatures);

  const show = (key) => detail?.[key] !== false && detail?.[key] !== 0;

  return (
    <div className="program-overview-wrapper">

      {/* ── SECTION 1: Alumni ── */}
      {show('ShowAlumni') && alumniList.length > 0 && (
        <section className="alumni-strip-section">
          <div className="container">
            <div className="alumni-logos-grid">
              <p className="alumni-strip-title"><T>Our alumni work at leading companies</T></p>
              <div className="alumni-logos-grid-tem">
                {alumniList.map((comp, i) => (
                  <div className="alumni-logo-item" key={i}>
                    {comp.logo
                      ? <img src={comp.logo} alt={comp.name} />
                      : <span className="alumni-comp-fallback">{comp.name}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 2: Legacy ── */}
      {show('ShowLegacy') && legacyCards.length > 0 && (
        <section className="legacy-section">
          <div className="container">
            <div className="legacy-heading">
              <h2><T>{detail?.LegacyTitle || 'Legacy That Nurtures Excellence'}</T></h2>
              {detail?.LegacySubtitle && <p><T>{detail.LegacySubtitle}</T></p>}
            </div>
            <div className="legacy-cards-grid">
              {legacyCards.map((card, i) => (
                <div className="legacy-card" key={i}>
                  <div className="legacy-icon-box"><DynIcon name={card.icon} size={28} /></div>
                  <h3><T>{card.title}</T></h3>
                  <p><T>{card.description}</T></p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 3: AI Systems ── */}
      {show('ShowAiSection') && (
        <section className="ai-systems-section">
          <div className="container ai-systems-container">
            <div className="ai-systems-left">
              <h2><T>{detail?.AiSectionTitle || 'From Full Stack to AI-Native Systems'}</T></h2>
              {detail?.AiSectionSubtext && <p className="ai-subtext"><T>{detail.AiSectionSubtext}</T></p>}
              <div className="highlights-list">
                {aiHighlights.map((item, i) => (
                  <div className="highlight-item" key={i}>
                    <div className="hl-icon"><DynIcon name={item.icon} size={22} /></div>
                    <div>
                      <h4><T>{item.title}</T></h4>
                      <p><T>{item.desc}</T></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="ai-systems-right">
              {(detail?.AiStat1Value || detail?.AiStat2Value) && (
                <div className="stats-row">
                  {detail?.AiStat1Value && (
                    <div className="stat-card">
                      <h3>{detail.AiStat1Value}</h3>
                      <span><T>{detail.AiStat1Label}</T></span>
                    </div>
                  )}
                  {detail?.AiStat2Value && (
                    <div className="stat-card">
                      <h3>{detail.AiStat2Value}</h3>
                      <span><T>{detail.AiStat2Label}</T></span>
                    </div>
                  )}
                </div>
              )}
              {detail?.AiPromoTitle && (
                <div className="orange-promo-card">
                  <h3><T>{detail.AiPromoTitle}</T></h3>
                  {detail?.AiPromoText && <p><T>{detail.AiPromoText}</T></p>}
                  <a href="#" className="btn-learn-stack"><T>Learn the Stack</T> <FaArrowRight size={16} /></a>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 4: Quick Highlights ── */}
      {show('ShowQuickHighlights') && quickHighlights.length > 0 && (
        <section className="quick-highlights-section">
          <div className="container">
            <div className="quick-highlights-heading">
              <h2><T>Quick</T> <span><T>Program</T></span> <T>Highlights</T></h2>
              <p><T>Everything you need to transform your career into AI excellence</T></p>
            </div>
            <div className="quick-highlights-grid">
              {quickHighlights.map((item, i) => (
                <div className="quick-highlight-card" key={i}>
                  <div className="qh-icon-box"><DynIcon name={item.icon} size={28} /></div>
                  <span className="qh-label"><T>{item.label}</T></span>
                  <h4 className="qh-value"><T>{item.value}</T></h4>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 5: Learning Journey ── */}
      {show('ShowLearningJourney') && journey.length > 0 && (
        <section className="custom-journey-section container">
          <div className="custom-journey-inner">
            <div className="custom-journey-heading">
              <h2><T>{detail?.LearningJourneyTitle || 'Your Learning Journey'}</T></h2>
              <p><T>A step-by-step roadmap to mastery</T></p>
            </div>
            <div className="custom-timeline-wrap">
              <div className="custom-timeline-line"></div>
              <div className="custom-cards-stack">
                {journey.map((item, i) => (
                  <div className="custom-card-row" key={i}>
                    <div className="custom-timeline-dot"></div>
                    <div className="custom-content-box">
                      <span className="custom-month-text"><T>{item.month}</T></span>
                      <h3><T>{item.title}</T></h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 6: Curriculum ── */}
      {show('ShowCurriculum') && curriculum.length > 0 && (
        <section className="curriculum-section accordion-curriculum">
          <div className="container circulam">
            <div className="curriculum-heading">
              <h2><T>Detailed</T> <span><T>Curriculum</T></span></h2>
              <p><T>Explore the modules designed by industry experts</T></p>
            </div>
            <div className="curriculum-accordion-list">
              {curriculum.map((mod, i) => {
                const modId   = mod.moduleNumber || i;
                const isOpen  = openModuleId === modId;
                const topics  = parseObjectives(mod.objectives);
                return (
                  <div key={i} className={`curriculum-accordion-item ${isOpen ? 'active' : ''}`}>
                    <div className="accordion-header" onClick={() => setOpenModuleId(isOpen ? null : modId)}>
                      <h3><T>{mod.moduleNumber ? `${mod.moduleNumber}: ` : ''}{mod.title}</T></h3>
                      <span className="accordion-icon">{isOpen ? <FiChevronUp /> : <FiChevronDown />}</span>
                    </div>
                    {isOpen && topics.length > 0 && (
                      <div className="accordion-body">
                        <span className="learning-obj-label"><T>KEY LEARNING OBJECTIVES</T></span>
                        <div className="objectives-grid">
                          {topics.map((obj, j) => (
                            <div className="objective-item" key={j}>
                              <span className="bullet-circle"></span>
                              <span><T>{obj}</T></span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 7: Tools & Technologies ── */}
      {show('ShowTools') && tools.length > 0 && (
        <section className="tools-tech-section">
          <div className="container tools-tech-container">
            <div className="tools-tech-header text-center">
              <h2><T>Tools & Technologies</T> <span><T>You'll Learn</T></span></h2>
            </div>
            <div className="tools-grid">
              {tools.map((tool, i) => (
                <div className="tool-card" key={i}>
                  <div className="tool-icon-box">
                    {tool.image
                      ? <img src={tool.image} alt={tool.name} />
                      : <span className="tool-icon-fallback">🔧</span>}
                  </div>
                  <h4>{tool.name}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 8: Real World Projects ── */}
      {show('ShowRealProjects') && realProjects.length > 0 && (
        <section className="real-world-projects-section">
          <div className="container">
            <div className="projects-heading">
              <h2><T>Real-World</T> <span><T>Projects</T></span></h2>
              <p><T>Build a portfolio that gets you hired</T></p>
            </div>
            <div className="projects-grid">
              {realProjects.map((project, i) => (
                <div className="project-card" key={i}>
                  <div className="project-card-header">
                    <span className="project-tag"><T>{project.tag}</T></span>
                    <div className="project-icon-box"><FiArrowUpRight /></div>
                  </div>
                  <div className="project-content-area">
                    <h3><T>{project.title}</T></h3>
                    <p><T>{project.description}</T></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 9: Capstone Projects ── */}
      {show('ShowCapstone') && capstones.length > 0 && (
        <section className="capstone-projects-section">
          <div className="container">
            <div className="capstone-heading">
              <h2><T>Industry</T> <span><T>Capstone</T></span> <T>Projects</T></h2>
              <p><T>Industry-specific AI transformation projects</T></p>
            </div>
            <div className="capstone-grid">
              {capstones.map((project, i) => {
                const isActive = activeCapstone === i;
                return (
                  <div
                    className={`capstone-card ${isActive ? 'active' : ''}`}
                    key={i}
                    onClick={() => setActiveCapstone(i)}
                  >
                    <div className="capstone-card-top">
                      <div className="capstone-icon-box">
                        <DynIcon name={project.icon} size={24} />
                      </div>
                    </div>
                    <div className="capstone-content">
                      <span className="capstone-category"><T>{project.category}</T></span>
                      <h3><T>{project.title}</T></h3>
                      <p><T>{project.description}</T></p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 10: Mentors ── */}
      {show('ShowMentors') && mentors.length > 0 && (
        <section className="learn-from-best-section container">
          <div className="container">
            <div className="best-heading">
              <h2><T>Learn From The Best</T></h2>
              <p><T>Guidance from world-class researchers and industry veterans</T></p>
            </div>
            <div className="mentors-slider-wrapper">
              <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={24}
                slidesPerView={4}
                loop={mentors.length > 4}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                breakpoints={{ 320: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 4 } }}
                className="mentors-swiper"
              >
                {mentors.map((mentor, i) => (
                  <SwiperSlide key={i}>
                    <div className="mentor-card" style={{ backgroundColor: mentor.bgColor || '#F3F4FD' }}>
                      <div className="mentor-img-box">
                        <img src={mentor.image} alt={mentor.name} />
                      </div>
                      <h3><T>{mentor.name}</T></h3>
                      <p><T>{mentor.role}</T></p>
                      <a href={mentor.linkedinUrl || '#'} target="_blank" rel="noopener noreferrer" className="mentor-linkedin">
                        <FaLinkedin className="linkedin-icon" /> <T>LinkedIn</T>
                      </a>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 11: Credential ── */}
      {show('ShowCredential') && (detail?.CredentialTitle || credFeatures.length > 0) && (
        <section className="credential-section">
          <div className="container">
            <div className="credential-heading">
              <h2>
                <T>{detail?.CredentialTitle || 'A Credential That Carries Weight'}</T>
              </h2>
              {detail?.CredentialSubtitle && <p><T>{detail.CredentialSubtitle}</T></p>}
            </div>
            <div className="credential-card-wrapper">
              <div className="credential-grid">
                <div className="credential-features">
                  {credFeatures.map((item, i) => (
                    <div className="credential-feature-item" key={i}>
                      <div className="credential-icon-box">
                        <DynIcon name={item.icon} size={22} />
                      </div>
                      <div className="credential-text">
                        <h3><T>{item.title}</T></h3>
                        <p><T>{item.description}</T></p>
                      </div>
                    </div>
                  ))}
                </div>
                {detail?.CertificateImage && (
                  <div className="credential-image-box">
                    <img src={detail.CertificateImage} alt="Certificate Preview" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

export default ProgramOverviewSections;
