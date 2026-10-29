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
  FaGraduationCap,
  FaBell,
  FaCheck,
  FaFire,
  FaLaptopCode,
  FaGlobeAmericas,
  FaUniversity,
  FaLayerGroup,
  FaArrowRight
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import T from "../context/T";
import "../assets/css/Navbar.css";
import "../assets/css/MegaDropdown.css";
import { navbarApi } from "../api/navbarApi";
import { navbarDropdownApi } from "../api/navbarDropdownApi";
import { careerApi } from "../api/careerApi";
import { onlineCourseApi } from "../api/onlineCourseApi";
import { authApi } from "../api/authApi";
import { lmsApi } from "../api/lmsApi";

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

  // ── Live Search & Filter State ─────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState("all"); // 'all' | 'career' | 'online' | 'abroad'
  const [searchSelectedIndex, setSearchSelectedIndex] = useState(-1);
  const [catalogCourses, setCatalogCourses] = useState({ career: [], online: [] });
  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);

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
    setIsSearchOpen(false);
    setSearchSelectedIndex(-1);
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

    // Fetch all public courses for comprehensive global search & filtering
    Promise.allSettled([
      careerApi.getPublicCareerData(),
      onlineCourseApi.getAllPublicOnlineCourses(999)
    ]).then(([careerRes, onlineRes]) => {
      const careerCourses = (careerRes.status === "fulfilled" && careerRes.value?.success)
        ? (careerRes.value.courses || [])
        : [];
      const onlineCourses = (onlineRes.status === "fulfilled" && onlineRes.value?.success)
        ? (onlineRes.value.courses || onlineRes.value.data?.courses || [])
        : [];
      setCatalogCourses({ career: careerCourses, online: onlineCourses });
    }).catch(() => {});
  }, []);

  // ── Search Dropdown Outside Click Listener ─────────────────
  useEffect(() => {
    const handleOutsideClick = (e) => {
      const isInsideDesktop = desktopSearchRef.current && desktopSearchRef.current.contains(e.target);
      const isInsideMobile = mobileSearchRef.current && mobileSearchRef.current.contains(e.target);
      if (!isInsideDesktop && !isInsideMobile) {
        setIsSearchOpen(false);
        setSearchSelectedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
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

  // ── Notifications for Profile Menu ─────────────────────────
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await lmsApi.getNotifications();
      if (res.success) {
        setNotifications(res.notifications || []);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (e) {}
  };

  const handleMarkNotificationRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await lmsApi.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.NotificationID === id ? { ...n, IsRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {}
  };

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

  // ── Unified Searchable Dataset ────────────────────────────
  const allSearchCatalog = [
    ...catalogCourses.career.map((c, i) => ({
      id: `career-${c.Id || c.Slug || i}`,
      title: c.Title || "Career Track Program",
      slug: c.Slug || "",
      category: "career",
      categoryLabel: "Career Track",
      badgeColor: "orange",
      university: c.Eligibility || "Industry Masterclass",
      duration: c.Duration || "6 Months",
      logo: null,
      url: `/course-detail/${c.Slug || c.Id}`,
      skills: ["Full Stack", "Data Science", "Python", "React", "AI", "Cloud", "Career Track"]
    })),
    ...catalogCourses.online.map((c, i) => ({
      id: `online-${c.Id || c.Slug || i}`,
      title: c.Title || "Online Degree Program",
      slug: c.Slug || "",
      category: "online",
      categoryLabel: "Online Degree",
      badgeColor: "blue",
      university: c.UniversityName || "Accredited University",
      duration: c.Duration || "12 Months",
      logo: c.UniversityLogo || null,
      url: `/online-course-detail/${c.Slug || c.Id}`,
      skills: ["Degree", "Masterclass", "Diploma", "Certification", "Online Course"]
    })),
    ...(dropdownData.items || []).map((item, i) => {
      const isAbroad = item.Url?.includes("abroad") || item.Title?.toLowerCase().includes("abroad");
      return {
        id: `dropdown-${item.Id || i}`,
        title: item.Title || "Certification Course",
        slug: item.Slug || "",
        category: isAbroad ? "abroad" : "career",
        categoryLabel: isAbroad ? "Study Abroad" : "Certification",
        badgeColor: isAbroad ? "purple" : "green",
        university: item.UniversityName || "Global Partner",
        duration: "Flexible",
        logo: item.UniversityLogo || null,
        url: item.Slug ? `/courses/${item.Slug}` : (item.Url || "/all-Courses"),
        skills: ["Global", "Campus", "Mentorship", "Certificate"]
      };
    })
  ];

  // Deduplicate by title
  const uniqueSearchCatalog = allSearchCatalog.filter((item, index, self) =>
    index === self.findIndex((t) => t.title.trim().toLowerCase() === item.title.trim().toLowerCase())
  );

  const queryClean = searchQuery.trim().toLowerCase();

  const filteredSearchResults = uniqueSearchCatalog.filter(item => {
    const matchesQuery = !queryClean || 
      item.title.toLowerCase().includes(queryClean) ||
      item.university.toLowerCase().includes(queryClean) ||
      item.categoryLabel.toLowerCase().includes(queryClean) ||
      item.skills.some(s => s.toLowerCase().includes(queryClean));
    
    const matchesCategory = searchFilter === "all" || item.category === searchFilter;
    return matchesQuery && matchesCategory;
  });

  const searchCounts = {
    all: uniqueSearchCatalog.filter(item => !queryClean || item.title.toLowerCase().includes(queryClean) || item.university.toLowerCase().includes(queryClean)).length,
    career: uniqueSearchCatalog.filter(item => item.category === "career" && (!queryClean || item.title.toLowerCase().includes(queryClean) || item.university.toLowerCase().includes(queryClean))).length,
    online: uniqueSearchCatalog.filter(item => item.category === "online" && (!queryClean || item.title.toLowerCase().includes(queryClean) || item.university.toLowerCase().includes(queryClean))).length,
    abroad: uniqueSearchCatalog.filter(item => item.category === "abroad" && (!queryClean || item.title.toLowerCase().includes(queryClean) || item.university.toLowerCase().includes(queryClean))).length
  };

  const highlightMatch = (text, query) => {
    if (!query || !text) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="nav-search-highlight">{part}</mark>
      ) : part
    );
  };

  const handleSearchKeyDown = (e) => {
    if (!isSearchOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSearchSelectedIndex(prev => Math.min(prev + 1, filteredSearchResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSearchSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (searchSelectedIndex >= 0 && filteredSearchResults[searchSelectedIndex]) {
        navigate(filteredSearchResults[searchSelectedIndex].url);
        setIsSearchOpen(false);
        setSearchQuery("");
        closeMenu();
      } else if (filteredSearchResults.length > 0) {
        navigate(filteredSearchResults[0].url);
        setIsSearchOpen(false);
        setSearchQuery("");
        closeMenu();
      }
    } else if (e.key === "Escape") {
      setIsSearchOpen(false);
    }
  };

  const handleSelectSearchResult = (url) => {
    navigate(url);
    setIsSearchOpen(false);
    setSearchQuery("");
    closeMenu();
  };

  const renderSearchDropdown = () => {
    // Dropdown tabhi dikhega jab user search box me kuch type karega
    if (!isSearchOpen || !queryClean) return null;

    return (
      <div className="nav-search-dropdown" onMouseDown={(e) => e.stopPropagation()}>
        {/* Category Filters Bar */}
        <div className="nav-search-filters-bar">
          <button 
            type="button"
            className={`search-pill-btn ${searchFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSearchFilter('all')}
          >
            All <span className="search-pill-count">{searchCounts.all}</span>
          </button>
          <button 
            type="button"
            className={`search-pill-btn ${searchFilter === 'career' ? 'active' : ''}`}
            onClick={() => setSearchFilter('career')}
          >
            <FaLayerGroup size={11} /> Career Tracks <span className="search-pill-count">{searchCounts.career}</span>
          </button>
          <button 
            type="button"
            className={`search-pill-btn ${searchFilter === 'online' ? 'active' : ''}`}
            onClick={() => setSearchFilter('online')}
          >
            <FaLaptopCode size={11} /> Online Degrees <span className="search-pill-count">{searchCounts.online}</span>
          </button>
          <button 
            type="button"
            className={`search-pill-btn ${searchFilter === 'abroad' ? 'active' : ''}`}
            onClick={() => setSearchFilter('abroad')}
          >
            <FaGlobeAmericas size={11} /> Study Abroad <span className="search-pill-count">{searchCounts.abroad}</span>
          </button>
        </div>

        {filteredSearchResults.length === 0 ? (
          /* No Results Found State */
          <div className="nav-search-empty">
            <FaSearch className="nav-search-empty-icon" />
            <h5>No matching courses found</h5>
            <p>We couldn't find any courses matching "<strong>{searchQuery}</strong>".</p>
            <div className="d-flex justify-content-center gap-2">
              <button 
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => {
                  setSearchQuery("");
                  setIsSearchOpen(false);
                }}
              >
                Clear Search
              </button>
              <button 
                type="button"
                className="btn btn-sm btn-warning text-white fw-bold"
                onClick={() => { setIsSearchOpen(false); setShowExpert(true); closeMenu(); }}
              >
                Talk to an Expert
              </button>
            </div>
          </div>
        ) : (
          /* Filtered Results List */
          <ul className="nav-search-results-list">
            {filteredSearchResults.map((item, idx) => (
              <li key={item.id}>
                <div
                  className={`nav-search-item ${searchSelectedIndex === idx ? 'selected' : ''}`}
                  onClick={() => handleSelectSearchResult(item.url)}
                  onMouseEnter={() => setSearchSelectedIndex(idx)}
                >
                  <div className="nav-search-item-left">
                    {item.logo ? (
                      <img src={item.logo} alt={item.university} className="nav-search-item-icon" />
                    ) : item.category === "online" ? (
                      <div className="nav-search-item-icon"><FaLaptopCode /></div>
                    ) : item.category === "abroad" ? (
                      <div className="nav-search-item-icon"><FaGlobeAmericas /></div>
                    ) : (
                      <div className="nav-search-item-icon"><FaGraduationCap /></div>
                    )}
                    
                    <div className="nav-search-item-info">
                      <h4 className="nav-search-title">
                        {highlightMatch(item.title, searchQuery)}
                      </h4>
                      <div className="nav-search-meta">
                        <span className={`nav-search-badge badge-${item.badgeColor}`}>
                          {item.categoryLabel}
                        </span>
                        <span>&bull; {item.university}</span>
                        {item.duration && <span>&bull; {item.duration}</span>}
                      </div>
                    </div>
                  </div>

                  <FaArrowRight className="nav-search-arrow" />
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Footer with Keyboard Hints */}
        <div className="nav-search-footer">
          <span><span><kbd>&uarr;</kbd><kbd>&darr;</kbd> Navigate</span> &bull; <span><kbd>&crarr;</kbd> Select</span></span>
          <span><kbd>ESC</kbd> Close</span>
        </div>
      </div>
    );
  };

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
          <div className="search-box" ref={desktopSearchRef}>
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search Courses, Skills, Universities..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                setSearchQuery(val);
                setIsSearchOpen(val.trim().length > 0);
                setSearchSelectedIndex(-1);
              }}
              onFocus={() => {
                if (searchQuery.trim().length > 0) setIsSearchOpen(true);
              }}
              onKeyDown={handleSearchKeyDown}
            />
            {searchQuery && (
              <button 
                type="button" 
                className="search-clear-btn"
                onClick={() => {
                  setSearchQuery("");
                  setIsSearchOpen(false);
                }}
              >
                <FaTimes />
              </button>
            )}

            {/* Desktop Search Dropdown & Filter Panel */}
            {renderSearchDropdown()}
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
              <span className="lang-name-text">
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

              <div className="search-box-mobile" ref={mobileSearchRef}>
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search Courses, Skills, Universities..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSearchQuery(val);
                    setIsSearchOpen(val.trim().length > 0);
                    setSearchSelectedIndex(-1);
                  }}
                  onFocus={() => {
                    if (searchQuery.trim().length > 0) setIsSearchOpen(true);
                  }}
                  onKeyDown={handleSearchKeyDown}
                />
                {searchQuery && (
                  <button 
                    type="button" 
                    className="search-clear-btn"
                    onClick={() => {
                      setSearchQuery("");
                      setIsSearchOpen(false);
                    }}
                  >
                    <FaTimes />
                  </button>
                )}

                {/* Mobile Search Dropdown */}
                {renderSearchDropdown()}
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
                          <FaChevronRight className="mobile-chevron" />
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
                          <FaChevronRight className="mobile-chevron" />
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
                        <div className="avatar-initials mob-profile-avatar-sm position-relative">
                          {user.profile_image || user.ProfileImage ? (
                            <img
                              src={user.profile_image || user.ProfileImage}
                              alt={user.full_name}
                              className="avatar-img"
                              onError={(e) => {
                                e.target.className = "avatar-img hidden";
                                e.target.nextSibling.className = "avatar-fallback visible";
                              }}
                            />
                          ) : null}
                          <span
                            className="avatar-fallback"
                          >
                            {getInitials(user.full_name)}
                          </span>
                          {unreadCount > 0 && <span className="profile-unread-dot" />}
                        </div>
                        <FaChevronRight className="mobile-chevron" />
                      </div>
                    ) : (
                      /* ── Desktop: avatar + dropdown ── */
                      <>
                        <div
                          className="avatar-btn position-relative"
                          onMouseEnter={() => !isMobileView() && setProfileDropdownOpen(true)}
                          onMouseLeave={() => !isMobileView() && setProfileDropdownOpen(false)}
                          title={user.full_name}
                        >
                          <div className="avatar-initials">
                            {user.profile_image || user.ProfileImage ? (
                              <img
                                src={user.profile_image || user.ProfileImage}
                                alt={user.full_name}
                                className="avatar-img"
                                onError={(e) => {
                                  e.target.className = "avatar-img hidden";
                                  e.target.nextSibling.className = "avatar-fallback visible";
                                }}
                              />
                            ) : null}
                            <span
                              className="avatar-fallback"
                            >
                              {getInitials(user.full_name)}
                            </span>
                          </div>
                          {unreadCount > 0 && <span className="profile-unread-dot" />}
                          <FaChevronDown
                            className={`chevron avatar-chevron ${profileDropdownOpen ? "rotate" : ""}`}
                          />
                        </div>

                        {profileDropdownOpen && (
                          <div 
                            className="profile-dropdown"
                            onMouseEnter={() => !isMobileView() && setProfileDropdownOpen(true)}
                            onMouseLeave={() => !isMobileView() && setProfileDropdownOpen(false)}
                          >
                            {/* User Header */}
                            <div className="profile-header-card">
                              <span className="profile-header-name">{user.full_name || "Student"}</span>
                              <span className="profile-header-email">{user.email || ""}</span>
                            </div>

                            {/* Core Navigation Links */}
                            <Link to="/my-learning" className="profile-dropdown-item"
                              onClick={() => { setProfileDropdownOpen(false); closeMenu(); }}>
                              <FaGraduationCap className="dropdown-icon" /> <T>My Learning</T>
                            </Link>
                            <Link to="/profile" className="profile-dropdown-item"
                              onClick={() => { setProfileDropdownOpen(false); closeMenu(); }}>
                              <FaUser className="dropdown-icon" /> <T>View Profile</T>
                            </Link>

                            {/* In-Dropdown Notifications Section */}
                            <div className="profile-notif-section">
                              <div className="profile-notif-header">
                                <span><FaBell className="me-1" /> Notifications</span>
                                {unreadCount > 0 && (
                                  <span className="badge-notif-count">{unreadCount} New</span>
                                )}
                              </div>
                              <div className="profile-notif-list">
                                {notifications.slice(0, 3).map((n) => (
                                  <Link
                                    key={n.NotificationID}
                                    to={n.LinkURL || "/my-learning"}
                                    className="profile-notif-item"
                                    onClick={() => {
                                      handleMarkNotificationRead(n.NotificationID);
                                      setProfileDropdownOpen(false);
                                      closeMenu();
                                    }}
                                  >
                                    <div className="notif-title">{n.Title}</div>
                                    <div className="notif-msg">{n.Message}</div>
                                  </Link>
                                ))}
                                {notifications.length === 0 && (
                                  <div className="text-muted small p-2 text-center" style={{ fontSize: 11 }}>
                                    No new notifications
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Logout */}
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
                    <span className="lang-text">
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
