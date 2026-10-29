import React, { useState, useEffect } from "react";
import { FaStar, FaCheckCircle, FaPen, FaTimes } from "react-icons/fa";
import { lmsApi } from "../api/lmsApi";
import T from "../context/T";
import "../assets/css/CourseReviewsSection.css";
import { toast } from "react-toastify";

const CourseReviewsSection = ({ courseId = 1, courseType = "online" }) => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(5.0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // New review form
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [courseId, courseType]);

  const fetchReviews = async () => {
    try {
      const res = await lmsApi.getCourseReviews(courseId, courseType);
      if (res.success) {
        setReviews(res.reviews || []);
        setAverageRating(res.averageRating || 5.0);
        setTotalReviews(res.totalReviews || 0);
      }
    } catch (e) {}
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("Please login to write a verified review.");
      return;
    }

    if (!reviewText.trim()) {
      toast.warning("Please enter your review feedback.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await lmsApi.addCourseReview({
        courseId,
        courseType,
        rating,
        reviewText: reviewText.trim()
      });

      if (res.success) {
        toast.success("Review submitted! Thank you for your feedback.");
        setShowModal(false);
        setReviewText("");
        fetchReviews();
      }
    } catch (err) {
      toast.error("Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="course-reviews-section">
      <div className="container">
        
        {/* Header */}
        <div className="reviews-header-block">
          <div className="reviews-title-box">
            <h2><T>Verified Student Reviews</T></h2>
            <p><T>Hear from alumni and working professionals who transformed their careers with this program.</T></p>
          </div>

          <button className="btn-write-review" onClick={() => setShowModal(true)}>
            <FaPen /> <T>Write a Review</T>
          </button>
        </div>

        {/* Rating Overview */}
        <div className="rating-summary-card">
          <div className="score-big-box">
            <div className="score-number">{averageRating}</div>
            <div className="score-stars">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} color={i < Math.round(averageRating) ? "#F59E0B" : "#CBD5E1"} />
              ))}
            </div>
            <div className="score-count">{totalReviews} <T>Verified Ratings</T></div>
          </div>

          <div>
            <h4 className="fw-bold text-dark m-0 mb-1"><T>100% Verified Learners</T></h4>
            <p className="text-muted m-0">
              <T>Every review is submitted by real enrolled students upon completing program milestones.</T>
            </p>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="reviews-grid">
          {reviews.length === 0 ? (
            <p className="text-muted"><T>No reviews yet for this course. Be the first to review!</T></p>
          ) : (
            reviews.map((r) => (
              <div key={r.ReviewID} className="review-item-card">
                <div className="review-author-row">
                  <span className="review-author-name">
                    {r.UserName} <span className="verified-pill"><FaCheckCircle /> <T>Verified Student</T></span>
                  </span>
                  <div className="review-stars">
                    {[...Array(r.Rating || 5)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                </div>

                <p className="review-message">"{r.ReviewText}"</p>
                <span className="review-date">{new Date(r.CreatedAt).toLocaleDateString()}</span>
              </div>
            ))
          )}
        </div>

      </div>

      {/* Review Modal */}
      {showModal && (
        <div className="review-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="review-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="m-0 fw-bold"><T>Write a Review</T></h3>
              <button className="btn btn-sm btn-light rounded-circle" onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmitReview}>
              <label className="form-label fw-bold"><T>Your Rating</T></label>
              <div className="star-rating-selector">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar 
                    key={star}
                    className={star <= rating ? "active-star" : ""}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold"><T>Review Feedback</T></label>
                <textarea 
                  className="form-control"
                  rows="4"
                  placeholder="Share your learning experience, curriculum feedback, or mentorship results..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-write-review w-100 justify-content-center" disabled={submitting}>
                <T>{submitting ? "Submitting..." : "Submit Verified Review"}</T>
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default CourseReviewsSection;
