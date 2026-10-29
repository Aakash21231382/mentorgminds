import React from 'react'
import HeroSection from '../pages/Technology/HeroSection'
import TopInstitutions from '../pages/Technology/TopInstitutions'
import Curriculum from '../pages/Technology/Curriculum'
import CourseProjects from '../pages/Technology/CourseProjects'
import ToolsTechnologies from '../pages/Technology/ToolsTechnologies'
import CourseInstructors from '../pages/Technology/CourseInstructors'
import CurriculumComparison from '../pages/Technology/CurriculumComparison'
import SkillsComparison from '../pages/Technology/SkillsComparison'
import AchieveGoals from '../pages/Technology/AchieveGoals'
import CourseOverview from '../pages/Technology/CourseOverview'
import FAQSection from '../pages/Technology/FAQSection'
import University from '../pages/University'

const Technology = () => {
  return (
    <div>
     <HeroSection/>
     <TopInstitutions/>

     <University/>
     <Curriculum/>
     <CourseProjects/>
     <ToolsTechnologies/>
     <CourseInstructors/>
     <CurriculumComparison/>
     <SkillsComparison/>
     <AchieveGoals/>
     <CourseOverview/>
     <FAQSection/>
    </div>
  )
}

export default Technology;
