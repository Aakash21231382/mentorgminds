import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { topProgramsApi } from "../../api/topProgramsApi";
import ProgramHero from "../ProgramHero";
import ProgramOverviewSections from "../../component/ProgramOverviewSections";
import CareerSupportPage from "../../component/CareerSupportPage";
import ProgramPricingSection from "../../component/ProgramPricingSection";
import "../../assets/css/CourseDetail.css";
import T from "../../context/T";

const TopProgramDetailPage = () => {
  const { slug } = useParams();

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    topProgramsApi
      .getProgramBySlug(slug)
      .then((data) => {
        if (data.success && data.program) {
          const prog = data.program;

          // Check if details are added
          const hasDetails =
            prog.HeroTitleNormal ||
            prog.HeroDescription ||
            prog.Title;

          if (!hasDetails) {
            setError(
              "Program details are not yet available. Please check back later."
            );
            setDetail(null);
          } else {
            setDetail(prog);
          }
        } else {
          setError("Program not found");
        }
      })
      .catch(() => setError("Failed to load program details"))
      .finally(() => setLoading(false));
  }, [slug]);

  /* Loading */
  if (loading)
    return (
      <div className="cd-loading">
        <div className="cd-spinner" />
        <p>
          <T>Loading program...</T>
        </p>
      </div>
    );

  /* Error / Not Found */
  if (error || !detail)
    return (
      <div className="cd-error">
        <h2>
          <T>Program Not Found</T>
        </h2>
        <p>
          <T>{error}</T>
        </p>
        <Link to="/study/abroad" className="cd-btn-primary">
          <T>Back to Study Abroad</T>
        </Link>
      </div>
    );
      

  return (
    <div>

      <ProgramHero
        badge={detail.HeroBadge}
        university={detail.University}
        titleNormal={detail.HeroTitleNormal}
        titleOrange={detail.HeroTitleOrange}
        description={detail.HeroDescription}
        duration={detail.HeroDuration}
        mode={detail.HeroMode}
        starts={detail.HeroStarts}
        image={detail.HeroImage}
        reviewText={detail.HeroReviewText}
        reviewAuthor={detail.HeroReviewAuthor}
        urgencyText={detail.HeroUrgencyText}
        brochureUrl={detail.BrochureUrl}
        price={detail.Price}
      />

      <ProgramOverviewSections detail={detail} />

      {detail.ShowCareerSupport !== false && (
        <CareerSupportPage detail={detail} />
      )}

      <ProgramPricingSection 
        detail={detail}
        slug={slug}
        courseId={detail.id || detail.ProgramId || 1}
        courseType="abroad"
      />

    </div>
  );
};

export default TopProgramDetailPage;


