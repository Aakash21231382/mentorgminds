import React, { useState, useEffect } from 'react';
import CentersHero from '../pages/Centers/CentersHero';
import CourseCard from './CourseCard';
import { careerApi } from '../api/careerApi';
// import '../assets/css/Centers.css';
import '../assets/css/centers/CentersHero.css'
import OfflineCentres from '../pages/Centers/OfflineCentres';
import { Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';
import CentersFAQ from '../pages/Centers/CentersFAQ';
import T from '../context/T'
import WhyChooseUs from '../pages/Centers/WhyChooseUs';
const AllCenters = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Same API as TopInstitutions
    careerApi.getPublicCareerData()
      .then(data => {
        if (data.success) {
          setCourses(data.courses || []);
        }
      })
      .catch(err => console.error('Failed to fetch courses:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <CentersHero />
 
      </>
    );
  }

  return (
    <>  
     <div className='container link1 '>
        <Link to="/" className='link'> <T>Home</T> <FaChevronRight /> </Link>
     </div>
      <CentersHero />
      <section className="centers-courses-section ">
        <div className="container">
          <h2 className="section-title1"><T> Explore Job-Ready Programs</T> <span className="oc-highlight"><T>Designed for Real Careers!</T></span></h2>
          
          {courses.length === 0 ? (
            <p className="oc-empty-msg">
             <T> No courses available at the moment.</T>
            </p>
          ) : (
            <div className="row g-4">
              {courses.slice(0,9).map((course) => (
                <div className="col-lg-4 col-md-6 col-12 " key={course.Id}>
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <OfflineCentres/>
      <WhyChooseUs/>
      <CentersFAQ/>
    
    </>
  );
};

export default AllCenters;
