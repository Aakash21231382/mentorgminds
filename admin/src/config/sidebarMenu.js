import {
  FaTachometerAlt,
  FaUsers,
  FaBars,
  FaPhone,
  FaGraduationCap,
  FaImage,
  FaLayerGroup,
  FaBook,
  FaListAlt,
  FaRegBookmark,
  FaLink,
  FaInbox,
  FaUniversity,
  FaLaptopCode,
  FaStar,
  FaChalkboardTeacher,
  FaTrophy,
  FaAward,
  FaProjectDiagram,
  FaTools,
  FaMapMarkerAlt,
  FaGlobeAmericas,
  FaUserGraduate,
  FaVideo,
  FaQuestionCircle,
  FaReceipt,
  FaTag,
  FaBriefcase,
  FaBan,
  FaClipboardList,
  FaBuilding,
  FaCheckCircle,
  FaComments
} from "react-icons/fa";

const sidebarMenu = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: FaTachometerAlt,
  },
  {
    title: "Users",
    path: "/admin/users",
    icon: FaUsers,
  },

  // ── LMS & Learning Studio ─────────────────────────────
  {
    title: "LMS Studio",
    icon: FaGraduationCap,
    children: [
      {
        title: "Curriculum & Videos",
        path: "/admin/lms-curriculum",
        icon: FaVideo,
      },
      {
        title: "Quizzes & MCQs",
        path: "/admin/lms-quizzes",
        icon: FaQuestionCircle,
      },
      {
        title: "Assignments & Projects",
        path: "/admin/lms-assignments",
        icon: FaProjectDiagram,
      },
      {
        title: "Live Masterclasses",
        path: "/admin/lms-live-classes",
        icon: FaVideo,
      },
      {
        title: "Job Placement Portal",
        path: "/admin/lms-jobs",
        icon: FaBriefcase,
      },
      {
        title: "Enrollments & Orders",
        path: "/admin/lms-enrollments",
        icon: FaReceipt,
      },
      {
        title: "Coupons & Discounts",
        path: "/admin/lms-coupons",
        icon: FaTag,
      },
      {
        title: "Student Reviews",
        path: "/admin/lms-reviews",
        icon: FaStar,
      },
    ],
  },

  // ── Manage Navbar dropdown ───────────────────────────
  {
    title: "Manage Navbar",
    icon: FaBars,
    children: [
      {
        title: "Navbar Links",
        path: "/admin/manage-navbar",
        icon: FaLink,
      },
      {
        title: "Callback Requests",
        path: "/admin/callbacks",
        icon: FaPhone,
      },
      {
        title: "Admissions",
        path: "/admin/admissions",
        icon: FaGraduationCap,
      },
    ],
  },

  {
    title: "Home",
    icon: FaImage,
    children: [
      {
        title: "Banner",
        path: "/admin/banners",
        icon: FaClipboardList,
      },
      {
        title: "Career Section",
        path: "/admin/career",
        icon: FaListAlt,
      },
      {
        title: "Universities",
        path: "/admin/university",
        icon: FaUniversity,
      },
      {
        title: "Online Courses",
        path: "/admin/online-courses",
        icon: FaLaptopCode,
      },
      {
        title: "Subscription Banner",
        path: "/admin/subscription-banner",
        icon: FaStar,
      },
      {
        title: "Instructors",
        path: "/admin/instructors",
        icon: FaChalkboardTeacher,
      },
      {
        title: "Success Section",
        path: "/admin/success-section",
        icon: FaTrophy,
      },
      {
        title: "Awards Section",
        path: "/admin/awards-section",
        icon: FaAward,
      },
    ]
  },
  {
    title: "Mentornship",
    icon: FaBook,
    children: [
      {
        title: "Curriculum",
        path: "/admin/curriculum",
        icon: FaBook,
      },
      {
        title: "Course Projects",
        path: "/admin/course-projects",
        icon: FaProjectDiagram,
      },
      {
        title: "Tools & Technologies",
        path: "/admin/tools-tech",
        icon: FaTools,
      },
      {
        title: "Course Instructors",
        path: "/admin/course-instructors",
        icon: FaChalkboardTeacher,
      },
      {
        title: "Curriculum Comparison",
        path: "/admin/curriculum-comparison",
        icon: FaLayerGroup,
      },
      {
        title: "Skills Comparison",
        path: "/admin/skills-comparison",
        icon: FaChalkboardTeacher,
      },
      {
        title: "Achieve Goals",
        path: "/admin/achieve-goals",
        icon: FaTrophy,
      },
      {
        title: "Course Overview",
        path: "/admin/course-overview",
        icon: FaBook,
      },
      {
        title: "FAQ Section",
        path: "/admin/faq",
        icon: FaListAlt,
      },
    ]
  },

  {
    title: "Free Courses",
    path: "/admin/free-courses",
    icon: FaRegBookmark,
  },

  {
    title: "Manage Centres",
    icon: FaMapMarkerAlt,
    children: [
      {
        title: "Location Centres",
        path: "/admin/offline-centres",
        icon: FaBuilding,
      },
      {
        title: "Why Choose Us",
        path: "/admin/centres-whychoose",
        icon: FaStar,
      },
      {
        title: "FAQs",
        path: "/admin/centres-faq",
        icon: FaQuestionCircle,
      },
    ]
  },

  {
    title: "Study Abroad",
    icon: FaGlobeAmericas,
    children: [
      {
        title: "Program Categories",
        path: "/admin/top-programs/categories",
        icon: FaLayerGroup,
      },
      {
        title: "Top Programs",
        path: "/admin/top-programs",
        icon: FaGraduationCap,
      },
      {
        title: "Advisor Leads",
        path: "/admin/study-abroad-leads",
        icon: FaInbox,
      },
    ]
  },

  {
    title: "Manage Footer",
    path: "/admin/footer",
    icon: FaLayerGroup,
  },
];

export default sidebarMenu;
