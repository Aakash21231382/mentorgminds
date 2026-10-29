import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/studyaborad/LearnersTrustBanner.css';
import { MdKeyboardArrowRight } from 'react-icons/md';
import CounselingModal from '../../component/CounselingModal';
import T from '../../context/T';
const LearnersTrustBanner = () => {
  const navigate = useNavigate();
    const [showCounselingModal, setShowCounselingModal] = useState(false);

  const handleStartJourney = () => {
    navigate('/study/abroad/consultation');
  };

  return (
    <section className="trust-banner-section container-fluid">
      <div className="">
        <div className="trust-banner-card">
          <div className="row g-0 align-items-center">
            {/* Left Image Section */}
            <div className="col-12 col-lg-6 trust-banner-img-col">
              <img
                src="https://d2o2utebsixu4k.cloudfront.net/footer%20image-c877767e8cba470ba5d3885e5d5935a4.webp"
                alt="Graduating learners"
                className="trust-banner-img"
              />
            </div>

            {/* Right Content Section */}
            <div className="col-12 col-lg-6 trust-banner-content-col ps-5">
              <h2 className="trust-banner-title">
                <span className="trust-banner-highlight">  <T>3,00,000+ learners </T>
                  </span> <T>have trusted us</T>
              </h2>
              <p className="trust-banner-subtitle">
           <T>Advance your career with our expert guidance &amp; global programs.</T>
              </p>
              <button 
                type="button" 
                className="trust-banner-btn" 
                onClick={() => setShowCounselingModal(true)}
              >
             <T>   Start Counselor</T> <MdKeyboardArrowRight size={28} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showCounselingModal && (
        <CounselingModal onClose={() => setShowCounselingModal(false)} />
      )}
    </section>
  );
};

export default LearnersTrustBanner;