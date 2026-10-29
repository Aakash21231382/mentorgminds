import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { universityApi } from "../api/universityApi";
import "../assets/css/AllUniversities.css";
import {
  FaStar, FaGraduationCap, FaChalkboardTeacher,
  FaBriefcase, FaClock, FaArrowRight,
} from "react-icons/fa";
import TalkToExpertModal from "../component/TalkToExpertModal";

const AllUniversities = () => {
  const [slides,      setSlides]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    universityApi.getUniversitySlides()
      .then((d) => {
        const data = d?.slides || d?.data?.slides || [];
        setSlides(data);
      })
      .catch((err) => console.error("Error fetching universities:", err))
      .finally(() => setLoading(false));
  }, []);

  // Pehli slide se heading info
  const firstSlide = slides[0] || {};
  const pageTitle  = firstSlide.Heading     || "Our University Partners";
  const pageDesc   = firstSlide.Description || "";
  const badgeText  = firstSlide.BadgeText   || null;

  // Saari slides ke logos ek array mein combine — duplicate IDs hataao
  const allLogosRaw = slides.flatMap((slide) => slide.logos || []);
  const logos = Array.from(new Map(allLogosRaw.map((l) => [l.Id, l])).values());

  if (loading) {
    return (
      <div className="au-page">
        <div className="au-loading">
          <div className="au-spinner"></div>
          <p>Loading universities...</p>
        </div>
      </div>
    );
  }

  const disciplines = [
    "Data Science", "Artificial Intelligence", "Business Management",
    "Digital Marketing", "Finance", "Cybersecurity", "Cloud Computing",
    "Product Design",
  ];

  const featuredUniversities = [
    { name: "Stanford Online", initial: "S", courseCount: 24, rating: 4.8, tags: ["Data Science", "AI & ML", "Product Management"] },
    { name: "MIT xPRO",        initial: "M", courseCount: 31, rating: 4.9, tags: ["Cloud Computing", "Cybersecurity", "Robotics"]   },
    { name: "IIT Delhi",       initial: "I", courseCount: 18, rating: 4.7, tags: ["Engineering", "Data Analytics", "AI"]            },
    { name: "Wharton Online",  initial: "W", courseCount: 22, rating: 4.8, tags: ["Finance", "Business Strategy", "Marketing"]      },
  ];

  const benefits = [
    { icon: <FaGraduationCap />,    title: "Globally recognized certificates",       text: "Every certificate carries the partner university's name and is verifiable online."                                                  },
    { icon: <FaChalkboardTeacher />, title: "Taught by faculty who teach on campus", text: "Courses are built and delivered by the same professors teaching these subjects offline."                                            },
    { icon: <FaClock />,            title: "Learn at your own pace",                 text: "Self-paced and cohort-based options, so the course fits around your schedule, not the other way round."                            },
    { icon: <FaBriefcase />,        title: "Built for career outcomes",              text: "Curriculum is reviewed with hiring partners to stay aligned with what roles actually need today."                                   },
  ];

  return (
    <>
      <div className="au-page">

        {/* ── Hero ── */}
        <div className="au-hero">
          {badgeText && <span className="au-badge">{badgeText}</span>}
          <h1>
            {pageTitle.includes(" ") ? (
              <>
                {pageTitle.split(" ").slice(0, -1).join(" ")}{" "}
                <span>{pageTitle.split(" ").slice(-1)}</span>
              </>
            ) : (
              <span>{pageTitle}</span>
            )}
          </h1>
          {pageDesc && <p>{pageDesc}</p>}

          {logos.length > 0 && (
            <div className="au-stats">
              <div className="au-stat"><div className="au-stat-number">{logos.length}+</div><div className="au-stat-label">Partner Universities</div></div>
              <div className="au-stat"><div className="au-stat-number">Global</div><div className="au-stat-label">Recognition</div></div>
              <div className="au-stat"><div className="au-stat-number">100%</div><div className="au-stat-label">Accredited</div></div>
            </div>
          )}
        </div>

        {/* ── Logos Grid ── */}
        {logos.length === 0 ? (
          <div className="au-empty">
            <div className="au-empty-icon">🏛️</div>
            <p>No universities to display at the moment.</p>
          </div>
        ) : (
          <div className="au-grid">
            {logos.map((logo) => (
              <div className="au-card" key={logo.Id}>
                <div className="au-card-img-wrap">
                  {logo.LogoUrl
                    ? <img src={logo.LogoUrl} alt={logo.Name || "university"} />
                    : <div className="au-card-no-img">{logo.Name ? logo.Name.charAt(0).toUpperCase() : "U"}</div>
                  }
                </div>
                {logo.Name && <p className="au-card-name">{logo.Name}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>

        {/* ── BROWSE BY DISCIPLINE ── */}
        <section className="au-disciplines-section">
          <div className="au-inner">
            <h2 className="au-section-title">Browse by discipline</h2>
            <p className="au-section-sub">
              Every partner university teaches across these areas — pick one to see matching courses.
            </p>
            <div className="au-disciplines">
              {disciplines.map((d, i) => (
                <span className="au-chip" key={i}>{d}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURED UNIVERSITIES ── */}
        <section className="au-featured-section">
          <div className="au-inner">
            <h2 className="au-section-title">Featured this month</h2>
            <p className="au-section-sub">
              A closer look at a few partners and what students are learning there right now.
            </p>
            <div className="au-featured-grid">
              {featuredUniversities.map((uni, i) => (
                <div className="au-feat-card" key={i}>
                  <div className="au-feat-top">
                    <div className="au-feat-logo">{uni.initial}</div>
                    <div className="au-feat-rating"><FaStar /> {uni.rating}</div>
                  </div>
                  <h3 className="au-feat-name">{uni.name}</h3>
                  <p className="au-feat-count">{uni.courseCount} courses available</p>
                  <div className="au-feat-tags">
                    {uni.tags.map((t, j) => (
                      <span className="au-feat-tag" key={j}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY OUR PARTNERS ── */}
        <section className="au-benefits-section">
          <div className="au-inner">
            <h2 className="au-section-title">Why learn with our partners</h2>
            <div className="au-benefits-grid">
              {benefits.map((b, i) => (
                <div className="au-benefit-card" key={i}>
                  <div className="au-benefit-icon">{b.icon}</div>
                  <h3 className="au-benefit-title">{b.title}</h3>
                  <p className="au-benefit-text">{b.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CLOSING CTA ── */}
        <section className="au-cta-section">
          <div className="au-inner au-cta-inner">
            <div>
              <h2 className="au-cta-title">Not sure which university fits you?</h2>
              <p className="au-cta-text">Talk to an advisor and get a shortlist based on your goals.</p>
            </div>
            <div className="au-cta-actions">
              <Link className="au-btn-primary" to="/all-Courses">
                Explore all courses <FaArrowRight size={13} />
              </Link>
              <button className="au-btn-outline" onClick={() => setIsModalOpen(true)}>
                Talk to Expert
              </button>
            </div>
          </div>
        </section>

      </div>

      {isModalOpen && <TalkToExpertModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default AllUniversities;
