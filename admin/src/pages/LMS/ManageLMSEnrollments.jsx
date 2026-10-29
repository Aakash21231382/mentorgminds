import React, { useState, useEffect } from "react";
import { 
  FaGraduationCap, 
  FaReceipt, 
  FaCheckCircle, 
  FaClock, 
  FaUser, 
  FaSearch,
  FaRupeeSign,
  FaAward,
  FaUsers
} from "react-icons/fa";
import { lmsAdminApi } from "../../api/lmsAdminApi";
import "../../assets/css/lms-admin.css";

const ManageLMSEnrollments = () => {
  const [activeTab, setActiveTab] = useState("enrollments"); // 'enrollments' | 'orders'
  const [enrollments, setEnrollments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [enrollRes, orderRes] = await Promise.allSettled([
        lmsAdminApi.getAllEnrollments(),
        lmsAdminApi.getAllOrders()
      ]);

      if (enrollRes.status === "fulfilled" && enrollRes.value.success) {
        setEnrollments(enrollRes.value.enrollments || []);
      }
      if (orderRes.status === "fulfilled" && orderRes.value.success) {
        setOrders(orderRes.value.orders || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Metrics
  const totalEnrollments = enrollments.length;
  const completedLearners = enrollments.filter(e => (e.ProgressPercent || 0) >= 100).length;
  const inProgressLearners = totalEnrollments - completedLearners;
  const totalRevenue = orders.reduce((acc, o) => acc + (o.FinalPrice || 0), 0);

  const filteredEnrollments = enrollments.filter(e => 
    (e.StudentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (e.StudentEmail || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (e.CourseTitle || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrders = orders.filter(o => 
    (o.StudentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (o.StudentEmail || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (o.OrderNumber || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="lms-admin-container">
      
      {/* Header */}
      <div className="lms-page-header">
        <div className="lms-header-title-box">
          <h1>
            <FaGraduationCap className="text-warning" /> Student Enrollments & Orders
          </h1>
          <p>Track student subscriptions, learning progress %, completion status, and revenue transactions.</p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button 
            className={activeTab === 'enrollments' ? 'btn-lms-action' : 'btn-lms-secondary'}
            onClick={() => setActiveTab("enrollments")}
          >
            <FaGraduationCap /> Enrollments ({enrollments.length})
          </button>
          <button 
            className={activeTab === 'orders' ? 'btn-lms-action' : 'btn-lms-secondary'}
            onClick={() => setActiveTab("orders")}
          >
            <FaReceipt /> Orders ({orders.length})
          </button>
        </div>
      </div>

      {/* 4 Metric Stats Cards */}
      <div className="lms-stats-grid">
        <div className="lms-stat-card">
          <div className="lms-stat-icon orange">
            <FaUsers />
          </div>
          <div className="lms-stat-info">
            <h3>{totalEnrollments}</h3>
            <span>Total Enrolled</span>
          </div>
        </div>

        <div className="lms-stat-card">
          <div className="lms-stat-icon blue">
            <FaClock />
          </div>
          <div className="lms-stat-info">
            <h3>{inProgressLearners}</h3>
            <span>Active Learners</span>
          </div>
        </div>

        <div className="lms-stat-card">
          <div className="lms-stat-icon green">
            <FaAward />
          </div>
          <div className="lms-stat-info">
            <h3>{completedLearners}</h3>
            <span>Certified Alumni</span>
          </div>
        </div>

        <div className="lms-stat-card">
          <div className="lms-stat-icon purple">
            <FaRupeeSign />
          </div>
          <div className="lms-stat-info">
            <h3>₹{totalRevenue.toLocaleString('en-IN')}</h3>
            <span>Total Revenue</span>
          </div>
        </div>
      </div>

      {/* Toolbar Search */}
      <div className="lms-toolbar">
        <div className="lms-search-box">
          <FaSearch className="text-muted" />
          <input 
            type="text"
            placeholder={activeTab === 'enrollments' ? "Search student, email, or course..." : "Search by order #, student or email..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <span className="text-muted small fw-semibold">
          Showing {activeTab === 'enrollments' ? filteredEnrollments.length : filteredOrders.length} Records
        </span>
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status" />
        </div>
      ) : activeTab === "enrollments" ? (
        <div className="lms-module-card">
          <div className="lms-table-responsive">
            <table className="lms-modern-table">
              <thead>
                <tr>
                  <th>Student Profile</th>
                  <th>Course Enrolled</th>
                  <th style={{ width: 220 }}>Progress</th>
                  <th>Lectures Done</th>
                  <th>Status</th>
                  <th>Enrolled On</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnrollments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">No student enrollments found.</td>
                  </tr>
                ) : (
                  filteredEnrollments.map((enr) => (
                    <tr key={enr.EnrollmentID}>
                      <td>
                        <div className="lms-student-cell">
                          <div className="lms-student-avatar">
                            {(enr.StudentName || "S").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="lms-table-title">{enr.StudentName || "Student"}</div>
                            <small className="lms-table-subtitle">{enr.StudentEmail || "No email"}</small>
                          </div>
                        </div>
                      </td>

                      <td>
                        <strong className="lms-table-title">{enr.CourseTitle || `Course #${enr.CourseID}`}</strong>
                        <span className="lms-tag-badge" style={{ marginLeft: 8 }}>{enr.CourseType}</span>
                      </td>

                      <td>
                        <div className="lms-progress-wrap">
                          <div className="lms-progress-track">
                            <div 
                              className={`lms-progress-fill ${(enr.ProgressPercent || 0) >= 100 ? 'completed' : ''}`}
                              style={{ width: `${Math.min(100, Math.max(0, enr.ProgressPercent || 0))}%` }}
                            />
                          </div>
                          <span className="lms-progress-text">{Math.round(enr.ProgressPercent || 0)}%</span>
                        </div>
                      </td>

                      <td>
                        <span className="lms-table-title">{enr.CompletedLessons || 0}</span>
                        <span style={{ color: "var(--lms-text-muted)" }}> / {enr.TotalLessons || 0}</span>
                      </td>

                      <td>
                        {(enr.ProgressPercent || 0) >= 100 ? (
                          <span className="badge-status active">
                            <FaCheckCircle size={10} /> Completed
                          </span>
                        ) : (
                          <span className="badge-status free-preview">
                            <FaClock size={10} /> In Progress
                          </span>
                        )}
                      </td>

                      <td>
                        <span style={{ color: "var(--lms-text-muted)", fontSize: 13 }}>
                          {new Date(enr.EnrolledAt).toLocaleDateString()}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="lms-module-card">
          <div className="lms-table-responsive">
            <table className="lms-modern-table">
              <thead>
                <tr>
                  <th>Order Number</th>
                  <th>Customer Info</th>
                  <th>Course Title</th>
                  <th>Original Price</th>
                  <th>Final Amount</th>
                  <th>Payment Mode</th>
                  <th>Status</th>
                  <th>Transaction Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5 text-muted">No orders found.</td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr key={ord.OrderID}>
                      <td>
                        <strong style={{ color: "#3B82F6" }}>{ord.OrderNumber}</strong>
                      </td>

                      <td>
                        <div className="lms-table-title">{ord.StudentName || "User"}</div>
                        <small className="lms-table-subtitle">{ord.StudentEmail}</small>
                      </td>

                      <td>
                        <span className="lms-table-title">{ord.CourseTitle}</span>
                      </td>

                      <td style={{ color: "var(--lms-text-muted)", textDecoration: "line-through" }}>
                        ₹{ord.OriginalPrice}
                      </td>

                      <td>
                        <strong style={{ color: "#10B981", fontSize: 15 }}>₹{ord.FinalPrice}</strong>
                      </td>

                      <td>
                        <span className="lms-tag-badge">
                          {ord.PaymentMethod.toUpperCase()}
                        </span>
                      </td>

                      <td>
                        <span className="badge-status active">
                          <FaCheckCircle size={10} /> PAID
                        </span>
                      </td>

                      <td>
                        <span style={{ color: "var(--lms-text-muted)", fontSize: 13 }}>
                          {new Date(ord.CreatedAt).toLocaleDateString()}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageLMSEnrollments;
