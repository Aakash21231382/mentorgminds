import React, { useState, useEffect } from "react";
import { 
  FaStar, 
  FaTrash, 
  FaCheck, 
  FaTimes, 
  FaSearch, 
  FaCheckCircle, 
  FaEye, 
  FaEyeSlash,
  FaComments,
  FaShieldAlt
} from "react-icons/fa";
import { lmsAdminApi } from "../../api/lmsAdminApi";
import "../../assets/css/lms-admin.css";

const ManageLMSReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // 'all' | 'approved' | 'hidden' | '5star'

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await lmsAdminApi.getAllReviews();
      if (res.success) {
        setReviews(res.reviews || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (reviewId) => {
    try {
      await lmsAdminApi.toggleReviewApproval(reviewId);
      fetchReviews();
    } catch (e) {
      alert("Could not toggle status.");
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await lmsAdminApi.deleteReview(reviewId);
      fetchReviews();
    } catch (e) {
      alert("Could not delete review.");
    }
  };

  // Metrics
  const totalReviews = reviews.length;
  const approvedReviews = reviews.filter(r => r.IsApproved).length;
  const hiddenReviews = totalReviews - approvedReviews;
  const avgRating = totalReviews > 0 
    ? (reviews.reduce((acc, r) => acc + (r.Rating || 5), 0) / totalReviews).toFixed(1)
    : "5.0";

  // Filtered reviews
  const filteredReviews = reviews.filter(r => {
    const matchSearch = 
      (r.UserName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.ReviewText || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.CourseTitle || "").toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchSearch) return false;
    if (filterStatus === "approved") return r.IsApproved;
    if (filterStatus === "hidden") return !r.IsApproved;
    if (filterStatus === "5star") return r.Rating === 5;
    return true;
  });

  return (
    <div className="lms-admin-container">
      
      {/* Header */}
      <div className="lms-page-header">
        <div className="lms-header-title-box">
          <h1>
            <FaComments className="text-warning" /> Student Reviews & Moderation
          </h1>
          <p>Review verified student feedback, star ratings, and toggle visibility on the live website.</p>
        </div>
      </div>

      {/* 4 Metric Stats Cards */}
      <div className="lms-stats-grid">
        <div className="lms-stat-card">
          <div className="lms-stat-icon orange">
            <FaComments />
          </div>
          <div className="lms-stat-info">
            <h3>{totalReviews}</h3>
            <span>Total Reviews</span>
          </div>
        </div>

        <div className="lms-stat-card">
          <div className="lms-stat-icon green">
            <FaCheckCircle />
          </div>
          <div className="lms-stat-info">
            <h3>{approvedReviews}</h3>
            <span>Approved & Live</span>
          </div>
        </div>

        <div className="lms-stat-card">
          <div className="lms-stat-icon purple">
            <FaEyeSlash />
          </div>
          <div className="lms-stat-info">
            <h3>{hiddenReviews}</h3>
            <span>Hidden / Pending</span>
          </div>
        </div>

        <div className="lms-stat-card">
          <div className="lms-stat-icon blue">
            <FaStar />
          </div>
          <div className="lms-stat-info">
            <h3>{avgRating} ★</h3>
            <span>Average Star Rating</span>
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="lms-toolbar">
        <div className="lms-search-box">
          <FaSearch className="text-muted" />
          <input 
            type="text"
            placeholder="Search by student name, course, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="lms-filter-pills">
          <button 
            className={`lms-pill-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All Reviews ({totalReviews})
          </button>
          <button 
            className={`lms-pill-btn ${filterStatus === 'approved' ? 'active' : ''}`}
            onClick={() => setFilterStatus('approved')}
          >
            Live ({approvedReviews})
          </button>
          <button 
            className={`lms-pill-btn ${filterStatus === 'hidden' ? 'active' : ''}`}
            onClick={() => setFilterStatus('hidden')}
          >
            Hidden ({hiddenReviews})
          </button>
          <button 
            className={`lms-pill-btn ${filterStatus === '5star' ? 'active' : ''}`}
            onClick={() => setFilterStatus('5star')}
          >
            5 Stars Only
          </button>
        </div>
      </div>

      {/* Main Reviews Table */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status" />
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="lms-empty-state">
          <div className="lms-empty-icon">
            <FaComments />
          </div>
          <h3>No Reviews Found</h3>
          <p>Student ratings and reviews submitted from course completion milestones will appear here.</p>
        </div>
      ) : (
        <div className="lms-module-card">
          <div className="lms-table-responsive">
            <table className="lms-modern-table">
              <thead>
                <tr>
                  <th style={{ minWidth: 200 }}>Student Info</th>
                  <th style={{ minWidth: 220 }}>Course Name</th>
                  <th style={{ minWidth: 140, whiteSpace: "nowrap" }}>Rating</th>
                  <th style={{ minWidth: 240, maxWidth: 380 }}>Review Message</th>
                  <th style={{ minWidth: 110, whiteSpace: "nowrap" }}>Date</th>
                  <th style={{ minWidth: 130, whiteSpace: "nowrap" }}>Status</th>
                  <th style={{ width: 110, minWidth: 110, textAlign: "right", whiteSpace: "nowrap" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map((r) => (
                  <tr key={r.ReviewID}>
                    <td>
                      <div className="lms-student-cell">
                        <div className="lms-student-avatar">
                          {(r.UserName || "U").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="lms-table-title" style={{ fontSize: 14 }}>{r.UserName || "Student"}</div>
                          <small className="lms-table-subtitle d-flex align-items-center gap-1">
                            <FaShieldAlt className="text-success" size={11} /> Verified Learner
                          </small>
                        </div>
                      </div>
                    </td>

                    <td>
                      <strong className="lms-table-title">{r.CourseTitle || `Course #${r.CourseID}`}</strong>
                      <span className="lms-tag-badge ms-2">{r.CourseType || 'online'}</span>
                    </td>

                    <td>
                      <div className="lms-rating-stars-wrap">
                        {[...Array(r.Rating || 5)].map((_, i) => (
                          <FaStar key={i} size={14} />
                        ))}
                        <span className="lms-rating-score">({r.Rating})</span>
                      </div>
                    </td>

                    <td style={{ maxWidth: 380 }}>
                      <p className="m-0 small" style={{ lineHeight: 1.5, color: "var(--lms-text-body)" }}>
                        "{r.ReviewText}"
                      </p>
                    </td>

                    <td>
                      <span style={{ color: "var(--lms-text-muted)", fontSize: 13, whiteSpace: "nowrap" }}>
                        {new Date(r.CreatedAt).toLocaleDateString()}
                      </span>
                    </td>

                    <td>
                      {r.IsApproved ? (
                        <span className="badge-status active">
                          <FaEye size={10} /> Live on Site
                        </span>
                      ) : (
                        <span className="badge-status inactive">
                          <FaEyeSlash size={10} /> Hidden
                        </span>
                      )}
                    </td>

                    <td style={{ textAlign: "right" }}>
                      <div className="lms-table-actions">
                        <button 
                          className={`action-icon-btn ${r.IsApproved ? 'danger' : 'success'}`}
                          onClick={() => handleToggle(r.ReviewID)}
                          title={r.IsApproved ? "Hide from website" : "Approve and publish"}
                        >
                          {r.IsApproved ? <FaEyeSlash /> : <FaCheck />}
                        </button>
                        <button 
                          className="action-icon-btn danger"
                          onClick={() => handleDelete(r.ReviewID)}
                          title="Delete review"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageLMSReviews;
