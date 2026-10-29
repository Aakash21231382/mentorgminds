import { useState, useEffect, useRef } from 'react';
import T from '../../context/T';
import '../../assets/css/technology/TopInstitutions.css';
import CourseCard from '../../component/CourseCard';
import { FiFilter } from 'react-icons/fi';
import { careerApi } from '../../api/careerApi';

const TopInstitutions = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null); // null = All
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  
  const filterRef = useRef(null);

  useEffect(() => {
    careerApi.getPublicCareerData()
      .then(d => {
        if (d.success) {
          setCourses(d.courses || []);
          setCategories(d.categories || []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    };

    if (showFilter) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilter]);

  // Filter by category
  const filtered = activeFilter
    ? courses.filter(c => c.CategoryId === activeFilter)
    : courses;

  if (loading) return null;
  if (courses.length === 0) return null;

  return (
    <section className="top-inst-section container">
      <div className="top-inst-container">

        <h2 className="top-inst-main-heading">
          <T>Gen AI & Agentic</T> <span><T>AI Courses</T></span> <T>from Top Institutions</T>
        </h2>

        <div className="top-inst-header-row">
          <h3>
            <T>All Courses</T> <span>({filtered.length})</span>
          </h3>

          {/* Filter button + category dropdown */}
          <div className="top-inst-filter-wrapper" ref={filterRef}>
            <button className="filter-btn" onClick={() => setShowFilter(p => !p)}>
              <FiFilter /> <T>Filter</T>
              {activeFilter && <span className="top-inst-filter-badge">1</span>}
            </button>

            {showFilter && (
              <div className="top-inst-filter-dropdown">
                <button
                  onClick={() => { setActiveFilter(null); setShowFilter(false); }}
                  className={`top-inst-filter-item ${!activeFilter ? 'active' : ''}`}
                >
                  <T>All Categories</T>
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.Id}
                    onClick={() => { setActiveFilter(cat.Id); setShowFilter(false); }}
                    className={`top-inst-filter-item ${activeFilter === cat.Id ? 'active' : ''}`}
                  >
                    <T>{cat.Name}</T>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="row g-4">
          {filtered.slice(0, 6).map((course) => (
            <div className="col-lg-4 col-md-6 col-12" key={course.Id}>
              <CourseCard course={course} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TopInstitutions;