import React from "react";
import "../../assets/css/studyaborad/IIMAlumSection.css";
import T from "../../context/T";
const IIMAlumSection = () => {
  const highlights = [
    {
      title: "Program",
      subtitle: "Certificate in Business Management",
    },
    {
      title: "Duration",
      subtitle: "6 months",
    },
    {
      title: "Credibility",
      subtitle: "Youngest AACSB-accredited IIM",
    },
    {
      title: "Ranking",
      subtitle: "NIRF 21 (2025)",
    },
  ];

  return (
    <section className="iim-section-wrapper">
      <div className="iim-container">
        {/* Header Heading */}
        <div className="iim-header">
          <h2 className="iim-main-heading">
          <T>  A distinct </T><span className="highlight-red"><T> IIM alum </T></span> <T>status — now yours</T>
          </h2>
          <p className="iim-sub-heading">
           <T> The IIM Udaipur advantage: Pathway to the world's top universities.</T>
          </p>
        </div>

        {/* Content Box (Image + Description) */}
        <div className="iim-content-box">
          <div className="iim-image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop" 
              alt="IIM Udaipur Campus"
              className="iim-campus-img"
            />
          </div>
          <div className="iim-text-wrapper">
            <p className="iim-description">
             <T>  A Global Pathway for upGrad Learners: Earn dual alumni status from IIM Udaipur and a top university abroad—all through one program. Begin your Master's at IIM Udaipur and gain access to the influential IIM alumni network. This six-month, high-impact certification focuses on data-driven decision-making for complex, real-world business challenges.</T>
            </p>
          </div>
        </div>

        {/* Bottom Key Highlights / Stats Bar */}
        <div className="iim-stats-row">
          {highlights.map((item, index) => (
            <React.Fragment key={index}>
              <div className="iim-stat-item">
                <span className="iim-stat-title"><T>{item.title}</T></span>
                <span className="iim-stat-subtitle"><T>{item.subtitle}</T></span>
              </div>
              {index !== highlights.length - 1 && <div className="iim-stat-divider" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IIMAlumSection;