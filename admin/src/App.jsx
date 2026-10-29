import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "./pages/Auth/AdminLogin";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashbord/Dashboard";
import ManageNavbar from "./pages/Dashbord/ManageNavbar";
import Users from "./pages/Users/Users";
import Callbacks from "./pages/Leads/Callbacks";
import Admissions from "./pages/Leads/Admissions";
import ManageBanners from "./pages/Banners/ManageBanners";
import ManageCareer from "./pages/Career/ManageCareer";
import ManageFreeCourses from "./pages/Career/ManageFreeCourses";
import ManageCourseDetail from "./pages/Career/ManageCourseDetail";
import ManageUniversity from "./pages/University/ManageUniversity";
import ManageOnlineCourse from "./pages/OnlineCourse/ManageOnlineCourse";
import ManageOnlineCourseDetail from "./pages/OnlineCourse/ManageOnlineCourseDetail";
import ManageSubscriptionBanner from "./pages/SubscriptionBanner/ManageSubscriptionBanner";
import ManageInstructors from "./pages/Instructors/ManageInstructors";
import ManageSuccessSection from "./pages/SuccessSection/ManageSuccessSection";
import ManageAwardsSection from "./pages/AwardsSection/ManageAwardsSection";
import ManageCurriculum from "./pages/Curriculum/ManageCurriculum";
import ManageCourseProjects from "./pages/CourseProjects/ManageCourseProjects";
import ManageToolsTech from "./pages/ToolsTech/ManageToolsTech";
import ManageCourseInstructors from "./pages/CourseInstructors/ManageCourseInstructors";
import ManageCurriculumComparison from "./pages/CurriculumComparison/ManageCurriculumComparison";
import ManageSkillsComparison from "./pages/SkillsComparison/ManageSkillsComparison";
import ManageAchieveGoals from "./pages/AchieveGoals/ManageAchieveGoals";
import ManageCourseOverview from "./pages/CourseOverview/ManageCourseOverview";
import ManageFAQ from "./pages/FAQ/ManageFAQ";
import ManageFooter from "./pages/Footer/ManageFooter";
import ManageNavbarDropdown from "./pages/NavbarDropdown/ManageNavbarDropdown";

import ManageCentres from "./pages/Centres/ManageCentres";
import ManageCentresWhyChoose from "./pages/Centres/ManageCentresWhyChoose";
import ManageCentresFAQ from "./pages/Centres/ManageCentresFAQ";
import ManageTopProgramCategories from "./pages/TopPrograms/ManageTopProgramCategories";
import ManageTopPrograms from "./pages/TopPrograms/ManageTopPrograms";
import TopProgramDetails from "./pages/TopPrograms/TopProgramDetails";
import ManageStudyAbroadLeads from "./pages/StudyAbroadLeads/ManageStudyAbroadLeads";

import ManageLMSCurriculum from "./pages/LMS/ManageLMSCurriculum";
import ManageLMSQuizzes from "./pages/LMS/ManageLMSQuizzes";
import ManageLMSEnrollments from "./pages/LMS/ManageLMSEnrollments";
import ManageLMSCoupons from "./pages/LMS/ManageLMSCoupons";
import ManageLMSReviews from "./pages/LMS/ManageLMSReviews";
import ManageLMSAssignments from "./pages/LMS/ManageLMSAssignments";
import ManageLMSLiveClasses from "./pages/LMS/ManageLMSLiveClasses";
import ManageLMSJobs from "./pages/LMS/ManageLMSJobs";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/admin/login" replace />} />

        {/* Public */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Panel */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="manage-navbar" element={<ManageNavbar />} />
          <Route path="users" element={<Users />} />
          
          {/* LMS Studio Routes */}
          <Route path="lms-curriculum" element={<ManageLMSCurriculum />} />
          <Route path="lms-quizzes" element={<ManageLMSQuizzes />} />
          <Route path="lms-assignments" element={<ManageLMSAssignments />} />
          <Route path="lms-live-classes" element={<ManageLMSLiveClasses />} />
          <Route path="lms-jobs" element={<ManageLMSJobs />} />
          <Route path="lms-enrollments" element={<ManageLMSEnrollments />} />
          <Route path="lms-coupons" element={<ManageLMSCoupons />} />
          <Route path="lms-reviews" element={<ManageLMSReviews />} />

          <Route path="callbacks" element={<Callbacks />} />
          <Route path="admissions" element={<Admissions />} />
          <Route path="banners" element={<ManageBanners />} />
          <Route path="career" element={<ManageCareer />} />
          <Route path="free-courses" element={<ManageFreeCourses />} />
          <Route
            path="course-detail/:careerCourseId"
            element={<ManageCourseDetail />}
          />
          <Route
            path="navbar-course-detail/:navbarLinkId"
            element={<ManageCourseDetail mode="navbar" />}
          />
          <Route
            path="navbar-dropdown-detail/:slug"
            element={<ManageCourseDetail mode="slug" />}
          />
          <Route
            path="footer-link-detail/:footerLinkId"
            element={<ManageCourseDetail mode="footer" />}
          />
          <Route path="university" element={<ManageUniversity />} />
          <Route path="online-courses" element={<ManageOnlineCourse />} />
          <Route
            path="online-course-detail/:onlineCourseId"
            element={<ManageOnlineCourseDetail />}
          />
          <Route
            path="subscription-banner"
            element={<ManageSubscriptionBanner />}
          />
          <Route path="instructors" element={<ManageInstructors />} />
          <Route path="success-section" element={<ManageSuccessSection />} />
          <Route path="awards-section" element={<ManageAwardsSection />} />
          <Route path="curriculum" element={<ManageCurriculum />} />
          <Route path="course-projects" element={<ManageCourseProjects />} />
          <Route path="tools-tech" element={<ManageToolsTech />} />
          <Route
            path="course-instructors"
            element={<ManageCourseInstructors />}
          />
          <Route
            path="curriculum-comparison"
            element={<ManageCurriculumComparison />}
          />
          <Route
            path="skills-comparison"
            element={<ManageSkillsComparison />}
          />
          <Route path="achieve-goals" element={<ManageAchieveGoals />} />
          <Route path="course-overview" element={<ManageCourseOverview />} />
          <Route path="faq" element={<ManageFAQ />} />
          <Route path="footer" element={<ManageFooter />} />
          <Route
            path="navbar-dropdown/:navbarLinkId"
            element={<ManageNavbarDropdown />}
          />
          <Route path="offline-centres" element={<ManageCentres />} />
          <Route
            path="centres-whychoose"
            element={<ManageCentresWhyChoose />}
          />
          <Route path="centres-faq" element={<ManageCentresFAQ />} />
          <Route
            path="top-programs/categories"
            element={<ManageTopProgramCategories />}
          />
          <Route path="top-programs" element={<ManageTopPrograms />} />
          <Route path="top-programs/details/:id" element={<TopProgramDetails />} />
          <Route path="study-abroad-leads" element={<ManageStudyAbroadLeads />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
