import React, { useState, useEffect } from "react";
import T from "../../context/T";
import { Link, useSearchParams } from "react-router-dom";
import {
  FaFilter,
  FaTimes,
  FaChevronRight,
  FaGraduationCap,
  FaFireAlt,
} from "react-icons/fa";
import {
  MdKeyboardArrowRight,
  MdKeyboardArrowLeft,
  MdAccessTime,
} from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { GoDownload } from "react-icons/go";
import "../../assets/css/AllPrograms.css";
import RoboticImg from "../../assets/images/Robotic.png";
import { topProgramsApi } from "../../api/topProgramsApi";

const PAGE_SIZE = 6;

const AllTopPrograms = () => {
  const [searchParams] = useSearchParams();

  // ── Hero text ──────────────────────────────────────────────
  const [hero] = useState({
    HeadingLine1: "Explore globally coveted programs",
    HeadingLine2: "designed for your success",
    BgImage: null,
  });

  // ── Data state ─────────────────────────────────────────────
  const [categories, setCategories] = useState([]);
  const [allPrograms, setAllPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Filter state ───────────────────────────────────────────
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [countryFilter, setCountryFilter] = useState("");
  const [uniFilter, setUniFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState("Relevance");
  const [page, setPage] = useState(1);

  // ── Load categories + all programs ─────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const catData = await topProgramsApi.getCategories();
        if (catData.success) {
          const activeCats = (catData.categories || []).filter(
            (c) => c.IsActive
          );
          setCategories(activeCats);

          // URL mein category param hai toh pre-select kar do
          const catParam = searchParams.get("category");
          if (catParam) {
            const cat = activeCats.find((c) => c.Slug === catParam);
            if (cat) setSelectedFilters([cat.Name]);
          }
        }

        // Fetch all programs from all categories
        const allProgs = [];
        for (const cat of catData.categories || []) {
          if (!cat.IsActive) continue;
          const progData = await topProgramsApi.getProgramsByCategory(cat.Slug);
          if (progData.success && progData.programs) {
            allProgs.push(...progData.programs);
          }
        }
        setAllPrograms(allProgs);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchParams]);

  // ── Dropdown options ───────────────────────────────────────
  const countries = [
    ...new Set(allPrograms.map((p) => p.Country).filter(Boolean)),
  ];
  const universities = [
    ...new Set(allPrograms.map((p) => p.UniversityName).filter(Boolean)),
  ];

  // ── Filter tag logic ───────────────────────────────────────
  const handleTagClick = (tag) => {
    setPage(1);
    setSelectedFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleDropdownChange = (setter, value) => {
    setPage(1);
    setter(value);
    if (value) {
      setSelectedFilters((prev) =>
        prev.includes(value) ? prev : [...prev, value]
      );
    }
  };

  const clearAllFilters = () => {
    setPage(1);
    setSelectedFilters([]);
    setCountryFilter("");
    setUniFilter("");
    setCategoryFilter("");
  };

  // ── Filtering ──────────────────────────────────────────────
  const filtered = allPrograms.filter((prog) => {
    if (selectedFilters.length === 0) return true;
    return selectedFilters.every(
      (f) =>
        (prog.Country || "").toLowerCase().includes(f.toLowerCase()) ||
        (prog.UniversityName || "").toLowerCase().includes(f.toLowerCase()) ||
        (prog.Title || "").toLowerCase().includes(f.toLowerCase()) ||
        (prog.CategoryName || "").toLowerCase().includes(f.toLowerCase())
    );
  });

  // ── Sorting ────────────────────────────────────────────────
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "Popularity")
      return (b.IsPopular ? 1 : 0) - (a.IsPopular ? 1 : 0);
    return 0; // Relevance
  });

  // ── Pagination ─────────────────────────────────────────────
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="all-programs-page">
      {/* ── Breadcrumb ── */}
      <div className="container breadcrumb-container">
        <div className="hero-breadcrumb">
          <Link to="/">
            <T>All Programs</T>
          </Link>
          <FaChevronRight size={14} />
          <span>
            <T>Study Abroad Programs</T>
          </span>
        </div>
      </div>

      {/* ── Hero Banner ── */}
      <div
        className="programs-hero-banner"
        style={{ backgroundImage: `url(${hero.BgImage || RoboticImg})` }}
      >
        <div className="container hero-container">
          <div className="hero-text">
            <h1>
              <T>{hero.HeadingLine1}</T> <br />
              <span>
                <T>{hero.HeadingLine2}</T>
              </span>
            </h1>
          </div>
        </div>
      </div>

      <div className="container programs-main-container">
        {/* ── Filter Bar ── */}
        <div className="filter-bar-wrapper">
          <div className="filter-dropdowns">
            <button className="filter-main-btn" onClick={clearAllFilters}>
              <FaFilter /> <T>All Filter</T>
            </button>

            {/* Country */}
            <select
              className="filter-select"
              value={countryFilter}
              onChange={(e) =>
                handleDropdownChange(setCountryFilter, e.target.value)
              }
            >
              <option value="">
                <T>Country</T>
              </option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* University */}
            <select
              className="filter-select"
              value={uniFilter}
              onChange={(e) =>
                handleDropdownChange(setUniFilter, e.target.value)
              }
            >
              <option value="">
                <T>University</T>
              </option>
              {universities.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>

            {/* Category */}
            <select
              className="filter-select"
              value={categoryFilter}
              onChange={(e) =>
                handleDropdownChange(setCategoryFilter, e.target.value)
              }
            >
              <option value="">
                <T>Category</T>
              </option>
              {categories.map((cat) => (
                <option key={cat.Id} value={cat.Name}>
                  {cat.Name}
                </option>
              ))}
            </select>
          </div>

          <div className="sort-wrapper">
            <span>
              <T>Sort by:</T>
            </span>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="Relevance">
                <T>Relevance</T>
              </option>
              <option value="Popularity">
                <T>Popularity</T>
              </option>
            </select>
          </div>
        </div>

        {/* ── Filter Tags Row ── */}
        <div className="filter-tags-row">
          {selectedFilters.length > 0 && (
            <button className="clear-all-btn" onClick={clearAllFilters}>
              <T>Clear All</T> <FaTimes />
            </button>
          )}

          {/* Active filters as chips */}
          {selectedFilters.map((tag, i) => (
            <button
              key={i}
              className="filter-tag-chip active"
              onClick={() => handleTagClick(tag)}
            >
              {tag} <FaTimes className="filter-tag-close-icon" />
            </button>
          ))}

          {/* Category chips */}
          {categories
            .filter((cat) => !selectedFilters.includes(cat.Name))
            .map((cat) => (
              <button
                key={cat.Id}
                className="filter-tag-chip"
                onClick={() => handleTagClick(cat.Name)}
              >
                {cat.Name}
              </button>
            ))}
        </div>

        {/* ── Program Cards ── */}
        <div className="programs-list-section">
          {loading ? (
            <p className="programs-status-msg">
              <T>Loading programs...</T>
            </p>
          ) : paginated.length === 0 ? (
            <p className="no-programs-text">
              <T>No programs found matching your filters.</T>
            </p>
          ) : (
            paginated.map((prog) => (
              <div className="program-card" key={prog.Id}>
                <div className="prog-card-left">
                  <div className="prog-uni-logo">
                    {prog.UniversityLogo ? (
                      <img src={prog.UniversityLogo} alt={prog.UniversityName} />
                    ) : (
                      <div className="prog-logo-placeholder" />
                    )}
                  </div>
                  <div className="prog-details">
                    <span className="uni-location">
                      <FaLocationDot size={16} className="location-icon" />
                      {prog.UniversityName || prog.CategoryName}
                    </span>
                    <h3>
                      <T>{prog.Title}</T>
                    </h3>
                    <div className="prog-meta">
                      <FaGraduationCap size={16} className="icon-time" />
                      <span>{prog.CategoryName}</span>
                      {prog.Duration && (
                        <>
                          <MdAccessTime size={16} className="icon-time" />
                          <span>{prog.Duration}</span>
                        </>
                      )}
                    </div>
                    {prog.IsPopular && (
                      <span className="prog-badge">
                        <FaFireAlt size={12} className="fire-icon" />
                        <T>POPULAR</T>
                      </span>
                    )}
                  </div>
                </div>
                <div className="prog-card-right">
                  <Link
                    to={
                      prog.HasDetails
                        ? `/study-abroad/programs/${prog.Slug}`
                        : "#"
                    }
                    className={`btn-view-program ${!prog.HasDetails ? "prog-btn-disabled" : ""}`}
                  >
                    <T>View Program</T>
                  </Link>
                  <a
                    href={prog.BrochureUrl || "#"}
                    target={prog.BrochureUrl ? "_blank" : undefined}
                    rel="noreferrer"
                    className={`btn-syllabus ${!prog.BrochureUrl ? "prog-btn-disabled" : ""}`}
                  >
                    <T>Brochure</T> <GoDownload size={18} />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="programs-pagination">
            <button
              className="page-arrow"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <MdKeyboardArrowLeft />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
              )
              .reduce((acc, p, i, arr) => {
                if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((item, i) =>
                item === "..." ? (
                  <span key={`ellipsis-${i}`}>...</span>
                ) : (
                  <button
                    key={item}
                    className={`page-num ${page === item ? "active" : ""}`}
                    onClick={() => {
                      setPage(item);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    {item}
                  </button>
                )
              )}

            <button
              className="page-arrow"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <MdKeyboardArrowRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTopPrograms;
