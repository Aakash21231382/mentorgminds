import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/Centers/OfflineCentres.css'; 
import { FaArrowRight } from 'react-icons/fa';
import { MdArrowOutward } from 'react-icons/md';
import { offlineCentresApi } from '../../api/offlineCentresApi';
import T from '../../context/T';

const OfflineCentres = () => {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cities with centre count from backend
  useEffect(() => {
    const fetchCentres = async () => {
      setLoading(true);
      try {
        const response = await offlineCentresApi.getCitiesWithCount();
        
        // Check if response is an array (direct data) or object with success property
        let citiesData = [];
        if (Array.isArray(response)) {
          // Direct array response
          citiesData = response;
        } else if (response.success && response.data) {
          // Object with success property
          citiesData = response.data;
        } else if (response.data) {
          // Object without success property
          citiesData = response.data;
        }
        
        if (citiesData && citiesData.length > 0) {
          // Transform data to match component structure
          const transformedData = citiesData.map((city, index) => ({
            id: index + 1,
            name: city.CityName,
            rawCount: city.CentreCount,
            image: city.CityImage || 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=300&auto=format&fit=crop&q=60'
          }));
          setCentres(transformedData);
        }
      } catch (error) {
        console.error('Error fetching centres:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCentres();
  }, []);

  // Agar 'View More' click nahi kiya toh pehle 8 dikhenge, click karne par saare
  const displayedCentres = showAll ? centres : centres.slice(0, 8);

  if (loading) {
    return (
      <section className="oc-section py-5">
        <div className="container text-center">
          <p className="oc-loading-msg"><T>Loading centres...</T></p>
        </div>
      </section>
    );
  }

  if (!centres || centres.length === 0) {
    return (
      <section className="oc-section py-5">
        <div className="container text-center">
          <h2 className="oc-section-title">
            <T>Explore our</T> <span className="oc-highlight"><T>Offline Centres</T></span>
          </h2>
          <p className="oc-empty-msg">
            <T>No centres available at the moment.</T>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="oc-section py-5">
      <div className="container">
        
        {/* Section Heading */}
        <div className="mb-5">
          <h2 className="oc-section-title">
            <T>Explore our</T> <span className="oc-highlight"><T>Offline Centres</T></span>
          </h2>
        </div>

        {/* Centres Grid */}
        <div className="row g-4">
          {displayedCentres.map((centre) => (
            <div key={centre.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div 
                className="oc-card"
                onClick={() => navigate(`/centre/${centre.name.toLowerCase()}`)}
              >
                <div className="oc-card-body d-flex align-items-center justify-content-between">
                  
                  {/* Left: Circular Image & Info */}
                  <div className="d-flex align-items-center gap-3">
                    <div className="oc-img-wrapper">
                      <img src={centre.image} alt={centre.name} className="oc-img" />
                    </div>
                    <div>
                      <h5 className="oc-city-name"><T>{centre.name}</T></h5>
                      <p className="oc-city-count">
                        {centre.rawCount} <T>{centre.rawCount === 1 ? 'centre' : 'centres'}</T>
                      </p>
                    </div>
                  </div>

                  {/* Right: Arrow Icon */}
                  <div className="oc-arrow-icon">
                    <MdArrowOutward />
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        {!showAll && centres.length > 8 && (
          <div className="text-center mt-5">
            <button 
              className="oc-view-more-btn"
              onClick={() => setShowAll(true)}
            >
              <T>View More</T>
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

export default OfflineCentres;