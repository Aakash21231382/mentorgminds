import React, { useState, useEffect } from "react";
import T from "../context/T";
import { Link, useSearchParams } from "react-router-dom";
import {
    FaFilter, FaTimes, FaChevronRight,
    FaGraduationCap, FaFireAlt,
} from "react-icons/fa";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft, MdAccessTime } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { GoDownload } from "react-icons/go";
import "../assets/css/AllPrograms.css";
import RoboticImg from "../assets/images/Robotic.png";
import { careerApi } from "../api/careerApi";
import FreeCourses from "../component/FreeCourses";
const PAGE_SIZE = 6;

const AllPrograms = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // ── Hero text from API ────────────────────────────────────
    const [hero, setHero] = useState({
        HeadingLine1: 'Invest in yourself today. Unlock',
        HeadingLine2: 'success for a lifetime.',
        BgImage:      null,
    });

    // ── Data state ────────────────────────────────────────────
    const [categories,  setCategories]  = useState([]);
    const [allCourses,  setAllCourses]  = useState([]);
    const [loading,     setLoading]     = useState(true);

    // ── Filter state ──────────────────────────────────────────
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [domainFilter,    setDomainFilter]    = useState("");
    const [uniFilter,       setUniFilter]       = useState("");
    const [typeFilter,      setTypeFilter]      = useState("");
    const [durationFilter,  setDurationFilter]  = useState("");
    const [sortBy,          setSortBy]          = useState("Relevance");
    const [page,            setPage]            = useState(1);

    // ── Load hero text + courses ──────────────────────────────
    useEffect(() => {
        // Hero text
        careerApi.getAllProgramsHero()
            .then(d => { if (d.success && d.hero) setHero(d.hero); })
            .catch(console.error);

        // Career courses
        careerApi.getPublicCareerData()
            .then(d => {
                if (d.success) {
                    setCategories(d.categories || []);
                    setAllCourses(d.courses    || []);

                    // URL mein category param hai toh tag laga do
                    const catParam = searchParams.get("category");
                    if (catParam) {
                        const cat = (d.categories || []).find(c => c.Id === parseInt(catParam));
                        if (cat) setSelectedFilters([cat.Name]);
                    }
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    // ── Dropdown options — dynamic from data ──────────────────
    const domains      = [...new Set(allCourses.map(c => c.Location).filter(Boolean))];
    const universities = [...new Set(allCourses.map(c => c.Location).filter(Boolean))];
    const programTypes = [...new Set(allCourses.map(c => c.Ribbon).filter(Boolean))];
    const durations    = [...new Set(categories.map(c => c.Name).filter(Boolean))];

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
        setDomainFilter("");
        setUniFilter("");
        setTypeFilter("");
        setDurationFilter("");
    };

    // ── Filtering ─────────────────────────────────────────────
    const filtered = allCourses.filter(course => {
        if (selectedFilters.length === 0) return true;
        return selectedFilters.every(f =>
            (course.Location  || "").toLowerCase().includes(f.toLowerCase()) ||
            (course.Title     || "").toLowerCase().includes(f.toLowerCase()) ||
            (course.Ribbon    || "").toLowerCase().includes(f.toLowerCase()) ||
            // category name match
            categories.find(c => c.Id === course.CategoryId)?.Name?.toLowerCase().includes(f.toLowerCase())
        );
    });

    // ── Sorting ───────────────────────────────────────────────
    const sorted = [...filtered].sort((a, b) => {
        if (sortBy === "Popularity") return (b.StudentsEnrolled || 0) - (a.StudentsEnrolled || 0);
        return 0; // Relevance — default order
    });

    // ── Pagination ────────────────────────────────────────────
    const totalPages   = Math.ceil(sorted.length / PAGE_SIZE);
    const paginated    = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    // Inline free courses banner insert karo after index 1 (same as original)
    const FREE_COURSES_AFTER_INDEX = 1;

    // Category name from id
    const getCatName = (id) => categories.find(c => c.Id === id)?.Name || "";

    return (
        <div className="all-programs-page">

            {/* ── Breadcrumb ── */}
            <div className="container breadcrumb-container">
                <div className="hero-breadcrumb">
                    <Link to="/"><T>All Programs</T></Link>
                    <FaChevronRight size={14} />
                    <span><T>All Courses</T></span>
                </div>
            </div>

            {/* ── Hero Banner ── */}
            <div className="programs-hero-banner" style={{ backgroundImage: `url(${hero.BgImage || RoboticImg})` }}>
                <div className="container hero-container">
                    <div className="hero-text">
                        <h1>
                            <T>{hero.HeadingLine1 || 'Invest in yourself today. Unlock'}</T> <br />
                            <span><T>{hero.HeadingLine2 || 'success for a lifetime.'}</T></span>
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

                        {/* Domain / Location */}
                        <select
                            className="filter-select"
                            value={domainFilter}
                            onChange={e => handleDropdownChange(setDomainFilter, e.target.value)}
                        >
                            <option value=""><T>Domain</T></option>
                            {domains.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>

                        {/* University — same as location for now */}
                        <select
                            className="filter-select"
                            value={uniFilter}
                            onChange={e => handleDropdownChange(setUniFilter, e.target.value)}
                        >
                            <option value=""><T>University</T></option>
                            {universities.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>

                        {/* Program Type / Ribbon */}
                        <select
                            className="filter-select"
                            value={typeFilter}
                            onChange={e => handleDropdownChange(setTypeFilter, e.target.value)}
                        >
                            <option value=""><T>Program Type</T></option>
                            {programTypes.map(pt => <option key={pt} value={pt}>{pt}</option>)}
                        </select>

                        {/* Duration / Category */}
                        <select
                            className="filter-select"
                            value={durationFilter}
                            onChange={e => handleDropdownChange(setDurationFilter, e.target.value)}
                        >
                            <option value=""><T>Category</T></option>
                            {durations.map(d => <option key={d} value={d}>{d}</option>)}
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

                    {/* Category chips (quick filter) */}
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

                {/* ── Program Cards ── */}
                <div className="programs-list-section">
                    {loading ? (
                        <p className="programs-status-msg">
                            <T>Loading courses...</T>
                        </p>
                    ) : paginated.length === 0 ? (
                        <p className="no-programs-text"><T>No programs found matching your filters.</T></p>
                    ) : (
                        paginated.map((course, idx) => (
                            <React.Fragment key={course.Id}>

                                {/* Program Card */}
                                <div className="program-card">
                                    <div className="prog-card-left">
                                        <div className="prog-uni-logo">
                                            {course.Logo
                                                ? <img src={course.Logo} alt={course.Location} />
                                                : <div className="prog-logo-placeholder" />}
                                        </div>
                                        <div className="prog-details">
                                            <span className="uni-location">
                                                <FaLocationDot size={16} className="location-icon" />
                                                {course.Location || getCatName(course.CategoryId)}
                                            </span>
                                            <h3><T>{course.Title}</T></h3>
                                            <div className="prog-meta">
                                                <FaGraduationCap size={16} className="icon-time" />
                                                <span>{getCatName(course.CategoryId)}</span>
                                                {course.Feature1Text && (
                                                    <><MdAccessTime size={16} className="icon-time" /><span>{course.Feature1Text}</span></>
                                                )}
                                            </div>
                                            {course.Ribbon && (
                                                <span className="prog-badge">
                                                    <FaFireAlt size={12} className="fire-icon" />
                                                    <T>{course.Ribbon}</T>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="prog-card-right">
                                        <a
                                            href={course.Slug ? `/course-detail/${course.Slug}` : '#'}
                                            className={`btn-view-program${!course.Slug ? ' prog-btn-disabled' : ''}`}
                                        >
                                            <T>View Program</T>
                                        </a>
                                        <a
                                            href={course.BrochureUrl || '#'}
                                            target={course.BrochureUrl ? '_blank' : undefined}
                                            rel="noreferrer"
                                            className={`btn-syllabus${!course.BrochureUrl ? ' prog-btn-disabled' : ''}`}
                                        >
                                            <T>Syllabus</T> <GoDownload size={18} />
                                        </a>
                                    </div>
                                </div>

                                {/* Free Courses banner after 2nd card — same as original design */}
                                {idx === FREE_COURSES_AFTER_INDEX && (
                                    <FreeCourses />
                                )}

                            </React.Fragment>
                        ))
                    )}
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

export default AllPrograms;
