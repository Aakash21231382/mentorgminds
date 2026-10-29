import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import T from "../context/T";
import { universityApi } from "../api/universityApi";
import "../assets/css/University.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// ── Single slide card ─────────────────────────────────────────
const UniversityCard = ({ slide }) => {
  const navigate = useNavigate();

  const handleBtn = () => {
    const link = slide.BtnLink || "/universities";
    if (link.startsWith("http")) window.open(link, "_blank", "noreferrer");
    else navigate(link);
  };

  return (
    <div className="university-container container">

      {/* LEFT — text */}
      <div className="university-left">
        {slide.BadgeText && (
          <span className="certificate-tag"><T>{slide.BadgeText}</T></span>
        )}
        {slide.Heading && (
          <h2><T>{slide.Heading}</T></h2>
        )}
        {slide.Description && (
          <p><T>{slide.Description}</T></p>
        )}
        {slide.BtnText && (
          <button onClick={handleBtn}><T>{slide.BtnText}</T></button>
        )}
      </div>

        {/* RIGHT — logos grid */}
        <div className="university-right">
          {(slide.logos || []).map((item) => (
            <div className="logo-box" key={item.Id}>
              {item.LogoUrl
                ? <img src={item.LogoUrl} alt={item.Name || "university logo"} />
                : <span className="uni-logo-name">{item.Name}</span>}
            </div>
          ))}
        </div>

      </div>
    );
  };

  // ── Main University section ───────────────────────────────────
  const University = () => {
    const [slides, setSlides] = useState([]);

    useEffect(() => {
      universityApi.getUniversitySlides()
        .then((d) => {
          const data = d?.slides || d?.data?.slides || [];
          setSlides(data);
        })
        .catch(() => {});
    }, []);

    if (slides.length === 0) return null;

    return (
      <section className="university-section">
        <div className="left-circle"></div>
        <div className="right-circle"></div>
        <div className="dot-pattern"></div>

        {slides.length === 1 ? (
          // Sirf ek slide — swiper nahi
          <UniversityCard slide={slides[0]} />
        ) : (
          // Multiple slides — poora card auto-slide
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={true}
            pagination={{ clickable: true, el: '.uni-swiper-dots' }}
            className="uni-full-swiper"
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.Id}>
                <UniversityCard slide={slide} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {/* Pagination dots */}
        {slides.length > 1 && (
          <div className="uni-swiper-dots slider-dots" />
        )}
      </section>
    );
  };

export default University;
