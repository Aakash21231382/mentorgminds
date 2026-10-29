import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootLayout from "./Layout/RootLayout";
import Dashbord from "./component/Dashbord";
import Signup from "./pages/SignUp";
import Login from "./pages/Login";
import Technology from "./component/Technology";
import AllPrograms from "./pages/AllPrograms";
import ForgotPassword from "./component/ForgotPassword";
import Profile from "./pages/Profile";
import CourseDetail from "./pages/CourseDetail";
import AllUniversities from "./pages/AllUniversities";
import ViewAllOnlineCourses from "./pages/ViewAllOnlineCourses";
import OnlineCourseDetailPage from "./pages/CourseDetail";
import ApplyNowModal from "./component/ApplyNowModal";
import TalkToExpertModal from "./component/TalkToExpertModal";
import AllCenters from "./component/Centers";
import CityLocations from "./pages/Centers/CityLocations";
import StudyAbroad from "./component/StudyAbroad";
import TopProgramDetailPage from "./pages/StudyAbroad/TopProgramDetailPage";
import AllTopPrograms from "./pages/StudyAbroad/AllTopPrograms";
import StudyAbroadConsultationPage from "./pages/StudyAbroad/StudyAbroadConsultationPage";
import MyLearning from "./pages/LMS/MyLearning";
import CoursePlayer from "./pages/LMS/CoursePlayer";
import VerifyCertificate from "./pages/LMS/VerifyCertificate";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Dashbord />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* LMS Student Portal */}
          <Route path="/my-learning" element={<MyLearning />} />
          <Route path="/learn/:courseSlug" element={<CoursePlayer />} />
          <Route path="/verify-certificate/:certNumber" element={<VerifyCertificate />} />

          {/* Career Course Detail Page */}
          <Route path="/course-detail/:slug" element={<CourseDetail />} />

          {/* Legacy routes */}
          <Route path="/all-mentonship" element={<Technology />} />
          <Route path="/all-Courses" element={<AllPrograms />} />
          <Route path="/Allcentres" element={<AllCenters />} />
          <Route path="/centres" element={<AllCenters />} />
          <Route path="/centre/:cityName" element={<CityLocations />} />
          <Route path="/universities" element={<AllUniversities />} />
          <Route path="/applynow" element={<ApplyNowModal />} />
          <Route path="/talk-to-expert" element={<TalkToExpertModal />} />

          {/* Online Courses */}
          <Route path="/online-courses" element={<ViewAllOnlineCourses />} />
          <Route path="/online-course-detail/:slug" element={<OnlineCourseDetailPage apiType="online" />} />

          {/* Dynamic detail pages */}
          <Route path="/courses/:slug" element={<CourseDetail />} />
          <Route path="/certifications/:slug" element={<CourseDetail />} />
          <Route path="/study-abroad/:slug" element={<CourseDetail />} />
          <Route path="/centers/:slug" element={<CourseDetail />} />
          <Route path="/mentorship/:slug" element={<CourseDetail />} />

          {/* Study Abroad Main Page */}
          <Route path="/study/abroad" element={<StudyAbroad />} />
          
          {/* Study Abroad Consultation Form Page */}
          <Route path="/study-abroad/consultation" element={<StudyAbroadConsultationPage />} />
          
          {/* Study Abroad Programs */}
          <Route path="/study-abroad/programs" element={<AllTopPrograms />} />
          <Route path="/study-abroad/programs/:slug" element={<TopProgramDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
