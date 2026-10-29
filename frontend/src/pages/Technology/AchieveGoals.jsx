import React, { useState, useEffect } from "react";
import T from "../../context/T";
import "../../assets/css/technology/AchieveGoals.css";
import { FaCheckCircle } from "react-icons/fa";
import { FaPlay } from "react-icons/fa6";
import { technologyApi } from "../../api/technologyApi";

const AchieveGoals = () => {
  const [settings,   setSettings]   = useState(null);
  const [tabs,       setTabs]       = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [activeIdx,  setActiveIdx]  = useState(0);

  useEffect(() => {
    technologyApi.getAchieveGoalsData()
      .then(d => {
        if (d.success) {
          setSettings(d.settings || null);
          setTabs(d.tabs || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Loading ya koi tab nahi — section hide karo
  if (loading || tabs.length === 0) return null;

  const current = tabs[activeIdx] || tabs[0];

  const pointList = current.Points
    ? current.Points.split('\n').filter(p => p.trim())
    : [];

  const headingNormal = settings?.HeadingNormal || "Services to Help You";
  const headingOrange = settings?.HeadingOrange || "Achieve Your Goal";
  const subHeading    = settings?.SubHeading    || "";

  return (
    <section className="achieve-goals-section container">
      <div className="achieve-goals-container">

        {/* Header */}
        <div className="achieve-goals-header text-center">
          <h2>
            <T>{headingNormal}</T>{" "}
            <span><T>{headingOrange}</T></span>
          </h2>
          {subHeading && <p><T>{subHeading}</T></p>}
        </div>

        {/* Tabs */}
        <div className="goals-tabs-wrapper">
          {tabs.map((tab, i) => (
            <button
              key={tab.Id}
              className={`goal-tab-btn ${activeIdx === i ? "active" : ""}`}
              onClick={() => setActiveIdx(i)}
            >
              {activeIdx === i && <FaCheckCircle className="point-icon" />}
              <T>{tab.TabLabel}</T>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="goals-content-box">
          {/* Left — image card */}
          <div
            className="goal-video-card"
            style={{
              backgroundImage: current.ImageUrl
                ? `linear-gradient(rgba(0,0,0,.4),rgba(0,0,0,.7)),url(${current.ImageUrl})`
                : 'linear-gradient(rgba(0,0,0,.5),rgba(0,0,0,.8))',
            }}
          >
            <div className="video-overlay-content">
              {current.CardHeading && <h3><T>{current.CardHeading}</T></h3>}
              {current.CardDesc    && <p><T>{current.CardDesc}</T></p>}
            </div>
            {current.VideoUrl && (
              <a
                href={current.VideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="play-btn-circle"
                aria-label="Watch video"
              >
                <FaPlay />
              </a>
            )}
          </div>

          {/* Right — info */}
          <div className="goal-info-content">
            {current.InfoTag      && <span className="info-tag"><T>{current.InfoTag}</T></span>}
            {current.InfoSubtitle && <h3><T>{current.InfoSubtitle}</T></h3>}
            <div className="info-points-list">
              {pointList.map((pt, i) => (
                <div className="info-point-item" key={i}>
                  <div className="point-icon"><FaCheckCircle /></div>
                  <p><T>{pt}</T></p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AchieveGoals;
