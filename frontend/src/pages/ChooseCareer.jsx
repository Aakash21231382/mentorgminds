import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import "../assets/css/ChooseCareer.css";
import CourseCard from "../component/CourseCard";
import { Link } from "react-router-dom";
import { MdKeyboardArrowRight } from "react-icons/md";
import T from "../context/T";
import { careerApi } from "../api/careerApi";

const ChooseCareer = () => {
    const [categories,    setCategories]    = useState([]);
    const [allCourses,    setAllCourses]    = useState([]);
    const [activeTab,     setActiveTab]     = useState(null);
    const [displayTab,    setDisplayTab]    = useState(null); // actually rendered tab
    const [animating,     setAnimating]     = useState(false);
    const [loading,       setLoading]       = useState(true);
    const swiperRef = useRef(null);

    useEffect(() => {
        careerApi.getPublicCareerData()
            .then(d => {
                if (d.success) {
                    setCategories(d.categories || []);
                    setAllCourses(d.courses    || []);
                    if (d.categories?.length > 0) {
                        setActiveTab(d.categories[0].Id);
                        setDisplayTab(d.categories[0].Id);
                    }
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleTabChange = (id, e) => {
        if (id === activeTab || animating) return;

        // Step 1: fade-out
        setAnimating(true);
        setActiveTab(id);

        // Step 2: after fade-out completes, swap cards + fade-in
        setTimeout(() => {
            setDisplayTab(id);
            setAnimating(false);
        }, 220); // matches CSS transition duration

        if (e?.currentTarget) {
            e.currentTarget.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        }
    };

    const currentTab      = categories.find(c => c.Id === activeTab);
    const filteredCourses = allCourses.filter(c => c.CategoryId === displayTab);
    const shouldLoop      = filteredCourses.length > 3;

    if (loading) return null;
    if (categories.length === 0) return null;

    return (
        <section className="career-section">
            <div className="container career-container">
                <div className="career-heading">
                    <h2>
                        <T>Choose Your</T>{" "}
                        <span><T>Career Path</T></span>
                    </h2>
                    <p>
                        <T>Discover industry-leading programs designed to accelerate your professional growth.</T>
                    </p>
                </div>

                {/* ── Category Tabs ── */}
                <div className="career-tabs-wrapper">
                    <div className="career-tabs">
                        {categories.map(tab => (
                            <button
                                key={tab.Id}
                                className={`career-tab ${activeTab === tab.Id ? "active" : ""}`}
                                onClick={e => handleTabChange(tab.Id, e)}
                            >
                                {tab.Image && <img src={tab.Image} alt={tab.Name} />}
                                <span><T>{tab.Name}</T></span>
                                <strong>({tab.CourseCount})</strong>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Top Row ── */}
                <div className="career-top">
                    <h3>
                        <T>Top</T> {currentTab?.Name}{" "}
                        <span><T>Courses</T> ({filteredCourses.length})</span>
                    </h3>
                    <Link
                        to={`/all-Courses?category=${activeTab}`}
                        className="view-all-btn"
                    >
                        <T>View All Course</T> <MdKeyboardArrowRight size={24} />
                    </Link>
                </div>

                {/* ── Slider ── */}
                <div
                    className={`career-slider-anim ${animating ? "career-slider-out" : "career-slider-in"}`}
                >
                    {filteredCourses.length === 0 ? (
                        <p className="no-courses-msg">
                            <T>No courses available in this category yet.</T>
                        </p>
                    ) : (
                        <div className="course-slider-wrapper">
                            <button
                                className="slider-arrow slider-arrow-left"
                                onClick={() => swiperRef.current?.slidePrev()}
                            >
                                <span>&#8249;</span>
                            </button>

                            <Swiper
                                modules={[Pagination]}
                                spaceBetween={24}
                                slidesPerView={1}
                                loop={shouldLoop}
                                onSwiper={swiper => { swiperRef.current = swiper; }}
                                pagination={{ el: ".slider-dots", clickable: true }}
                                breakpoints={{
                                    768: { slidesPerView: 2 },
                                    992: { slidesPerView: 3 },
                                }}
                                className="career-swiper"
                                key={displayTab}
                            >
                                {filteredCourses.map(course => (
                                    <SwiperSlide key={course.Id}>
                                        <CourseCard course={course} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            <button
                                className="slider-arrow slider-arrow-right"
                                onClick={() => swiperRef.current?.slideNext()}
                            >
                                <span>&#8250;</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="slider-dots"></div>
        </section>
    );
};

export default ChooseCareer;
