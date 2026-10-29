const express = require("express");
require("dotenv").config();
const cors = require('cors');
const path = require('path');
const { connectDB } = require("./config/database");

const authRoutes    = require("./routes/auth.routes");
const navbarRoutes  = require('./routes/navbar.routes');
const navbarDropdownRoutes = require('./routes/navbarDropdown.routes');
const courseRoutes  = require('./routes/course.routes');
const leadsRoutes   = require('./routes/leads.routes');
const bannerRoutes  = require('./routes/banner.routes');
const uploadRoutes  = require('./routes/upload.routes');
const careerRoutes     = require('./routes/career.routes');
const freeCourseRoutes    = require('./routes/freeCourse.routes');
const courseDetailRoutes  = require('./routes/courseDetail.routes');
const universityRoutes    = require('./routes/university.routes');
const onlineCourseRoutes  = require('./routes/onlineCourse.routes');
const subscriptionBannerRoutes = require('./routes/subscriptionBanner.routes');
const instructorRoutes = require('./routes/instructor.routes');
const successSectionRoutes = require('./routes/successSection.routes');
const awardsSectionRoutes  = require('./routes/awardsSection.routes');
const curriculumRoutes     = require('./routes/curriculum.routes');
const courseProjectsRoutes = require('./routes/courseProjects.routes');
const toolsTechRoutes      = require('./routes/toolsTech.routes');
const courseInstructorsRoutes = require('./routes/courseInstructors.routes');
const curriculumComparisonRoutes = require('./routes/curriculumComparison.routes');
const skillsComparisonRoutes     = require('./routes/skillsComparison.routes');
const achieveGoalsRoutes         = require('./routes/achieveGoals.routes');
const courseOverviewRoutes       = require('./routes/courseOverview.routes');
const faqRoutes                  = require('./routes/faq.routes');
const footerRoutes               = require('./routes/footer.routes');
const centerVisitsRoutes         = require('./routes/centerVisits.routes');
const offlineCentresRoutes       = require('./routes/offlineCentres.routes');
const centresWhyChooseRoutes     = require('./routes/centresWhyChoose.routes');
const centresFAQRoutes           = require('./routes/centresFAQ.routes');
const topProgramCategoriesRoutes = require('./routes/topProgramCategories.routes');
const topProgramsRoutes          = require('./routes/topPrograms.routes');
const counselingRoutes           = require('./routes/counseling.routes');
const studyAbroadAdvisorRoutes   = require('./routes/studyAbroadAdvisor.routes');
const lmsRoutes                  = require('./routes/lms.routes');
const lmsAdminRoutes             = require('./routes/lmsAdmin.routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (e.g. mobile apps, curl, postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
            return callback(null, true);
        }
        // Allow Netlify, Render, and Vercel domains dynamically
        if (origin.endsWith('.netlify.app') || origin.endsWith('.onrender.com') || origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }
        // Allow in development or fallback
        if (process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true
}));

// Uploaded images publicly serve karo
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectDB();

app.use("/api/auth",    authRoutes);
app.use('/api/navbar',  navbarRoutes);
app.use('/api/navbar-dropdown', navbarDropdownRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/leads',   leadsRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/upload',  uploadRoutes);
app.use('/api/career',       careerRoutes);
app.use('/api/free-courses',    freeCourseRoutes);
app.use('/api/course-detail',  courseDetailRoutes);
app.use('/api/university',     universityRoutes);
app.use('/api/online-courses', onlineCourseRoutes);
app.use('/api/subscription-banner', subscriptionBannerRoutes);
app.use('/api/instructors', instructorRoutes);
app.use('/api/success-section', successSectionRoutes);
app.use('/api/awards-section',  awardsSectionRoutes);
app.use('/api/curriculum',         curriculumRoutes);
app.use('/api/course-projects',    courseProjectsRoutes);
app.use('/api/tools-tech',             toolsTechRoutes);
app.use('/api/course-instructors',     courseInstructorsRoutes);
app.use('/api/curriculum-comparison',  curriculumComparisonRoutes);
app.use('/api/skills-comparison',      skillsComparisonRoutes);
app.use('/api/achieve-goals',          achieveGoalsRoutes);
app.use('/api/course-overview',        courseOverviewRoutes);
app.use('/api/faq',                    faqRoutes);
app.use('/api/footer',                 footerRoutes);
app.use('/api/navbar-dropdown',        navbarDropdownRoutes);
app.use('/api/center-visits',          centerVisitsRoutes);
app.use('/api/offline-centres',        offlineCentresRoutes);
app.use('/api/centres-whychoose',      centresWhyChooseRoutes);
app.use('/api/centres-faq',            centresFAQRoutes);
app.use('/api/top-program-categories', topProgramCategoriesRoutes);
app.use('/api/top-programs',           topProgramsRoutes);
app.use('/api/counseling',             counselingRoutes);
app.use('/api/study-abroad-advisor',   studyAbroadAdvisorRoutes);
app.use('/api/lms',                    lmsRoutes);
app.use('/api/admin/lms',              lmsAdminRoutes);

app.get("/", (req, res) => {
    res.send("Backend Running Successfully 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server Running On Port ${PORT}`);
});
