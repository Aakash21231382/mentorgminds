import React, { useState, useEffect } from "react";
import T from "../../context/T";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "../../assets/css/technology/CourseInstructors.css";
import { FaLinkedin } from "react-icons/fa";
import { technologyApi } from "../../api/technologyApi";

const CourseInstructors = () => {
  const [settings,   setSettings]   = useState(null);
  const [tabs,       setTabs]       = useState([]);
  const [activeTabId, setActiveTabId] = useState(null);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    technologyApi.getCourseInstructorsData()
      .then(d => {
        if (d.success) {
          setSettings(d.settings || null);
          const t = d.tabs || [];
          setTabs(t);
          if (t.length > 0) setActiveTabId(t[0].Id);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Koi tab nahi → section hide
  if (!loading && tabs.length === 0) return null;
  if (loading) return null;

  const headingNormal = settings?.HeadingNormal || 'Course';
  const headingOrange = settings?.HeadingOrange || 'Instructors';
  const subtitle      = settings?.Subtitle      || 'Guidance from world-class researchers and industry veterans';

  const activeTab     = tabs.find(t => t.Id === activeTabId);
  const currentCards  = activeTab?.cards || [];

  return (
    <section className="course-instructors-section">
      <div className="container course-instructors-container">

        {/* Header */}
        <div className="course-instructors-header text-center">
          <h2>
            <T>{headingNormal}</T> <span><T>{headingOrange}</T></span>
          </h2>
          {subtitle && <p><T>{subtitle}</T></p>}
        </div>

        {/* Tabs */}
        <div className="instructors-tabs-header">
          {tabs.map(tab => (
            <button
              key={tab.Id}
              className={`tab-btn ${activeTabId === tab.Id ? 'active' : ''}`}
              onClick={() => setActiveTabId(tab.Id)}
            >
              <T>{tab.TabName}</T>
              {' '}
              <span className="tab-btn-count">
                ({tab.cards?.length || 0})
              </span>
            </button>
          ))}
        </div>

        {/* Cards Swiper */}
        <div key={activeTabId} className="instructors-swiper-wrapper tab-change-animation">
          {currentCards.length === 0 ? (
            <p className="instructors-empty-msg"><T>No instructors in this tab yet.</T></p>
          ) : (
            <Swiper
              modules={[Pagination]}
              spaceBetween={24}
              slidesPerView={1}
              pagination={{ el: '.instructors-slider-dots', clickable: true }}
              breakpoints={{
                768:  { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1200: { slidesPerView: 4 },
              }}
              className="instructors-swiper"
            >
              {currentCards.map(card => (
                <SwiperSlide key={card.Id}>
                  <div className={`instructor-card ${card.CardBg || 'card-bg-1'}`}>
                    <div className="instructor-img-box">
                      {card.Photo
                        ? <img src={card.Photo} alt={card.Name} />
                        : <div className="instructor-avatar-fallback">👤</div>}
                    </div>
                    <h3><T>{card.Name}</T></h3>
                    {card.Role && <p><T>{card.Role}</T></p>}
                    {card.LinkedinUrl && (
                      <a href={card.LinkedinUrl} target="_blank" rel="noopener noreferrer" className="linkedin-link">
                        <FaLinkedin className="linkedin-icon" /> <T>LinkedIn</T>
                      </a>
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        {/* Pagination dots */}
        <div className="instructors-slider-dots"></div>

      </div>
    </section>
  );
};

export default CourseInstructors;
