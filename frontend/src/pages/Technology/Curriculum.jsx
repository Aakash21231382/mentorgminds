import React, { useState, useEffect } from "react";
import T from "../../context/T";
import "../../assets/css/technology/Curriculum.css";
import { FaCheckCircle } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { technologyApi } from "../../api/technologyApi";

const COLOR_CLASS = {
  white: 'white-card',
  peach: 'peach-card',
  blue:  'blue-card',
};

const Curriculum = () => {
  const [settings, setSettings] = useState(null);
  const [cards,    setCards]    = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    technologyApi.getCurriculumData()
      .then(d => {
        if (d.success) {
          setSettings(d.settings || null);
          setCards(d.cards    || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Koi active card nahi → poora section hide
  if (!loading && cards.length === 0) return null;

  // Loading state
  if (loading) return null;

  const headingLine1  = settings?.HeadingLine1 || '';
  const headingLine2  = settings?.HeadingLine2 || '';
  const brochureUrl   = settings?.BrochureUrl  || null;

  return (
    <section className="curriculum-section">
      <div className="container curriculum-container">

        {/* Header — dynamic */}
        <div className="curriculum-header text-center">
          <h2>
            {headingLine1 && <><T>{headingLine1}</T><br /></>}
            {headingLine2 && <span><T>{headingLine2}</T></span>}
          </h2>
        </div>

        {/* Timeline */}
        <div
          className="timeline-wrapper"
          style={{ height: `${Math.max(900, (cards.length - 1) * 200 + 250)}px` }}
        >
          <div className="timeline-center-line"></div>

          {cards.map((card, idx) => {
            const pts = card.Points
              ? card.Points.split('\n').filter(p => p.trim())
              : [];
            const colorClass = COLOR_CLASS[card.CardColor] || 'white-card';
            const isLeft     = idx % 2 === 0;

            return (
              <div
                key={card.Id}
                className="timeline-row"
                style={{
                  top: `${idx * 200}px`,
                  flexDirection: isLeft ? 'row' : 'row-reverse',
                }}
              >
                <div className={`curriculum-card ${colorClass}`}>
                  <h3><T>{card.Title}</T></h3>
                  <ul className="curriculum-list">
                    {pts.map((point, i) => (
                      <li key={i}>
                        <FaCheckCircle className="curr-check-icon" />
                        <span><T>{point}</T></span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`timeline-number-node node-${isLeft ? 'left' : 'right'}`}>
                  <span>{idx + 1}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Download button — sirf tab dikhao jab PDF ho */}
        {brochureUrl && (
          <div className="curriculum-btn-box text-center">
            <a
              href={brochureUrl}
              target="_blank"
              rel="noreferrer"
              className="download-syllabus-btn"
              style={{ textDecoration: 'none' }}
            >
              <T>Download Syllabus</T> <FaDownload />
            </a>
          </div>
        )}

      </div>
    </section>
  );
};

export default Curriculum;
