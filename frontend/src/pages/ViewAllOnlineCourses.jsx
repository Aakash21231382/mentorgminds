import React, { useState, useEffect } from "react";
import T from "../context/T";
import { Link, useSearchParams } from "react-router-dom";
import {
    FaFilter, FaTimes, FaChevronRight,
    FaGraduationCap, FaFireAlt, FaDownload,
} from "react-icons/fa";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft, MdAccessTime } from "react-icons/md";
import { GoDownload } from "react-icons/go";
import "../assets/css/AllPrograms.css";
import RoboticImg from "../assets/images/Robotic.png";
import { onlineCourseApi } from "../api/onlineCourseApi";
import FreeCourses from "../component/FreeCourses";
const PAGE_SIZE = 6;

// Same as CourseCard.jsx — window.open in new tab
const handleBrochure = (url) => {
    if (url) window.open(url, '_blank');
};

const ViewAllOnlineCourses = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // ── Data state ────────────────────────────────────────────
    const [categories,  setCategories]  = useState([]);
    const [allCourses,  setAllCourses]  = useState([]);
    const [loading,     setLoading]     = useState(true);

    // ── Filter state ──────────────────────────────────────────
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [categoryFilter,  setCategoryFilter]  = useState("");
    const [featureFilter,   setFeatureFilter]   = useState("");
    const [subtitleFilter,  setSubtitleFilter]  = useState("");
    const [sortBy,          setSortBy]          = useState("Relevance");
    const [page,            setPage]            = useState(1);

    // ── Load all data at once (client-side filter/pagination) ─
    useEffect(() => {
        // Load categories for filter chips
        onlineCourseApi.getPublicOnlineCourses()
            .then(d => {
                if (d.success) {
                    setCategories(d.categories || []);
                    const catParam = searchParams.get("category");
                    if (catParam) {
                        const cat = (d.categories || []).find(c => c.Id === parseInt(catParam));
                        if (cat) setSelectedFilters([cat.Name]);
                    }
                }
            })
            .catch(console.error);

        // Load all courses (client-side pagination)
        onlineCourseApi.getAllPublicOnlineCourses(999)
            .then(d => { if (d.success) setAllCourses(d.courses || []); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    // ── Dropdown options — dynamic from data ──────────────────
    const programTypes  = [...new Set(allCourses.map(c => c.CategoryName).filter(Boolean))];
    const featureTypes  = [...new Set(allCourses.map(c => c.Feature1).filter(Boolean))];
    const subtitleTypes = [...new Set(allCourses.map(c => c.Subtitle).filter(Boolean))];

    // ── Filter tag logic ──────────────────────────────────────
    const handleTagClick = (tag) => {
        setPage(1);
        setSelectedFilters(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const handleDropdownChange = (setter, value) => {
        setPage(1);
        setter(value);
        if (value) {
            setSelectedFilters(prev =>
                prev.includes(value) ? prev : [...prev, value]
            );
        }
    };

    const clearAllFilters = () => {
        setPage(1);
        setSelectedFilters([]);
        setCategoryFilter("");
        setFeatureFilter("");
        setSubtitleFilter("");
        setSearchParams({});
    };

    // ── Filtering ─────────────────────────────────────────────
    const filtered = allCourses.filter(course => {
        if (selectedFilters.length === 0) return true;
        return selectedFilters.every(f =>
            (course.CategoryName || "").toLowerCase().includes(f.toLowerCase()) ||
            (course.Title        || "").toLowerCase().includes(f.toLowerCase()) ||
            (course.Subtitle     || "").toLowerCase().includes(f.toLowerCase()) ||
            (course.Feature1     || "").toLowerCase().includes(f.toLowerCase()) ||
            (course.Feature2     || "").toLowerCase().includes(f.toLowerCase()) ||
            (course.Feature3     || "").toLowerCase().includes(f.toLowerCase())
        );
    });

    // ── Sorting ───────────────────────────────────────────────
    const sorted = [...filtered].sort((a, b) => {
        if (sortBy === "Popularity") return (b.ExtraSkills || 0) - (a.ExtraSkills || 0);
        return 0;
    });

    // ── Pagination ────────────────────────────────────────────
    const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
    const paginated  = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    // Skill images parse helper
    const getSkillImages = (course) => {
        if (course.SkillImages) {
            try { return JSON.parse(course.SkillImages); } catch { return []; }
        }
        if (course.SkillImage) return [course.SkillImage];
        return [];
    };

    return (
        <div className="all-programs-page">

            {/* ── Breadcrumb ── */}
            <div className="container breadcrumb-container">
                <div className="hero-breadcrumb">
                    <Link to="/"><T>Home</T></Link>
                    <FaChevronRight size={14} />
                    <span><T>Online Courses</T></span>
                </div>
            </div>

            {/* ── Hero Banner ── */}
            <div className="programs-hero-banner" style={{ backgroundImage: `url(${RoboticImg})` }}>
                <div className="container hero-container">
                    <div className="hero-text">
                        <h1>
                            <T>Online Courses with</T> <br />
                            <span><T>Placement Assistance</T></span>
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

                        {/* Category / Program Type */}
                        <select
                            className="filter-select"
                            value={categoryFilter}
                            onChange={e => handleDropdownChange(setCategoryFilter, e.target.value)}
                        >
                            <option value=""><T>Category</T></option>
                            {programTypes.map(pt => <option key={pt} value={pt}>{pt}</option>)}
                        </select>

                        {/* Program Duration / Subtitle */}
                        <select
                            className="filter-select"
                            value={subtitleFilter}
                            onChange={e => handleDropdownChange(setSubtitleFilter, e.target.value)}
                        >
                            <option value=""><T>Program Type</T></option>
                            {subtitleTypes.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>

                        {/* Feature / Skill */}
                        <select
                            className="filter-select"
                            value={featureFilter}
                            onChange={e => handleDropdownChange(setFeatureFilter, e.target.value)}
                        >
                            <option value=""><T>Features</T></option>
                            {featureTypes.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                    </div>

                    <div className="sort-wrapper">
                        <span><T>Sort by:</T></span>
                        <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                            <option value="Relevance"><T>Relevance</T></option>
                            <option value="Popularity"><T>Popularity</T></option>
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
                    {selectedFilters.map((tag, i) => (
                        <button
                            key={i}
                            className="filter-tag-chip active"
                            onClick={() => handleTagClick(tag)}
                        >
                            {tag} <FaTimes className="filter-tag-close-icon" />
                        </button>
                    ))}
                    {categories
                        .filter(cat => !selectedFilters.includes(cat.Name))
                        .map(cat => (
                            <button
                                key={cat.Id}
                                className="filter-tag-chip"
                                onClick={() => handleTagClick(cat.Name)}
                            >
                                {cat.Name}
                            </button>
                        ))}
                </div>


          
                {/* ── Program Cards — same layout as AllPrograms ── */}
                <div className="programs-list-section">
                    {loading ? (
                        <p className="programs-status-msg">
                            <T>Loading courses...</T>
                        </p>
                    ) : paginated.length === 0 ? (
                        <p className="no-programs-text"><T>No courses found matching your filters.</T></p>
                    ) : (
                        paginated.map((course) => {
                            const skillImgs = getSkillImages(course);
                            return (
                                <div className="program-card" key={course.Id}>
                                    <div className="prog-card-left">
                                        {/* Course banner image as logo/thumbnail */}
                                        <div className="prog-uni-logo">
                                            {course.Image
                                                ? <img src={course.Image} alt={course.Title} />
                                                : <div className="prog-logo-placeholder" />}
                                        </div>
                                        <div className="prog-details">
                                            {/* Category badge as location */}
                                            <span className="uni-location">
                                                <FaGraduationCap size={16} className="location-icon" />
                                                {course.CategoryName || '—'}
                                            </span>
                                            <h3><T>{course.Title}</T></h3>
                                            <div className="prog-meta">
                                                {course.Subtitle && (
                                                    <><MdAccessTime size={16} className="icon-time" /><span>{course.Subtitle}</span></>
                                                )}
                                                {/* Skill images inline */}
                                                {skillImgs.length > 0 && (
                                                    <span className="prog-skill-list">
                                                        {skillImgs.slice(0, 4).map((src, i) => (
                                                            <img key={i} src={src} alt={`skill-${i}`} className="prog-skill-img" />
                                                        ))}
                                                        {course.ExtraSkills > 0 && (
                                                            <span className="prog-skill-more">
                                                                & {course.ExtraSkills} more
                                                            </span>
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                            {/* Features */}
                                            {(course.Feature1 || course.Feature2) && (
                                                <div className="prog-meta prog-features-row">
                                                    {course.Feature1 && <span className="prog-feature-badge">✓ {course.Feature1}</span>}
                                                    {course.Feature2 && <span className="prog-feature-badge">✓ {course.Feature2}</span>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="prog-card-right">
                                        <a
                                            href={course.Slug ? `/online-course-detail/${course.Slug}` : (course.ProgramUrl || '#')}
                                            className={`btn-view-program${(!course.Slug && !course.ProgramUrl) ? ' prog-btn-disabled' : ''}`}
                                        >
                                            <T>View Program</T>
                                        </a>
                                        <button
                                            onClick={() => handleBrochure(course.BrochureUrl)}
                                            className={`btn-syllabus${!course.BrochureUrl ? ' prog-btn-disabled' : ''}`}
                                            disabled={!course.BrochureUrl}
                                        >
                                            <T>Brochure</T> <GoDownload size={18} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>


                <div className='container'>
                     <FreeCourses/>
                     </div>

                {/* ── Pagination ── */}
                {totalPages > 1 && (
                    <div className="programs-pagination">
                        <button
                            className="page-arrow"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            <MdKeyboardArrowLeft />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
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
                                        onClick={() => { setPage(item); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                                    >
                                        {item}
                                    </button>
                                )
                            )
                        }

                        <button
                            className="page-arrow"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
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

export default ViewAllOnlineCourses;
