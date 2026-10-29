import React, { useState, useEffect } from "react";
import T from "../../context/T";
import "../../assets/css/technology/ToolsTechnologies.css";
import { technologyApi } from "../../api/technologyApi";

const ToolsTechnologies = () => {
  const [settings, setSettings] = useState(null);
  const [tools,    setTools]    = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    technologyApi.getToolsTechData()
      .then(d => {
        if (d.success) {
          setSettings(d.settings || null);
          setTools(d.tools    || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Koi tool nahi → section hide
  if (!loading && tools.length === 0) return null;
  if (loading) return null;

  const headingNormal = settings?.HeadingNormal || 'Tools & Technologies';
  const headingOrange = settings?.HeadingOrange || "You'll Learn";

  return (
    <section className="tools-tech-section">
      <div className="container tools-tech-container">

        <div className="tools-tech-header text-center">
          <h2>
            <T>{headingNormal}</T> <span><T>{headingOrange}</T></span>
          </h2>
        </div>

        <div className="tools-grid">
          {tools.map((tool) => (
            <div className="tool-card" key={tool.Id}>
              <div className="tool-icon-box">
                {tool.IconUrl
                  ? <img src={tool.IconUrl} alt={tool.Name} />
                  : <span className="tool-fallback-icon">🔧</span>}
              </div>
              <h4>{tool.Name}</h4>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ToolsTechnologies;
