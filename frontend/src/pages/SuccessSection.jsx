import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import "../assets/css/SuccessSection.css";
import T from "../context/T";

import { FaPlayCircle } from "react-icons/fa";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { successSectionApi } from "../api/successSectionApi";

// ── Video modal ───────────────────────────────────────────────
const VideoModal = ({ url, onClose }) => {
  if (!url) return null;

  // YouTube link ko embed URL mein convert karo
  const getEmbedUrl = (link) => {
    try {
      const u = new URL(link);
      // youtu.be short link
      if (u.hostname === 'youtu.be') {
        return `https://www.youtube.com/embed/${u.pathname.slice(1)}?autoplay=1`;
      }
      // youtube.com/watch?v=
      if (u.hostname.includes('youtube.com')) {
        const v = u.searchParams.get('v');
        if (v) return `https://www.youtube.com/embed/${v}?autoplay=1`;
      }
      // Vimeo
      if (u.hostname.includes('vimeo.com')) {
        const id = u.pathname.split('/').pop();
        return `https://player.vimeo.com/video/${id}?autoplay=1`;
      }
    } catch (_) {}
    // Direct video file ya koi aur link as-is
    return link;
  };

  const embedUrl = getEmbedUrl(url);
  const isDirect = /\.(mp4|webm|ogg)$/i.test(url);

  return (
    <div className="success-video-backdrop" onClick={onClose}>
      <div className="success-video-modal" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="success-video-close">✕</button>

        {isDirect ? (
          <video src={url} controls autoPlay className="success-video-media" />
        ) : (
          <iframe
            src={embedUrl}
            title="video"
            className="success-video-frame"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
};

const SuccessSection = () => {
  const [swiperRef, setSwiperRef]   = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [config, setConfig]         = useState(null);
  const [stories, setStories]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [videoUrl, setVideoUrl]     = useState(null);

  useEffect(() => {
    Promise.all([
      successSectionApi.getConfig(),
      successSectionApi.getStories(),
    ])
      .then(([cfgRes, storyRes]) => {
        if (cfgRes.success && cfgRes.config)       setConfig(cfgRes.config);
        if (storyRes.success && storyRes.stories)  setStories(storyRes.stories);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (!config && stories.length === 0) return null;

  // Learner images: comma-separated string se array
  const learnerImgs = config?.LearnerImages
    ? config.LearnerImages.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  // Banner button action
  const handleBannerBtn = () => {
    const link = config?.BannerBtnLink || '';
    if (!link) return;
    setVideoUrl(link);
  };

  return (
    <section className="unique-success-section">
      {/* Video modal */}
      {videoUrl && <VideoModal url={videoUrl} onClose={() => setVideoUrl(null)} />}

      {/* ── Heading + Stats ── */}
      <div className="container unique-success-container">
        {(config?.TagText || config?.HeadingNormal || config?.HeadingOrange) && (
          <div className="unique-success-heading">
            {config.TagText && (
              <span className="unique-success-tag"><T>{config.TagText}</T></span>
            )}
            {(config.HeadingNormal || config.HeadingOrange) && (
              <h2>
                {config.HeadingNormal && <T>{config.HeadingNormal}</T>}
                {config.HeadingOrange && <span> <T>{config.HeadingOrange}</T></span>}
              </h2>
            )}
          </div>
        )}

        {/* Stats */}
        {(config?.Stat1Value || config?.Stat2Value || config?.Stat3Value || config?.Stat4Value) && (
          <div className="unique-success-stats">
            {[1, 2, 3, 4].map(n => {
              const val   = config[`Stat${n}Value`];
              const label = config[`Stat${n}Label`];
              if (!val && !label) return null;
              return (
                <div key={n} className="unique-success-item">
                  {val   && <h3><T>{val}</T></h3>}
                  {label && <p><T>{label}</T></p>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Stories Slider ── */}
      {stories.length > 0 && (
        <div className="container unique-success-container">
          <div className="unique-story-wrapper">
            <button className="unique-story-arrow unique-prev-btn" onClick={() => swiperRef?.slidePrev()}>
              <MdKeyboardArrowLeft />
            </button>

            <Swiper
              modules={[Navigation]}
              spaceBetween={0}
              slidesPerView={1}
              loop={stories.length > 1}
              onSwiper={setSwiperRef}
              onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)}
              className="unique-story-swiper"
            >
              {stories.map((story, idx) => (
                <SwiperSlide key={story.Id}>
                  <div className="unique-story-card">
                    {/* Left: text */}
                    <div className="unique-story-content">
                      {story.Quote && <h3><T>{story.Quote}</T></h3>}
                      <p className="unique-story-desc">
                        {story.DescStrong && <strong><T>{story.DescStrong}</T></strong>}
                        {story.DescRest   && <T>{story.DescRest}</T>}
                      </p>
                      {story.Name    && <h4><T>{story.Name}</T></h4>}
                      {story.Program && <span><T>{story.Program}</T></span>}

                      {/* Dots */}
                      <div className="unique-story-dots">
                        {stories.map((_, dotIdx) => (
                          <span
                            key={dotIdx}
                            className={currentIndex === dotIdx ? "active" : ""}
                            onClick={() => swiperRef?.slideToLoop(dotIdx)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Right: image */}
                    <div className="unique-story-image">
                      {story.Image && (
                        <img src={story.Image} alt={story.Name || 'student'} />
                      )}

                      {/* Watch story button — sirf tab dikhao jab video link ho */}
                      {story.VideoLink && (
                        <button
                          className="unique-watch-btn"
                          onClick={() => setVideoUrl(story.VideoLink)}
                        >
                          <FaPlayCircle />
                          <T>Watch story</T>
                        </button>
                      )}

                      {(story.Name || story.RoleText) && (
                        <div className="unique-student-info">
                          {story.Name     && <h4><T>{story.Name.toUpperCase()}</T></h4>}
                          {story.RoleText && <p><T>{story.RoleText}</T></p>}
                        </div>
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <button className="unique-story-arrow unique-next-btn" onClick={() => swiperRef?.slideNext()}>
              <MdKeyboardArrowRight />
            </button>
          </div>
        </div>
      )}

      {/* ── Bottom Learners Banner ── */}
      {(config?.BannerHeading || config?.BannerDesc) && (
        <div className="container unique-success-container">
          <div className="unique-learners-banner">
            <div className="unique-circle-left"></div>
            <div className="unique-circle-right"></div>
            <div className="unique-learners-dots"></div>

            <div className="unique-learner-content">
              <div className="unique-learner-top">
                {learnerImgs.length > 0 && (
                  <div className="unique-learner-images">
                    {learnerImgs.map((src, i) => (
                      <img key={i} src={src} alt={`learner-${i + 1}`} />
                    ))}
                  </div>
                )}
                {config.BannerTopLabel && (
                  <h4><T>{config.BannerTopLabel}</T></h4>
                )}
              </div>

              {config.BannerHeading && (
                <h2><T>{config.BannerHeading}</T></h2>
              )}
              {config.BannerDesc && (
                <p><T>{config.BannerDesc}</T></p>
              )}
            </div>

            {config.BannerBtnText && (
              <button className="unique-testimonial-btn" onClick={handleBannerBtn}>
                <T>{config.BannerBtnText}</T>
                <FaPlayCircle />
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default SuccessSection;
