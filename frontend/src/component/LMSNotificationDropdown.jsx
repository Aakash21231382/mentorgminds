import React, { useState, useEffect, useRef } from "react";
import { FaBell, FaCheckCircle, FaVideo, FaAward, FaInfoCircle, FaCheck } from "react-icons/fa";
import { Link } from "react-router-dom";
import { lmsApi } from "../api/lmsApi";

const LMSNotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Polling every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await lmsApi.getNotifications();
      if (res.success) {
        setNotifications(res.notifications || []);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (e) {}
  };

  const handleMarkAsRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await lmsApi.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.NotificationID === id ? { ...n, IsRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {}
  };

  const getIcon = (type) => {
    switch (type) {
      case "live": return <FaVideo color="#EF4444" />;
      case "grade": return <FaAward color="#F59E0B" />;
      case "success": return <FaCheckCircle color="#10B981" />;
      default: return <FaInfoCircle color="#3B82F6" />;
    }
  };

  return (
    <div className="position-relative d-inline-block" ref={dropdownRef} style={{ marginRight: 12 }}>
      {/* Bell Button */}
      <button 
        type="button"
        className="btn d-flex align-items-center justify-content-center position-relative"
        style={{ 
          width: 40, 
          height: 40, 
          borderRadius: "50%", 
          background: isOpen ? "#FFF5EB" : "#F8FAFC", 
          border: "1px solid #E2E8F0",
          color: isOpen ? "#FF6E06" : "#64748B",
          cursor: "pointer"
        }}
        onClick={() => setIsOpen(!isOpen)}
        title="Notifications"
      >
        <FaBell size={16} />
        {unreadCount > 0 && (
          <span 
            className="position-absolute translate-middle badge rounded-pill bg-danger"
            style={{ top: 6, right: -4, fontSize: 10, padding: "3px 6px" }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="shadow-lg border-0 rounded-4 overflow-hidden position-absolute end-0 mt-2 bg-white"
          style={{ width: 340, zIndex: 1100, border: "1px solid #E2E8F0" }}
        >
          <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light">
            <h6 className="m-0 fw-bold text-dark">Notifications</h6>
            <span className="badge bg-warning text-dark">{unreadCount} New</span>
          </div>

          <div style={{ maxHeight: 340, overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted small">
                No notifications right now.
              </div>
            ) : (
              notifications.map(n => (
                <Link
                  key={n.NotificationID}
                  to={n.LinkURL || "#"}
                  onClick={() => {
                    handleMarkAsRead(n.NotificationID);
                    setIsOpen(false);
                  }}
                  className={`p-3 d-flex align-items-start gap-3 border-bottom text-decoration-none ${n.IsRead ? 'bg-white' : 'bg-light'}`}
                >
                  <div className="mt-1 fs-5 flex-shrink-0">
                    {getIcon(n.Type)}
                  </div>
                  <div className="flex-grow-1">
                    <strong className="d-block text-dark small">{n.Title}</strong>
                    <p className="m-0 text-muted" style={{ fontSize: 12, lineHeight: 1.4 }}>{n.Message}</p>
                    <small className="text-secondary" style={{ fontSize: 10 }}>
                      {new Date(n.CreatedAt).toLocaleDateString()}
                    </small>
                  </div>
                  {!n.IsRead && (
                    <button 
                      className="btn btn-sm btn-link p-0 text-muted"
                      onClick={(e) => handleMarkAsRead(n.NotificationID, e)}
                      title="Mark as read"
                    >
                      <FaCheck size={11} />
                    </button>
                  )}
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LMSNotificationDropdown;
