import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "../assets/css/InstructionSection.css";
import T from "../context/T";
import CardLine from "../assets/images/cards-lines.svg";
import { instructorApi } from "../api/instructorApi";

import {
  FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube,
} from "react-icons/fa";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const InstructionSection = () => {
  const [section,     setSection]     = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const swiperRef = useRef(null);

  useEffect(() => {
    Promise.all([
      instructorApi.getInstructorSection(),
      instructorApi.getInstructors(),
    ])
      .then(([secRes, instrRes]) => {
        if (secRes.success  && secRes.section)        setSection(secRes.section);
        if (instrRes.success && instrRes.instructors) setInstructors(instrRes.instructors);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Loading mein kuch mat dikhao
  if (loading) return null;

  // Koi data nahi toh section hide karo
  if (!section && instructors.length === 0) return null;
  if (instructors.length === 0) return null;

  const shouldLoop = instructors.length > 3;

  return (
    <section className="instruction-section">
      <div className="container instruction-container">

        {/* ── Header ── */}
        {section && (
          <div className="instruction-header">
            <div>
              {section.TagText && (
                <span className="instruction-tag">
                  <T>{section.TagText}</T>
                </span>
              )}
              <h2>
                {section.HeadingNormal && <T>{section.HeadingNormal}</T>}
                {section.HeadingOrange && (
                  <span> <T>{section.HeadingOrange}</T></span>
                )}
              </h2>
            </div>
            {section.ViewAllText && (
              <Link className="view-course" to={section.ViewAllLink || '/all-Courses'}>
                <T>{section.ViewAllText}</T>
                <MdKeyboardArrowRight size={24} />
              </Link>
            )}
          </div>
        )}

        {/* ── Slider ── */}
        <div className="instruction-wrapper">
          <button
            className="instruction-arrow left"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <MdKeyboardArrowLeft />
          </button>

          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            loop={shouldLoop}
            onSwiper={swiper => { swiperRef.current = swiper; }}
            pagination={{ el: '.instr-dots', clickable: true }}
            breakpoints={{
              768: { slidesPerView: 2 },
              992: { slidesPerView: 3 },
            }}
            className="instruction-swiper"
          >
            {instructors.map((item) => (
              <SwiperSlide key={item.Id}>
                <div className={`instruction-card ${item.CardBg || 'blue'}`}>
                  <img src={CardLine} alt="" className="card-lines" />

                  {/* Photo */}
                  {item.Photo && (
                    <img src={item.Photo} alt={item.Name} className="teacher-image" />
                  )}

                  <h3><T>{item.Name}</T></h3>
                  {item.Role && <h4><T>{item.Role}</T></h4>}

                  <div className="card-desc">
                    {/* Company logo */}
                    {item.CompanyLogo && (
                      <p className="working">
                        <T>Working at</T>
                        <img src={item.CompanyLogo} alt="company" />
                      </p>
                    )}

                    {item.Description && (
                      <p className="teacher-desc"><T>{item.Description}</T></p>
                    )}

                    {/* Social links — only show if at least one exists */}
                    {(item.FacebookUrl || item.TwitterUrl || item.LinkedinUrl || item.YoutubeUrl) && (
                      <div className="social">
                        <h5><T>View Social Media Profile</T></h5>
                        <div className="social-icons">
                          {item.FacebookUrl && (
                            <a href={item.FacebookUrl} target="_blank" rel="noreferrer" className="facebook">
                              <FaFacebookF />
                            </a>
                          )}
                          {item.TwitterUrl && (
                            <a href={item.TwitterUrl} target="_blank" rel="noreferrer" className="twitter">
                              <FaTwitter />
                            </a>
                          )}
                          {item.LinkedinUrl && (
                            <a href={item.LinkedinUrl} target="_blank" rel="noreferrer" className="linkedin">
                              <FaLinkedinIn />
                            </a>
                          )}
                          {item.YoutubeUrl && (
                            <a href={item.YoutubeUrl} target="_blank" rel="noreferrer" className="youtube">
                              <FaYoutube />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            className="instruction-arrow right"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <MdKeyboardArrowRight />
          </button>
        </div>

        <div className="instr-dots"></div>
      </div>
    </section>
  );
};

export default InstructionSection;
