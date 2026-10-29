# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


import { useState, useRef, useEffect } from "react";
import TalkToExpertModal from "./TalkToExpertModal";
import ApplyNowModal from "./ApplyNowModal";
import {
  FaBars,
  FaTimes,
  FaSearch,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaUser,
  FaFileAlt,
  FaBook,
  FaBookOpen,
  FaSignOutAlt,
  FaAngleRight,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import T from "../context/T";
import "../assets/css/Navbar.css";
import "../assets/css/MegaDropdown.css";
import { navbarApi } from "../api/navbarApi";
import { navbarDropdownApi } from "../api/navbarDropdownApi";
import { authApi } from "../api/authApi";

import NavLogo1 from "../assets/images/NavLogo1.png";
import USLogo from "../assets/images/USlogo.png";
import SpanishLogo from "../assets/images/SpanishLogo.png";
import IndiaLogo from "../assets/images/IndiaLogo.png";
import ChinaLogo from "../assets/images/ChinaLogo.png";
import BrazeilLogo from "../assets/images/BrazeilLogo.png";

const languages = [
  { code: "en", name: "English", flag: USLogo },
  { code: "hi", name: "हिंदी", flag: IndiaLogo },
  { code: "es", name: "Español", flag: SpanishLogo },
  { code: "fr", name: "Français", flag: BrazeilLogo },
  { code: "de", name: "Deutsch", flag: ChinaLogo },
  { code: "zh", name: "中文", flag: ChinaLogo },
  { code: "ar", name: "العربية", flag: IndiaLogo },
  { code: "pt", name: "Português", flag: BrazeilLogo },
  { code: "ja", name: "日本語", flag: USLogo },
  { code: "ru", name: "Русский", flag: SpanishLogo },
];

const getInitials = (name) => {
  if (!name || typeof name !== "string") return "??";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  if (parts[0].length >= 2) return parts[0].slice(0, 2).toUpperCase();
  return parts[0][0].toUpperCase();
};

// ── Helper: URL prefix from category ─────────────────────────
const getCategoryPrefix = (category) => {
  if (!category) return "courses";
  const cat = category.toLowerCase();
  if (cat.includes("certification")) return "certifications";
  if (cat.includes("study") || cat.includes("abroad")) return "study-abroad";
  if (cat.includes("center")) return "centers";
  if (cat.includes("mentor")) return "mentorship";
  return "courses";
};

const Navbar = () => {
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const savedLang = languages.find((l) => l.code === language) || languages[0];

  // ── State ──────────────────────────────────────────────────
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedLang, setSelectedLang] = useState(savedLang);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [topBarHidden, setTopBarHidden] = useState(false);
  const [mobileSubPanel, setMobileSubPanel] = useState(null);       // for regular dropdown sub-panel
  const [mobileMegaPanel, setMobileMegaPanel] = useState(null);     // for mega dropdown sub-panel
  const [mobileMegaActiveGroup, setMobileMegaActiveGroup] = useState(null); // accordion group
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showExpert, setShowExpert] = useState(false);
  const [showApply, setShowApply] = useState(false);
  const [dropdownFlip, setDropdownFlip] = useState(false); // flip dropdown leftward if near right edge

  // Dynamic navbar data from API
  const [navLinks, setNavLinks] = useState([]);
  const [dropdownData, setDropdownData] = useState({ groups: [], items: [] });
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Auth
  const [user, setUser] = useState(() => {
    const s = localStorage.getItem("user");
    if (!s || s === "undefined" || s === "null") return null;
    try {
      return JSON.parse(s);
    } catch {
      return null;
    }
  });

  const isMobileView = () => window.innerWidth <= 991;

  const navRef = useRef(null);
  const langRef = useRef(null);
  const mobileLangRef = useRef(null); // Separate ref for mobile
  const profileRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  // ── Helpers ────────────────────────────────────────────────
  const openMenu = () => setIsOpen(true);
  const closeMenu = () => {
    setIsOpen(false);
    setActiveDropdown(null);
    setLangDropdownOpen(false);
    setMobileSubPanel(null);
    setMobileMegaPanel(null);
    setMobileMegaActiveGroup(null);
    setProfileDropdownOpen(false);
    setDropdownFlip(false);
  };

  const handleDropdownClick = (e, menuKey, hasMega = false) => {
    e.preventDefault();
    // Mobile pe click behaviour
    if (isMobileView()) {
      if (hasMega) {
        setMobileMegaPanel(menuKey);
        setMobileMegaActiveGroup(null);
      } else {
        setMobileSubPanel(menuKey);
      }
    }
    // Desktop pe click kuch nahi karega, hover hi kaam karega
  };



  const handleDropdownHover = (menuKey, hasMega = false) => {
    if (!isMobileView()) {
      // Clear any pending close
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }

      setActiveDropdown(menuKey);

      // Detect if dropdown would overflow right edge → flip left
      if (!hasMega) {
        const navItem = document.querySelector(`[data-menu-key="${menuKey}"]`);
        if (navItem) {
          const rect = navItem.getBoundingClientRect();
          const DROPDOWN_W = 280;
          setDropdownFlip(rect.left + DROPDOWN_W > window.innerWidth - 20);
        }
      } else {
        setDropdownFlip(false);
      }

      // Auto-select first group when opening mega dropdown
      if (hasMega) {
        const linkId = parseInt(menuKey.replace("nav-", ""));
        const linkGroups = dropdownData.groups.filter(
          (g) => g.NavbarLinkId === linkId,
        );
        if (linkGroups.length > 0) {
          setSelectedGroup(linkGroups[0].Id);
        }
      }
    }
  };

  const handleDropdownLeave = () => {
    if (!isMobileView()) {
      // Add small delay before closing to prevent flicker
      hoverTimeoutRef.current = setTimeout(() => {
        setActiveDropdown(null);
        setDropdownFlip(false);
      }, 100);
    }
  };

  const handleLangSelect = (lang) => {
    console.log("Language selected:", lang.name, lang.code); // Debug
    setSelectedLang(lang);
    setLanguage(lang.code);
    // Close dropdown after a tiny delay to ensure selection completes
    setTimeout(() => {
      setLangDropdownOpen(false);
    }, 50);
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // API fail ho toh bhi locally logout karo
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setProfileDropdownOpen(false);
      navigate("/login");
    }
  };

  // ── Fetch dynamic navbar links + dropdown data ────────────
  useEffect(() => {
    navbarApi
      .getNavbarLinks()
      .then((res) => {
        if (res.success) setNavLinks(res.links);
      })
      .catch((err) => console.error("Navbar fetch error:", err));

    navbarDropdownApi
      .getAllPublicDropdowns()
      .then((res) => {
        if (res.success)
          setDropdownData({ groups: res.groups || [], items: res.items || [] });
      })
      .catch((err) => console.error("Dropdown data fetch error:", err));
  }, []);


  // ── Auth sync ──────────────────────────────────────────────
  useEffect(() => {
    const sync = () => {
      const s = localStorage.getItem("user");
      if (!s || s === "undefined" || s === "null") {
        setUser(null);
        return;
      }
      try {
        setUser(JSON.parse(s));
      } catch {
        setUser(null);
      }
    };
    window.addEventListener("userUpdated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("userUpdated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // ── Click-outside handlers ─────────────────────────────────
  useEffect(() => {
    const h = (e) => {
      // Check if click is inside any language dropdown item
      const isLangOption = e.target.closest('.lang-option');
      
      if (navRef.current && !navRef.current.contains(e.target))
        setActiveDropdown(null);
      
      // Only close if not clicking on lang option
      if (!isLangOption) {
        if (langRef.current && !langRef.current.contains(e.target))
          setLangDropdownOpen(false);
        if (mobileLangRef.current && !mobileLangRef.current.contains(e.target))
          setLangDropdownOpen(false);
      }
      
      // Profile dropdown close on click outside (only on mobile or when explicitly clicking outside)
      // On desktop, hover handles it, so we don't need aggressive click-outside
      if (profileRef.current && !profileRef.current.contains(e.target) && isMobileView())
        setProfileDropdownOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // ── Scroll / resize padding ────────────────────────────────
  useEffect(() => {
    const TOPBAR_H = 61,
      NAVBAR_H = 78,
      MOBILE_H = 68;
    const isMob = () => window.innerWidth <= 991;
    const update = (hidden) => {
      document.body.style.paddingTop = isMob()
        ? `${MOBILE_H}px`
        : hidden
          ? `${NAVBAR_H}px`
          : `${TOPBAR_H + NAVBAR_H}px`;
      if (hidden) {
        document.body.classList.add("topbar-hidden");
      } else {
        document.body.classList.remove("topbar-hidden");
      }
    };
    const onScroll = () => {
      const h = window.scrollY > 10;
      setTopBarHidden(h);
      update(h);
    };
    const onResize = () => update(window.scrollY > 10);
    update(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.body.style.paddingTop = "";
    };
  }, []);

  // ── Check if any sub-panel is open (for main panel slide) ──
  const anySubPanelOpen = mobileSubPanel !== null || mobileMegaPanel !== null;

  return (
    <>
      {/* ── TOP BAR ── */}
      <div className={`top-bar${topBarHidden ? " top-bar--hidden" : ""}`}>
        <div className="top-bar-inner">
          <span className="announcement-text">
            <T>🚀 Admissions Open for 2026 Batch | Get Up to 30% Scholarship</T>
          </span>
          <div className="top-bar-buttons">
            <button className="btn-apply" onClick={() => setShowApply(true)}>
              <T>Apply Now</T>
            </button>
            <button className="btn-talk" onClick={() => setShowExpert(true)}>
              <T>Talk to Expert</T>
            </button>
          </div>
        </div>
      </div>

      {isOpen && <div className="mobile-overlay show" onClick={closeMenu} />}
      {activeDropdown && !isMobileView() && (
        <div className="mega-overlay" onClick={() => setActiveDropdown(null)} />
      )}

      {/* ── NAVBAR ── */}
      <nav className={`premium-navbar${topBarHidden ? " navbar--top" : ""}`}>
        <div className="nav-inner">
          {/* Logo */}
          <Link className="logo-link" to="/" onClick={closeMenu}>
            <img src={NavLogo1} alt="Mentoring Minds" className="brand-logo" />
          </Link>

          {/* Desktop Search */}
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search Courses, Skills, Universities..."
              className="search-input"
            />
          </div>

          {/* Mobile Language Selector - Only visible on mobile before hamburger */}
          <div className="lang-container mobile-lang-selector" ref={mobileLangRef}>
            <div
              className="lang-selector"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            >
              <img
                src={selectedLang.flag}
                alt={selectedLang.name}
                className="uslogo"
              />
              <span style={{ fontSize: 15, fontWeight: 400 }}>
                {selectedLang.name}
              </span>
              <FaChevronDown
                className={`chevron ${langDropdownOpen ? "rotate" : ""}`}
              />
            </div>
            {langDropdownOpen && (
              <ul className="lang-dropdown-menu">
                {languages.map((lang) => (
                  <li
                    key={lang.code}
                    className={`lang-option ${selectedLang.code === lang.code ? "active" : ""}`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleLangSelect(lang);
                    }}
                  >
                    <img
                      src={lang.flag}
                      alt={lang.name}
                      className="uslogo"
                    />
                    <span>{lang.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="hamburger"
            onClick={openMenu}
            aria-label="Open navigation"
          >
            <FaBars />
          </button>

          {/* ── NAV MENU ── */}
          <div className={`nav-menu ${isOpen ? "open" : ""}`} ref={navRef}>
            <div
              className={`mob-main-panel${anySubPanelOpen ? " mob-slide-out" : ""}`}
            >
              {/* Mobile header */}
              <div className="mobile-header">
                {/* Logo */}
                <Link className="mob-header-logo" to="/" onClick={closeMenu}>
                  <img src={NavLogo1} alt="Mentoring Minds" />
                </Link>

                <div className="mob-header-right">
                  {/* Close button */}
                  <button className="close-btn" onClick={closeMenu}>
                    <FaTimes />
                  </button>
                </div>
              </div>

              <div className="search-box-mobile">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search Courses, Skills, Universities..."
                  className="search-input"
                />
              </div>

              {/* ── DYNAMIC NAV LINKS ── */}
              <ul className="nav-links">
                {navLinks.map((link) => {
                  const key = `nav-${link.Id}`;
                  const children = link.children || [];

                  // Get groups for this nav link (for mega dropdown)
                  const linkGroups = dropdownData.groups.filter(
                    (g) => g.NavbarLinkId === link.Id,
                  );
                  const hasMegaDropdown = linkGroups.length > 0;

                  if (hasMegaDropdown) {
                    const urlPrefix = getCategoryPrefix(link.Category);

                    return (
                      <li 
                        key={key} 
                        className="nav-item has-mega-dropdown"
                        data-menu-key={key}
                        onMouseEnter={() => handleDropdownHover(key, true)}
                        onMouseLeave={handleDropdownLeave}
                      >
                        <Link
                          className="nav-link"
                          to={link.Url || "#"}
                          onClick={(e) => handleDropdownClick(e, key, true)}
                        >
                          <span>
                            <T>{link.Title}</T>
                          </span>
                          {link.BadgeText && (
                            <span className="badge-new">
                              <T>{link.BadgeText}</T>
                            </span>
                          )}
                          <FaChevronDown
                            className={`chevron desktop-chevron ${activeDropdown === key ? "rotate" : ""}`}
                          />
                          <FaChevronRight className=" mobile-chevron" />
                          {/* <FaAngleRight /> */}
                        </Link>
                        {/* Desktop MEGA dropdown only */}
                        <div
                          className={`mega-dropdown ${activeDropdown === key ? "show-mega" : ""}`}
                          onMouseEnter={() => handleDropdownHover(key, true)}
                          onMouseLeave={handleDropdownLeave}
                        >
                          <div className="mega-dropdown-inner">
                            {/* Left: Groups (Countries/Categories) */}
                            <div className="mega-left">
                              <h3 className="mega-title">
                                {link.Category === "study-abroad"
                                  ? "Countries"
                                  : "Domains"}
                              </h3>
                              <ul className="mega-groups">
                                {linkGroups.map((group) => (
                                  <li
                                    key={group.Id}
                                    className={`mega-group-item ${selectedGroup === group.Id ? "active" : ""}`}
                                    onClick={() => setSelectedGroup(group.Id)}
                                  >
                                    {group.Image && (
                                      <img
                                        src={group.Image}
                                        alt={group.Name}
                                        className="mega-group-icon"
                                      />
                                    )}
                                    <span>{group.Name}</span>
                                    <FaChevronRight className="mega-arrow" />
                                  </li>
                                ))}
                              </ul>
                              {/* View All Button */}
                              {link.ViewAllUrl && (
                                <div className="mega-view-all-wrap-left">
                                  <Link
                                    to={link.ViewAllUrl}
                                    className="mega-view-all-btn"
                                    onClick={closeMenu}
                                  >
                                    View All {link.Title}{" "}
                                    <FaChevronRight size={11} />
                                  </Link>
                                </div>
                              )}
                            </div>
                            {/* Right: Items (Courses) */}
                            <div className="mega-right">
                              {selectedGroup ? (
                                <>
                                  <h3 className="mega-title">
                                    {
                                      linkGroups.find(
                                        (g) => g.Id === selectedGroup,
                                      )?.Name
                                    }
                                  </h3>
                                  <div className="mega-items-grid">
                                    {dropdownData.items
                                      .filter(
                                        (item) =>
                                          item.GroupId === selectedGroup,
                                      )
                                      .map((item) => (
                                        <Link
                                          key={item.Id}
                                          to={
                                            item.Slug
                                              ? `/${urlPrefix}/${item.Slug}`
                                              : item.Url || "#"
                                          }
                                          className="mega-item-card"
                                          onClick={closeMenu}
                                        >
                                          {item.UniversityLogo && (
                                            <img
                                              src={item.UniversityLogo}
                                              alt={item.UniversityName}
                                              className="mega-item-logo"
                                            />
                                          )}
                                          <div className="mega-item-content">
                                            {item.UniversityName && (
                                              <p className="mega-item-uni">
                                                {item.UniversityName}
                                              </p>
                                            )}
                                            <p className="mega-item-title">
                                              {item.Title}
                                            </p>
                                          </div>
                                        </Link>
                                      ))}
                                  </div>
                                </>
                              ) : (
                                <p className="mega-placeholder">
                                  Hover over a category to see courses
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  }

                  if (children.length > 0) {
                    // Regular dropdown (old style)
                    return (
                      <li 
                        key={key} 
                        className="nav-item has-dropdown"
                        data-menu-key={key}
                        onMouseEnter={() => handleDropdownHover(key, false)}
                        onMouseLeave={handleDropdownLeave}
                      >
                        <Link
                          className="nav-link"
                          to={link.Url || "#"}
                          onClick={(e) => handleDropdownClick(e, key, false)}
                        >
                          <span>
                            <T>{link.Title}</T>
                          </span>
                          {link.BadgeText && (
                            <span className="badge-new">
                              <T>{link.BadgeText}</T>
                            </span>
                          )}
                          <FaChevronDown
                            className={`chevron desktop-chevron ${activeDropdown === key ? "rotate" : ""}`}
                          />
                          <FaChevronRight className="chevron mobile-chevron" />
                        </Link>
                        {/* Desktop dropdown */}
                        <ul
                          className={`dropdown-menu-custom multi-col ${activeDropdown === key ? "show-dropdown" : ""} ${activeDropdown === key && dropdownFlip ? "flip-left" : ""}`}
                          onMouseEnter={() => handleDropdownHover(key, false)}
                          onMouseLeave={handleDropdownLeave}
                        >
                          {children.map((child) => (
                            <li key={child.Id}>
                              <Link
                                to={child.Url || "#"}
                                className="dropdown-link"
                                onClick={closeMenu}
                              >
                                <T>{child.Title}</T>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    );
                  }

                  // Simple link (no dropdown)
                  return (
                    <li key={key} className="nav-item">
                      <Link
                        className="nav-link"
                        to={link.Url || "#"}
                        onClick={closeMenu}
                      >
                        <T>{link.Title}</T>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              {/* ── END DYNAMIC NAV LINKS ── */}

              {/* ── ACTION GROUP ── */}
              <div className="action-group">
                {user ? (
                  <div className="profile-menu-container" ref={profileRef}>

                    {/* ── Mobile: profile trigger (like nav item) ── */}
                    {isMobileView() ? (
                      <div
                        className="mob-profile-trigger"
                        onClick={() => setMobileSubPanel("profile")}
                      >
                        <div className="avatar-initials mob-profile-avatar-sm">
                          {user.profile_image || user.ProfileImage ? (
                            <img
                              src={user.profile_image || user.ProfileImage}
                              alt={user.full_name}
                              className="avatar-img"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                          ) : null}
                          <span
                            style={{
                              display:
                                user.profile_image || user.ProfileImage
                                  ? "none"
                                  : "flex",
                            }}
                          >
                            {getInitials(user.full_name)}
                          </span>
                        </div>
                        <FaChevronRight className="mobile-chevron" style={{ marginLeft: "auto" }} />
                      </div>
                    ) : (
                      /* ── Desktop: avatar + dropdown ── */
                      <>
                        <div
                          className="avatar-btn"
                          onMouseEnter={() => !isMobileView() && setProfileDropdownOpen(true)}
                          onMouseLeave={() => !isMobileView() && setProfileDropdownOpen(false)}
                          title={user.full_name}
                          style={{ cursor: "pointer" }}
                        >
                          <div className="avatar-initials">
                            {user.profile_image || user.ProfileImage ? (
                              <img
                                src={user.profile_image || user.ProfileImage}
                                alt={user.full_name}
                                className="avatar-img"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />
                            ) : null}
                            <span
                              style={{
                                display:
                                  user.profile_image || user.ProfileImage
                                    ? "none"
                                    : "flex",
                              }}
                            >
                              {getInitials(user.full_name)}
                            </span>
                          </div>
                          <FaChevronDown
                            className={`chevron ${profileDropdownOpen ? "rotate" : ""}`}
                            style={{ fontSize: "14px", color: "#666", transition: "transform 0.3s ease" }}
                          />
                        </div>

                        {profileDropdownOpen && (
                          <div 
                            className="profile-dropdown"
                            onMouseEnter={() => !isMobileView() && setProfileDropdownOpen(true)}
                            onMouseLeave={() => !isMobileView() && setProfileDropdownOpen(false)}
                          >
                            <Link to="/profile" className="profile-dropdown-item"
                              onClick={() => { setProfileDropdownOpen(false); closeMenu(); }}>
                              <FaUser className="dropdown-icon" /> <T>View Profile</T>
                            </Link>
                            {/* <Link to="/applications" className="profile-dropdown-item"
                              onClick={() => { setProfileDropdownOpen(false); closeMenu(); }}>
                              <FaFileAlt className="dropdown-icon" /> <T>My Applications</T>
                            </Link>
                            <Link to="/my-courses" className="profile-dropdown-item"
                              onClick={() => { setProfileDropdownOpen(false); closeMenu(); }}>
                              <FaBook className="dropdown-icon" /> <T>My Courses</T>
                            </Link>
                            <Link to="/external-courses" className="profile-dropdown-item"
                              onClick={() => { setProfileDropdownOpen(false); closeMenu(); }}>
                              <FaBookOpen className="dropdown-icon" /> <T>My External Courses</T>
                            </Link> */}
                            <div className="profile-dropdown-item logout-item" onClick={handleLogout}>
                              <FaSignOutAlt className="dropdown-icon" /> <T>Logout</T>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <Link to="/login" className="btn-login" onClick={closeMenu}>
                      <T>Login</T>
                    </Link>
                    <Link
                      to="/signup"
                      className="btn-signup"
                      onClick={closeMenu}
                    >
                      <T>Sign Up</T>
                    </Link>
                  </>
                )}

                {/* Language Selector */}
                <div className="lang-container" ref={langRef}>
                  <div
                    className="lang-selector"
                    onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  >
                    <img
                      src={selectedLang.flag}
                      alt={selectedLang.name}
                      className="uslogo"
                    />
                    <span style={{ fontSize: 15, fontWeight: 400 }}>
                      {selectedLang.name}
                    </span>
                    <FaChevronDown
                      className={`chevron ${langDropdownOpen ? "rotate" : ""}`}
                    />
                  </div>
                  {langDropdownOpen && (
                    <ul className="lang-dropdown-menu">
                      {languages.map((lang) => (
                        <li
                          key={lang.code}
                          className={`lang-option ${selectedLang.code === lang.code ? "active" : ""}`}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleLangSelect(lang);
                          }}
                        >
                          <img
                            src={lang.flag}
                            alt={lang.name}
                            className="uslogo"
                          />
                          <span>{lang.name}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              {/* ── END ACTION GROUP ── */}
            </div>
            {/* ── END MAIN PANEL ── */}

            {/* ── MOBILE SUB-PANELS (for regular dropdown children) ── */}
            {navLinks
              .filter((l) => l.children && l.children.length > 0)
              .map((link) => {
                const key = `nav-${link.Id}`;
                return (
                  <div
                    key={key}
                    className={`mob-sub-panel${mobileSubPanel === key ? " mob-sub-panel--open" : ""}`}
                  >
                    <button
                      className="mob-back-btn"
                      onClick={() => setMobileSubPanel(null)}
                    >
                      <FaChevronLeft />
                      <span>
                        <T>{link.Title}</T>
                      </span>
                    </button>
                    <ul className="mob-sub-links">
                      {(link.children || []).map((child) => (
                        <li key={child.Id}>
                          <Link
                            to={child.Url || "#"}
                            className="mob-sub-link"
                            onClick={closeMenu}
                          >
                            <T>{child.Title}</T>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}

            {/* ── MOBILE PROFILE SUB-PANEL ── */}
            {user && (
              <div
                className={`mob-sub-panel${mobileSubPanel === "profile" ? " mob-sub-panel--open" : ""}`}
              >
                <button
                  className="mob-back-btn"
                  onClick={() => setMobileSubPanel(null)}
                >
                  <FaChevronLeft />
                  <span>
                    <T>My Account</T>
                  </span>
                </button>
                <ul className="mob-sub-links">
                  <li>
                    <Link
                      to="/profile"
                      className="mob-sub-link"
                      onClick={closeMenu}
                    >
                      <FaUser className="dropdown-icon" style={{ marginRight: "12px" }} />
                      <T>View Profile</T>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/applications"
                      className="mob-sub-link"
                      onClick={closeMenu}
                    >
                      <FaFileAlt className="dropdown-icon" style={{ marginRight: "12px" }} />
                      <T>My Applications</T>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/my-courses"
                      className="mob-sub-link"
                      onClick={closeMenu}
                    >
                      <FaBook className="dropdown-icon" style={{ marginRight: "12px" }} />
                      <T>My Courses</T>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/external-courses"
                      className="mob-sub-link"
                      onClick={closeMenu}
                    >
                      <FaBookOpen className="dropdown-icon" style={{ marginRight: "12px" }} />
                      <T>My External Courses</T>
                    </Link>
                  </li>
                  <li>
                    <div
                      className="mob-sub-link logout-item"
                      onClick={handleLogout}
                      style={{ cursor: "pointer" }}
                    >
                      <FaSignOutAlt className="dropdown-icon" style={{ marginRight: "12px", color: "#e74c3c" }} />
                      <span style={{ color: "#e74c3c" }}>
                        <T>Logout</T>
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            )}

            {/* ── MOBILE MEGA SUB-PANELS (accordion style) ── */}
            {navLinks
              .filter(
                (l) =>
                  dropdownData.groups.filter((g) => g.NavbarLinkId === l.Id)
                    .length > 0,
              )
              .map((link) => {
                const key = `nav-${link.Id}`;
                const linkGroups = dropdownData.groups.filter(
                  (g) => g.NavbarLinkId === link.Id,
                );
                const urlPrefix = getCategoryPrefix(link.Category);

                return (
                  <div
                    key={key}
                    className={`mob-sub-panel mob-mega-panel${mobileMegaPanel === key ? " mob-sub-panel--open" : ""}`}
                  >
                    {/* Back button */}
                    <button
                      className="mob-back-btn"
                      onClick={() => {
                        setMobileMegaPanel(null);
                        setMobileMegaActiveGroup(null);
                      }}
                    >
                      <FaChevronLeft />
                      <span>
                        <T>{link.Title}</T>
                      </span>
                    </button>

                    {/* Groups accordion list */}
                    <ul className="mob-mega-groups-list">
                      {linkGroups.map((group) => {
                        const isGroupOpen = mobileMegaActiveGroup === group.Id;
                        const groupItems = dropdownData.items.filter(
                          (item) => item.GroupId === group.Id,
                        );

                        return (
                          <li key={group.Id} className="mob-mega-group">
                            <div
                              className={`mob-mega-group-header${isGroupOpen ? " active" : ""}`}
                              onClick={() =>
                                setMobileMegaActiveGroup(
                                  isGroupOpen ? null : group.Id,
                                )
                              }
                            >
                              {group.Image && (
                                <img
                                  src={group.Image}
                                  alt={group.Name}
                                  className="mob-mega-group-img"
                                />
                              )}
                              <span className="mob-mega-group-name">
                            <T>    {group.Name}</T>
                              </span>
                              <FaChevronDown
                                className={`mob-mega-chevron${isGroupOpen ? " rotate" : ""}`}
                              />
                            </div>

                            {/* Accordion items */}
                            <div
                              className={`mob-mega-items-wrap${isGroupOpen ? " open" : ""}`}
                            >
                              <ul className="mob-mega-items">
                                {groupItems.length > 0 ? (
                                  groupItems.map((item) => (
                                    <li key={item.Id}>
                                      <Link
                                        to={
                                          item.Slug
                                            ? `/${urlPrefix}/${item.Slug}`
                                            : item.Url || "#"
                                        }
                                        className="mob-mega-item"
                                        onClick={closeMenu}
                                      >
                                        {item.UniversityLogo && (
                                          <img
                                            src={item.UniversityLogo}
                                            alt={item.UniversityName}
                                            className="mob-mega-item-logo"
                                          />
                                        )}
                                        <div className="mob-mega-item-info">
                                          {item.UniversityName && (
                                            <p className="mob-mega-item-uni">
                                          <T>    {item.UniversityName}</T>
                                            </p>
                                          )}
                                          <p className="mob-mega-item-title">
                                           <T> {item.Title}</T>
                                          </p>
                                        </div>
                                      </Link>
                                    </li>
                                  ))
                                ) : (
                                  <li className="mob-mega-empty">
                             <T> No items available</T>
                                  </li>
                                )}
                              </ul>
                            </div>
                          </li>
                        );
                      })}
                    </ul>

                    {/* View All button at bottom */}
                    {link.ViewAllUrl && (
                      <div className="mob-mega-view-all">
                        <Link
                          to={link.ViewAllUrl}
                          className="mob-mega-view-all-btn"
                          onClick={closeMenu}
                        >
                         <T> View All</T> {link.Title}
                          <FaChevronRight size={12} />
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            {/* ── END MOBILE MEGA SUB-PANELS ── */}
          </div>
          {/* ── END NAV MENU ── */}
        </div>
      </nav>

      {showExpert && <TalkToExpertModal onClose={() => setShowExpert(false)} />}
      {showApply && <ApplyNowModal onClose={() => setShowApply(false)} />}
    </>
  );
};

export default Navbar;




:root {
  --orange:   #F6881F;
  --orange2:  #F18D21;
  --grad:     linear-gradient(90deg, #F6881F, #F18D21);
  --dark:     #333;
  --gray:     #666;
  --border:   #E5E5E5;
  --shadow:   0 4px 20px rgba(0,0,0,.08);
  --topbar-h: 61px;
  --navbar-h: 78px;
}

* {
  box-sizing: border-box;
}


.top-bar *, .premium-navbar * { box-sizing: border-box; margin: 0; padding: 0; }
.top-bar a, .premium-navbar a { text-decoration: none; color: inherit; }
.top-bar ul, .premium-navbar ul { list-style: none; }
.premium-navbar button { border: none; outline: none; cursor: pointer; font-family: inherit; background: none; }
.top-bar img, .premium-navbar img { display: block; max-width: 100%; }

.top-bar {
  position: fixed;
  top: 0; left: 0;
  width: 100%;
  height: var(--topbar-h);
  background: var(--grad);
  z-index: 1000;
  transition: transform 0.3s ease;
}

.top-bar--hidden {
  transform: translateY(-100%);
}

.top-bar-inner {
  height: var(--topbar-h);
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 0 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.announcement-text {
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  white-space: nowrap;
}

.top-bar-buttons { display: flex; gap: 10px; flex-shrink: 0; }
.btn-apply { background: #fff !important; color: #222 !important; width: 118px; height: 42px; border-radius: 7px; font-weight: 600; border: none; transition: .2s; }
.btn-talk { background: transparent !important; border: 1.5px solid #fff !important; color: #fff !important; width: 138px; height: 42px; border-radius: 7px; font-weight: 600; transition: .2s; }
.btn-talk:hover { background: #fff !important; color: var(--orange) !important; }

.premium-navbar {
  position: fixed;
  top: var(--topbar-h);
  left: 0;
  width: 100%;
  height: var(--navbar-h);
  background: #fff;
  box-shadow: var(--shadow);
  z-index: 1001;
  overflow: visible;
  transition: top 0.3s ease;
}

.navbar--top {
  top: 0;
}

.nav-inner {
  height: var(--navbar-h);
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 30px;
  display: flex;
  align-items: center;
  gap: 18px;
  position: relative;
}

.logo-link { flex-shrink: 0; display: flex; align-items: center; height: 55px; min-width: 0; }
.brand-logo { height: 48px; width: auto; }

.search-box {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  width: 250px;
  height: 42px;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0 12px;
  background: #fafafa;
}
.search-icon { color: #000; font-size: 14px; margin-right: 8px; flex-shrink: 0; }
.search-input { flex: 1; border: none; background: transparent; outline: none; font-size: 14x; color: var(--dark); }

.hamburger { 
  display: none; 
  font-size: 24px; 
  color: var(--orange); 
  margin-left: auto; 
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  flex-shrink: 0;
}

/* Mobile language selector - hidden on desktop */
.mobile-lang-selector {
  display: none;
}

.nav-menu { flex: 1; display: flex; align-items: center; }
.mobile-header, .search-box-mobile { display: none; }

/* Mobile chevron hidden on desktop by default */
.mobile-chevron { display: none; }

/* Desktop: mob-main-panel is just a flex pass-through wrapper */
.mob-main-panel {
  display: contents;
}

/* Desktop: sub-panels are never shown */
.mob-sub-panel { display: none; }

.nav-links {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  font-weight: 500;
  color: black;
  /* margin-top: 20px; */
}

.nav-item { 
  position: relative;
}

/* Pseudo-element to bridge gap between nav-item and dropdown */
.nav-item.has-dropdown::after,
.nav-item.has-mega-dropdown::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  height: 10px;
  background: transparent;
  z-index: 499;
  display: none;
}

@media (min-width: 992px) {
  .nav-item.has-dropdown::after,
  .nav-item.has-mega-dropdown::after {
    display: block;
  }
}

.nav-link {
  display: flex; align-items: center; gap: 20px; padding: 6px 12px;
  color: var(--dark); font-size: 14px; font-weight: 500; white-space: nowrap; cursor: pointer;
}
.nav-link:hover { color: var(--orange); }

.badge-new {
  background: var(--orange); color: #fff; font-size: 9px; font-weight: 700;
  padding: 2px 5px; border-radius: 4px; position: absolute; top: -12px; right: -6px;
}
.chevron { font-size: 15px; transition: transform .25s; color: var(--gray); padding-left: 3px; }
.chevron.rotate { transform: rotate(180deg); }

.dropdown-menu-custom {
  display: none;
  position: absolute;
  top: calc(100% + 0px);
  left: 0;
  right: auto;
  width: max-content;
  min-width: 200px;
  max-width: 320px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 12px 30px rgba(0,0,0,.1);
  padding: 8px 0;
  z-index: 500;
  border: 1px solid var(--border);
  margin-top: 0;
}

/* Flip: open to the LEFT when nav item is near right edge */
.dropdown-menu-custom.flip-left {
  left: auto;
  right: 0;
}

/* When dropdown has many items — 2 column layout */
.dropdown-menu-custom.multi-col {
  columns: 2;
  column-gap: 0;
}

.dropdown-menu-custom li {
  break-inside: avoid;
}

.dropdown-menu-custom.show-dropdown {
  display: block;
  animation: fadeDown .2s ease;
}

.dropdown-link { display: block; padding: 10px 18px; font-size: 14px; color: #444; transition: .2s; }
.dropdown-link:hover { background: #FFF5EB; color: var(--orange); padding-left: 22px; }

@keyframes fadeDown {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.nav-divider { width: 1px; height: 32px; background: #ddd; margin: 0 10px; }
.action-group { display: flex; align-items: center; gap: 10px; }

.btn-login {
  width: 76px;
  height: 48px;
  border: 1.5px solid #ccc !important;
  border-radius: 7px;
  font-weight: 600;
  display: flex;
  background-color: #fff !important;
  color: #1a1a1a !important;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}
.btn-login:hover { background: #f5f5f5 !important; color: var(--orange) !important; border-color: var(--orange) !important; }

.btn-signup {
  width: 88px;
  height: 48px;
  background: var(--grad) !important;
  color: #fff !important;
  border-radius: 7px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.lang-container { position: relative; }

.lang-selector {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  height: 40px;
  padding: 0 8px;
  border-radius: 6px;
  transition: background 0.2s;
}
.lang-selector:hover { background: #f7f7f7; }
.uslogo { width: 22px; height: 16px; border-radius: 2px; object-fit: cover; }

.lang-dropdown-menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  width: 140px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  padding: 6px 0;
  z-index: 1200;
  border: 1px solid var(--border);
}

.lang-option {
  display: flex; 
  align-items: center; 
  gap: 10px; 
  padding: 8px 14px;
  font-size: 14px; 
  color: #333; 
  cursor: pointer; 
  transition: background 0.2s;
  user-select: none;
}
.lang-option img,
.lang-option span {
  pointer-events: none;
}
.lang-option:hover { background: #FFF5EB; color: var(--orange); }
.lang-option.active { font-weight: 600; background: #fafafa; }

body {
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
  background: #fff;
  padding-top: calc(var(--topbar-h) + var(--navbar-h)); /* fallback, JS overrides on scroll */
  transition: padding-top 0.3s ease;
  margin: 0;
  width: 100%;
  max-width: 100vw;
}

html {
  overflow-x: hidden;
  width: 100%;
  max-width: 100vw;
}

/* .mobile-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.5); z-index: 100; } */

@media (max-width: 991px) {
  .top-bar { display: none; }
  .premium-navbar { 
    top: 0; 
    height: 68px; 
    overflow: visible;
    z-index: 1001;
    width: 100%;
  }
  .nav-inner { 
    height: 68px; 
    padding: 0 16px; 
    gap: 40px; 
    max-width: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .brand-logo { height: 42px; flex-shrink: 0; }
  body { 
    padding-top: 68px; 
    overflow-x: hidden;
    max-width: 100vw;
  }

  /* Search box hidden on mobile */
  .search-box { display: none; }

  /* Mobile language selector - visible only on mobile */
  .mobile-lang-selector {
    display: flex !important;
    position: relative;
    flex-shrink: 0;
    flex: 1;
    justify-content: center;
    max-width: 200px;
    z-index: 1002;
  }
.search-icon{
  font-size: 24px;
  color: #6c6c6c;
}
  .mobile-lang-selector .lang-selector {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    height: 44px;
    padding: 0 16px;
    border-radius: 8px;
    border: 1px solid #ddd;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    white-space: nowrap;
    position: relative;
    z-index: 1002;
  }

  .mobile-lang-selector .uslogo {
    width: 24px;
    height: 18px;
    flex-shrink: 0;
    pointer-events: none;
  }

  .mobile-lang-selector .lang-selector span {
    font-size: 15px !important;
    font-weight: 500 !important;
    color: #333 !important;
    display: block !important;
    pointer-events: none;
  }

  .mobile-lang-selector .chevron {
    font-size: 12px;
    color: #666;
    flex-shrink: 0;
    pointer-events: none;
  }

  .mobile-lang-selector .lang-dropdown-menu {
    position: absolute;
    top: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    width: 180px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    border: 1px solid #ddd;
    padding: 8px 0;
    z-index: 9999;
    max-height: 400px;
    overflow-y: auto;
  }

  .mobile-lang-selector .lang-dropdown-menu .lang-option {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    cursor: pointer;
    transition: background 0.2s;
    font-size: 14px;
    color: #333;
    user-select: none;
    -webkit-tap-highlight-color: rgba(255, 136, 31, 0.2);
    touch-action: manipulation;
  }

  .mobile-lang-selector .lang-dropdown-menu .lang-option img {
    width: 24px;
    height: 18px;
    pointer-events: none;
  }

  .mobile-lang-selector .lang-dropdown-menu .lang-option span {
    flex: 1;
    pointer-events: none;
  }

  .mobile-lang-selector .lang-dropdown-menu .lang-option:active {
    background: #ddd !important;
  }

  .mobile-lang-selector .lang-dropdown-menu .lang-option:hover {
    background: #f5f5f5;
  }

  .mobile-lang-selector .lang-dropdown-menu .lang-option.active {
    background: #FFF5EB;
    color: var(--orange);
    font-weight: 600;
  }

  .hamburger { 
    display: flex !important;
    flex-shrink: 0;
    font-size: 24px;
    color: var(--orange);
    width: 40px;
    height: 40px;
  }
  .search-box { display: none; }

  /* nav-menu is the outer container — full screen width */
  .nav-menu {
    position: fixed; top: 0; left: -100%; width: 100%; height: 100vh;
    background: #fff; z-index: 1050;
    overflow: hidden;
    transition: left .35s cubic-bezier(.77,0,.175,1);
  }
  .nav-menu.open { left: 0; }

  /* ── MAIN PANEL ── */
  .mob-main-panel {
    display: flex !important;
    position: absolute;
    top: 0; left: 0;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    flex-direction: column;
    align-items: flex-start;
    padding: 0 20px 24px;
    transition: transform .35s cubic-bezier(.77,0,.175,1);
    transform: translateX(0);
    background: #fff;
  }

  /* When a sub-panel is open, slide main panel to the left */
  .mob-main-panel.mob-slide-out {
    transform: translateX(-100%);
  }

  /* ── SUB PANEL ── */
  .mob-sub-panel {
    display: block !important;
    position: absolute;
    top: 0; left: 0;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    background: #fff;
    padding: 0;
    transform: translateX(100%);
    transition: transform .35s cubic-bezier(.77,0,.175,1);
    z-index: 10;
  }

  .mob-sub-panel--open {
    transform: translateX(0);
  }

  /* Back button */
  .mob-back-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 18px 20px;
    border: none;
    background: none;
    font-size: 16px;
    font-weight: 600;
    color: var(--dark);
    cursor: pointer;
    border-bottom: 1px solid var(--border);
    margin-bottom: 8px;
  }

  .mob-back-btn svg {
    color: var(--orange);
    font-size: 14px;
  }

  /* Sub-panel links */
  .mob-sub-links {
    list-style: none;
    margin: 0;
    padding: 0 0 20px;
    width: 100%;
  }

  .mob-sub-links li {
    border-bottom: 1px solid #f5f5f5;
  }

  .mob-sub-link {
    display: block;
    padding: 15px 20px;
    font-size: 15px;
    color: var(--dark);
    text-decoration: none;
    transition: color .2s, background .2s;
  }

  .mob-sub-link:hover {
    color: var(--orange);
    background: #FFF5EB;
  }

  /* Hide desktop chevron, show mobile arrow on mobile */
  .desktop-chevron { display: none !important; }
  .mobile-chevron { display: flex !important; align-items: center; font-size: 14px; color: var(--gray); flex-shrink: 0;  }

  /* ── Mobile Header: Logo | Lang | Close ── */
  .mobile-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 12px 0 10px;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 4px;
  }

  .mob-header-logo {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .mob-header-logo img {
    height: 36px;
    width: auto;
    display: block;
  }

  .mob-header-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  /* Remove mobile header language selector */
  .mob-header-lang,
  .mob-lang-selector,
  .mob-lang-dropdown {
    display: none !important;
  }

  .close-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    background: #fff4f4;
    border: 1px solid #ffd0d0;
    border-radius: 8px;
    cursor: pointer;
    color: #e53e3e;
    flex-shrink: 0;
  }

  /* Hide language from action-group on mobile (it's in main navbar now) */
  .action-group .lang-container { display: none; }


  .search-box-mobile {
    display: flex; width: 100%; border: 1px solid #ddd;
    padding: 20px; margin: 42px 0 8px;
    border-radius: 8px; background: #fafafa;
  }

  .nav-links { 
    flex-direction: column; 
    width: 100%; 
    gap: 25px; 
    align-items: flex-start; 
    /* margin: 8px 0 12px; */
  }

  .nav-item { width: 100%;
     border-bottom: none; 
     font-size: 20px;
    }
  .nav-link { 
    width: 100%; 
    display: flex;
    align-items: center;
    justify-content: flex-start; 
    padding: 10px 0; 
    flex-wrap: nowrap; 
    gap: 8px;
    line-height: 1.3;
  }
  /* .chevron{
   margin-bottom: 20px;
  } */
  /* Text + badge grouped left, chevron pushed right */
  .nav-link > span:first-child { 
    flex: 0 0 auto;
    line-height: 1.3;
  }
  .badge-new { position: static; margin-left: 4px; flex-shrink: 0; }
  .mobile-chevron { 
    margin-left: auto; 
    flex-shrink: 0;
    align-self: center;

  } 

  /* Desktop dropdown hidden on mobile (sub-panel used instead) */
  .dropdown-menu-custom { display: none !important; }

  .nav-divider { display: none; }
  .action-group { flex-direction: column; width: 100%; margin-top: 8px; gap: 0; }
  .btn-login, .btn-signup { width: 100%; height: 42px; margin-bottom: 8px; }
  .lang-container { width: 100%; }
  .lang-selector { width: 100%; justify-content: space-between; border: 1px solid var(--border); padding: 0 12px; }
  .lang-dropdown-menu { width: 100%; position: static; box-shadow: none; border: none; background: #fafafa; margin-top: 5px; }
}

@media (max-width: 480px) {
  .brand-logo { height: 36px; }
  .announcement-text { font-size: 13px; }
}

@media (min-width: 992px) and (max-width: 1366px) {
  .nav-inner { padding: 0 20px; gap: 14px; }
  .search-box { width: 220px; }
  .nav-links { gap: 25px; }
  .nav-link { padding: 6px 8px; }
  .chevron{ padding-left: 3px;}
}

@media (min-width: 1600px) {
  .nav-inner, .top-bar-inner { max-width: 1850px; padding: 0 3%; }
  .search-box{
    max-width: 500px;
    margin-left: 30px;
  }
  .nav-links{
    gap: 30px;
  }
  .chevron{
    padding-left: 10px;
    font-size: 25px;
  }
  .nav-divider{
    margin-right: 30px;
  }

}









/* =========================================
   USER PROFILE ICON & DROPDOWN STYLES
========================================= */

/* Profile Menu Container */
.profile-menu-container {
  position: relative;
  display: flex;
  align-items: center;
}

/* Pseudo-element bridge for profile dropdown - desktop only */
@media (min-width: 992px) {
  .profile-menu-container::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    height: 10px;
    background: transparent;
    z-index: 499;
  }
}

.avatar-btn {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
}

.avatar-img {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #F6881F; /* Theme color */
}

.avatar-initials {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #F6881F, #F18D21);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.5px;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(246,136,31,0.4);
  flex-shrink: 0;
  overflow: hidden; /* image crop ke liye */
  position: relative;
}

/* Profile image inside avatar */
.avatar-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

/* Dropdown Card (Desktop View) */
.profile-dropdown {
  position: absolute;
  top: calc(100% + 0px);
  right: 0;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  width: 260px;
  padding: 12px 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  border: 1px solid #eee;
  animation: fadeInDown 0.2s ease forwards;
}

/* Dropdown Links */
.profile-dropdown-item {
  display: flex;
  align-items: center;
  padding: 14px 24px;
  color: #333;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
}

.profile-dropdown-item:hover {
  background-color: #f9f9f9;
  color: #F6881F;
}

/* Icons styling */
.dropdown-icon {
  margin-right: 16px;
  font-size: 18px;
  color: #444;
  transition: color 0.2s ease;
}

.profile-dropdown-item:hover .dropdown-icon {
  color: #F6881F;
}

/* Logout Button Special Styling */
.logout-item {
  border-top: 1px solid #f0f0f0;
  margin-top: 5px;
  padding-top: 15px;
}

/* Desktop dropdown animation */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


/* =========================================
   MOBILE NAVBAR & PROFILE DROPDOWN FIXES
========================================= */

@media (max-width: 992px) {
  .profile-menu-container {
    position: relative !important;
    width: 100%;
    margin-top: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  /* Mobile: Avatar button — compact like nav item */
  .mob-profile-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 10px 0;
    border-bottom: none;
    cursor: pointer;
    gap: 12px;
  }

  .mob-profile-trigger:hover {
    background: #fafafa;
  }

  /* Hide name and email on mobile */
  .mob-profile-trigger-info,
  .mob-profile-name,
  .mob-profile-email {
    display: none !important;
  }

  /* Avatar styling */
  .mob-profile-avatar-sm {
    width: 42px;
    height: 42px;
  }

  .avatar-btn {
    margin-right: 0;
    padding: 10px 0;
    width: 100%;
    border-bottom: none;
    justify-content: center;
    gap: 10px;
  }

  /* Desktop dropdown hidden on mobile */
  .profile-dropdown {
    display: none !important;
  }

  /* Mobile sub-panel link icons styling */
  .mob-sub-links .mob-sub-link {
    display: flex;
    align-items: center;
  }

  .mob-sub-links .dropdown-icon {
    font-size: 16px;
    color: #666;
    flex-shrink: 0;
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* =========================================
   MOBILE OVERLAY (full screen dark bg)
========================================= */
.mobile-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 900;
  animation: fadeIn 0.25s ease;
}
.mobile-overlay.show {
  display: block;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* =========================================
   MOBILE MEGA PANEL — Accordion Styles
========================================= */

/* Groups list container */
.mob-mega-groups-list {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  overflow-y: auto;
  flex: 1;
}

/* Each group wrapper */
.mob-mega-group {
  border-bottom: 1px solid #f0f0f0;
}

/* Group header (tap to expand) */
.mob-mega-group-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 20px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  color: #333;
  transition: background 0.2s, color 0.2s;
  user-select: none;
}

.mob-mega-group-header:hover {
  background: #fafafa;
}

.mob-mega-group-header.active {
  color: var(--orange);
  background: #FFF5EB;
}

/* Group flag/icon */
.mob-mega-group-img {
  width: 26px;
  height: 26px;
  object-fit: contain;
  border-radius: 4px;
  flex-shrink: 0;
}

.mob-mega-group-name {
  flex: 1;
}

/* Accordion chevron */
.mob-mega-chevron {
  font-size: 13px;
  color: #bbb;
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.mob-mega-chevron.rotate {
  transform: rotate(180deg);
  color: var(--orange);
}

/* Accordion items container — collapsed by default */
.mob-mega-items-wrap {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.mob-mega-items-wrap.open {
  max-height: 800px; /* generous max for smooth animation */
}

/* Items list */
.mob-mega-items {
  list-style: none;
  padding: 4px 0 8px;
  margin: 0;
  background: #f8f8f8;
}

/* Each item link */
.mob-mega-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 20px 11px 34px;
  text-decoration: none;
  color: #444;
  font-size: 14px;
  border-bottom: 1px solid #efefef;
  transition: background 0.2s, color 0.2s;
}

.mob-mega-item:last-child {
  border-bottom: none;
}

.mob-mega-item:hover {
  background: #FFF5EB;
  color: var(--orange);
}

/* University logo in item */
.mob-mega-item-logo {
  width: 34px;
  height: 34px;
  object-fit: contain;
  border-radius: 5px;
  border: 1px solid #eee;
  padding: 2px;
  background: #fff;
  flex-shrink: 0;
}

.mob-mega-item-info {
  flex: 1;
  min-width: 0;
}

/* University name */
.mob-mega-item-uni {
  font-size: 11px;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin: 0 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Course/item title */
.mob-mega-item-title {
  font-size: 13px;
  font-weight: 500;
  color: #333;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Empty state */
.mob-mega-empty {
  padding: 16px 34px;
  font-size: 13px;
  color: #bbb;
  font-style: italic;
}

/* View All button at bottom of mega panel */
.mob-mega-view-all {
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;
  background: #fff;
  margin-top: auto;
  flex-shrink: 0;
}

.mob-mega-view-all-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 13px 16px;
  background: var(--grad);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  transition: opacity 0.2s;
  letter-spacing: 0.2px;
}

.mob-mega-view-all-btn:hover {
  opacity: 0.9;
}

/* ── Desktop: always hide mobile panels ───────────────────── */
@media (min-width: 992px) {
  .mob-sub-panel,
  .mob-mega-panel {
    display: none !important;
  }
}

/* ── Mobile only: mob-mega-panel flex column layout ────────── */
@media (max-width: 991px) {
  /* Make mob-mega-panel a flex column so view-all sticks to bottom */
  .mob-mega-panel {
    display: flex !important;
    flex-direction: column;
  }

  .mob-mega-panel .mob-mega-groups-list {
    flex: 1;
    overflow-y: auto;
  }
}
