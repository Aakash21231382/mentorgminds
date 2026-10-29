import { useState, useEffect, useRef, useCallback } from "react";
import T from "../context/T";
import "../assets/css/Banner.css";
import { bannerApi } from "../api/bannerApi";
import BannerBg from "../assets/images/Banner-Bg.svg";
import Container from "../assets/images/Container.png";
import { FaChevronRight } from "react-icons/fa6";
import { FaChevronLeft } from "react-icons/fa";
const INTERVAL = 5000; // ms — auto-slide interval

// ─── Video Modal ─────────────────────────────────────────────
const VideoModal = ({ url, onClose }) => {
  const embedUrl = url
    .replace("watch?v=", "embed/")
    .replace("youtu.be/", "www.youtube.com/embed/");

  return (
    <div className="bn-video-backdrop" onClick={onClose}>
      <div className="bn-video-wrapper" onClick={(e) => e.stopPropagation()}>
        <button className="bn-video-close m-4" onClick={onClose}>✕</button>
        {url.includes("youtube.com") || url.includes("youtu.be") ? (
          <iframe
            src={`${embedUrl}?autoplay=1`}
            title="Video"
            allow="autoplay; fullscreen"
            allowFullScreen
            className="bn-video-iframe"
          />
        ) : (
          <video src={url} controls autoPlay className="bn-video-player" />
        )}
      </div>
    </div>
  );
};

// ─── Single Slide ─────────────────────────────────────────────
const BannerSlide = ({ banner, isActive, onApply, onExpert }) => {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div
      className={`bn-slide ${isActive ? "bn-slide--active" : ""}`}
      style={banner.BgImage ? { backgroundImage: `url(${banner.BgImage})` } : undefined}
    >
      <div className="banner-overlay conta" />

      <div className="banner-container container">
        {/* ── LEFT ── */}
        <div className="banner-left">

          {banner.BadgeText && (
            <div className="tag"><T>{banner.BadgeText}</T></div>
          )}

          <div className="banner-contant">
            {(banner.HeadingLine1 || banner.HeadingLine2) && (
              <h1>
                {banner.HeadingLine1 && <T>{banner.HeadingLine1}</T>}
                {banner.HeadingLine2 && <span> <T>{banner.HeadingLine2}</T></span>}
              </h1>
            )}
            {banner.SubText1 && <p><T>{banner.SubText1}</T></p>}
            {banner.SubText2 && (
              <p className="small banner-subtext-2">
                <T>{banner.SubText2}</T>
              </p>
            )}
          </div>

          {(banner.Btn1Text || banner.Btn2Text) && (
            <div className="buttons">
              {banner.Btn1Text && (
                <button className="btn1" onClick={() => banner.Btn1Link ? window.location.href = banner.Btn1Link : onApply?.()}>
                  <T>{banner.Btn1Text}</T>
                </button>
              )}
              {banner.Btn2Text && (
                <button className="btn2" onClick={() => banner.Btn2Link ? window.location.href = banner.Btn2Link : onExpert?.()}>
                  <T>{banner.Btn2Text}</T>
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── RIGHT ── */}
        {banner.BannerImage && (
          <div className="banner-right">
            <img src={banner.BannerImage} alt="Banner" />
            {banner.VideoUrl && (
              <div className="preview-card preview-card--clickable" onClick={() => setShowVideo(true)}>
                <div className="play">
                  <img src={Container} alt="Play" />
                </div>
                <div>
                  {banner.VideoCardLabel && <small><T>{banner.VideoCardLabel}</T></small>}
                  {banner.VideoCardTitle && <h4><T>{banner.VideoCardTitle}</T></h4>}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showVideo && banner.VideoUrl && (
        <VideoModal url={banner.VideoUrl} onClose={() => setShowVideo(false)} />
      )}
    </div>
  );
};

// ─── Main Banner Carousel ─────────────────────────────────────
const Banner = ({ onApply, onExpert }) => {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const timerRef              = useRef(null);

  useEffect(() => {
    bannerApi.getBanners()
      .then((d) => { if (d.success) setBanners(d.banners || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    timerRef.current = setInterval(next, INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [banners.length, next]);

  const goTo = (idx) => {
    clearInterval(timerRef.current);
    setCurrent(idx);
    timerRef.current = setInterval(next, INTERVAL);
  };

  if (loading) return (
    <section className="banner banner--loading" />
  );

  if (!banners.length) return null;

  return (
    <section className="banner bn-carousel">
      <div className="bn-track">
        {banners.map((b, i) => (
          <BannerSlide key={b.Id} banner={b} isActive={i === current} onApply={onApply} onExpert={onExpert} />
        ))}
      </div>

      {banners.length > 1 && (
        <div className="bn-arrows-wrap">
          <button className="bn-arrow bn-arrow--prev" onClick={() => goTo((current - 1 + banners.length) % banners.length)} aria-label="Previous"><FaChevronLeft /></button>
          <button className="bn-arrow bn-arrow--next" onClick={() => goTo((current + 1) % banners.length)} aria-label="Next"><FaChevronRight /></button>
        </div>
      )}

      {banners.length > 1 && (
        <div className="slider-dots">
          {banners.map((_, i) => (
            <span key={i} className={`dot ${i === current ? "active" : ""}`} onClick={() => goTo(i)} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Banner;
