import React, { useState, useEffect } from 'react';
import StudyAbroadHero from '../pages/StudyAbroad/StudyAbroadHero';
import SmartStudySection from '../pages/StudyAbroad/SmartStudySection';
import IIMAlumSection from '../pages/StudyAbroad/IIMAlumSection';
import TopProgramsSection from '../pages/StudyAbroad/TopProgramsSection';
import StudyAbroadAdvisorModal from './StudyAbroadAdvisorModal';
import StudyAbroadGuide from '../pages/StudyAbroad/StudyAbroadGuide';
import StudyAbroadConsultationPage from '../pages/StudyAbroad/StudyAbroadConsultationPage';
import CareerSupportPage from './CareerSupportPage';
import LearnersTrustBanner from '../pages/StudyAbroad/LearnersTrustBanner';

const StudyAbroad = () => {
  const [showModal, setShowModal] = useState(false);

  // Show modal after page loads (with a small delay for better UX)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 800); // 800ms delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <StudyAbroadHero />
      <SmartStudySection />
      <IIMAlumSection />
      <TopProgramsSection />
      <StudyAbroadConsultationPage/>
      <LearnersTrustBanner/>
      <StudyAbroadGuide />
      <CareerSupportPage/>
      
      {/* Study Abroad Advisor Modal */}
      <StudyAbroadAdvisorModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </div>
  );
};

export default StudyAbroad;
