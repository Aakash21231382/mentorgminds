import React, { useState, useEffect } from "react";
import T from "../../context/T";
import "../../assets/css/technology/CurriculumComparison.css";
import { FaRegClock, FaRegFolderOpen } from "react-icons/fa";
import { FiMonitor } from "react-icons/fi";
import { technologyApi } from "../../api/technologyApi";

// ── Parse JSON safely ─────────────────────────────────────────
const parse = (v) => {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  try { return JSON.parse(v); } catch { return []; }
};

const CurriculumComparison = () => {
  const [settings, setSettings] = useState(null);
  const [cards, setCards] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    technologyApi.getCurriculumCompData()
      .then((data) => {
        const s = data?.settings || null;
        const c = data?.cards || [];
        setSettings(s);
        setCards(c);
        const tabs = parse(s?.TabsJson);
        if (tabs.length > 0) setActiveTab(tabs[0].key);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || !settings) return null;

  const tabs = parse(settings.TabsJson);
  const currentTab = activeTab || tabs[0]?.key;
  const tabCards = cards.filter(c => c.TabKey === currentTab);
  const partACards = tabCards.filter(c => c.Part === 'A');
  const partBCards = tabCards.filter(c => c.Part === 'B');

  // Get part title/badge from first card in each part
  const partATitle = partACards[0]?.PartTitle || 'Part A';
  const partABadge = partACards[0]?.PartBadge || '';
  const partBTitle = partBCards[0]?.PartTitle || 'Part B';
  const partBBadge = partBCards[0]?.PartBadge || '';

  // If no tabs or no cards, don't render
  if (tabs.length === 0 && cards.length === 0) return null;

  return (
    <section className="curriculum-comp-section container">
      <div className=" curriculum-comp-container">
        <div className="curriculum-comp-header text-center">
          <h2>
            <T>{settings.HeadingNormal || 'Gen AI & Agentic AI Course'}</T>{' '}
            <span><T>{settings.HeadingOrange || 'Curriculum Comparison'}</T></span>
          </h2>

          {tabs.length > 0 && (
            <div className="comp-toggle-box">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  className={`toggle-btn ${currentTab === tab.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  <span className="sub-title"><T>{tab.subTitle}</T></span>
                  <span className="main-title"><T>{tab.mainTitle}</T></span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="comparison-content-grid">
          {/* Part A */}
          <div className="comp-column">
            <div className="column-header">
              <h3><T>Part A</T> <span><T>{partATitle}</T></span></h3>
              {partABadge && <span className="track-badge"><T>{partABadge}</T></span>}
            </div>
            <div className="comp-cards-list">
              {partACards.map(card => (
                <CompCard key={`${currentTab}-partA-${card.Id}`} card={card} />
              ))}
              {partACards.length === 0 && (
                <p className="comp-empty-msg"><T>No cards added yet.</T></p>
              )}
            </div>
          </div>

          {/* Part B */}
          <div className="comp-column">
            <div className="column-header">
              <h3><T>Part B</T> <span><T>{partBTitle}</T></span></h3>
              {partBBadge && <span className="track-badge"><T>{partBBadge}</T></span>}
            </div>
            <div className="comp-cards-list">
              {partBCards.map(card => (
                <CompCard key={`${currentTab}-partB-${card.Id}`} card={card} />
              ))}
              {partBCards.length === 0 && (
                <p className="comp-empty-msg"><T>No cards added yet.</T></p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ── Single Card (Fixed your half-cut code) ───────────────────────────────────────────────
const CompCard = ({ card }) => (
  <div className="comp-card">
    <div className="card-icon-box">
      {card.IconUrl && <img src={card.IconUrl} alt={card.Title} />}
    </div>
    <div className="card-info">
      <h4><T>{card.Title}</T></h4>
      {card.Descr && <p><T>{card.Descr}</T></p>}
      
      <div className="card-meta">
        {card.Hours && <span><FaRegClock /> <T>{card.Hours}</T></span>}
        {card.Projects && <span><FaRegFolderOpen /> <T>{card.Projects}</T></span>}
        {card.Extra && <span><FiMonitor /> <T>{card.Extra}</T></span>}
      </div>
    </div>
  </div>
);

export default CurriculumComparison;