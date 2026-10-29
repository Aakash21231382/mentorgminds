import React, { useState, useEffect } from "react";
import T from "../../context/T";
import "../../assets/css/technology/CourseProjects.css";
import { FaCheck, FaRegFileAlt } from "react-icons/fa";
import { technologyApi } from "../../api/technologyApi";

const CourseProjects = () => {
  const [settings, setSettings] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    technologyApi.getCourseProjectsData()
      .then(d => {
        if (d.success) {
          setSettings(d.settings || null);
          setProjects(d.projects || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Koi project nahi → section hide
  if (!loading && projects.length === 0) return null;
  if (loading) return null;

  const line1    = settings?.HeadingLine1 || 'Gen AI & Agentic AI Course';
  const line2    = settings?.HeadingLine2 || 'Projects Learn';
  const line3    = settings?.HeadingLine3 || 'by Doing';
  // Badge: admin ne set kiya ho toh woh, warna actual count
  const badge    = settings?.BadgeText || `${projects.length}+`;

  return (
    <section className="course-projects-section">
      <div className="container course-projects-container">

        {/* Header */}
        <div className="course-projects-header">
          <div className="title-box">
            <h2>
              {line1 && <><T>{line1}</T><br /></>}
              {line2 && <span><T>{line2}</T></span>}
              {line3 && <> <T>{line3}</T></>}
            </h2>
          </div>
          <div className="projects-badge">
            <FaRegFileAlt className="badge-icon" />
            <span><T>Projects</T> <strong>{badge}</strong></span>
          </div>
        </div>

        {/* Projects List */}
        <div className="projects-list">
          {projects.map((project) => {
            const skills = project.Skills
              ? project.Skills.split(',').map(s => s.trim()).filter(Boolean)
              : [];

            return (
              <div className="project-card" key={project.Id}>

                {/* LEFT — icon */}
                <div className="project-icon-box">
                  {project.IconUrl
                    ? <img src={project.IconUrl} alt={project.Title} />
                    : <FaRegFileAlt className="project-fallback-icon" />}
                </div>

                {/* RIGHT — content */}
                <div className="project-info">
                  <h3><T>{project.Title}</T></h3>
                  {project.Description && <p><T>{project.Description}</T></p>}
                  {skills.length > 0 && (
                    <div className="skills-section">
                      <span className="skills-label"><T>Skills learned</T></span>
                      <div className="skills-tags">
                        {skills.map((skill, i) => (
                          <span className="skill-tag" key={i}>
                            <span className="skill-check"><FaCheck /></span>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default CourseProjects;
