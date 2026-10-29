import React, { useContext, useState, useEffect, useRef } from "react";
import {
  FaBars, FaSearch, FaBell, FaUserCircle,
  FaMoon, FaSun, FaChevronDown, FaSignOutAlt,
  FaPhone, FaGraduationCap, FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import "../assets/css/header.css";
import { API_BASE_URL } from "../config/api";
import { adminLogoutApi } from "../api/adminApi";

const BACKEND = API_BASE_URL.replace(/\/api$/, "");

const Header = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { adminUser, logout } = useAuth();
  const navigate = useNavigate();

  const [showDropdown,  setShowDropdown]  = useState(false);
  const [unreadCount,   setUnreadCount]   = useState(0);
  const [showBell,      setShowBell]      = useState(false);
  const [activeTab,     setActiveTab]     = useState("callbacks");
  const [callbacks,     setCallbacks]     = useState([]);
  const [admissions,    setAdmissions]    = useState([]);
  const [loadingBell,   setLoadingBell]   = useState(false);

  const profileRef = useRef(null);
  const bellRef    = useRef(null);

  const getToken = () => localStorage.getItem("adminToken");

  // ── Fetch unread count ─────────────────────────────────────
  const fetchUnreadCount = async () => {
    try {
      const token = getToken();
      if (!token) return;
      const res  = await fetch(`${BACKEND}/api/leads/unread-count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setUnreadCount(data.total || 0);
    } catch {
      // silently ignore
    }
  };

  // ── Fetch bell dropdown data ───────────────────────────────
  const fetchBellData = async () => {
    setLoadingBell(true);
    try {
      const token = getToken();
      if (!token) return;
      const [cbRes, admRes] = await Promise.all([
        fetch(`${BACKEND}/api/leads/callbacks`,  { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${BACKEND}/api/leads/admissions`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const cbData  = await cbRes.json();
      const admData = await admRes.json();
      if (cbData.success)  setCallbacks(cbData.callbacks?.filter(c => !c.IsRead).slice(0, 8) || []);
      if (admData.success) setAdmissions(admData.admissions?.filter(a => !a.IsRead).slice(0, 8) || []);
    } catch {
      // silently ignore
    } finally {
      setLoadingBell(false);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // ── Click outside handlers ─────────────────────────────────
  useEffect(() => {
    const h = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setShowDropdown(false);
      if (bellRef.current && !bellRef.current.contains(e.target))
        setShowBell(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleLogout = async () => {
    try {
      await adminLogoutApi();
    } catch {
      // API fail ho toh bhi logout karo locally
    } finally {
      logout();
      navigate("/admin/login", { replace: true });
    }
  };

  const handleBellClick = () => {
    const next = !showBell;
    setShowBell(next);
    if (next) fetchBellData();
  };

  const handleMarkCallbackRead = async (id) => {
    try {
      const token = getToken();
      await fetch(`${BACKEND}/api/leads/callbacks/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      setCallbacks((prev) => prev.filter((c) => c.Id !== id));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch { /* ignore */ }
  };

  const handleMarkAdmissionRead = async (id) => {
    try {
      const token = getToken();
      await fetch(`${BACKEND}/api/leads/admissions/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmissions((prev) => prev.filter((a) => a.Id !== id));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch { /* ignore */ }
  };

  const handleNavToCallbacks = () => {
    setShowBell(false);
    navigate("/admin/callbacks");
  };

  const handleNavToAdmissions = () => {
    setShowBell(false);
    navigate("/admin/admissions");
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "";

  return (
    <header className="admin-header">
      {/* Left Section */}
      <div className="header-left">
        <button
          type="button"
          className="mobile-menu-button"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <FaBars />
        </button>
        <div className="header-page-title">
          <h1>Dashboard</h1>
        </div>
      </div>

      {/* Right Section */}
      <div className="header-right">
        {/* Search Bar */}
        <div className="header-search">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search everything..." />
        </div>

        {/* Action Buttons */}
        <div className="header-actions">
          {/* Theme Toggle */}
          <button
            className="header-icon-button theme-toggle"
            onClick={toggleTheme}
            title={theme === "light" ? "Dark Mode" : "Light Mode"}
          >
            {theme === "light" ? <FaMoon /> : <FaSun className="sun-icon" />}
          </button>

          {/* Notifications Bell */}
          <div ref={bellRef} style={{ position: "relative" }}>
            <button
              className="header-icon-button notification-btn"
              aria-label="Notifications"
              onClick={handleBellClick}
            >
              <FaBell />
              {unreadCount > 0 && (
                <span className="notification-badge">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {/* Bell Dropdown */}
            {showBell && (
              <div style={bellStyles.panel}>
                {/* Panel Header */}
                <div style={bellStyles.panelHeader}>
                  <span style={bellStyles.panelTitle}>Notifications</span>
                  <button style={bellStyles.closeIcon} onClick={() => setShowBell(false)}>
                    <FaTimes />
                  </button>
                </div>

                {/* Tabs */}
                <div style={bellStyles.tabs}>
                  <button
                    style={activeTab === "callbacks"
                      ? { ...bellStyles.tab, ...bellStyles.tabActive }
                      : bellStyles.tab}
                    onClick={() => setActiveTab("callbacks")}
                  >
                    <FaPhone style={{ marginRight: 6 }} />
                    Callbacks {callbacks.length > 0 && (
                      <span style={bellStyles.tabBadge}>{callbacks.length}</span>
                    )}
                  </button>
                  <button
                    style={activeTab === "admissions"
                      ? { ...bellStyles.tab, ...bellStyles.tabActive }
                      : bellStyles.tab}
                    onClick={() => setActiveTab("admissions")}
                  >
                    <FaGraduationCap style={{ marginRight: 6 }} />
                    Applications {admissions.length > 0 && (
                      <span style={bellStyles.tabBadge}>{admissions.length}</span>
                    )}
                  </button>
                </div>

                {/* Content */}
                <div style={bellStyles.list}>
                  {loadingBell ? (
                    <p style={bellStyles.empty}>Loading...</p>
                  ) : activeTab === "callbacks" ? (
                    callbacks.length === 0 ? (
                      <p style={bellStyles.empty}>No unread callback requests</p>
                    ) : (
                      callbacks.map((cb) => (
                        <div key={cb.Id} style={bellStyles.item}>
                          <div style={bellStyles.itemInfo}>
                            <strong style={bellStyles.itemName}>{cb.FullName}</strong>
                            <span style={bellStyles.itemSub}>{cb.Phone} · {cb.Domain || "—"}</span>
                            <span style={bellStyles.itemDate}>{formatDate(cb.CreatedAt)}</span>
                          </div>
                          <button
                            style={bellStyles.readBtn}
                            onClick={() => handleMarkCallbackRead(cb.Id)}
                            title="Mark as read"
                          >
                            ✓
                          </button>
                        </div>
                      ))
                    )
                  ) : (
                    admissions.length === 0 ? (
                      <p style={bellStyles.empty}>No unread applications</p>
                    ) : (
                      admissions.map((adm) => (
                        <div key={adm.Id} style={bellStyles.item}>
                          <div style={bellStyles.itemInfo}>
                            <strong style={bellStyles.itemName}>{adm.FullName}</strong>
                            <span style={bellStyles.itemSub}>{adm.CourseInterest}</span>
                            <span style={bellStyles.itemDate}>{formatDate(adm.CreatedAt)}</span>
                          </div>
                          <button
                            style={bellStyles.readBtn}
                            onClick={() => handleMarkAdmissionRead(adm.Id)}
                            title="Mark as read"
                          >
                            ✓
                          </button>
                        </div>
                      ))
                    )
                  )}
                </div>

                {/* Footer links */}
                <div style={bellStyles.footer}>
                  <button style={bellStyles.footerBtn} onClick={handleNavToCallbacks}>
                    View All Callbacks
                  </button>
                  <button style={bellStyles.footerBtn} onClick={handleNavToAdmissions}>
                    View All Applications
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Admin Profile */}
        <div
          className="header-profile"
          ref={profileRef}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div className="profile-avatar">
            <FaUserCircle className="profile-icon" />
            <span className="online-status"></span>
          </div>
          <div className="profile-info">
            <span className="profile-name">{adminUser?.full_name || "Admin"}</span>
            <span className="profile-role">Administrator</span>
          </div>
          <FaChevronDown className="dropdown-arrow" />

          {showDropdown && (
            <div className="profile-dropdown">
              <button className="profile-dropdown-item logout-item" onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// Bell dropdown inline styles
const bellStyles = {
  panel: {
    position: "absolute",
    top: "calc(100% + 12px)",
    right: 0,
    width: "min(360px, calc(100vw - 20px))",
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
    zIndex: 1100,
    overflow: "hidden",
  },
  panelHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 16px",
    borderBottom: "1px solid #edf2f7",
  },
  panelTitle: {
    fontWeight: "700",
    fontSize: "15px",
    color: "#2d3748",
  },
  closeIcon: {
    background: "none",
    border: "none",
    color: "#a0aec0",
    cursor: "pointer",
    fontSize: "16px",
    padding: "4px",
  },
  tabs: {
    display: "flex",
    borderBottom: "1px solid #edf2f7",
  },
  tab: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 8px",
    background: "none",
    border: "none",
    fontSize: "13px",
    fontWeight: "500",
    color: "#718096",
    cursor: "pointer",
    borderBottom: "2px solid transparent",
  },
  tabActive: {
    color: "#F6881F",
    borderBottomColor: "#F6881F",
    fontWeight: "700",
  },
  tabBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "6px",
    background: "#F6881F",
    color: "#fff",
    fontSize: "11px",
    fontWeight: "700",
    minWidth: "18px",
    height: "18px",
    borderRadius: "50%",
    padding: "0 4px",
  },
  list: {
    maxHeight: "260px",
    overflowY: "auto",
  },
  empty: {
    textAlign: "center",
    color: "#a0aec0",
    fontSize: "13px",
    padding: "24px 16px",
  },
  item: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 14px",
    borderBottom: "1px solid #f7fafc",
    background: "#fffaf0",
  },
  itemInfo: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minWidth: 0,
  },
  itemName: {
    fontSize: "13px",
    color: "#2d3748",
    fontWeight: "600",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  itemSub: {
    fontSize: "12px",
    color: "#718096",
    marginTop: "2px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  itemDate: {
    fontSize: "11px",
    color: "#a0aec0",
    marginTop: "2px",
  },
  readBtn: {
    marginLeft: "10px",
    background: "#F6881F",
    border: "none",
    color: "#fff",
    borderRadius: "50%",
    width: "24px",
    height: "24px",
    fontSize: "13px",
    cursor: "pointer",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    display: "flex",
    borderTop: "1px solid #edf2f7",
  },
  footerBtn: {
    flex: 1,
    padding: "12px 8px",
    background: "none",
    border: "none",
    fontSize: "12px",
    fontWeight: "600",
    color: "#F6881F",
    cursor: "pointer",
    textAlign: "center",
  },
};

export default Header;
