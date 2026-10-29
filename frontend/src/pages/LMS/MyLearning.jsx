import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaBookOpen, 
  FaTrophy, 
  FaClock, 
  FaPlayCircle, 
  FaCheckCircle, 
  FaCertificate, 
  FaReceipt, 
  FaArrowRight, 
  FaGraduationCap,
  FaFire,
  FaVideo,
  FaBriefcase,
  FaMedal,
  FaBuilding,
  FaMapMarkerAlt,
  FaCoins,
  FaExternalLinkAlt,
  FaCheck
} from "react-icons/fa";
import { lmsApi } from "../../api/lmsApi";
import T from "../../context/T";
import "../../assets/css/lms/MyLearning.css";
import { toast } from "react-toastify";

const MyLearning = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("inprogress"); // 'inprogress' | 'completed' | 'live' | 'leaderboard' | 'jobs' | 'orders'
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [userData, setUserData] = useState({});

  // Enterprise LMS states
  const [xpStats, setXpStats] = useState({ TotalXP: 250, DailyStreak: 3, TierBadge: "Silver" });
  const [liveClasses, setLiveClasses] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applyingJobId, setApplyingJobId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("Please login to access your courses.");
      navigate("/login");
      return;
    }

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUserData(JSON.parse(savedUser));
      } catch (e) {}
    }

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [courseRes, orderRes, xpRes, liveRes, leaderRes, jobsRes] = await Promise.allSettled([
        lmsApi.getMyCourses(),
        lmsApi.getMyOrders(),
        lmsApi.getUserXPStats(),
        lmsApi.getLiveClasses(),
        lmsApi.getLeaderboard(),
        lmsApi.getJobListings()
      ]);

      if (courseRes.status === "fulfilled" && courseRes.value.success) {
        setCourses(courseRes.value.courses || []);
      }
      if (orderRes.status === "fulfilled" && orderRes.value.success) {
        setOrders(orderRes.value.orders || []);
      }
      if (xpRes.status === "fulfilled" && xpRes.value.success) {
        setXpStats(xpRes.value.stats || { TotalXP: 250, DailyStreak: 3, TierBadge: "Silver" });
      }
      if (liveRes.status === "fulfilled" && liveRes.value.success) {
        setLiveClasses(liveRes.value.liveClasses || []);
      }
      if (leaderRes.status === "fulfilled" && leaderRes.value.success) {
        setLeaderboard(leaderRes.value.leaderboard || []);
      }
      if (jobsRes.status === "fulfilled" && jobsRes.value.success) {
        setJobs(jobsRes.value.jobs || []);
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
      toast.error("Failed to load learning dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyJob = async (jobId) => {
    try {
      setApplyingJobId(jobId);
      const res = await lmsApi.applyJob(jobId, {
        phone: userData.phone || "9876543210",
        resumeUrl: "https://example.com/resume.pdf",
        certificateNumber: "MM-CERT-2026-ACTIVE"
      });

      if (res.success) {
        toast.success(res.message || "Application submitted successfully!");
      }
    } catch (e) {
      toast.error("Application submission failed.");
    } finally {
      setApplyingJobId(null);
    }
  };

  const inProgressCourses = courses.filter(c => (c.ProgressPercent || 0) < 100);
  const completedCourses = courses.filter(c => (c.ProgressPercent || 0) >= 100);
  const totalCertificates = courses.filter(c => c.CertificateNumber).length;
  const upcomingLive = liveClasses[0];

  return (
    <div className="mylearning-page container">
      
      {/* Header Banner */}
      <div className="mylearning-header">
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
          <div className="mylearning-welcome">
            <h1>
              <T>Welcome back,</T> <span>{userData.full_name || "Student"}!</span>
            </h1>
            <p>
              <T>Master in-demand skills, build real projects, and earn industry certifications.</T>
            </p>
          </div>

          <div className="d-flex gap-2 align-items-center">
            <span className="streak-fire-badge">
              <FaFire /> {xpStats.DailyStreak || 3} Day Streak 🔥
            </span>
            <span className="badge bg-warning text-dark px-3 py-2 fw-bold rounded-pill">
              ⭐ {xpStats.TotalXP || 250} XP &bull; {xpStats.TierBadge || "Silver"}
            </span>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="mylearning-stats-grid">
          <div className="mylearning-stat-card">
            <div className="stat-icon-box">
              <FaBookOpen />
            </div>
            <div className="stat-info">
              <h3>{inProgressCourses.length}</h3>
              <span><T>Active Courses</T></span>
            </div>
          </div>

          <div className="mylearning-stat-card">
            <div className="stat-icon-box">
              <FaTrophy />
            </div>
            <div className="stat-info">
              <h3>{completedCourses.length}</h3>
              <span><T>Completed</T></span>
            </div>
          </div>

          <div className="mylearning-stat-card">
            <div className="stat-icon-box">
              <FaCertificate />
            </div>
            <div className="stat-info">
              <h3>{totalCertificates}</h3>
              <span><T>Certificates Earned</T></span>
            </div>
          </div>

          <div className="mylearning-stat-card">
            <div className="stat-icon-box">
              <FaReceipt />
            </div>
            <div className="stat-info">
              <h3>{orders.length}</h3>
              <span><T>Order Invoices</T></span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Class Notification Banner */}
      {upcomingLive && (
        <div className="live-class-banner">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="live-dot-pulse" />
              <span className="text-warning fw-bold small text-uppercase">Live Masterclass Scheduled</span>
            </div>
            <h4 className="m-0 fw-bold">
              {upcomingLive.Title ? upcomingLive.Title.replace(/^[?]+\s*/, '🔥 ') : "Live Masterclass"}
            </h4>
            <p className="m-0 text-white-50 small mt-1">
              Instructor: <strong>{upcomingLive.InstructorName}</strong> &bull; {new Date(upcomingLive.ScheduledStartTime).toLocaleString()}
            </p>
          </div>

          <a 
            href={upcomingLive.MeetingURL || "#"} 
            target="_blank" 
            rel="noreferrer" 
            className="btn-join-live"
          >
            <FaVideo /> Join Live Session
          </a>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="mylearning-tabs">
        <button 
          className={`tab-btn ${activeTab === "inprogress" ? "active" : ""}`}
          onClick={() => setActiveTab("inprogress")}
        >
          <FaPlayCircle /> <T>In Progress</T> 
          <span className="tab-count-badge">{inProgressCourses.length}</span>
        </button>

        <button 
          className={`tab-btn ${activeTab === "completed" ? "active" : ""}`}
          onClick={() => setActiveTab("completed")}
        >
          <FaCheckCircle /> <T>Completed & Certificates</T> 
          <span className="tab-count-badge">{completedCourses.length}</span>
        </button>

        <button 
          className={`tab-btn ${activeTab === "leaderboard" ? "active" : ""}`}
          onClick={() => setActiveTab("leaderboard")}
        >
          <FaMedal /> <T>Cohort Leaderboard</T>
        </button>

        <button 
          className={`tab-btn ${activeTab === "jobs" ? "active" : ""}`}
          onClick={() => setActiveTab("jobs")}
        >
          <FaBriefcase /> <T>Jobs & Placement Portal</T> 
          <span className="tab-count-badge">{jobs.length}</span>
        </button>

        <button 
          className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          <FaReceipt /> <T>Orders & Receipts</T> 
          <span className="tab-count-badge">{orders.length}</span>
        </button>
      </div>

      {/* Tab 1: In Progress */}
      {activeTab === "inprogress" && (
        <div className="mylearning-courses-grid">
          {inProgressCourses.length === 0 ? (
            <div className="mylearning-empty">
              <FaGraduationCap className="empty-icon" />
              <h3><T>No courses in progress</T></h3>
              <p><T>Explore our verified curriculum and start learning today!</T></p>
              <Link to="/courses" className="btn-explore">
                <T>Explore Programs</T>
              </Link>
            </div>
          ) : (
            inProgressCourses.map((c) => {
              const pct = Math.min(100, Math.max(0, c.ProgressPercent || 0));
              const courseUrl = `/learn/${c.CourseID}`;

              return (
                <div key={c.EnrollmentID} className="mylearning-card">
                  <div className="card-thumb-wrap">
                    <img 
                      src={c.CourseImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"} 
                      alt={c.CourseTitle} 
                      className="card-thumb-img"
                    />
                    <span className="card-tag"><T>Online</T></span>
                  </div>

                  <div className="card-body-content">
                    <h3 className="card-course-title">{c.CourseTitle}</h3>

                    <div className="card-progress-section">
                      <div className="progress-label-row">
                        <span><T>Progress</T></span>
                        <strong>{Math.round(pct)}%</strong>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="lessons-completed-text">
                        {c.CompletedLessons || 0} / {c.TotalLessons || 6} <T>Lectures Completed</T>
                      </span>
                    </div>

                    <Link to={courseUrl} className="btn-continue-learning">
                      <FaPlayCircle /> <T>Resume Learning</T>
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Completed & Certificates */}
      {activeTab === "completed" && (
        <div className="mylearning-courses-grid">
          {completedCourses.length === 0 ? (
            <div className="mylearning-empty">
              <FaTrophy className="empty-icon" />
              <h3><T>No completed programs yet</T></h3>
              <p><T>Finish all modules and assessments in your active courses to unlock official certificates!</T></p>
            </div>
          ) : (
            completedCourses.map((c) => (
              <div key={c.EnrollmentID} className="mylearning-card completed">
                <div className="card-thumb-wrap">
                  <img 
                    src={c.CourseImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"} 
                    alt={c.CourseTitle} 
                    className="card-thumb-img"
                  />
                  <span className="card-tag completed"><T>Completed</T></span>
                </div>

                <div className="card-body-content">
                  <h3 className="card-course-title">{c.CourseTitle}</h3>
                  <div className="completed-badge-box">
                    <FaCheckCircle className="text-success" />
                    <span><T>Course 100% Completed</T></span>
                  </div>

                  <div className="completed-action-row">
                    <Link to={`/learn/${c.CourseID}`} className="btn-review-course">
                      <T>Review Classroom</T>
                    </Link>

                    {c.CertificateNumber ? (
                      <Link 
                        to={`/verify-certificate/${c.CertificateNumber}`} 
                        className="btn-view-cert"
                      >
                        <FaCertificate /> <T>Certificate</T>
                      </Link>
                    ) : (
                      <Link to={`/learn/${c.CourseID}`} className="btn-view-cert">
                        <FaCertificate /> <T>Claim Certificate</T>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Weekly Cohort Leaderboard */}
      {activeTab === "leaderboard" && (
        <div className="leaderboard-table-card p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 className="fw-bold m-0 text-dark">🏆 Weekly Cohort Leaderboard</h3>
              <p className="text-muted small m-0">Top learners earning XP by completing video lectures, quizzes, and projects.</p>
            </div>
            <span className="badge bg-primary px-3 py-2">Updated Live</span>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th style={{ width: 80 }}>Rank</th>
                  <th>Student</th>
                  <th>Streak</th>
                  <th>Tier Badge</th>
                  <th className="text-end">Total XP</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((u, idx) => (
                  <tr key={u.UserID || idx} className={idx < 3 ? "fw-bold" : ""}>
                    <td>
                      {idx === 0 && <span className="rank-badge-gold">🥇 #1</span>}
                      {idx === 1 && <span className="rank-badge-silver">🥈 #2</span>}
                      {idx === 2 && <span className="rank-badge-bronze">🥉 #3</span>}
                      {idx > 2 && <span className="text-muted fw-bold">#{idx + 1}</span>}
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div 
                          className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center"
                          style={{ width: 34, height: 34, fontSize: 13 }}
                        >
                          {(u.UserName || "Student")[0]}
                        </div>
                        <span>{u.UserName || "Student"}</span>
                      </div>
                    </td>
                    <td>
                      <span className="text-danger fw-bold">🔥 {u.DailyStreak} Days</span>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">{u.TierBadge}</span>
                    </td>
                    <td className="text-end text-primary fw-bold">
                      ⭐ {u.TotalXP} XP
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Jobs & Placement Portal */}
      {activeTab === "jobs" && (
        <div className="row g-4">
          {jobs.length === 0 ? (
            <div className="mylearning-empty">
              <FaBriefcase className="empty-icon" />
              <h3>No jobs posted right now</h3>
            </div>
          ) : (
            jobs.map(job => (
              <div key={job.JobID} className="col-lg-6">
                <div className="job-card">
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <span className="text-muted small fw-bold d-flex align-items-center gap-1">
                          <FaBuilding /> {job.Company}
                        </span>
                        <h4 className="fw-bold text-dark mt-1 mb-1">{job.RoleTitle}</h4>
                      </div>
                      <span className="job-package-tag">
                        {(job.SalaryPackage || "").replace(/\?/g, "₹")}
                      </span>
                    </div>

                    <div className="d-flex gap-3 text-secondary small mb-3">
                      <span><FaMapMarkerAlt /> {job.Location}</span>
                      <span>&bull; {job.JobType}</span>
                      <span>&bull; Exp: {job.Experience}</span>
                    </div>

                    <p className="text-muted small mb-3" style={{ lineHeight: 1.5 }}>
                      {job.Description}
                    </p>

                    <div className="p-2 bg-light rounded text-dark small mb-3">
                      <strong>Requirements:</strong> {job.Requirements}
                    </div>
                  </div>

                  <button 
                    className="btn btn-warning w-100 fw-bold d-flex align-items-center justify-content-center gap-2"
                    onClick={() => handleApplyJob(job.JobID)}
                    disabled={applyingJobId === job.JobID}
                  >
                    <FaCheck /> {applyingJobId === job.JobID ? "Submitting..." : "Apply with Mentoring Minds Certificate"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 5: Orders & Receipts */}
      {activeTab === "orders" && (
        <div className="mylearning-orders-wrapper">
          {orders.length === 0 ? (
            <div className="mylearning-empty">
              <FaReceipt className="empty-icon" />
              <h3><T>No order receipts</T></h3>
              <p><T>All your enrollment payment invoices will be recorded here.</T></p>
            </div>
          ) : (
            <div className="orders-table-card">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th><T>Order #</T></th>
                    <th><T>Course Program</T></th>
                    <th><T>Amount</T></th>
                    <th><T>Discount</T></th>
                    <th><T>Final Paid</T></th>
                    <th><T>Status</T></th>
                    <th><T>Date</T></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.OrderID}>
                      <td><span className="order-num-badge">{o.OrderNumber}</span></td>
                      <td><strong>{o.CourseTitle}</strong></td>
                      <td>₹{o.OriginalPrice}</td>
                      <td className="text-success">-₹{o.DiscountAmount}</td>
                      <td><strong className="text-primary">₹{o.FinalPrice}</strong></td>
                      <td>
                        <span className={`status-pill ${o.PaymentStatus}`}>
                          {o.PaymentStatus}
                        </span>
                      </td>
                      <td>{new Date(o.CreatedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default MyLearning;
