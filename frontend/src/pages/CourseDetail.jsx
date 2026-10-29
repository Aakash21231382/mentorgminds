import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { courseDetailApi } from "../api/courseDetailApi";
import ProgramHero from "./ProgramHero";
import ProgramOverviewSections from "../component/ProgramOverviewSections";
import CareerSupportPage from "../component/CareerSupportPage";
import ProgramPricingSection from "../component/ProgramPricingSection";
import CourseReviewsSection from "../component/CourseReviewsSection";
import "../assets/css/CourseDetail.css";
import T from "../context/T";

const CourseDetail = ({ apiType = "career" }) => {
  const { slug } = useParams();

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const apiFn = apiType === "online"
      ? courseDetailApi.getOnlineCourseDetailBySlug(slug)
      : courseDetailApi.getCourseDetailBySlug(slug);

    apiFn
      .then(d => {
        if (d.success) setDetail(d.detail);
        else setError("Course not found");
      })
      .catch(() => setError("Failed to load course details"))
      .finally(() => setLoading(false));
  }, [slug, apiType]);

  if (loading) return (
    <div className="cd-loading">
      <div className="cd-spinner" />
      <p><T>Loading course...</T></p>
    </div>
  );

  if (error || !detail) return (
    <div className="cd-error">
      <h2><T>Course Not Found</T></h2>
      <p>{error}</p>
      <Link to="/" className="cd-btn-primary"><T>Back to Home</T></Link>
    </div>
  );

  const courseId = detail.CareerCourseId || detail.OnlineCourseId || detail.NavbarLinkId || detail.FooterLinkId || detail.Id || detail.id;

  return (
    <div className="cd-page">
      <ProgramHero
        courseId={courseId}
        slug={slug || detail.Slug}
        courseType={apiType}
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
        slug={slug || detail.Slug}
        courseId={courseId}
        courseType={apiType}
      />
      <CourseReviewsSection courseId={courseId} courseType={apiType} />
    </div>
  );
};

export default CourseDetail;
