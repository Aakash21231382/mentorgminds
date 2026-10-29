import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/pagination";

import "../assets/css/OnlineCourse.css";
import { FaDownload, FaCheck } from "react-icons/fa";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import T from "../context/T";
import { onlineCourseApi } from "../api/onlineCourseApi";

// Same as CourseCard.jsx — window.open in new tab
const handleBrochure = (url) => {
  if (url) window.open(url, '_blank');
};



const OnlineCourse = () => {
  const [categories,   setCategories]   = useState([]);
  const [allCourses,   setAllCourses]   = useState([]);
  const [activeTab,    setActiveTab]    = useState(null);
  const [displayTab,   setDisplayTab]   = useState(null);
  const [animating,    setAnimating]    = useState(false);
  const [loading,      setLoading]      = useState(true);
  const swiperRef = useRef(null);

  useEffect(() => {
    onlineCourseApi.getPublicOnlineCourses()
      .then(d => {
        if (d.success) {
          setCategories(d.categories || []);
          setAllCourses(d.courses    || []);
          if (d.categories?.length > 0) {
            setActiveTab(d.categories[0].Id);
            setDisplayTab(d.categories[0].Id);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleTabChange = (id, e) => {
    if (id === activeTab || animating) return;
    setAnimating(true);
    setActiveTab(id);
    setTimeout(() => {
      setDisplayTab(id);
      setAnimating(false);
    }, 220);
    if (e?.currentTarget) {
      e.currentTarget.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  };

  const filteredCourses = allCourses.filter(c => c.CategoryId === displayTab);
  const shouldLoop      = filteredCourses.length > 3;

  if (loading) return null;
  if (categories.length === 0) return null;

  return (
    <section className="online-course-section">
      <div className="container oc-container">

        <div className="online-course-heading">
          <h2>
            <T>Online Courses with</T> <span><T>Placement Assistance</T></span>
          </h2>
        </div>

        {/* ── Category Tabs ── */}
        <div className="course-category">
          {categories.map(cat => (
            <button
              key={cat.Id}
              className={activeTab === cat.Id ? "active-category" : ""}
              onClick={e => handleTabChange(cat.Id, e)}
            >
              <T>{cat.Name}</T>
            </button>
          ))}
        </div>

        {/* ── Feature Row ── */}
        <div className="course-feature-row">
          <div className="oc-feature-item">
            <FaCheck className="oc-check-icon" />
            <span><T>Real world projects</T></span>
          </div>
          <div className="oc-feature-item">
            <FaCheck className="oc-check-icon" />
            <span><T>Unlimited AI mock interviews</T></span>
          </div>
          <div className="oc-feature-item">
            <FaCheck className="oc-check-icon" />
            <span><T>Priority Access to top opportunities</T></span>
          </div>
          <Link to={`/online-courses?category=${activeTab}`} className="oc-view-all">
            <T>View All Courses</T> <MdKeyboardArrowRight size={24} />
          </Link>
        </div>

        {/* ── Swiper ── */}
        <div
          className={`oc-card-wrapper ${animating ? "career-slider-out" : "career-slider-in"}`}
        >
          <button className="oc-slider-btn oc-left-btn" onClick={() => swiperRef.current?.slidePrev()}>
            <MdKeyboardArrowLeft />
          </button>

          {filteredCourses.length === 0 ? (
            <p className="oc-no-courses">
              <T>No courses available in this category yet.</T>
            </p>
          ) : (
            <Swiper
              modules={[Pagination]}
              spaceBetween={24}
              slidesPerView={1}
              loop={shouldLoop}
              onSwiper={swiper => { swiperRef.current = swiper; }}
              pagination={{ el: '.oc-slider-dots', clickable: true }}
              breakpoints={{ 768: { slidesPerView: 2 }, 992: { slidesPerView: 3 } }}
              className="oc-swiper"
              key={displayTab}
            >
              {filteredCourses.map(course => (
                <SwiperSlide key={course.Id}>
                  <div className="oc-card">
                    <div className="oc-card-image">
                      {course.Image
                        ? <img src={course.Image} alt={course.Title} />
                        : <div className="oc-img-placeholder" />}
                    </div>
                    <div className="oc-card-content">
                      <h3><T>{course.Title}</T></h3>
                      {course.Subtitle && <p className="oc-subtitle"><T>{course.Subtitle}</T></p>}
                      <ul className="oc-features-list">
                        {course.Feature1 && <li><T>{course.Feature1}</T></li>}
                        {course.Feature2 && <li><T>{course.Feature2}</T></li>}
                        {course.Feature3 && <li><T>{course.Feature3}</T></li>}
                      </ul>
                      {/* Skills & Tools — multiple images */}
                      {(() => {
                        let skillImgs = [];
                        if (course.SkillImages) {
                          try { skillImgs = JSON.parse(course.SkillImages); } catch { skillImgs = []; }
                        }
                        if (skillImgs.length === 0 && course.SkillImage) skillImgs = [course.SkillImage];
                        return skillImgs.length > 0 ? (
                          <div className="oc-skills-row">
                            <span className="oc-skills-label"><T>Skills and Tools</T></span>
                            <div className="oc-skill-icons">
                              {skillImgs.map((src, i) => (
                                <img key={i} src={src} alt={`skill-${i}`} />
                              ))}
                              {course.ExtraSkills > 0 && (
                                <span className="oc-more-skill">& {course.ExtraSkills} <T>more</T></span>
                              )}
                            </div>
                          </div>
                        ) : null;
                      })()}
                      <div className="oc-card-buttons">
                        <a
                          href={course.Slug ? `/online-course-detail/${course.Slug}` : (course.ProgramUrl || '#')}
                          className={`oc-btn-view ${(!course.Slug && !course.ProgramUrl) ? 'oc-btn-disabled' : ''}`}
                        >
                          <T>View Program</T>
                        </a>
                        <button
                          onClick={() => handleBrochure(course.BrochureUrl)}
                          className="oc-btn-brochure"
                          disabled={!course.BrochureUrl}
                        >
                          <T>Brochure</T> <FaDownload size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          <button className="oc-slider-btn oc-right-btn" onClick={() => swiperRef.current?.slideNext()}>
            <MdKeyboardArrowRight />
          </button>
        </div>
      </div>

      <div className="oc-slider-dots"></div>
    </section>
  );
};

export default OnlineCourse;


