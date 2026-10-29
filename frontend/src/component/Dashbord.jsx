import React, { useState } from 'react';

import Banner from '../pages/Banner';
import ChooseCareer from '../pages/ChooseCareer';
import University from '../pages/University';
import OnlineCourse from '../pages/OnlineCourse';
import SubscriptionBanner from '../pages/SubscriptionBanner';
import InstructionSection from '../pages/InstructionSection';
import SuccessSection from '../pages/SuccessSection';
import AwardsSection from '../pages/AwardsSection';
import TalkToExpertModal from './TalkToExpertModal';
import ApplyNowModal from './ApplyNowModal';
import FreeCourses from './FreeCourses';

const Dashbord = () => {
  const [showExpert, setShowExpert] = useState(false);
  const [showApply,  setShowApply]  = useState(false);

  return (
    <div>
      <Banner
        onApply={() => setShowApply(true)}
        onExpert={() => setShowExpert(true)}
      />
      <ChooseCareer />
      <University />
      <OnlineCourse />
      <SubscriptionBanner />
      <InstructionSection />
      <SuccessSection />
     <div className='container'> <FreeCourses/></div>
      <AwardsSection />

      {showExpert && <TalkToExpertModal onClose={() => setShowExpert(false)} />}
      {showApply  && <ApplyNowModal    onClose={() => setShowApply(false)}  />}
    </div>
  );
};

export default Dashbord;
