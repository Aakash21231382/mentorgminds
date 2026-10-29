import React, { useState, useEffect } from "react";
import T from "../../context/T";
import "../../assets/css/technology/SkillsComparison.css";
import { FaCheck } from "react-icons/fa";
import { technologyApi } from "../../api/technologyApi";

const SkillsComparison = () => {
  const [settings, setSettings] = useState(null);
  const [cards,    setCards]    = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    technologyApi.getSkillsCompData()
      .then(d => {
        if (d.success) {
          setSettings(d.settings || null);
          setCards(d.cards    || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Loading ya koi card nahi — section hide karo
  if (loading || cards.length === 0) return null;

  const headingNormal = settings?.HeadingNormal || "Skills You'll Acquire";
  const headingOrange = settings?.HeadingOrange || "";

  return (
    <section className="skills-comp-section container">
      <div className="skills-comp-container">

        <div className="skills-comp-header text-center">
          <h2>
            <T>{headingNormal}</T>
            {headingOrange && <> <span><T>{headingOrange}</T></span></>}
          </h2>
        </div>

        <div className="skills-comp-grid">
          {cards.map((card) => {
            const skillList = card.Skills
              ? card.Skills.split('\n').filter(s => s.trim())
              : [];
            return (
              <div className="skills-card" key={card.Id}>
                <h3><T>{card.CardTitle}</T></h3>
                {card.CardSubtitle && (
                  <p className="card-subtitle"><T>{card.CardSubtitle}</T></p>
                )}
                <ul className="skills-list">
                  {skillList.map((skill, i) => (
                    <li key={i}>
                      <span className="skill-check-icon"><FaCheck /></span>
                      <span><T>{skill}</T></span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default SkillsComparison;
