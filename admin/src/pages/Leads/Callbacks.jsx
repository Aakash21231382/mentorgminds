import React, { useState, useEffect } from "react";
import {
  FaPhone, FaCheckDouble, FaCheck, FaEnvelope, FaCalendarAlt,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { adminLeadsApi } from "../../api/adminApi";
import PageLoader from "../../components/PageLoader";
import "../../assets/css/Callbacks.css";

const Callbacks = () => {
  const [callbacks,   setCallbacks]   = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter,      setFilter]      = useState("all");

  const fetchCallbacks = async () => {
    setLoading(true);
    try {
      const data = await adminLeadsApi.getCallbacks();
      if (data.success) {
        setCallbacks(data.callbacks || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error("Fetch callbacks error:", err);
      toast.error("Failed to load callbacks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCallbacks(); }, []);

  const markRead = async (id) => {
    try {
      await adminLeadsApi.markCallbackRead(id);
      setCallbacks((prev) =>
        prev.map((c) => (c.Id === id ? { ...c, IsRead: true } : c))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Mark read error:", err);
      toast.error("Could not mark as read");
    }
  };

  const markAllRead = async () => {
    try {
      await adminLeadsApi.markAllCallbacksRead();
      setCallbacks((prev) => prev.map((c) => ({ ...c, IsRead: true })));
      setUnreadCount(0);
      toast.success("All callbacks marked as read");
    } catch (err) {
      console.error("Mark all read error:", err);
      toast.error("Could not mark all as read");
    }
  };

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleString("en-IN", {
          day: "2-digit", month: "short", year: "numeric",
          hour: "2-digit", minute: "2-digit",
        })
      : "—";

  const filtered = callbacks.filter((c) => {
    if (filter === "unread") return !c.IsRead;
    if (filter === "read")   return  c.IsRead;
    return true;
  });

  if (loading) return <PageLoader message="Loading callbacks..." />;

  return (
    <div className="cb-page">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Page Header */}
      <div className="cb-page-header">
        <div className="cb-title-row">
          <div className="cb-title-group">
            <div className="cb-icon-box"><FaPhone /></div>
            <div>
              <h1 className="cb-page-title">Callback Requests</h1>
              <p className="cb-page-subtitle">Manage "Talk to Expert" enquiries</p>
            </div>
          </div>
          {unreadCount > 0 && (
            <span className="cb-unread-badge">{unreadCount} unread</span>
          )}
        </div>

        <div className="cb-toolbar">
          <div className="cb-filter-group">
            {["all", "unread", "read"].map((f) => (
              <button
                key={f}
                className={`cb-filter-btn${filter === f ? " cb-filter-btn--active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          {unreadCount > 0 && (
            <button className="cb-mark-all-btn" onClick={markAllRead}>
              <FaCheckDouble />
              Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="cb-card">
        {filtered.length === 0 ? (
          <div className="cb-empty">
            <FaPhone className="cb-empty-icon" />
            <p>No callback requests found</p>
          </div>
        ) : (
          <div className="cb-table-wrap">
            <table className="cb-table">
              <thead>
                <tr>
                  {["#", "Name", "Phone", "Email", "Domain", "Message", "Date", "Status", "Action"].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((cb, idx) => (
                  <tr
                    key={cb.Id}
                    className={`cb-tr${!cb.IsRead ? " cb-tr--unread" : ""}`}
                  >
                    <td className="cb-td">{idx + 1}</td>
                    <td className={`cb-td${!cb.IsRead ? " cb-td--bold" : ""}`}>{cb.FullName}</td>
                    <td className="cb-td">
                      <a href={`tel:${cb.Phone}`} className="cb-link">{cb.Phone}</a>
                    </td>
                    <td className="cb-td">
                      {cb.Email ? (
                        <a href={`mailto:${cb.Email}`} className="cb-link">
                          <FaEnvelope />{cb.Email}
                        </a>
                      ) : <span className="cb-muted">—</span>}
                    </td>
                    <td className="cb-td">
                      {cb.Domain
                        ? <span className="cb-domain-tag">{cb.Domain}</span>
                        : <span className="cb-muted">—</span>}
                    </td>
                    <td className="cb-td cb-td--clamp">
                      <span className="cb-msg-clamp">
                        {cb.Message || <span className="cb-muted">—</span>}
                      </span>
                    </td>
                    <td className="cb-td">
                      <span className="cb-date-cell">
                        <FaCalendarAlt className="cb-date-icon" />
                        {formatDate(cb.CreatedAt)}
                      </span>
                    </td>
                    <td className="cb-td">
                      <span className={cb.IsRead ? "cb-status-read" : "cb-status-unread"}>
                        {cb.IsRead ? "Read" : "New"}
                      </span>
                    </td>
                    <td className="cb-td">
                      {!cb.IsRead && (
                        <button className="cb-action-btn" onClick={() => markRead(cb.Id)} title="Mark as read">
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

export default Callbacks;
