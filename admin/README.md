# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.




Email   : admin@mentoringminds.com
Password: Admin@123


Create A Navbar link add 

Step 1 — Pehle Main Menu Item banao (Parent)
Yeh parent hoga jaise "Courses", "Certifications" etc.
Sahi Tarika — Step by Step:
Step 1: "Courses" edit karo:

Custom URL → khali kar do (blank)
Category → Static (No Details) ✅
Update Link dabao
Step 2: "Machine Learning" edit karo:

Custom URL → /courses/machine-learning
Category → Courses ✅
Update Link dabao ← yeh zaroori hai
Step 3: Machine Learning ka Details button dabao:

Slug field mein → machine-learning likho ← URL se exact match
Baaki data fill karo
Save



Create A Navbar link add 

Step 1 — Pehle Main Menu Item banao (Parent)
Yeh parent hoga jaise "Courses", "Certifications" etc.
Sahi Tarika — Step by Step:
Step 1: "Courses" edit karo:

Custom URL → khali kar do (blank)
Category → Static (No Details) ✅
Update Link dabao
Step 2: "Machine Learning" edit karo:

Custom URL → /courses/machine-learning
Category → Courses ✅
Update Link dabao ← yeh zaroori hai
Step 3: Machine Learning ka Details button dabao:

Slug field mein → machine-learning likho ← URL se exact match
Baaki data fill karo
Save All dabao












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
} from "react-icons/fa";

const sidebarMenu = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: FaTachometerAlt,
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
    // path: "/admin/banners",
    icon: FaImage,
    children:[
      {
        title:"Banner",
        path:"/admin/banners"
        
      },
      {
        title: "Universities",
        path: "/admin/university",
        // icon: FaUniversity,
      },
      {
        title: "Online Courses",
        path: "/admin/online-courses",
        // icon: FaLaptopCode,
      },
      {
        title: "Subscription Banner",
        path: "/admin/subscription-banner",
        // icon: FaStar,
      },
      {
        title: "Instructors",
        path: "/admin/instructors",
        // icon: FaChalkboardTeacher,
      },
      {
        title: "Success Section",
        path: "/admin/success-section",
        // icon: FaTrophy,
      },
      {
        title: "Awards Section",
        path: "/admin/awards-section",
        // icon: FaAward,
      },
      {
        title: "Categories & Courses",
        path: "/admin/career",
        // icon: FaListAlt,
      },
      {
        title: "Free Courses",
        path: "/admin/free-courses",
        // icon: FaRegBookmark,
      },
    ]
  },

  // {
  //   title: "Universities",
  //   path: "/admin/university",
  //   icon: FaUniversity,
  // },

  // ── Online Courses ───────────────────────────────────
  // {
  //   title: "Online Courses",
  //   path: "/admin/online-courses",
  //   icon: FaLaptopCode,
  // },

  // ── Subscription Banner ──────────────────────────────
  // {
  //   title: "Subscription Banner",
  //   path: "/admin/subscription-banner",
  //   icon: FaStar,
  // },

  // ── Instructors ──────────────────────────────────────
  // {
  //   title: "Instructors",
  //   path: "/admin/instructors",
  //   icon: FaChalkboardTeacher,
  // },

  // ── Success Section ──────────────────────────────────
  // {
  //   title: "Success Section",
  //   path: "/admin/success-section",
  //   icon: FaTrophy,
  // },

  // ── Awards Section ───────────────────────────────────
  // {
  //   title: "Awards Section",
  //   path: "/admin/awards-section",
  //   icon: FaAward,
  // },
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

  // ── Career Section dropdown ──────────────────────────
  {
    title: "Career Section",
    icon: FaLayerGroup,
    children: [
      {
        title: "Categories & Courses",
        path: "/admin/career",
        icon: FaListAlt,
      },
      {
        title: "Free Courses",
        path: "/admin/free-courses",
        icon: FaRegBookmark,
      },
    ],
  },

  {
    title: "Users",
    path: "/admin/users",
    icon: FaUsers,
  },
];

export default sidebarMenu;
