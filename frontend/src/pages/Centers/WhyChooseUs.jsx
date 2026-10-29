import React, { useRef, useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { centresWhyChooseApi } from '../../api/centresWhyChooseApi';
import '../../assets/css/centers/WhyChooseUs.css';
import T from '../../context/T';

const WhyChooseUs = () => {
  const scrollRef = useRef(null);
  const [featuresData, setFeaturesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await centresWhyChooseApi.getActive();
        if (response.success && response.data) {
         
          const mappedData = response.data.map(item => ({
            id: item.Id,
            image: item.Image,
            title: item.Title,
            description: item.Description
          }));
          setFeaturesData(mappedData);
        }
      } catch (error) {
        console.error('Failed to fetch why choose data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 380;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return null;
  }

  if (featuresData.length === 0) {
    return null; 
  }

  return (
    <section className="why-choose-section container ">
      <div className="why-choose-container">
        
        {/* Section Header */}
        <div className="why-choose-header">
          <h2 className="why-choose-title">
            <T>Why Choose</T> <span className="highlight-text"><T>Mentorigminds?</T></span>
          </h2>
        </div>
        <div className="why-choose-slider-wrapper">
          <button 
            className="slider-nav-btn prev-btn" 
            onClick={() => handleScroll('left')}
            aria-label="Previous slide"
          >
            <FaChevronLeft size={14} />
          </button>
          <div className="why-choose-cards-track" ref={scrollRef}>
            {featuresData.map((item) => (
              <div key={item.id} className="why-choose-card">
                <div className="card-image-box">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="card-content-box">
                  <h3 className="card-title"><T>{item.title}</T></h3>
                  <p className="card-description"><T>{item.description}</T></p>
                </div>
              </div>
            ))}
          </div>
          <button 
            className="slider-nav-btn next-btn" 
            onClick={() => handleScroll('right')}
            aria-label="Next slide"
          >
            <FaChevronRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;