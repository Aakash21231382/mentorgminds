import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import T from "../../context/T";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "../../assets/css/studyaborad/TopProgramsSection.css";
import { topProgramsApi } from "../../api/topProgramsApi";
import {
  MdKeyboardArrowRight,
  MdOutlineFileDownload,
  MdOutlineKeyboardArrowLeft,
} from "react-icons/md";

const TopProgramsSection = () => {
  const [activeTab, setActiveTab] = useState("");
  const [categories, setCategories] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  const categorySliderRef = useRef(null);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await topProgramsApi.getCategories();

        if (data.success && data.categories.length > 0) {
          const activeCategories = data.categories.filter(
            (cat) => cat.IsActive,
          );

          setCategories(activeCategories);

          if (activeCategories.length > 0) {
            setActiveTab(activeCategories[0].Slug);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch programs when active tab changes
  useEffect(() => {
    if (activeTab) {
      const fetchPrograms = async () => {
        setLoading(true);

        try {
          const data = await topProgramsApi.getProgramsByCategory(activeTab);

          if (data.success) {
            setPrograms(data.programs || []);
          }
        } catch (error) {
          console.error("Error fetching programs:", error);
          setPrograms([]);
        } finally {
          setLoading(false);
        }
      };

      fetchPrograms();
    }
  }, [activeTab]);

  // Handle category tab change with smooth scroll to center
  const handleTabChange = (slug, event) => {
    if (slug === activeTab) return;

    setActiveTab(slug);

    if (event?.currentTarget) {
      event.currentTarget.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  };

  const currentCategory = categories.find((c) => c.Slug === activeTab);

  const currentPrograms = programs;

  // Initial Loading
  if (loading && categories.length === 0) {
    return (
      <section className="programs-wrapper">
        <div className="container">
          <div className="programs-header"></div>
        </div>
      </section>
    );
  }

  // No Categories
  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="programs-wrapper">
      <div className="container">
        {/* Title Header */}
        <div className="programs-header">
          <h2 className="programs-title">
            <span className="text-red">
              <T>Top Pathway Programs</T>
            </span>{" "}
            <T>designed for your success</T>
          </h2>

          <p className="programs-subtitle">
            <T>
              Explore globally coveted programs designed to empower your
              success. Start online, complete your degree on-campus abroad.
            </T>
          </p>
        </div>

        {/* Category Tabs */}
        <div className="categories-scroll-wrapper">
          <div className="categories-nav" ref={categorySliderRef}>
            {categories.map((cat) => (
              <button
                key={cat.Slug}
                className={`category-tab-btn ${
                  activeTab === cat.Slug ? "active" : ""
                }`}
                onClick={(e) => handleTabChange(cat.Slug, e)}
              >
                <T>{cat.Name}</T>
              </button>
            ))}
          </div>
        </div>

        {/* Swiper Slider */}
        {loading ? (
          <div className="top-programs-status-msg">
            <T>Loading programs...</T>
          </div>
        ) : currentPrograms.length === 0 ? (
          <div className="top-programs-empty-msg">
            <p>
              <T>No programs available in this category</T>
            </p>
          </div>
        ) : (
          <div className="swiper-container-relative">
            <div key={activeTab} className="cards-fade-wrapper">
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={24}
                slidesPerView={1}
                navigation={{
                  nextEl: ".custom-swiper-next",
                  prevEl: ".custom-swiper-prev",
                }}
                breakpoints={{
                  640: {
                    slidesPerView: 1.5,
                  },
                  768: {
                    slidesPerView: 2,
                  },
                  1024: {
                    slidesPerView: 3,
                  },
                }}
                className="programs-swiper"
              >
                {currentPrograms.map((program, index) => (
                  <SwiperSlide key={`${activeTab}-${program.Id}`}>
                    <div className="course-card">
                      {/* Top Badges */}
                      <div className="card-top-bar">
                        <span className="badge-country">
                          ✈ <T>Study in</T> <T>{program.Country}</T>
                        </span>

                        {program.IsPopular && (
                          <span className="badge-popular">
                            ★ <T>POPULAR</T>
                          </span>
                        )}
                      </div>

                      {/* Logo Banner */}
                      <div className="card-banner-box">
                        {program.UniversityLogo ? (
                          <img
                            src={program.UniversityLogo}
                            alt={program.UniversityName}
                            className="top-program-logo-img"
                          />
                        ) : (
                          <div className="banner-logo-placeholder">
                            <span className="logo-text">
                              <T>UNIVERSITY PARTNERS</T>
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content Area */}
                      <div className="card-body-content">
                        <div className="uni-name-row">
                          {program.CountryFlag && (
                            <span className="uni-flag">
                              {program.CountryFlag}
                            </span>
                          )}

                          <span className="uni-name">
                            <T>{program.UniversityName}</T>
                          </span>
                        </div>

                        <h3 className="course-name">
                          <T>{program.Title}</T>
                        </h3>

                        <p className="course-info">
                          <T>
                            {program.Description ||
                              "Explore this amazing program opportunity."}
                          </T>
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="card-action-footer">
                        {program.BrochureUrl ? (
                          <a
                            href={program.BrochureUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-brochure"
                          >
                            <T>Download Brochure</T>

                            <span className="dl-icon">
                              <MdOutlineFileDownload size={20} />
                            </span>
                          </a>
                        ) : (
                          <button
                            className="btn-brochure"
                            disabled
                          >
                            <T>No Brochure</T>
                          </button>
                        )}

                        {/* View Button */}
                        {program.HasDetails ? (
                          <Link
                            to={`/study-abroad/programs/${program.Slug}`}
                            className="btn-arrow-icon"
                            aria-label="Details"
                          >
                            <T>View</T>
                          </Link>
                        ) : (
                          <button
                            className="btn-arrow-icon"
                            disabled
                            title="Details not yet available"
                          >
                            <T>View</T>
                          </button>
                        )}
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Navigation Arrows */}
            <button className="custom-swiper-prev" aria-label="Previous">
              <MdOutlineKeyboardArrowLeft />
            </button>

            <button className="custom-swiper-next" aria-label="Next">
              <MdKeyboardArrowRight />
            </button>
          </div>
        )}

        {/* Dynamic Category View All Button */}
        <div className="view-all-wrapper">
          <Link
            to={`/study-abroad/programs?category=${activeTab}`}
            className="dynamic-view-all-link"
          >
            <T>View All</T> <T>{currentCategory?.Name || ""}</T> <T>Programs</T>
            <span className="arrow-sym">
              <MdKeyboardArrowRight size={20} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopProgramsSection;
