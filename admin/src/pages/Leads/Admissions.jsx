import React, { useState, useEffect } from "react";
import {
  FaGraduationCap, FaCheck, FaEnvelope, FaPhone, FaCalendarAlt,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { adminLeadsApi } from "../../api/adminApi";
import PageLoader from "../../components/PageLoader";
import "../../assets/css/Admissions.css";

const STATUS_COLORS = {
  New:       { bg: "#fffaf0", color: "#F6881F" },
  Contacted: { bg: "#ebf8ff", color: "#2b6cb0" },
  Enrolled:  { bg: "#f0fff4", color: "#38a169" },
  Rejected:  { bg: "#fff5f5", color: "#e53e3e" },
};

const Admissions = () => {
  const [admissions,   setAdmissions]   = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [unreadCount,  setUnreadCount]  = useState(0);
  const [filter,       setFilter]       = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const data = await adminLeadsApi.getAdmissions();
      if (data.success) {
        setAdmissions(data.admissions || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error("Fetch admissions error:", err);
      toast.error("Failed to load admissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAdmissions(); }, []);

  const markRead = async (id) => {
    try {
      await adminLeadsApi.markAdmissionRead(id);
      setAdmissions((prev) =>
        prev.map((a) => (a.Id === id ? { ...a, IsRead: true } : a))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Mark read error:", err);
      toast.error("Could not mark as read");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await adminLeadsApi.updateAdmissionStatus(id, status);
      setAdmissions((prev) =>
        prev.map((a) => (a.Id === id ? { ...a, Status: status } : a))
      );
    } catch (err) {
      console.error("Update status error:", err);
      toast.error("Could not update status");
    }
  };

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleString("en-IN", {
          day: "2-digit", month: "short", year: "numeric",
          hour: "2-digit", minute: "2-digit",
        })
      : "—";

  const filtered = admissions.filter((a) => {
    const readMatch =
      filter === "unread" ? !a.IsRead
      : filter === "read"  ?  a.IsRead
      : true;
    const statusMatch = statusFilter === "all" ? true : a.Status === statusFilter;
    return readMatch && statusMatch;
  });

  const statusOptions = ["New", "Contacted", "Enrolled", "Rejected"];

  if (loading) return <PageLoader message="Loading admissions..." />;

  return (
    <div className="adm-page">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Page Header */}
      <div className="adm-page-header">
        <div className="adm-title-row">
          <div className="adm-title-group">
            <div className="adm-icon-box"><FaGraduationCap /></div>
            <div>
              <h1 className="adm-page-title">Admission Applications</h1>
              <p className="adm-page-subtitle">Manage "Apply Now" form submissions</p>
            </div>
          </div>
          {unreadCount > 0 && (
            <span className="adm-unread-badge">{unreadCount} unread</span>
          )}
        </div>

        <div className="adm-toolbar">
          {/* Read filter */}
          <div className="adm-filter-group">
            {["all", "unread", "read"].map((f) => (
              <button
                key={f}
                className={`adm-filter-btn${filter === f ? " adm-filter-btn--active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          {/* Status filter */}
          <div className="adm-filter-group">
            {["all", ...statusOptions].map((st) => (
              <button
                key={st}
                className={`adm-filter-btn-sm${statusFilter === st ? " adm-filter-btn-sm--active" : ""}`}
                onClick={() => setStatusFilter(st)}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="adm-stats-bar">
        {statusOptions.map((st) => {
          const count  = admissions.filter((a) => a.Status === st).length;
          const colors = STATUS_COLORS[st] || {};
          return (
            <div key={st} className="adm-stat-card" style={{ background: colors.bg }}>
              <span className="adm-stat-label" style={{ color: colors.color }}>{st}</span>
              <span className="adm-stat-count" style={{ color: colors.color }}>{count}</span>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="adm-card">
        {filtered.length === 0 ? (
          <div className="adm-empty">
            <FaGraduationCap className="adm-empty-icon" />
            <p>No applications found</p>
          </div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  {["#", "Name", "Email", "Phone", "Course", "Qualification", "Experience", "City", "Status", "Date", "Read", "Action"].map(
                    (h) => <th key={h}>{h}</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((adm, idx) => (
                  <tr
                    key={adm.Id}
                    className={`adm-tr${!adm.IsRead ? " adm-tr--unread" : ""}`}
                  >
                    <td className="adm-td">{idx + 1}</td>
                    <td className={`adm-td${!adm.IsRead ? " adm-td--bold" : ""}`}>{adm.FullName}</td>
                    <td className="adm-td">
                      <a href={`mailto:${adm.Email}`} className="adm-link">
                        <FaEnvelope />{adm.Email}
                      </a>
                    </td>
                    <td className="adm-td">
                      <a href={`tel:${adm.Phone}`} className="adm-link">
                        <FaPhone />{adm.Phone}
                      </a>
                    </td>
                    <td className="adm-td">
                      <span className="adm-course-tag">{adm.CourseInterest}</span>
                    </td>
                    <td className="adm-td">{adm.Qualification || <span className="adm-muted">—</span>}</td>
                    <td className="adm-td">{adm.WorkExperience || <span className="adm-muted">—</span>}</td>
                    <td className="adm-td">{adm.City || <span className="adm-muted">—</span>}</td>
                    <td className="adm-td">
                      <select
                        value={adm.Status}
                        onChange={(e) => updateStatus(adm.Id, e.target.value)}
                        className="adm-status-select"
                        style={{
                          background: STATUS_COLORS[adm.Status]?.bg || "#f7fafc",
                          color:      STATUS_COLORS[adm.Status]?.color || "#2d3748",
                        }}
                      >
                        {statusOptions.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </td>
                    <td className="adm-td">
                      <span className="adm-date-cell">
                        <FaCalendarAlt className="adm-date-icon" />
                        {formatDate(adm.CreatedAt)}
                      </span>
                    </td>
                    <td className="adm-td">
                      <span className={adm.IsRead ? "adm-status-read" : "adm-status-unread"}>
                        {adm.IsRead ? "Read" : "New"}
                      </span>
                    </td>
                    <td className="adm-td">
                      {!adm.IsRead && (
                        <button className="adm-action-btn" onClick={() => markRead(adm.Id)} title="Mark as read">
                          <FaCheck />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admissions;
