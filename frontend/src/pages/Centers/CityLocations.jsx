import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CentersHero from './CentersHero';
import CourseCard from '../../component/CourseCard';
import OfflineCentres from './OfflineCentres';
import TalkToExpertModal from '../../component/TalkToExpertModal';
import { offlineCentresApi } from '../../api/offlineCentresApi';
import { careerApi } from '../../api/careerApi';
import { FaMapMarkerAlt, FaPhone, FaArrowLeft, FaBuilding, FaEnvelope } from 'react-icons/fa';
import '../../assets/css/centers/CityLocations.css';
import T from '../../context/T';

const CityLocations = () => {
  const { cityName } = useParams();
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [showTalkToExpertModal, setShowTalkToExpertModal] = useState(false);

  // Fetch city-specific locations
  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      try {
        // Capitalize first letter
        const formattedCity = cityName.charAt(0).toUpperCase() + cityName.slice(1);
        const response = await offlineCentresApi.getCentresByCity(formattedCity);
        
        if (Array.isArray(response)) {
          setLocations(response);
        } else if (response.success && response.data) {
          setLocations(response.data);
        } else if (response.data) {
          setLocations(response.data);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setLoading(false);
      }
    };

    if (cityName) {
      fetchLocations();
    }
  }, [cityName]);

  // Fetch courses (same as Centers.jsx)
  useEffect(() => {
    careerApi.getPublicCareerData()
      .then(data => {
        if (data.success) {
          setCourses(data.courses || []);
        }
      })
      .catch(err => console.error('Failed to fetch courses:', err))
      .finally(() => setCoursesLoading(false));
  }, []);

  const cityDisplayName = cityName.charAt(0).toUpperCase() + cityName.slice(1);

  return (
    <>
      {/* Breadcrumb - Before Hero */}
      <div className="cl-breadcrumb-wrapper">
        <div className="container">
          <nav className="breadcrumb-nav">
            <span className="breadcrumb-item breadcrumb-clickable" onClick={() => navigate('/')}>
              <T>Home</T>
            </span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-item breadcrumb-clickable" onClick={() => navigate('/centres')}>
              <T>Offline Centre</T>
            </span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-item breadcrumb-active">
              <T>{cityDisplayName}</T>
            </span>
          </nav>
        </div>
      </div>

      <CentersHero />
      
      {/* City Locations Section (NEW - After Hero) */}
      <section className="city-locations-section">
        <div className="container">
          {/* Title */}
          <div className="cl-header">
            <h2 className="cl-title">
              <T>Visit our offline centre in</T> <span className="cl-highlight"><T>{cityDisplayName}</T></span>
            </h2>
            <p className="cl-subtitle">
              {locations.length} <T>{locations.length === 1 ? 'location' : 'locations'}</T> <T>available in</T> <T>{cityDisplayName}</T>
            </p>
          </div>

          {/* Locations Grid */}
          {loading ? (
            <div className="cl-loading-container">
              <div className="cl-spinner" />
            </div>
          ) : locations.length === 0 ? (
            <div className="cl-no-data">
              <p><T>No locations found in</T> <T>{cityDisplayName}</T></p>
            </div>
          ) : (
            <div className="cl-locations-grid">
              {locations.map((location, index) => (
                <div key={location.Id || index} className="cl-location-card">
                  <div className="cl-card-header">
                    <div className="cl-location-icon">
                      <FaMapMarkerAlt />
                    </div>
                    <div>
                      <h3 className="cl-location-name">
                        <T>{location.LocationName || `${cityDisplayName} Centre ${index + 1}`}</T>
                      </h3>
                      {location.LocationCity && (
                        <p className="cl-location-city"><T>{location.LocationCity}</T></p>
                      )}
                    </div>
                  </div>

                  <div className="cl-card-body">
                    {/* Address */}
                    {location.LocationAddress && (
                      <div className="cl-info-item">
                        <FaBuilding className="cl-info-icon" />
                        <div>
                          <p className="cl-info-label"><T>Address</T></p>
                          <p className="cl-info-value"><T>{location.LocationAddress}</T></p>
                        </div>
                      </div>
                    )}

                    {/* Contact Number */}
                    {location.LocationPhone && (
                      <div className="cl-info-item">
                        <FaPhone className="cl-info-icon" />
                        <div>
                          <p className="cl-info-label"><T>Contact</T></p>
                          <a href={`tel:${location.LocationPhone}`} className="cl-info-value cl-link">
                            {location.LocationPhone}
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Email */}
                    {location.LocationEmail && (
                      <div className="cl-info-item">
                        <FaEnvelope className="cl-info-icon" />
                        <div>
                          <p className="cl-info-label"><T>Email</T></p>
                          <a href={`mailto:${location.LocationEmail}`} className="cl-info-value cl-link">
                            {location.LocationEmail}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="cl-card-footer">
                    <button 
                      className="cl-btn-secondary"
                      onClick={() => setShowTalkToExpertModal(true)}
                    >
                      <T>Request a Call</T>
                    </button>
                    {location.LocationMapUrl ? (
                      <a 
                        href={location.LocationMapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cl-btn-primary"
                      >
                        <T>Get Directions</T>
                      </a>
                    ) : (
                      <button 
                        className="cl-btn-primary"
                        onClick={() => {
                          const address = location.LocationAddress || `${cityDisplayName}, India`;
                          window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
                        }}
                      >
                        <T>Get Directions</T>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Map Section (If locations exist) */}
      {locations.length > 0 && (
        <section className="city-map-section">
          <div className="container">
            <h2 className="cl-title text-center mb-4">
              <T>Find us on</T> <span className="cl-highlight"><T>Map</T></span>
            </h2>
            <div className="map-container">
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  locations[0].LocationAddress || `${cityDisplayName}, India`
                )}&output=embed`}
                width="100%"
                height="450"
                className="cl-map-iframe"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${cityDisplayName} Locations Map`}
              />
              <p className="map-note">
                <T>Showing</T> {locations.length} <T>centre(s) in</T> <T>{cityDisplayName}</T>
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Course Cards Section (Same as Centers.jsx) */}
      <section className="centers-courses-section">
        <div className="container">
          <h2 className="section-title">
            <T>Explore Job-Ready Programs</T> <span className="cl-highlight"><T>Designed for Real Careers!</T></span>
          </h2>
          
          {coursesLoading ? (
            <div className="cl-spinner-container">
              <div className="cl-spinner" />
            </div>
          ) : courses.length === 0 ? (
            <p className="cl-no-courses">
              <T>No courses available at the moment.</T>
            </p>
          ) : (
            <div className="row g-4">
              {courses.slice(0, 9).map((course) => (
                <div className="col-lg-4 col-md-6 col-12" key={course.Id}>
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Offline Centres Component (All Cities) */}
      <OfflineCentres />

      {/* Talk To Expert Modal */}
      {showTalkToExpertModal && (
        <TalkToExpertModal onClose={() => setShowTalkToExpertModal(false)} />
      )}
    </>
  );
};

export default CityLocations;