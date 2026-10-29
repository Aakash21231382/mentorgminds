import React, { useState, useEffect } from "react";
import T from "../../context/T";
import "../../assets/css/technology/CourseOverview.css";
import { technologyApi } from "../../api/technologyApi";

// safe JSON parse for bullet points
const parseBullets = (v) => {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  try { return JSON.parse(v); } catch { return []; }
};

// Split paragraphs by double newline
const parseParagraphs = (v) => {
  if (!v) return [];
  return v.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
};

const CourseOverview = () => {
  const [settings, setSettings] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    technologyApi.getCourseOverviewData()
      .then(d => {
        if (d.success) {
          setSettings(d.settings || null);
          setSections(d.sections || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || sections.length === 0) return null;

  const headingNormal = settings?.HeadingNormal || 'Agentic AI and Generative AI';
  const headingOrange = settings?.HeadingOrange || 'Course Overview';
  const mainDesc      = settings?.MainDesc      || '';

  return (
    <section className="course-overview-section">
      <div className="container course-overview-container">

        {/* Main Header */}
        <div className="overview-main-header">
          <h2>
            <T>{headingNormal}</T>{' '}
            <span><T>{headingOrange}</T></span>
          </h2>
          {mainDesc && <p><T>{mainDesc}</T></p>}
        </div>

        {/* Content Blocks */}
        <div className="overview-body-content">
          {sections.map((sec) => {
            const paras   = parseParagraphs(sec.Paragraphs);
            const bullets = parseBullets(sec.BulletPoints);

            return (
              <div className="overview-block" key={sec.Id}>
                <h3><T>{sec.Title}</T></h3>

                {/* Text paragraphs */}
                {sec.SectionType === 'text' && paras.map((para, i) => (
                  <p key={i}><T>{para}</T></p>
                ))}

                {/* Bullet list */}
                {sec.SectionType === 'bullets' && (
                  <>
                    {sec.Subtitle && (
                      <p className="use-case-sub"><T>{sec.Subtitle}</T></p>
                    )}
                    <ul className="overview-bullet-list">
                      {bullets.map((pt, i) => (
                        <li key={i}>
                          {pt.label && <strong><T>{pt.label}</T>: </strong>}
                          <T>{pt.desc}</T>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default CourseOverview;
