-- â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—
--   MENTORINGMINDS â€” COMPLETE DATABASE SETUP (ALL-IN-ONE)
--   Sirf yeh EK file database mein run karo.
--   Sab kuch included: Tables, SPs, Fixes â€” sab latest version.
--
--   RUN ORDER: Upar se neeche, ek baar mein sab run kar do.
--   SAFE: Data delete nahi hoga â€” sirf SPs replace honge.
--          Tables pehle se hain toh create nahi hongi.
-- â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

-- ============================================================
-- PART 1: DROP ALL STORED PROCEDURES
-- ============================================================

-- Auth / User SPs
IF OBJECT_ID('sp_RegisterUser',          'P') IS NOT NULL DROP PROCEDURE sp_RegisterUser;
IF OBJECT_ID('sp_AddNavbarLink',         'P') IS NOT NULL DROP PROCEDURE sp_AddNavbarLink;
IF OBJECT_ID('UpdateUserProfile',        'P') IS NOT NULL DROP PROCEDURE UpdateUserProfile;
IF OBJECT_ID('sp_CheckUserForRegister',  'P') IS NOT NULL DROP PROCEDURE sp_CheckUserForRegister;
IF OBJECT_ID('sp_UpdateUnverifiedUser',  'P') IS NOT NULL DROP PROCEDURE sp_UpdateUnverifiedUser;
IF OBJECT_ID('sp_VerifyOtp',             'P') IS NOT NULL DROP PROCEDURE sp_VerifyOtp;
IF OBJECT_ID('sp_MarkUserVerified',      'P') IS NOT NULL DROP PROCEDURE sp_MarkUserVerified;
IF OBJECT_ID('sp_EnsureUserProfile',     'P') IS NOT NULL DROP PROCEDURE sp_EnsureUserProfile;
IF OBJECT_ID('sp_GetUserByEmail',        'P') IS NOT NULL DROP PROCEDURE sp_GetUserByEmail;
IF OBJECT_ID('sp_UpdateLastLogin',       'P') IS NOT NULL DROP PROCEDURE sp_UpdateLastLogin;
IF OBJECT_ID('sp_GetProfileImage',       'P') IS NOT NULL DROP PROCEDURE sp_GetProfileImage;
IF OBJECT_ID('sp_SetForgotOtp',          'P') IS NOT NULL DROP PROCEDURE sp_SetForgotOtp;
IF OBJECT_ID('sp_VerifyResetOtp',        'P') IS NOT NULL DROP PROCEDURE sp_VerifyResetOtp;
IF OBJECT_ID('sp_ResetPassword',         'P') IS NOT NULL DROP PROCEDURE sp_ResetPassword;
IF OBJECT_ID('sp_ResendOtp',             'P') IS NOT NULL DROP PROCEDURE sp_ResendOtp;
IF OBJECT_ID('sp_UpdateProfileImage',    'P') IS NOT NULL DROP PROCEDURE sp_UpdateProfileImage;
IF OBJECT_ID('sp_GetUserProfile',        'P') IS NOT NULL DROP PROCEDURE sp_GetUserProfile;
IF OBJECT_ID('sp_GetAllUsers',           'P') IS NOT NULL DROP PROCEDURE sp_GetAllUsers;
-- Navbar SPs
IF OBJECT_ID('sp_GetNavbarLinks',        'P') IS NOT NULL DROP PROCEDURE sp_GetNavbarLinks;
IF OBJECT_ID('sp_UpdateNavbarLink',      'P') IS NOT NULL DROP PROCEDURE sp_UpdateNavbarLink;
IF OBJECT_ID('sp_DeleteNavbarLink',      'P') IS NOT NULL DROP PROCEDURE sp_DeleteNavbarLink;
IF OBJECT_ID('sp_ToggleNavbarLink',      'P') IS NOT NULL DROP PROCEDURE sp_ToggleNavbarLink;
-- Leads SPs
IF OBJECT_ID('sp_SubmitCallback',        'P') IS NOT NULL DROP PROCEDURE sp_SubmitCallback;
IF OBJECT_ID('sp_GetCallbacks',          'P') IS NOT NULL DROP PROCEDURE sp_GetCallbacks;
IF OBJECT_ID('sp_MarkCallbackRead',      'P') IS NOT NULL DROP PROCEDURE sp_MarkCallbackRead;
IF OBJECT_ID('sp_MarkAllCallbacksRead',  'P') IS NOT NULL DROP PROCEDURE sp_MarkAllCallbacksRead;
IF OBJECT_ID('sp_SubmitAdmission',       'P') IS NOT NULL DROP PROCEDURE sp_SubmitAdmission;
IF OBJECT_ID('sp_GetAdmissions',         'P') IS NOT NULL DROP PROCEDURE sp_GetAdmissions;
IF OBJECT_ID('sp_MarkAdmissionRead',     'P') IS NOT NULL DROP PROCEDURE sp_MarkAdmissionRead;
IF OBJECT_ID('sp_UpdateAdmissionStatus', 'P') IS NOT NULL DROP PROCEDURE sp_UpdateAdmissionStatus;
IF OBJECT_ID('sp_GetUnreadCount',        'P') IS NOT NULL DROP PROCEDURE sp_GetUnreadCount;
-- Banner SPs
IF OBJECT_ID('sp_GetBanners',            'P') IS NOT NULL DROP PROCEDURE sp_GetBanners;
IF OBJECT_ID('sp_GetBannerById',         'P') IS NOT NULL DROP PROCEDURE sp_GetBannerById;
IF OBJECT_ID('sp_AddBanner',             'P') IS NOT NULL DROP PROCEDURE sp_AddBanner;
IF OBJECT_ID('sp_UpdateBanner',          'P') IS NOT NULL DROP PROCEDURE sp_UpdateBanner;
IF OBJECT_ID('sp_DeleteBanner',          'P') IS NOT NULL DROP PROCEDURE sp_DeleteBanner;
IF OBJECT_ID('sp_ToggleBanner',          'P') IS NOT NULL DROP PROCEDURE sp_ToggleBanner;
-- Old Course SPs
IF OBJECT_ID('sp_GetCourseBySlug',       'P') IS NOT NULL DROP PROCEDURE sp_GetCourseBySlug;
IF OBJECT_ID('sp_GetCourseByNavbarId',   'P') IS NOT NULL DROP PROCEDURE sp_GetCourseByNavbarId;
IF OBJECT_ID('sp_UpsertCourseDetails',   'P') IS NOT NULL DROP PROCEDURE sp_UpsertCourseDetails;
IF OBJECT_ID('sp_GetAllCourses',         'P') IS NOT NULL DROP PROCEDURE sp_GetAllCourses;
IF OBJECT_ID('sp_DeleteCourseDetails',   'P') IS NOT NULL DROP PROCEDURE sp_DeleteCourseDetails;
-- University SPs (old â€” replaced by Slides system)
-- These are dropped but not recreated â€” use university_slides_migration.sql
IF OBJECT_ID('sp_GetUniversitySection',   'P') IS NOT NULL DROP PROCEDURE sp_GetUniversitySection;
IF OBJECT_ID('sp_UpdateUniversitySection','P') IS NOT NULL DROP PROCEDURE sp_UpdateUniversitySection;
IF OBJECT_ID('sp_GetUniversityLogos',     'P') IS NOT NULL DROP PROCEDURE sp_GetUniversityLogos;
IF OBJECT_ID('sp_GetUniversityLogoById',  'P') IS NOT NULL DROP PROCEDURE sp_GetUniversityLogoById;
IF OBJECT_ID('sp_AddUniversityLogo',      'P') IS NOT NULL DROP PROCEDURE sp_AddUniversityLogo;
IF OBJECT_ID('sp_UpdateUniversityLogo',   'P') IS NOT NULL DROP PROCEDURE sp_UpdateUniversityLogo;
IF OBJECT_ID('sp_DeleteUniversityLogo',   'P') IS NOT NULL DROP PROCEDURE sp_DeleteUniversityLogo;
IF OBJECT_ID('sp_ToggleUniversityLogo',   'P') IS NOT NULL DROP PROCEDURE sp_ToggleUniversityLogo;
IF OBJECT_ID('sp_ReorderUniversityLogo',  'P') IS NOT NULL DROP PROCEDURE sp_ReorderUniversityLogo;
-- University Slides SPs (new)
IF OBJECT_ID('sp_GetUniversitySlides',        'P') IS NOT NULL DROP PROCEDURE sp_GetUniversitySlides;
IF OBJECT_ID('sp_AddUniversitySlide',         'P') IS NOT NULL DROP PROCEDURE sp_AddUniversitySlide;
IF OBJECT_ID('sp_UpdateUniversitySlide',      'P') IS NOT NULL DROP PROCEDURE sp_UpdateUniversitySlide;
IF OBJECT_ID('sp_DeleteUniversitySlide',      'P') IS NOT NULL DROP PROCEDURE sp_DeleteUniversitySlide;
IF OBJECT_ID('sp_ToggleUniversitySlide',      'P') IS NOT NULL DROP PROCEDURE sp_ToggleUniversitySlide;
IF OBJECT_ID('sp_AddUniversitySlideLogo',     'P') IS NOT NULL DROP PROCEDURE sp_AddUniversitySlideLogo;
IF OBJECT_ID('sp_UpdateUniversitySlideLogo',  'P') IS NOT NULL DROP PROCEDURE sp_UpdateUniversitySlideLogo;
IF OBJECT_ID('sp_DeleteUniversitySlideLogo',  'P') IS NOT NULL DROP PROCEDURE sp_DeleteUniversitySlideLogo;
-- Career SPs
IF OBJECT_ID('sp_GetCareerCategories',    'P') IS NOT NULL DROP PROCEDURE sp_GetCareerCategories;
IF OBJECT_ID('sp_AddCareerCategory',      'P') IS NOT NULL DROP PROCEDURE sp_AddCareerCategory;
IF OBJECT_ID('sp_UpdateCareerCategory',   'P') IS NOT NULL DROP PROCEDURE sp_UpdateCareerCategory;
IF OBJECT_ID('sp_DeleteCareerCategory',   'P') IS NOT NULL DROP PROCEDURE sp_DeleteCareerCategory;
IF OBJECT_ID('sp_ToggleCareerCategory',   'P') IS NOT NULL DROP PROCEDURE sp_ToggleCareerCategory;
IF OBJECT_ID('sp_GetCareerCourses',       'P') IS NOT NULL DROP PROCEDURE sp_GetCareerCourses;
IF OBJECT_ID('sp_GetCareerCourseById',    'P') IS NOT NULL DROP PROCEDURE sp_GetCareerCourseById;
IF OBJECT_ID('sp_AddCareerCourse',        'P') IS NOT NULL DROP PROCEDURE sp_AddCareerCourse;
IF OBJECT_ID('sp_UpdateCareerCourse',     'P') IS NOT NULL DROP PROCEDURE sp_UpdateCareerCourse;
IF OBJECT_ID('sp_DeleteCareerCourse',     'P') IS NOT NULL DROP PROCEDURE sp_DeleteCareerCourse;
IF OBJECT_ID('sp_ToggleCareerCourse',     'P') IS NOT NULL DROP PROCEDURE sp_ToggleCareerCourse;
IF OBJECT_ID('sp_GetPublicCareerData',    'P') IS NOT NULL DROP PROCEDURE sp_GetPublicCareerData;
-- Course Detail SPs
IF OBJECT_ID('sp_GetCourseDetailBySlug',  'P') IS NOT NULL DROP PROCEDURE sp_GetCourseDetailBySlug;
IF OBJECT_ID('sp_GetCourseDetailById',    'P') IS NOT NULL DROP PROCEDURE sp_GetCourseDetailById;
IF OBJECT_ID('sp_UpsertCourseDetail',     'P') IS NOT NULL DROP PROCEDURE sp_UpsertCourseDetail;
IF OBJECT_ID('sp_DeleteCourseDetail',     'P') IS NOT NULL DROP PROCEDURE sp_DeleteCourseDetail;
IF OBJECT_ID('sp_GetAllCourseDetails',    'P') IS NOT NULL DROP PROCEDURE sp_GetAllCourseDetails;
-- Free Courses SPs
IF OBJECT_ID('sp_GetPublicFreeCourses',   'P') IS NOT NULL DROP PROCEDURE sp_GetPublicFreeCourses;
IF OBJECT_ID('sp_GetAllFreeCourses',      'P') IS NOT NULL DROP PROCEDURE sp_GetAllFreeCourses;
IF OBJECT_ID('sp_AddFreeCourse',          'P') IS NOT NULL DROP PROCEDURE sp_AddFreeCourse;
IF OBJECT_ID('sp_UpdateFreeCourse',       'P') IS NOT NULL DROP PROCEDURE sp_UpdateFreeCourse;
IF OBJECT_ID('sp_DeleteFreeCourse',       'P') IS NOT NULL DROP PROCEDURE sp_DeleteFreeCourse;
IF OBJECT_ID('sp_ToggleFreeCourse',       'P') IS NOT NULL DROP PROCEDURE sp_ToggleFreeCourse;
-- Achieve Goals SPs
IF OBJECT_ID('sp_GetAchieveGoalsSettings','P') IS NOT NULL DROP PROCEDURE sp_GetAchieveGoalsSettings;
IF OBJECT_ID('sp_SaveAchieveGoalsSettings','P') IS NOT NULL DROP PROCEDURE sp_SaveAchieveGoalsSettings;
IF OBJECT_ID('sp_GetAchieveGoalsTabs','P')      IS NOT NULL DROP PROCEDURE sp_GetAchieveGoalsTabs;
IF OBJECT_ID('sp_AddAchieveGoalsTab','P')       IS NOT NULL DROP PROCEDURE sp_AddAchieveGoalsTab;
IF OBJECT_ID('sp_UpdateAchieveGoalsTab','P')    IS NOT NULL DROP PROCEDURE sp_UpdateAchieveGoalsTab;
IF OBJECT_ID('sp_DeleteAchieveGoalsTab','P')    IS NOT NULL DROP PROCEDURE sp_DeleteAchieveGoalsTab;
IF OBJECT_ID('sp_ToggleAchieveGoalsTab','P')    IS NOT NULL DROP PROCEDURE sp_ToggleAchieveGoalsTab;
IF OBJECT_ID('sp_GetAchieveGoalsAllData','P')   IS NOT NULL DROP PROCEDURE sp_GetAchieveGoalsAllData;
-- Awards Section SPs
IF OBJECT_ID('sp_GetAwardsSectionConfig','P')    IS NOT NULL DROP PROCEDURE sp_GetAwardsSectionConfig;
IF OBJECT_ID('sp_UpsertAwardsSectionConfig','P') IS NOT NULL DROP PROCEDURE sp_UpsertAwardsSectionConfig;
IF OBJECT_ID('sp_GetAwardCards','P')             IS NOT NULL DROP PROCEDURE sp_GetAwardCards;
IF OBJECT_ID('sp_GetAwardCardById','P')          IS NOT NULL DROP PROCEDURE sp_GetAwardCardById;
IF OBJECT_ID('sp_AddAwardCard','P')              IS NOT NULL DROP PROCEDURE sp_AddAwardCard;
IF OBJECT_ID('sp_UpdateAwardCard','P')           IS NOT NULL DROP PROCEDURE sp_UpdateAwardCard;
IF OBJECT_ID('sp_DeleteAwardCard','P')           IS NOT NULL DROP PROCEDURE sp_DeleteAwardCard;
IF OBJECT_ID('sp_ToggleAwardCard','P')           IS NOT NULL DROP PROCEDURE sp_ToggleAwardCard;
-- Course Instructors SPs
IF OBJECT_ID('sp_GetCourseInstructorSettings','P') IS NOT NULL DROP PROCEDURE sp_GetCourseInstructorSettings;
IF OBJECT_ID('sp_SaveCourseInstructorSettings','P') IS NOT NULL DROP PROCEDURE sp_SaveCourseInstructorSettings;
IF OBJECT_ID('sp_GetCourseInstructorTabs','P')      IS NOT NULL DROP PROCEDURE sp_GetCourseInstructorTabs;
IF OBJECT_ID('sp_AddCourseInstructorTab','P')       IS NOT NULL DROP PROCEDURE sp_AddCourseInstructorTab;
IF OBJECT_ID('sp_UpdateCourseInstructorTab','P')    IS NOT NULL DROP PROCEDURE sp_UpdateCourseInstructorTab;
IF OBJECT_ID('sp_DeleteCourseInstructorTab','P')    IS NOT NULL DROP PROCEDURE sp_DeleteCourseInstructorTab;
IF OBJECT_ID('sp_ToggleCourseInstructorTab','P')    IS NOT NULL DROP PROCEDURE sp_ToggleCourseInstructorTab;
IF OBJECT_ID('sp_GetCourseInstructorCards','P')     IS NOT NULL DROP PROCEDURE sp_GetCourseInstructorCards;
IF OBJECT_ID('sp_AddCourseInstructorCard','P')      IS NOT NULL DROP PROCEDURE sp_AddCourseInstructorCard;
IF OBJECT_ID('sp_UpdateCourseInstructorCard','P')   IS NOT NULL DROP PROCEDURE sp_UpdateCourseInstructorCard;
IF OBJECT_ID('sp_DeleteCourseInstructorCard','P')   IS NOT NULL DROP PROCEDURE sp_DeleteCourseInstructorCard;
IF OBJECT_ID('sp_ToggleCourseInstructorCard','P')   IS NOT NULL DROP PROCEDURE sp_ToggleCourseInstructorCard;
IF OBJECT_ID('sp_GetAllCourseInstructors','P')      IS NOT NULL DROP PROCEDURE sp_GetAllCourseInstructors;
-- Course Overview SPs
IF OBJECT_ID('sp_GetCourseOverviewSettings','P')   IS NOT NULL DROP PROCEDURE sp_GetCourseOverviewSettings;
IF OBJECT_ID('sp_SaveCourseOverviewSettings','P')  IS NOT NULL DROP PROCEDURE sp_SaveCourseOverviewSettings;
IF OBJECT_ID('sp_GetCourseOverviewSections','P')   IS NOT NULL DROP PROCEDURE sp_GetCourseOverviewSections;
IF OBJECT_ID('sp_AddCourseOverviewSection','P')    IS NOT NULL DROP PROCEDURE sp_AddCourseOverviewSection;
IF OBJECT_ID('sp_UpdateCourseOverviewSection','P') IS NOT NULL DROP PROCEDURE sp_UpdateCourseOverviewSection;
IF OBJECT_ID('sp_DeleteCourseOverviewSection','P') IS NOT NULL DROP PROCEDURE sp_DeleteCourseOverviewSection;
IF OBJECT_ID('sp_ToggleCourseOverviewSection','P') IS NOT NULL DROP PROCEDURE sp_ToggleCourseOverviewSection;
IF OBJECT_ID('sp_GetCourseOverviewAllData','P')    IS NOT NULL DROP PROCEDURE sp_GetCourseOverviewAllData;
-- Course Projects SPs
IF OBJECT_ID('sp_GetCourseProjectSettings','P') IS NOT NULL DROP PROCEDURE sp_GetCourseProjectSettings;
IF OBJECT_ID('sp_SaveCourseProjectSettings','P') IS NOT NULL DROP PROCEDURE sp_SaveCourseProjectSettings;
IF OBJECT_ID('sp_GetCourseProjects','P')         IS NOT NULL DROP PROCEDURE sp_GetCourseProjects;
IF OBJECT_ID('sp_AddCourseProject','P')          IS NOT NULL DROP PROCEDURE sp_AddCourseProject;
IF OBJECT_ID('sp_UpdateCourseProject','P')       IS NOT NULL DROP PROCEDURE sp_UpdateCourseProject;
IF OBJECT_ID('sp_DeleteCourseProject','P')       IS NOT NULL DROP PROCEDURE sp_DeleteCourseProject;
IF OBJECT_ID('sp_ToggleCourseProject','P')       IS NOT NULL DROP PROCEDURE sp_ToggleCourseProject;
-- Curriculum Comparison SPs
IF OBJECT_ID('sp_GetCurriculumCompSettings','P')  IS NOT NULL DROP PROCEDURE sp_GetCurriculumCompSettings;
IF OBJECT_ID('sp_SaveCurriculumCompSettings','P') IS NOT NULL DROP PROCEDURE sp_SaveCurriculumCompSettings;
IF OBJECT_ID('sp_GetCurriculumCompCards','P')     IS NOT NULL DROP PROCEDURE sp_GetCurriculumCompCards;
IF OBJECT_ID('sp_AddCurriculumCompCard','P')      IS NOT NULL DROP PROCEDURE sp_AddCurriculumCompCard;
IF OBJECT_ID('sp_UpdateCurriculumCompCard','P')   IS NOT NULL DROP PROCEDURE sp_UpdateCurriculumCompCard;
IF OBJECT_ID('sp_DeleteCurriculumCompCard','P')   IS NOT NULL DROP PROCEDURE sp_DeleteCurriculumCompCard;
IF OBJECT_ID('sp_ToggleCurriculumCompCard','P')   IS NOT NULL DROP PROCEDURE sp_ToggleCurriculumCompCard;
IF OBJECT_ID('sp_GetCurriculumCompAllData','P')   IS NOT NULL DROP PROCEDURE sp_GetCurriculumCompAllData;
-- Curriculum SPs
IF OBJECT_ID('sp_GetCurriculumCards','P')    IS NOT NULL DROP PROCEDURE sp_GetCurriculumCards;
IF OBJECT_ID('sp_AddCurriculumCard','P')     IS NOT NULL DROP PROCEDURE sp_AddCurriculumCard;
IF OBJECT_ID('sp_UpdateCurriculumCard','P')  IS NOT NULL DROP PROCEDURE sp_UpdateCurriculumCard;
IF OBJECT_ID('sp_DeleteCurriculumCard','P')  IS NOT NULL DROP PROCEDURE sp_DeleteCurriculumCard;
IF OBJECT_ID('sp_ToggleCurriculumCard','P')  IS NOT NULL DROP PROCEDURE sp_ToggleCurriculumCard;
IF OBJECT_ID('sp_GetCurriculumSettings','P') IS NOT NULL DROP PROCEDURE sp_GetCurriculumSettings;
IF OBJECT_ID('sp_SaveCurriculumSettings','P') IS NOT NULL DROP PROCEDURE sp_SaveCurriculumSettings;
-- FAQ SPs
IF OBJECT_ID('sp_GetFaqSettings','P')  IS NOT NULL DROP PROCEDURE sp_GetFaqSettings;
IF OBJECT_ID('sp_SaveFaqSettings','P') IS NOT NULL DROP PROCEDURE sp_SaveFaqSettings;
IF OBJECT_ID('sp_GetFaqItems','P')     IS NOT NULL DROP PROCEDURE sp_GetFaqItems;
IF OBJECT_ID('sp_AddFaqItem','P')      IS NOT NULL DROP PROCEDURE sp_AddFaqItem;
IF OBJECT_ID('sp_UpdateFaqItem','P')   IS NOT NULL DROP PROCEDURE sp_UpdateFaqItem;
IF OBJECT_ID('sp_DeleteFaqItem','P')   IS NOT NULL DROP PROCEDURE sp_DeleteFaqItem;
IF OBJECT_ID('sp_ToggleFaqItem','P')   IS NOT NULL DROP PROCEDURE sp_ToggleFaqItem;
IF OBJECT_ID('sp_GetFaqAllData','P')   IS NOT NULL DROP PROCEDURE sp_GetFaqAllData;
-- Instructors SPs
IF OBJECT_ID('sp_GetInstructors',        'P') IS NOT NULL DROP PROCEDURE sp_GetInstructors;
IF OBJECT_ID('sp_GetInstructorById',     'P') IS NOT NULL DROP PROCEDURE sp_GetInstructorById;
IF OBJECT_ID('sp_AddInstructor',         'P') IS NOT NULL DROP PROCEDURE sp_AddInstructor;
IF OBJECT_ID('sp_UpdateInstructor',      'P') IS NOT NULL DROP PROCEDURE sp_UpdateInstructor;
IF OBJECT_ID('sp_DeleteInstructor',      'P') IS NOT NULL DROP PROCEDURE sp_DeleteInstructor;
IF OBJECT_ID('sp_ToggleInstructor',      'P') IS NOT NULL DROP PROCEDURE sp_ToggleInstructor;
IF OBJECT_ID('sp_GetInstructorSection',  'P') IS NOT NULL DROP PROCEDURE sp_GetInstructorSection;
IF OBJECT_ID('sp_UpsertInstructorSection','P') IS NOT NULL DROP PROCEDURE sp_UpsertInstructorSection;
IF OBJECT_ID('sp_GetAllProgramsHero',    'P') IS NOT NULL DROP PROCEDURE sp_GetAllProgramsHero;
IF OBJECT_ID('sp_UpsertAllProgramsHero', 'P') IS NOT NULL DROP PROCEDURE sp_UpsertAllProgramsHero;
-- Skills Comparison SPs
IF OBJECT_ID('sp_GetSkillsCompSettings','P')  IS NOT NULL DROP PROCEDURE sp_GetSkillsCompSettings;
IF OBJECT_ID('sp_SaveSkillsCompSettings','P') IS NOT NULL DROP PROCEDURE sp_SaveSkillsCompSettings;
IF OBJECT_ID('sp_GetSkillsCompCards','P')     IS NOT NULL DROP PROCEDURE sp_GetSkillsCompCards;
IF OBJECT_ID('sp_AddSkillsCompCard','P')      IS NOT NULL DROP PROCEDURE sp_AddSkillsCompCard;
IF OBJECT_ID('sp_UpdateSkillsCompCard','P')   IS NOT NULL DROP PROCEDURE sp_UpdateSkillsCompCard;
IF OBJECT_ID('sp_DeleteSkillsCompCard','P')   IS NOT NULL DROP PROCEDURE sp_DeleteSkillsCompCard;
IF OBJECT_ID('sp_ToggleSkillsCompCard','P')   IS NOT NULL DROP PROCEDURE sp_ToggleSkillsCompCard;
IF OBJECT_ID('sp_GetSkillsCompAllData','P')   IS NOT NULL DROP PROCEDURE sp_GetSkillsCompAllData;
-- Subscription Banner SPs
IF OBJECT_ID('sp_GetSubscriptionBanner',    'P') IS NOT NULL DROP PROCEDURE sp_GetSubscriptionBanner;
IF OBJECT_ID('sp_UpsertSubscriptionBanner', 'P') IS NOT NULL DROP PROCEDURE sp_UpsertSubscriptionBanner;
-- Success Section SPs
IF OBJECT_ID('sp_GetSuccessSectionConfig','P')    IS NOT NULL DROP PROCEDURE sp_GetSuccessSectionConfig;
IF OBJECT_ID('sp_UpsertSuccessSectionConfig','P') IS NOT NULL DROP PROCEDURE sp_UpsertSuccessSectionConfig;
IF OBJECT_ID('sp_GetSuccessStories','P')          IS NOT NULL DROP PROCEDURE sp_GetSuccessStories;
IF OBJECT_ID('sp_GetSuccessStoryById','P')        IS NOT NULL DROP PROCEDURE sp_GetSuccessStoryById;
IF OBJECT_ID('sp_AddSuccessStory','P')            IS NOT NULL DROP PROCEDURE sp_AddSuccessStory;
IF OBJECT_ID('sp_UpdateSuccessStory','P')         IS NOT NULL DROP PROCEDURE sp_UpdateSuccessStory;
IF OBJECT_ID('sp_DeleteSuccessStory','P')         IS NOT NULL DROP PROCEDURE sp_DeleteSuccessStory;
IF OBJECT_ID('sp_ToggleSuccessStory','P')         IS NOT NULL DROP PROCEDURE sp_ToggleSuccessStory;
-- Tools & Tech SPs
IF OBJECT_ID('sp_GetToolsSettings','P')  IS NOT NULL DROP PROCEDURE sp_GetToolsSettings;
IF OBJECT_ID('sp_SaveToolsSettings','P') IS NOT NULL DROP PROCEDURE sp_SaveToolsSettings;
IF OBJECT_ID('sp_GetTools','P')          IS NOT NULL DROP PROCEDURE sp_GetTools;
IF OBJECT_ID('sp_AddTool','P')           IS NOT NULL DROP PROCEDURE sp_AddTool;
IF OBJECT_ID('sp_UpdateTool','P')        IS NOT NULL DROP PROCEDURE sp_UpdateTool;
IF OBJECT_ID('sp_DeleteTool','P')        IS NOT NULL DROP PROCEDURE sp_DeleteTool;
IF OBJECT_ID('sp_ToggleTool','P')        IS NOT NULL DROP PROCEDURE sp_ToggleTool;

-- Offline Centres SPs
IF OBJECT_ID('sp_GetOfflineCentres',       'P') IS NOT NULL DROP PROCEDURE sp_GetOfflineCentres;
IF OBJECT_ID('sp_GetOfflineCentresByCity', 'P') IS NOT NULL DROP PROCEDURE sp_GetOfflineCentresByCity;
IF OBJECT_ID('sp_UpsertOfflineCentre',     'P') IS NOT NULL DROP PROCEDURE sp_UpsertOfflineCentre;
IF OBJECT_ID('sp_DeleteOfflineCentre',     'P') IS NOT NULL DROP PROCEDURE sp_DeleteOfflineCentre;
IF OBJECT_ID('sp_GetOfflineCitiesWithCount','P') IS NOT NULL DROP PROCEDURE sp_GetOfflineCitiesWithCount;
-- Centres Why Choose & FAQ SPs
IF OBJECT_ID('sp_GetAllCentresWhyChoose',       'P') IS NOT NULL DROP PROCEDURE sp_GetAllCentresWhyChoose;
IF OBJECT_ID('sp_GetActiveCentresWhyChoose',     'P') IS NOT NULL DROP PROCEDURE sp_GetActiveCentresWhyChoose;
IF OBJECT_ID('sp_UpsertCentresWhyChoose',        'P') IS NOT NULL DROP PROCEDURE sp_UpsertCentresWhyChoose;
IF OBJECT_ID('sp_DeleteCentresWhyChoose',        'P') IS NOT NULL DROP PROCEDURE sp_DeleteCentresWhyChoose;
IF OBJECT_ID('sp_ToggleCentresWhyChooseStatus',  'P') IS NOT NULL DROP PROCEDURE sp_ToggleCentresWhyChooseStatus;
IF OBJECT_ID('sp_GetAllCentresFAQ',              'P') IS NOT NULL DROP PROCEDURE sp_GetAllCentresFAQ;
IF OBJECT_ID('sp_GetActiveCentresFAQ',            'P') IS NOT NULL DROP PROCEDURE sp_GetActiveCentresFAQ;
IF OBJECT_ID('sp_UpsertCentresFAQ',               'P') IS NOT NULL DROP PROCEDURE sp_UpsertCentresFAQ;
IF OBJECT_ID('sp_DeleteCentresFAQ',               'P') IS NOT NULL DROP PROCEDURE sp_DeleteCentresFAQ;
IF OBJECT_ID('sp_ToggleCentresFAQStatus',         'P') IS NOT NULL DROP PROCEDURE sp_ToggleCentresFAQStatus;
-- Top Programs SPs
IF OBJECT_ID('sp_GetTopProgramCategories',   'P') IS NOT NULL DROP PROCEDURE sp_GetTopProgramCategories;
IF OBJECT_ID('sp_UpsertTopProgramCategory',  'P') IS NOT NULL DROP PROCEDURE sp_UpsertTopProgramCategory;
IF OBJECT_ID('sp_DeleteTopProgramCategory',  'P') IS NOT NULL DROP PROCEDURE sp_DeleteTopProgramCategory;
IF OBJECT_ID('sp_GetTopProgramsByCategory',  'P') IS NOT NULL DROP PROCEDURE sp_GetTopProgramsByCategory;
IF OBJECT_ID('sp_GetAllTopPrograms',         'P') IS NOT NULL DROP PROCEDURE sp_GetAllTopPrograms;
IF OBJECT_ID('sp_GetTopProgramBySlug',       'P') IS NOT NULL DROP PROCEDURE sp_GetTopProgramBySlug;
IF OBJECT_ID('sp_UpsertTopProgram',          'P') IS NOT NULL DROP PROCEDURE sp_UpsertTopProgram;
IF OBJECT_ID('sp_DeleteTopProgram',          'P') IS NOT NULL DROP PROCEDURE sp_DeleteTopProgram;
IF OBJECT_ID('sp_GetTopProgramDetails',      'P') IS NOT NULL DROP PROCEDURE sp_GetTopProgramDetails;
IF OBJECT_ID('sp_UpsertTopProgramDetails',   'P') IS NOT NULL DROP PROCEDURE sp_UpsertTopProgramDetails;
-- Online Course SPs
IF OBJECT_ID('sp_GetOnlineCourseCategories',   'P') IS NOT NULL DROP PROCEDURE sp_GetOnlineCourseCategories;
IF OBJECT_ID('sp_AddOnlineCourseCategory',     'P') IS NOT NULL DROP PROCEDURE sp_AddOnlineCourseCategory;
IF OBJECT_ID('sp_UpdateOnlineCourseCategory',  'P') IS NOT NULL DROP PROCEDURE sp_UpdateOnlineCourseCategory;
IF OBJECT_ID('sp_DeleteOnlineCourseCategory',  'P') IS NOT NULL DROP PROCEDURE sp_DeleteOnlineCourseCategory;
IF OBJECT_ID('sp_ToggleOnlineCourseCategory',  'P') IS NOT NULL DROP PROCEDURE sp_ToggleOnlineCourseCategory;
IF OBJECT_ID('sp_GetOnlineCourses',            'P') IS NOT NULL DROP PROCEDURE sp_GetOnlineCourses;
IF OBJECT_ID('sp_GetOnlineCourseById',         'P') IS NOT NULL DROP PROCEDURE sp_GetOnlineCourseById;
IF OBJECT_ID('sp_AddOnlineCourse',             'P') IS NOT NULL DROP PROCEDURE sp_AddOnlineCourse;
IF OBJECT_ID('sp_UpdateOnlineCourse',          'P') IS NOT NULL DROP PROCEDURE sp_UpdateOnlineCourse;
IF OBJECT_ID('sp_DeleteOnlineCourse',          'P') IS NOT NULL DROP PROCEDURE sp_DeleteOnlineCourse;
IF OBJECT_ID('sp_ToggleOnlineCourse',          'P') IS NOT NULL DROP PROCEDURE sp_ToggleOnlineCourse;
IF OBJECT_ID('sp_GetPublicOnlineCourseData',   'P') IS NOT NULL DROP PROCEDURE sp_GetPublicOnlineCourseData;
IF OBJECT_ID('sp_GetAllPublicOnlineCourses',   'P') IS NOT NULL DROP PROCEDURE sp_GetAllPublicOnlineCourses;
IF OBJECT_ID('sp_GetOnlineCourseDetailBySlug', 'P') IS NOT NULL DROP PROCEDURE sp_GetOnlineCourseDetailBySlug;
IF OBJECT_ID('sp_GetOnlineCourseDetailById',   'P') IS NOT NULL DROP PROCEDURE sp_GetOnlineCourseDetailById;
IF OBJECT_ID('sp_UpsertOnlineCourseDetail',    'P') IS NOT NULL DROP PROCEDURE sp_UpsertOnlineCourseDetail;
IF OBJECT_ID('sp_DeleteOnlineCourseDetail',    'P') IS NOT NULL DROP PROCEDURE sp_DeleteOnlineCourseDetail;
IF OBJECT_ID('sp_GetAllOnlineCourseDetails',   'P') IS NOT NULL DROP PROCEDURE sp_GetAllOnlineCourseDetails;
GO

-- ============================================================
-- PART 2: CREATE TABLES (agar pehle se nahi hain)
-- ============================================================

-- users
IF OBJECT_ID('users','U') IS NULL
BEGIN
    CREATE TABLE users (
        id            INT IDENTITY(1,1) PRIMARY KEY,
        full_name     VARCHAR(100)  NOT NULL,
        email         VARCHAR(150)  NOT NULL UNIQUE,
        phone         VARCHAR(20)   NOT NULL UNIQUE,
        password_hash VARCHAR(255)  NOT NULL,
        profile_image VARCHAR(MAX)  NULL,
        role          VARCHAR(20)   NOT NULL DEFAULT 'User',
        otp           VARCHAR(10)   NULL,
        otp_expiry    DATETIME      NULL,
        is_verified   BIT           NOT NULL DEFAULT 0,
        is_active     BIT           NOT NULL DEFAULT 1,
        last_login    DATETIME      NULL,
        created_at    DATETIME      NOT NULL DEFAULT GETDATE(),
        updated_at    DATETIME      NOT NULL DEFAULT GETDATE()
    );
    PRINT 'users table created';
END
GO

-- UsersProfile
IF OBJECT_ID('UsersProfile','U') IS NULL
BEGIN
    CREATE TABLE UsersProfile (
        Id                   INT NOT NULL PRIMARY KEY,
        FullName             VARCHAR(100)  NOT NULL,
        Email                VARCHAR(150)  NOT NULL UNIQUE,
        PasswordHash         VARCHAR(255)  NOT NULL,
        ProfileImage         VARCHAR(MAX)  NULL,
        DOB                  DATE          NULL,
        Gender               VARCHAR(20)   NULL,
        MaritalStatus        VARCHAR(50)   NULL,
        HighestQualification VARCHAR(100)  NULL,
        Phone                VARCHAR(20)   NULL,
        WhatsApp             VARCHAR(20)   NULL,
        AltPhone             VARCHAR(20)   NULL,
        AltEmail             VARCHAR(150)  NULL,
        PermHouseNo          VARCHAR(100)  NULL,
        PermAptName          VARCHAR(100)  NULL,
        PermLocality         VARCHAR(150)  NULL,
        PermCountry          VARCHAR(50)   NULL,
        PermCity             VARCHAR(50)   NULL,
        PermPincode          VARCHAR(20)   NULL,
        CurrHouseNo          VARCHAR(100)  NULL,
        CurrAptName          VARCHAR(100)  NULL,
        CurrLocality         VARCHAR(150)  NULL,
        CurrCountry          VARCHAR(50)   NULL,
        CurrCity             VARCHAR(50)   NULL,
        CurrPincode          VARCHAR(20)   NULL,
        FatherName           VARCHAR(100)  NULL,
        FatherEducation      VARCHAR(100)  NULL,
        MotherName           VARCHAR(100)  NULL,
        MotherEducation      VARCHAR(100)  NULL,
        ParentMobile         VARCHAR(20)   NULL,
        LinkedIn             VARCHAR(255)  NULL,
        GitHub               VARCHAR(255)  NULL,
        Instagram            VARCHAR(255)  NULL,
        CreatedAt            DATETIME      NOT NULL DEFAULT GETDATE(),
        UpdatedAt            DATETIME      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_UsersProfile_Users FOREIGN KEY (Id) REFERENCES users(id) ON DELETE CASCADE
    );
    PRINT 'UsersProfile table created';
END
GO

-- NavbarLinks
IF OBJECT_ID('NavbarLinks','U') IS NULL
BEGIN
    CREATE TABLE NavbarLinks (
        Id        INT IDENTITY(1,1) PRIMARY KEY,
        Title     VARCHAR(100) NOT NULL,
        Url       VARCHAR(255) NULL,
        Slug      VARCHAR(150) NULL,
        Category  VARCHAR(50)  NULL,
        ParentId  INT          NULL,
        BadgeText VARCHAR(20)  NULL,
        IsActive  BIT          NOT NULL DEFAULT 1,
        SortOrder INT          NOT NULL DEFAULT 0,
        CreatedAt DATETIME     NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_NavbarLinks_Parent FOREIGN KEY (ParentId) REFERENCES NavbarLinks(Id)
    );
    PRINT 'NavbarLinks table created';
END
GO

-- CourseDetails (old navbar-linked courses)
IF OBJECT_ID('CourseDetails','U') IS NULL
BEGIN
    CREATE TABLE CourseDetails (
        Id                  INT IDENTITY(1,1) PRIMARY KEY,
        NavbarLinkId        INT           NOT NULL,
        Slug                VARCHAR(150)  NOT NULL UNIQUE,
        Category            VARCHAR(50)   NOT NULL,
        HeroTitle           VARCHAR(255)  NULL,
        HeroSubtitle        VARCHAR(500)  NULL,
        HeroImage           VARCHAR(MAX)  NULL,
        HeroBadge           VARCHAR(100)  NULL,
        OverviewTitle       VARCHAR(255)  NULL,
        OverviewDescription NVARCHAR(MAX) NULL,
        KeyHighlights       NVARCHAR(MAX) NULL,
        Curriculum          NVARCHAR(MAX) NULL,
        WhoShouldEnroll     NVARCHAR(MAX) NULL,
        OriginalFee         VARCHAR(50)   NULL,
        DiscountedFee       VARCHAR(50)   NULL,
        Duration            VARCHAR(100)  NULL,
        Rating              DECIMAL(2,1)  NULL,
        StudentsEnrolled    INT           NULL,
        InstitutionName     VARCHAR(150)  NULL,
        InstitutionLogo     VARCHAR(MAX)  NULL,
        CertificateTitle    VARCHAR(255)  NULL,
        CertificateImage    VARCHAR(MAX)  NULL,
        FAQs                NVARCHAR(MAX) NULL,
        MetaTitle           VARCHAR(255)  NULL,
        MetaDescription     VARCHAR(500)  NULL,
        IsActive            BIT           NOT NULL DEFAULT 1,
        CreatedAt           DATETIME      NOT NULL DEFAULT GETDATE(),
        UpdatedAt           DATETIME      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_CourseDetails_NavbarLinks FOREIGN KEY (NavbarLinkId) REFERENCES NavbarLinks(Id)
    );
    PRINT 'CourseDetails table created';
END
GO

-- CallbackRequests
IF OBJECT_ID('CallbackRequests','U') IS NULL
BEGIN
    CREATE TABLE CallbackRequests (
        Id        INT IDENTITY(1,1) PRIMARY KEY,
        FullName  VARCHAR(100) NOT NULL,
        Phone     VARCHAR(20)  NOT NULL,
        Email     VARCHAR(150) NULL,
        Domain    VARCHAR(100) NULL,
        Message   VARCHAR(500) NULL,
        IsRead    BIT          NOT NULL DEFAULT 0,
        CreatedAt DATETIME     NOT NULL DEFAULT GETDATE()
    );
    PRINT 'CallbackRequests table created';
END
GO

-- AdmissionApplications
IF OBJECT_ID('AdmissionApplications','U') IS NULL
BEGIN
    CREATE TABLE AdmissionApplications (
        Id             INT IDENTITY(1,1) PRIMARY KEY,
        FullName       VARCHAR(100) NOT NULL,
        Email          VARCHAR(150) NOT NULL,
        Phone          VARCHAR(20)  NOT NULL,
        CourseInterest VARCHAR(150) NOT NULL,
        Qualification  VARCHAR(100) NULL,
        WorkExperience VARCHAR(50)  NULL,
        City           VARCHAR(100) NULL,
        Message        VARCHAR(500) NULL,
        Status         VARCHAR(30)  NOT NULL DEFAULT 'New',
        IsRead         BIT          NOT NULL DEFAULT 0,
        CreatedAt      DATETIME     NOT NULL DEFAULT GETDATE()
    );
    PRINT 'AdmissionApplications table created';
END
GO

-- Banners
IF OBJECT_ID('Banners','U') IS NULL
BEGIN
    CREATE TABLE Banners (
        Id             INT IDENTITY(1,1) PRIMARY KEY,
        BadgeText      VARCHAR(150)  NULL,
        HeadingLine1   VARCHAR(255)  NULL,
        HeadingLine2   VARCHAR(255)  NULL,
        SubText1       VARCHAR(500)  NULL,
        SubText2       NVARCHAR(MAX) NULL,
        Btn1Text       VARCHAR(100)  NULL,
        Btn1Link       VARCHAR(255)  NULL,
        Btn2Text       VARCHAR(100)  NULL,
        Btn2Link       VARCHAR(255)  NULL,
        BannerImage    VARCHAR(MAX)  NULL,
        VideoUrl       VARCHAR(500)  NULL,
        VideoCardLabel VARCHAR(150)  NULL,
        VideoCardTitle VARCHAR(150)  NULL,
        BgImage        VARCHAR(MAX)  NULL,
        IsActive       BIT           NOT NULL DEFAULT 1,
        SortOrder      INT           NOT NULL DEFAULT 0,
        CreatedAt      DATETIME      NOT NULL DEFAULT GETDATE(),
        UpdatedAt      DATETIME      NOT NULL DEFAULT GETDATE()
    );
    PRINT 'Banners table created';
END
GO

-- UniversityLogos (old â€” replaced, kept as DROP only)
IF OBJECT_ID('UniversityLogos','U') IS NOT NULL DROP TABLE UniversityLogos;
GO

-- UniversitySection (old â€” replaced, kept as DROP only)
IF OBJECT_ID('UniversitySection','U') IS NOT NULL DROP TABLE UniversitySection;
GO

-- UniversitySlides (new)
IF OBJECT_ID('UniversitySlideLogos','U') IS NULL
BEGIN
    -- Slides table pehle banana zaroori hai
    IF OBJECT_ID('UniversitySlides','U') IS NULL
    BEGIN
        CREATE TABLE UniversitySlides (
            Id          INT IDENTITY(1,1) PRIMARY KEY,
            BadgeText   VARCHAR(200)  NULL,
            Heading     VARCHAR(255)  NULL,
            Description NVARCHAR(MAX) NULL,
            BtnText     VARCHAR(100)  NULL,
            BtnLink     VARCHAR(255)  NULL,
            SortOrder   INT           NOT NULL DEFAULT 0,
            IsActive    BIT           NOT NULL DEFAULT 1,
            CreatedAt   DATETIME      NOT NULL DEFAULT GETDATE(),
            UpdatedAt   DATETIME      NOT NULL DEFAULT GETDATE()
        );
        PRINT 'UniversitySlides table created';
    END

    CREATE TABLE UniversitySlideLogos (
        Id        INT IDENTITY(1,1) PRIMARY KEY,
        SlideId   INT           NOT NULL,
        Name      VARCHAR(150)  NULL,
        LogoUrl   VARCHAR(MAX)  NULL,
        SortOrder INT           NOT NULL DEFAULT 0,
        IsActive  BIT           NOT NULL DEFAULT 1,
        CreatedAt DATETIME      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_SlideLogos_Slide FOREIGN KEY (SlideId)
            REFERENCES UniversitySlides(Id) ON DELETE CASCADE
    );
    PRINT 'UniversitySlideLogos table created';
END
GO

-- CareerCategories
IF OBJECT_ID('CareerCategories','U') IS NULL
BEGIN
    CREATE TABLE CareerCategories (
        Id        INT IDENTITY(1,1) PRIMARY KEY,
        Name      VARCHAR(100) NOT NULL,
        Image     VARCHAR(MAX) NULL,
        SortOrder INT          NOT NULL DEFAULT 0,
        IsActive  BIT          NOT NULL DEFAULT 1,
        CreatedAt DATETIME     NOT NULL DEFAULT GETDATE(),
        UpdatedAt DATETIME     NOT NULL DEFAULT GETDATE()
    );
    PRINT 'CareerCategories table created';
END
GO

-- CareerCourses
IF OBJECT_ID('CareerCourses','U') IS NULL
BEGIN
    CREATE TABLE CareerCourses (
        Id           INT IDENTITY(1,1) PRIMARY KEY,
        CategoryId   INT          NOT NULL,
        Ribbon       VARCHAR(50)  NULL,
        RibbonColor  VARCHAR(20)  NULL,
        Logo         VARCHAR(MAX) NULL,
        Location     VARCHAR(150) NULL,
        Title        VARCHAR(500) NOT NULL,
        Feature1Text VARCHAR(255) NULL,
        Feature1Icon VARCHAR(50)  NULL,
        Feature2Text VARCHAR(255) NULL,
        Feature2Icon VARCHAR(50)  NULL,
        SortOrder    INT          NOT NULL DEFAULT 0,
        IsActive     BIT          NOT NULL DEFAULT 1,
        CreatedAt    DATETIME     NOT NULL DEFAULT GETDATE(),
        UpdatedAt    DATETIME     NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_CareerCourses_Category FOREIGN KEY (CategoryId)
            REFERENCES CareerCategories(Id) ON DELETE CASCADE
    );
    PRINT 'CareerCourses table created';
END
GO

-- CoursePageDetails (Career + Online course detail pages)
IF OBJECT_ID('CoursePageDetails','U') IS NULL
BEGIN
    CREATE TABLE CoursePageDetails (
        Id                   INT IDENTITY(1,1) PRIMARY KEY,
        CareerCourseId       INT           NULL UNIQUE,
        OnlineCourseId       INT           NULL UNIQUE,
        Slug                 VARCHAR(200)  NOT NULL UNIQUE,
        HeroBadge            VARCHAR(100)  NULL,
        University           VARCHAR(150)  NULL,
        HeroTitleNormal      VARCHAR(300)  NULL,
        HeroTitleOrange      VARCHAR(300)  NULL,
        HeroDescription      NVARCHAR(MAX) NULL,
        HeroDuration         VARCHAR(100)  NULL,
        HeroMode             VARCHAR(100)  NULL,
        HeroStarts           VARCHAR(100)  NULL,
        HeroImage            VARCHAR(MAX)  NULL,
        HeroReviewText       NVARCHAR(MAX) NULL,
        HeroReviewAuthor     VARCHAR(150)  NULL,
        HeroUrgencyText      NVARCHAR(MAX) NULL,
        BrochureUrl          VARCHAR(MAX)  NULL,
        AlumniCompanies      NVARCHAR(MAX) NULL,
        LegacyTitle          VARCHAR(300)  NULL,
        LegacySubtitle       NVARCHAR(MAX) NULL,
        LegacyCards          NVARCHAR(MAX) NULL,
        AiSectionTitle       VARCHAR(300)  NULL,
        AiSectionSubtext     NVARCHAR(MAX) NULL,
        AiHighlights         NVARCHAR(MAX) NULL,
        AiStat1Value         VARCHAR(50)   NULL,
        AiStat1Label         VARCHAR(100)  NULL,
        AiStat2Value         VARCHAR(50)   NULL,
        AiStat2Label         VARCHAR(100)  NULL,
        AiPromoTitle         VARCHAR(200)  NULL,
        AiPromoText          NVARCHAR(MAX) NULL,
        QuickHighlights      NVARCHAR(MAX) NULL,
        LearningJourneyTitle VARCHAR(300)  NULL,
        LearningJourney      NVARCHAR(MAX) NULL,
        Curriculum           NVARCHAR(MAX) NULL,
        Tools                NVARCHAR(MAX) NULL,
        RealWorldProjects    NVARCHAR(MAX) NULL,
        CapstoneProjects     NVARCHAR(MAX) NULL,
        Mentors              NVARCHAR(MAX) NULL,
        CredentialTitle      VARCHAR(300)  NULL,
        CredentialSubtitle   NVARCHAR(MAX) NULL,
        CredentialFeatures   NVARCHAR(MAX) NULL,
        CertificateImage     VARCHAR(MAX)  NULL,
        CareerJourneySteps   NVARCHAR(MAX) NULL,
        CareerStats          NVARCHAR(MAX) NULL,
        SuccessStories       NVARCHAR(MAX) NULL,
        LearningExperience   NVARCHAR(MAX) NULL,
        ShowAlumni           BIT NOT NULL DEFAULT 1,
        ShowLegacy           BIT NOT NULL DEFAULT 1,
        ShowAiSection        BIT NOT NULL DEFAULT 1,
        ShowQuickHighlights  BIT NOT NULL DEFAULT 1,
        ShowLearningJourney  BIT NOT NULL DEFAULT 1,
        ShowCurriculum       BIT NOT NULL DEFAULT 1,
        ShowTools            BIT NOT NULL DEFAULT 1,
        ShowRealProjects     BIT NOT NULL DEFAULT 1,
        ShowCapstone         BIT NOT NULL DEFAULT 1,
        ShowMentors          BIT NOT NULL DEFAULT 1,
        ShowCredential       BIT NOT NULL DEFAULT 1,
        ShowCareerSupport    BIT NOT NULL DEFAULT 1,
        IsActive             BIT NOT NULL DEFAULT 1,
        CreatedAt            DATETIME NOT NULL DEFAULT GETDATE(),
        UpdatedAt            DATETIME NOT NULL DEFAULT GETDATE()
    );
    PRINT 'CoursePageDetails table created';
END
GO

-- FreeCourses
IF OBJECT_ID('FreeCourses','U') IS NULL
BEGIN
    CREATE TABLE FreeCourses (
        Id         INT IDENTITY(1,1) PRIMARY KEY,
        Title      VARCHAR(300) NOT NULL,
        Image      VARCHAR(MAX) NULL,
        Learners   VARCHAR(50)  NULL,
        Duration   VARCHAR(50)  NULL,
        ProgramUrl VARCHAR(500) NULL,
        EnrollUrl  VARCHAR(500) NULL,
        SortOrder  INT          NOT NULL DEFAULT 0,
        IsActive   BIT          NOT NULL DEFAULT 1,
        CreatedAt  DATETIME     NOT NULL DEFAULT GETDATE(),
        UpdatedAt  DATETIME     NOT NULL DEFAULT GETDATE()
    );
    PRINT 'FreeCourses table created';
END
GO

-- OnlineCourseCategories
IF OBJECT_ID('OnlineCourseCategories','U') IS NULL
BEGIN
    CREATE TABLE OnlineCourseCategories (
        Id        INT IDENTITY(1,1) PRIMARY KEY,
        Name      VARCHAR(100) NOT NULL,
        SortOrder INT          NOT NULL DEFAULT 0,
        IsActive  BIT          NOT NULL DEFAULT 1,
        CreatedAt DATETIME     NOT NULL DEFAULT GETDATE(),
        UpdatedAt DATETIME     NOT NULL DEFAULT GETDATE()
    );
    PRINT 'OnlineCourseCategories table created';
END
GO

-- OnlineCourses
IF OBJECT_ID('OnlineCourses','U') IS NULL
BEGIN
    CREATE TABLE OnlineCourses (
        Id          INT IDENTITY(1,1) PRIMARY KEY,
        CategoryId  INT           NOT NULL,
        Title       VARCHAR(500)  NOT NULL,
        Subtitle    VARCHAR(300)  NULL,
        Image       VARCHAR(MAX)  NULL,
        Feature1    VARCHAR(255)  NULL,
        Feature2    VARCHAR(255)  NULL,
        Feature3    VARCHAR(255)  NULL,
        SkillImage  VARCHAR(MAX)  NULL,
        SkillImages NVARCHAR(MAX) NULL,
        ExtraSkills INT           NOT NULL DEFAULT 0,
        ProgramUrl  VARCHAR(500)  NULL,
        BrochureUrl VARCHAR(MAX)  NULL,
        SortOrder   INT           NOT NULL DEFAULT 0,
        IsActive    BIT           NOT NULL DEFAULT 1,
        CreatedAt   DATETIME      NOT NULL DEFAULT GETDATE(),
        UpdatedAt   DATETIME      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_OnlineCourses_Category
            FOREIGN KEY (CategoryId) REFERENCES OnlineCourseCategories(Id) ON DELETE CASCADE
    );
    PRINT 'OnlineCourses table created';
END
GO

-- AchieveGoalsSettings
IF OBJECT_ID('AchieveGoalsSettings','U') IS NULL
BEGIN
    CREATE TABLE AchieveGoalsSettings (
        Id            INT          NOT NULL DEFAULT 1 PRIMARY KEY,
        HeadingNormal VARCHAR(255) NULL DEFAULT 'Services to Help You',
        HeadingOrange VARCHAR(255) NULL DEFAULT 'Achieve Your Goal',
        SubHeading    NVARCHAR(MAX) NULL DEFAULT 'Access the various career development support services offered to help you achieve your professional goals.',
        UpdatedAt     DATETIME     NOT NULL DEFAULT GETDATE()
    );
    INSERT INTO AchieveGoalsSettings (Id, HeadingNormal, HeadingOrange, SubHeading)
    VALUES (1, 'Services to Help You', 'Achieve Your Goal', 'Access the various career development support services offered to help you achieve your professional goals.');
    PRINT 'AchieveGoalsSettings table created';
END
GO

-- AchieveGoalsTabs
IF OBJECT_ID('AchieveGoalsTabs','U') IS NULL
BEGIN
    CREATE TABLE AchieveGoalsTabs (
        Id           INT IDENTITY(1,1) PRIMARY KEY,
        TabLabel     VARCHAR(255)  NOT NULL,
        InfoTag      VARCHAR(255)  NULL,
        InfoSubtitle VARCHAR(255)  NULL,
        CardHeading  VARCHAR(255)  NULL,
        CardDesc     NVARCHAR(MAX) NULL,
        ImageUrl     VARCHAR(MAX)  NULL,
        VideoUrl     VARCHAR(MAX)  NULL,
        Points       NVARCHAR(MAX) NULL,
        SortOrder    INT           NOT NULL DEFAULT 0,
        IsActive     BIT           NOT NULL DEFAULT 1,
        CreatedAt    DATETIME      NOT NULL DEFAULT GETDATE(),
        UpdatedAt    DATETIME      NOT NULL DEFAULT GETDATE()
    );
    PRINT 'AchieveGoalsTabs table created';
END
ELSE
BEGIN
    -- Migration: VideoUrl column add (agar pehle se nahi hai)
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='AchieveGoalsTabs' AND COLUMN_NAME='VideoUrl')
    BEGIN
        ALTER TABLE AchieveGoalsTabs ADD VideoUrl VARCHAR(MAX) NULL;
        PRINT 'VideoUrl column added to AchieveGoalsTabs';
    END
END
GO

-- AwardsSectionConfig
IF OBJECT_ID('AwardsSectionConfig','U') IS NULL
BEGIN
    CREATE TABLE AwardsSectionConfig (
        Id                   INT IDENTITY(1,1) PRIMARY KEY,
        HeadingNormal        NVARCHAR(200)  NULL,
        HeadingOrange        NVARCHAR(200)  NULL,
        MainImage            NVARCHAR(MAX)  NULL,
        SupportHeadingBold   NVARCHAR(200)  NULL,
        SupportHeadingNormal NVARCHAR(200)  NULL,
        SupportDesc          NVARCHAR(500)  NULL,
        SupportCard1Image    NVARCHAR(MAX)  NULL,
        SupportCard2Image    NVARCHAR(MAX)  NULL,
        IsActive             BIT            NOT NULL DEFAULT 1,
        UpdatedAt            DATETIME       NOT NULL DEFAULT GETDATE()
    );
    INSERT INTO AwardsSectionConfig (HeadingNormal, HeadingOrange, MainImage, SupportHeadingBold, SupportHeadingNormal, SupportDesc, SupportCard1Image, SupportCard2Image, IsActive)
    VALUES ('Awards &', 'Accomplishments', NULL, 'MENTORINGMINDS', 'Learner Support', 'Talk to our experts. We are available 7 days a week, 10 AM to 7 PM', NULL, NULL, 1);
    PRINT 'AwardsSectionConfig table created';
END
GO

-- AwardCards
IF OBJECT_ID('AwardCards','U') IS NULL
BEGIN
    CREATE TABLE AwardCards (
        Id          INT IDENTITY(1,1) PRIMARY KEY,
        CardImage   NVARCHAR(MAX)  NULL,
        DataText    NVARCHAR(300)  NULL,
        Title       NVARCHAR(300)  NULL,
        Description NVARCHAR(MAX)  NULL,
        SortOrder   INT            NOT NULL DEFAULT 0,
        IsActive    BIT            NOT NULL DEFAULT 1,
        CreatedAt   DATETIME       NOT NULL DEFAULT GETDATE()
    );
    PRINT 'AwardCards table created';
END
GO

-- CourseInstructorSettings
IF OBJECT_ID('CourseInstructorSettings','U') IS NULL
BEGIN
    CREATE TABLE CourseInstructorSettings (
        Id             INT  NOT NULL DEFAULT 1 PRIMARY KEY,
        HeadingNormal  VARCHAR(200) NULL DEFAULT 'Course',
        HeadingOrange  VARCHAR(200) NULL DEFAULT 'Instructors',
        Subtitle       VARCHAR(300) NULL DEFAULT 'Guidance from world-class researchers and industry veterans',
        UpdatedAt      DATETIME NOT NULL DEFAULT GETDATE()
    );
    INSERT INTO CourseInstructorSettings (Id, HeadingNormal, HeadingOrange, Subtitle)
    VALUES (1, 'Course', 'Instructors', 'Guidance from world-class researchers and industry veterans');
    PRINT 'CourseInstructorSettings created';
END
GO

-- CourseInstructorTabs
IF OBJECT_ID('CourseInstructorTabs','U') IS NULL
BEGIN
    CREATE TABLE CourseInstructorTabs (
        Id        INT IDENTITY(1,1) PRIMARY KEY,
        TabName   VARCHAR(150) NOT NULL,
        SortOrder INT          NOT NULL DEFAULT 0,
        IsActive  BIT          NOT NULL DEFAULT 1,
        CreatedAt DATETIME     NOT NULL DEFAULT GETDATE()
    );
    PRINT 'CourseInstructorTabs table created';
END
GO

-- CourseInstructorCards
IF OBJECT_ID('CourseInstructorCards','U') IS NULL
BEGIN
    CREATE TABLE CourseInstructorCards (
        Id          INT IDENTITY(1,1) PRIMARY KEY,
        TabId       INT           NOT NULL,
        Name        VARCHAR(150)  NOT NULL,
        Role        VARCHAR(200)  NULL,
        Photo       VARCHAR(MAX)  NULL,
        LinkedinUrl VARCHAR(300)  NULL,
        CardBg      VARCHAR(20)   NULL DEFAULT 'card-bg-1',
        SortOrder   INT           NOT NULL DEFAULT 0,
        IsActive    BIT           NOT NULL DEFAULT 1,
        CreatedAt   DATETIME      NOT NULL DEFAULT GETDATE(),
        UpdatedAt   DATETIME      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_CICards_Tab FOREIGN KEY (TabId)
            REFERENCES CourseInstructorTabs(Id) ON DELETE CASCADE
    );
    PRINT 'CourseInstructorCards table created';
END
GO

-- CourseOverviewSettings
IF OBJECT_ID('CourseOverviewSettings','U') IS NULL
BEGIN
    CREATE TABLE CourseOverviewSettings (
        Id            INT          NOT NULL DEFAULT 1 PRIMARY KEY,
        HeadingNormal VARCHAR(255) NULL DEFAULT 'Agentic AI and Generative AI',
        HeadingOrange VARCHAR(255) NULL DEFAULT 'Course Overview',
        MainDesc      NVARCHAR(MAX) NULL,
        UpdatedAt     DATETIME     NOT NULL DEFAULT GETDATE()
    );
    INSERT INTO CourseOverviewSettings (Id, HeadingNormal, HeadingOrange, MainDesc)
    VALUES (1, 'Agentic AI and Generative AI', 'Course Overview', 'Work is changing fast across engineering, product, and business teams worldwide.');
    PRINT 'CourseOverviewSettings table created';
END
GO

-- CourseOverviewSections
IF OBJECT_ID('CourseOverviewSections','U') IS NULL
BEGIN
    CREATE TABLE CourseOverviewSections (
        Id           INT IDENTITY(1,1) PRIMARY KEY,
        Title        VARCHAR(255)  NOT NULL,
        SectionType  VARCHAR(20)   NOT NULL DEFAULT 'text',
        Paragraphs   NVARCHAR(MAX) NULL,
        Subtitle     VARCHAR(MAX)  NULL,
        BulletPoints NVARCHAR(MAX) NULL,
        SortOrder    INT           NOT NULL DEFAULT 0,
        IsActive     BIT           NOT NULL DEFAULT 1,
        CreatedAt    DATETIME      NOT NULL DEFAULT GETDATE(),
        UpdatedAt    DATETIME      NOT NULL DEFAULT GETDATE()
    );
    PRINT 'CourseOverviewSections table created';
END
GO

-- CourseProjectSettings
IF OBJECT_ID('CourseProjectSettings','U') IS NULL
BEGIN
    CREATE TABLE CourseProjectSettings (
        Id           INT  NOT NULL DEFAULT 1 PRIMARY KEY,
        HeadingLine1 VARCHAR(255) NULL DEFAULT 'Gen AI & Agentic AI Course',
        HeadingLine2 VARCHAR(255) NULL DEFAULT 'Projects Learn',
        HeadingLine3 VARCHAR(255) NULL DEFAULT 'by Doing',
        BadgeText    VARCHAR(100) NULL DEFAULT '10+',
        UpdatedAt    DATETIME NOT NULL DEFAULT GETDATE()
    );
    INSERT INTO CourseProjectSettings (Id, HeadingLine1, HeadingLine2, HeadingLine3, BadgeText)
    VALUES (1, 'Gen AI & Agentic AI Course', 'Projects Learn', 'by Doing', '10+');
    PRINT 'CourseProjectSettings created';
END
GO

-- CourseProjects
IF OBJECT_ID('CourseProjects','U') IS NULL
BEGIN
    CREATE TABLE CourseProjects (
        Id          INT IDENTITY(1,1) PRIMARY KEY,
        Title       VARCHAR(255)  NOT NULL,
        Description NVARCHAR(MAX) NULL,
        IconUrl     VARCHAR(MAX)  NULL,
        Skills      NVARCHAR(MAX) NULL,
        SortOrder   INT           NOT NULL DEFAULT 0,
        IsActive    BIT           NOT NULL DEFAULT 1,
        CreatedAt   DATETIME      NOT NULL DEFAULT GETDATE(),
        UpdatedAt   DATETIME      NOT NULL DEFAULT GETDATE()
    );
    PRINT 'CourseProjects table created';
END
GO

-- CurriculumCompSettings
IF OBJECT_ID('CurriculumCompSettings','U') IS NULL
BEGIN
    CREATE TABLE CurriculumCompSettings (
        Id            INT          NOT NULL DEFAULT 1 PRIMARY KEY,
        HeadingNormal VARCHAR(255) NULL DEFAULT 'Gen AI & Agentic AI Course',
        HeadingOrange VARCHAR(255) NULL DEFAULT 'Curriculum Comparison',
        TabsJson      NVARCHAR(MAX) NULL,
        UpdatedAt     DATETIME     NOT NULL DEFAULT GETDATE()
    );
    INSERT INTO CurriculumCompSettings (Id, HeadingNormal, HeadingOrange, TabsJson)
    VALUES (1, 'Gen AI & Agentic AI Course', 'Curriculum Comparison',
        N'[{"key":"iitkgp","subTitle":"IIT KGP Curriculum","mainTitle":"Gen AI & Agentic AI Course"},{"key":"iiitb","subTitle":"IIITB Curriculum","mainTitle":"EPGP in Applied AI & Agentic AI"}]');
    PRINT 'CurriculumCompSettings table created';
END
GO

-- CurriculumCompCards
IF OBJECT_ID('CurriculumCompCards','U') IS NULL
BEGIN
    CREATE TABLE CurriculumCompCards (
        Id        INT IDENTITY(1,1) PRIMARY KEY,
        TabKey    VARCHAR(100)  NOT NULL,
        Part      VARCHAR(10)   NOT NULL DEFAULT 'A',
        PartTitle VARCHAR(255)  NULL,
        PartBadge VARCHAR(255)  NULL,
        Title     VARCHAR(255)  NOT NULL,
        Descr     NVARCHAR(MAX) NULL,
        Hours     VARCHAR(100)  NULL,
        Projects  VARCHAR(100)  NULL,
        Extra     VARCHAR(100)  NULL,
        IconUrl   VARCHAR(MAX)  NULL,
        SortOrder INT           NOT NULL DEFAULT 0,
        IsActive  BIT           NOT NULL DEFAULT 1,
        CreatedAt DATETIME      NOT NULL DEFAULT GETDATE(),
        UpdatedAt DATETIME      NOT NULL DEFAULT GETDATE()
    );
    PRINT 'CurriculumCompCards table created';
END
GO

-- CurriculumSettings
IF OBJECT_ID('CurriculumSettings','U') IS NULL
BEGIN
    CREATE TABLE CurriculumSettings (
        Id           INT  NOT NULL DEFAULT 1 PRIMARY KEY,
        HeadingLine1 VARCHAR(255) NULL DEFAULT 'Agentic AI & Generative',
        HeadingLine2 VARCHAR(255) NULL DEFAULT 'AI Course Curriculum',
        BrochureUrl  VARCHAR(MAX) NULL,
        UpdatedAt    DATETIME     NOT NULL DEFAULT GETDATE()
    );
    INSERT INTO CurriculumSettings (Id, HeadingLine1, HeadingLine2)
    VALUES (1, 'Agentic AI & Generative', 'AI Course Curriculum');
    PRINT 'CurriculumSettings table created';
END
GO

-- CurriculumCards
IF OBJECT_ID('CurriculumCards','U') IS NULL
BEGIN
    CREATE TABLE CurriculumCards (
        Id        INT IDENTITY(1,1) PRIMARY KEY,
        Title     VARCHAR(255)  NOT NULL,
        Points    NVARCHAR(MAX) NOT NULL,
        CardColor VARCHAR(20)   NOT NULL DEFAULT 'white',
        SortOrder INT           NOT NULL DEFAULT 0,
        IsActive  BIT           NOT NULL DEFAULT 1,
        CreatedAt DATETIME      NOT NULL DEFAULT GETDATE(),
        UpdatedAt DATETIME      NOT NULL DEFAULT GETDATE()
    );
    PRINT 'CurriculumCards table created';
END
GO

-- FaqSettings
IF OBJECT_ID('FaqSettings','U') IS NULL
BEGIN
    CREATE TABLE FaqSettings (
        Id            INT          NOT NULL DEFAULT 1 PRIMARY KEY,
        HeadingNormal VARCHAR(255) NULL DEFAULT 'Frequently',
        HeadingOrange VARCHAR(255) NULL DEFAULT 'Asked Questions',
        UpdatedAt     DATETIME     NOT NULL DEFAULT GETDATE()
    );
    INSERT INTO FaqSettings (Id, HeadingNormal, HeadingOrange)
    VALUES (1, 'Frequently', 'Asked Questions');
    PRINT 'FaqSettings table created';
END
GO

-- FaqItems
IF OBJECT_ID('FaqItems','U') IS NULL
BEGIN
    CREATE TABLE FaqItems (
        Id             INT IDENTITY(1,1) PRIMARY KEY,
        Question       NVARCHAR(MAX) NOT NULL,
        Answer         NVARCHAR(MAX) NULL,
        SubHeading     VARCHAR(500)  NULL,
        IntroText      NVARCHAR(MAX) NULL,
        BulletPoints   NVARCHAR(MAX) NULL,
        OutroText      NVARCHAR(MAX) NULL,
        ExampleHeading VARCHAR(500)  NULL,
        Examples       NVARCHAR(MAX) NULL,
        SortOrder      INT           NOT NULL DEFAULT 0,
        IsActive       BIT           NOT NULL DEFAULT 1,
        CreatedAt      DATETIME      NOT NULL DEFAULT GETDATE(),
        UpdatedAt      DATETIME      NOT NULL DEFAULT GETDATE()
    );
    PRINT 'FaqItems table created';
END
GO

-- InstructorSection
IF OBJECT_ID('InstructorSection','U') IS NULL
BEGIN
    CREATE TABLE InstructorSection (
        Id            INT IDENTITY(1,1) PRIMARY KEY,
        TagText       VARCHAR(100)  NULL,
        HeadingNormal VARCHAR(200)  NULL,
        HeadingOrange VARCHAR(200)  NULL,
        ViewAllText   VARCHAR(100)  NULL,
        ViewAllLink   VARCHAR(300)  NULL,
        UpdatedAt     DATETIME      NOT NULL DEFAULT GETDATE()
    );
    INSERT INTO InstructorSection (TagText, HeadingNormal, HeadingOrange, ViewAllText, ViewAllLink)
    VALUES ('INSTRUCTORS', 'Master your craft with', 'renowned faculty', 'View All Courses', '/all-Courses');
    PRINT 'InstructorSection table created';
END
GO

-- Instructors
IF OBJECT_ID('Instructors','U') IS NULL
BEGIN
    CREATE TABLE Instructors (
        Id           INT IDENTITY(1,1) PRIMARY KEY,
        Name         VARCHAR(150)  NOT NULL,
        Role         VARCHAR(150)  NULL,
        Photo        VARCHAR(MAX)  NULL,
        CompanyLogo  VARCHAR(MAX)  NULL,
        Description  NVARCHAR(MAX) NULL,
        CardBg       VARCHAR(20)   NULL DEFAULT 'blue',
        FacebookUrl  VARCHAR(300)  NULL,
        TwitterUrl   VARCHAR(300)  NULL,
        LinkedinUrl  VARCHAR(300)  NULL,
        YoutubeUrl   VARCHAR(300)  NULL,
        SortOrder    INT           NOT NULL DEFAULT 0,
        IsActive     BIT           NOT NULL DEFAULT 1,
        CreatedAt    DATETIME      NOT NULL DEFAULT GETDATE(),
        UpdatedAt    DATETIME      NOT NULL DEFAULT GETDATE()
    );
    PRINT 'Instructors table created';
END
GO

-- AllProgramsHero
IF OBJECT_ID('AllProgramsHero','U') IS NULL
BEGIN
    CREATE TABLE AllProgramsHero (
        Id           INT IDENTITY(1,1) PRIMARY KEY,
        HeadingLine1 VARCHAR(300)  NULL,
        HeadingLine2 VARCHAR(300)  NULL,
        BgImage      VARCHAR(MAX)  NULL,
        UpdatedAt    DATETIME      NOT NULL DEFAULT GETDATE()
    );
    INSERT INTO AllProgramsHero (HeadingLine1, HeadingLine2)
    VALUES ('Invest in yourself today. Unlock', 'success for a lifetime.');
    PRINT 'AllProgramsHero table created';
END
GO

-- SkillsCompSettings
IF OBJECT_ID('SkillsCompSettings','U') IS NULL
BEGIN
    CREATE TABLE SkillsCompSettings (
        Id            INT          NOT NULL DEFAULT 1 PRIMARY KEY,
        HeadingNormal VARCHAR(255) NULL DEFAULT 'Skills You''ll Acquire',
        HeadingOrange VARCHAR(255) NULL DEFAULT 'IIITB vs IITKGP',
        UpdatedAt     DATETIME     NOT NULL DEFAULT GETDATE()
    );
    INSERT INTO SkillsCompSettings (Id, HeadingNormal, HeadingOrange)
    VALUES (1, 'Skills You''ll Acquire', 'IIITB vs IITKGP');
    PRINT 'SkillsCompSettings table created';
END
GO

-- SkillsCompCards
IF OBJECT_ID('SkillsCompCards','U') IS NULL
BEGIN
    CREATE TABLE SkillsCompCards (
        Id           INT IDENTITY(1,1) PRIMARY KEY,
        CardTitle    VARCHAR(255)  NOT NULL,
        CardSubtitle NVARCHAR(MAX) NULL,
        Skills       NVARCHAR(MAX) NULL,
        SortOrder    INT           NOT NULL DEFAULT 0,
        IsActive     BIT           NOT NULL DEFAULT 1,
        CreatedAt    DATETIME      NOT NULL DEFAULT GETDATE(),
        UpdatedAt    DATETIME      NOT NULL DEFAULT GETDATE()
    );
    PRINT 'SkillsCompCards table created';
END
GO

-- SubscriptionBanner
IF OBJECT_ID('SubscriptionBanner','U') IS NULL
BEGIN
    CREATE TABLE SubscriptionBanner (
        Id            INT IDENTITY(1,1) PRIMARY KEY,
        Heading       NVARCHAR(300) NULL,
        Description   NVARCHAR(MAX) NULL,
        Feature1Label VARCHAR(150)  NULL,
        Feature1Icon  VARCHAR(50)   NULL,
        Feature1Color VARCHAR(20)   NULL,
        Feature2Label VARCHAR(150)  NULL,
        Feature2Icon  VARCHAR(50)   NULL,
        Feature2Color VARCHAR(20)   NULL,
        Feature3Label VARCHAR(150)  NULL,
        Feature3Icon  VARCHAR(50)   NULL,
        Feature3Color VARCHAR(20)   NULL,
        Feature4Label VARCHAR(150)  NULL,
        Feature4Icon  VARCHAR(50)   NULL,
        Feature4Color VARCHAR(20)   NULL,
        BtnText       VARCHAR(100)  NULL,
        BtnLink       VARCHAR(300)  NULL,
        Image         VARCHAR(MAX)  NULL,
        IsActive      BIT           NOT NULL DEFAULT 1,
        UpdatedAt     DATETIME      NOT NULL DEFAULT GETDATE()
    );
    INSERT INTO SubscriptionBanner (
        Heading, Description,
        Feature1Label, Feature1Icon, Feature1Color,
        Feature2Label, Feature2Icon, Feature2Color,
        Feature3Label, Feature3Icon, Feature3Color,
        Feature4Label, Feature4Icon, Feature4Color,
        BtnText, BtnLink, IsActive
    ) VALUES (
        'Build your career with a Personal Plan subscription',
        'Subscribers save an average of â‚¹4,000+ in their first month, stop paying per course. Join 5 lakh+ learners, starting at â‚¹500/month.',
        'Learn AI and more', 'BsStars', '#deeae5',
        'Prep for a certification', 'FaTrophy', '#BBE7D3',
        'Practice with AI coaching', 'TiMessages', '#efd99e',
        'Advance your career', 'FaLightbulb', '#BBE7D3',
        'Register Now', '/signup', 1
    );
    PRINT 'SubscriptionBanner table created';
END
GO

-- SuccessSectionConfig
IF OBJECT_ID('SuccessSectionConfig','U') IS NULL
BEGIN
    CREATE TABLE SuccessSectionConfig (
        Id              INT IDENTITY(1,1) PRIMARY KEY,
        TagText         NVARCHAR(150)  NULL,
        HeadingNormal   NVARCHAR(300)  NULL,
        HeadingOrange   NVARCHAR(300)  NULL,
        Stat1Value      NVARCHAR(100)  NULL,
        Stat1Label      NVARCHAR(150)  NULL,
        Stat2Value      NVARCHAR(100)  NULL,
        Stat2Label      NVARCHAR(150)  NULL,
        Stat3Value      NVARCHAR(100)  NULL,
        Stat3Label      NVARCHAR(150)  NULL,
        Stat4Value      NVARCHAR(100)  NULL,
        Stat4Label      NVARCHAR(150)  NULL,
        BannerTopLabel  NVARCHAR(200)  NULL,
        BannerHeading   NVARCHAR(500)  NULL,
        BannerDesc      NVARCHAR(MAX)  NULL,
        BannerBtnText   NVARCHAR(100)  NULL,
        BannerBtnLink   NVARCHAR(500)  NULL,
        LearnerImages   NVARCHAR(MAX)  NULL,
        IsActive        BIT            NOT NULL DEFAULT 1,
        UpdatedAt       DATETIME       NOT NULL DEFAULT GETDATE()
    );
    INSERT INTO SuccessSectionConfig (
        TagText, HeadingNormal, HeadingOrange,
        Stat1Value, Stat1Label, Stat2Value, Stat2Label,
        Stat3Value, Stat3Label, Stat4Value, Stat4Label,
        BannerTopLabel, BannerHeading, BannerDesc, BannerBtnText, BannerBtnLink,
        LearnerImages, IsActive
    ) VALUES (
        'YOUR GOALS ARE OUR GOALS',
        'Invest in yourself today. Unlock', 'success for a lifetime.',
        '15 Million', 'STUDENTS AND ALUMNI', '4.6/5', 'PROGRAM RATING',
        '50%', 'AVG. HIKE POST PROGRAM*', '4500+', 'HIRING COMPANIES*',
        'WHAT OUR LEARNERS SAY',
        'From promotions to transitions, MENTORINGMINDS opens new doors',
        'Our learners share their experiences about their MENTORINGMINDS journey and outcomes.',
        'Watch Testimonials', '', '', 1
    );
    PRINT 'SuccessSectionConfig table created';
END
GO

-- SuccessStories
IF OBJECT_ID('SuccessStories','U') IS NULL
BEGIN
    CREATE TABLE SuccessStories (
        Id          INT IDENTITY(1,1) PRIMARY KEY,
        Quote       NVARCHAR(500)  NULL,
        DescStrong  NVARCHAR(200)  NULL,
        DescRest    NVARCHAR(MAX)  NULL,
        Name        NVARCHAR(150)  NULL,
        Program     NVARCHAR(300)  NULL,
        RoleText    NVARCHAR(200)  NULL,
        Image       NVARCHAR(MAX)  NULL,
        VideoLink   NVARCHAR(500)  NULL,
        SortOrder   INT            NOT NULL DEFAULT 0,
        IsActive    BIT            NOT NULL DEFAULT 1,
        CreatedAt   DATETIME       NOT NULL DEFAULT GETDATE()
    );
    PRINT 'SuccessStories table created';
END
GO

-- ToolsSettings
IF OBJECT_ID('ToolsSettings','U') IS NULL
BEGIN
    CREATE TABLE ToolsSettings (
        Id            INT  NOT NULL DEFAULT 1 PRIMARY KEY,
        HeadingNormal VARCHAR(200) NULL DEFAULT 'Tools & Technologies',
        HeadingOrange VARCHAR(200) NULL DEFAULT 'You''ll Learn',
        UpdatedAt     DATETIME NOT NULL DEFAULT GETDATE()
    );
    INSERT INTO ToolsSettings (Id, HeadingNormal, HeadingOrange)
    VALUES (1, 'Tools & Technologies', 'You''ll Learn');
    PRINT 'ToolsSettings table created';
END
GO

-- Tools
IF OBJECT_ID('Tools','U') IS NULL
BEGIN
    CREATE TABLE Tools (
        Id        INT IDENTITY(1,1) PRIMARY KEY,
        Name      VARCHAR(150) NOT NULL,
        IconUrl   VARCHAR(MAX) NULL,
        SortOrder INT          NOT NULL DEFAULT 0,
        IsActive  BIT          NOT NULL DEFAULT 1,
        CreatedAt DATETIME     NOT NULL DEFAULT GETDATE(),
        UpdatedAt DATETIME     NOT NULL DEFAULT GETDATE()
    );
    PRINT 'Tools table created';
END
GO

-- ============================================================
-- PART 3: ALTER EXISTING TABLES â€” Add missing columns
-- ============================================================

-- CoursePageDetails: CareerCourseId nullable
IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='CoursePageDetails' AND COLUMN_NAME='CareerCourseId' AND IS_NULLABLE='NO')
BEGIN
    DECLARE @fkDrop NVARCHAR(200);
    SELECT @fkDrop = CONSTRAINT_NAME FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
    WHERE TABLE_NAME='CoursePageDetails' AND CONSTRAINT_TYPE='FOREIGN KEY' AND CONSTRAINT_NAME LIKE '%CareerCourse%';
    IF @fkDrop IS NOT NULL EXEC('ALTER TABLE CoursePageDetails DROP CONSTRAINT ' + @fkDrop);
    ALTER TABLE CoursePageDetails ALTER COLUMN CareerCourseId INT NULL;
    PRINT 'CareerCourseId made nullable';
END
GO

IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE TABLE_NAME='CoursePageDetails' AND CONSTRAINT_NAME='FK_CoursePageDetails_CareerCourses')
BEGIN
    ALTER TABLE CoursePageDetails ADD CONSTRAINT FK_CoursePageDetails_CareerCourses
    FOREIGN KEY (CareerCourseId) REFERENCES CareerCourses(Id) ON DELETE SET NULL;
    PRINT 'FK_CoursePageDetails_CareerCourses added';
END
GO

-- CoursePageDetails: OnlineCourseId column
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='CoursePageDetails' AND COLUMN_NAME='OnlineCourseId')
BEGIN
    ALTER TABLE CoursePageDetails ADD OnlineCourseId INT NULL;
    PRINT 'OnlineCourseId column added';
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='UQ_CoursePageDetails_OnlineCourseId')
BEGIN
    CREATE UNIQUE INDEX UQ_CoursePageDetails_OnlineCourseId ON CoursePageDetails(OnlineCourseId) WHERE OnlineCourseId IS NOT NULL;
    PRINT 'UQ index on OnlineCourseId created';
END
GO

-- OnlineCourses: SkillImages column
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='OnlineCourses' AND COLUMN_NAME='SkillImages')
BEGIN
    ALTER TABLE OnlineCourses ADD SkillImages NVARCHAR(MAX) NULL;
    PRINT 'SkillImages column added to OnlineCourses';
END
GO

-- OnlineCourses: BrochureUrl expand to VARCHAR(MAX)
IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='OnlineCourses' AND COLUMN_NAME='BrochureUrl' AND CHARACTER_MAXIMUM_LENGTH=500)
BEGIN
    ALTER TABLE OnlineCourses ALTER COLUMN BrochureUrl VARCHAR(MAX) NULL;
    PRINT 'BrochureUrl expanded to VARCHAR(MAX)';
END
GO

-- ============================================================
-- PART 4: AUTH & USER STORED PROCEDURES
-- ============================================================
CREATE PROCEDURE sp_RegisterUser
    @full_name VARCHAR(100), @email VARCHAR(150), @phone VARCHAR(20),
    @password_hash VARCHAR(255), @profile_image VARCHAR(MAX)=NULL,
    @role VARCHAR(20)='User', @otp VARCHAR(10), @otp_expiry DATETIME
AS BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM users WHERE email=@email AND is_verified=1) BEGIN SELECT 0 AS user_id,'Email already registered.' AS message; RETURN; END
    IF EXISTS (SELECT 1 FROM users WHERE phone=@phone AND is_verified=1) BEGIN SELECT 0 AS user_id,'Phone number already registered.' AS message; RETURN; END
    INSERT INTO users (full_name,email,phone,password_hash,profile_image,role,otp,otp_expiry) VALUES (@full_name,@email,@phone,@password_hash,@profile_image,@role,@otp,@otp_expiry);
    SELECT SCOPE_IDENTITY() AS user_id,'OTP sent to your email. Please verify.' AS message;
END;
GO
CREATE PROCEDURE sp_CheckUserForRegister @email VARCHAR(150), @phone VARCHAR(20) AS BEGIN SET NOCOUNT ON; SELECT id,email,phone,is_verified FROM users WHERE email=@email OR phone=@phone; END;
GO
CREATE PROCEDURE sp_UpdateUnverifiedUser @email VARCHAR(150), @full_name VARCHAR(100), @phone VARCHAR(20), @password_hash VARCHAR(255), @otp VARCHAR(10), @otp_expiry DATETIME AS BEGIN SET NOCOUNT ON; UPDATE users SET full_name=@full_name,phone=@phone,password_hash=@password_hash,otp=@otp,otp_expiry=@otp_expiry,updated_at=GETDATE() WHERE email=@email; END;
GO
CREATE PROCEDURE sp_VerifyOtp @email VARCHAR(150) AS BEGIN SET NOCOUNT ON; SELECT id,full_name,email,password_hash,otp,otp_expiry FROM users WHERE email=@email; END;
GO
CREATE PROCEDURE sp_MarkUserVerified @email VARCHAR(150) AS BEGIN SET NOCOUNT ON; UPDATE users SET is_verified=1,otp=NULL,otp_expiry=NULL WHERE email=@email; END;
GO
CREATE PROCEDURE sp_EnsureUserProfile @userId INT, @full_name VARCHAR(100), @email VARCHAR(150), @password_hash VARCHAR(255) AS BEGIN SET NOCOUNT ON; IF NOT EXISTS (SELECT 1 FROM UsersProfile WHERE Id=@userId) INSERT INTO UsersProfile (Id,FullName,Email,PasswordHash) VALUES (@userId,@full_name,@email,@password_hash); END;
GO
CREATE PROCEDURE sp_GetUserByEmail @email VARCHAR(150) AS BEGIN SET NOCOUNT ON; SELECT id,full_name,email,password_hash,role,is_active,is_verified FROM users WHERE email=@email; END;
GO
CREATE PROCEDURE sp_UpdateLastLogin @userId INT AS BEGIN SET NOCOUNT ON; UPDATE users SET last_login=GETDATE() WHERE id=@userId; END;
GO
CREATE PROCEDURE sp_GetProfileImage @userId INT AS BEGIN SET NOCOUNT ON; SELECT ProfileImage FROM UsersProfile WHERE Id=@userId; END;
GO
CREATE PROCEDURE sp_SetForgotOtp @email VARCHAR(150), @otp VARCHAR(10), @otp_expiry DATETIME AS BEGIN SET NOCOUNT ON; SELECT id,full_name FROM users WHERE email=@email; UPDATE users SET otp=@otp,otp_expiry=@otp_expiry WHERE email=@email; END;
GO
CREATE PROCEDURE sp_VerifyResetOtp @email VARCHAR(150) AS BEGIN SET NOCOUNT ON; SELECT id,otp,otp_expiry FROM users WHERE email=@email; END;
GO
CREATE PROCEDURE sp_ResetPassword @email VARCHAR(150), @password_hash VARCHAR(255) AS BEGIN SET NOCOUNT ON; UPDATE users SET password_hash=@password_hash,otp=NULL,otp_expiry=NULL WHERE email=@email; END;
GO
CREATE PROCEDURE sp_ResendOtp @email VARCHAR(150), @otp VARCHAR(10), @otp_expiry DATETIME AS BEGIN SET NOCOUNT ON; SELECT id,full_name,is_verified FROM users WHERE email=@email; UPDATE users SET otp=@otp,otp_expiry=@otp_expiry WHERE email=@email; END;
GO
CREATE PROCEDURE sp_UpdateProfileImage @userId INT, @imageUrl VARCHAR(MAX) AS BEGIN SET NOCOUNT ON; UPDATE users SET profile_image=@imageUrl,updated_at=GETDATE() WHERE id=@userId; UPDATE UsersProfile SET ProfileImage=@imageUrl,UpdatedAt=GETDATE() WHERE Id=@userId; END;
GO
CREATE PROCEDURE sp_GetUserProfile @userId INT AS BEGIN SET NOCOUNT ON; IF NOT EXISTS (SELECT 1 FROM UsersProfile WHERE Id=@userId) INSERT INTO UsersProfile (Id,FullName,Email,PasswordHash) SELECT id,full_name,email,password_hash FROM users WHERE id=@userId; SELECT * FROM UsersProfile WHERE Id=@userId; END;
GO
CREATE PROCEDURE sp_GetAllUsers AS BEGIN SET NOCOUNT ON; SELECT id,full_name,email,phone,role,is_verified,is_active,last_login,created_at FROM users ORDER BY created_at DESC; END;
GO

CREATE PROCEDURE UpdateUserProfile
    @UserId INT,
    @DOB DATE=NULL, @Gender VARCHAR(20)=NULL, @MaritalStatus VARCHAR(50)=NULL,
    @HighestQualification VARCHAR(100)=NULL, @Phone VARCHAR(20)=NULL,
    @WhatsApp VARCHAR(20)=NULL, @AltPhone VARCHAR(20)=NULL, @AltEmail VARCHAR(150)=NULL,
    @PermHouseNo VARCHAR(100)=NULL, @PermAptName VARCHAR(100)=NULL, @PermLocality VARCHAR(150)=NULL,
    @PermCountry VARCHAR(50)=NULL, @PermCity VARCHAR(50)=NULL, @PermPincode VARCHAR(20)=NULL,
    @CurrHouseNo VARCHAR(100)=NULL, @CurrAptName VARCHAR(100)=NULL, @CurrLocality VARCHAR(150)=NULL,
    @CurrCountry VARCHAR(50)=NULL, @CurrCity VARCHAR(50)=NULL, @CurrPincode VARCHAR(20)=NULL,
    @FatherName VARCHAR(100)=NULL, @FatherEducation VARCHAR(100)=NULL,
    @MotherName VARCHAR(100)=NULL, @MotherEducation VARCHAR(100)=NULL,
    @ParentMobile VARCHAR(20)=NULL, @LinkedIn VARCHAR(255)=NULL,
    @GitHub VARCHAR(255)=NULL, @Instagram VARCHAR(255)=NULL
AS BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS (SELECT 1 FROM UsersProfile WHERE Id=@UserId) BEGIN SELECT NULL AS Id; RETURN; END
    UPDATE UsersProfile SET
        DOB=ISNULL(@DOB,DOB), Gender=ISNULL(@Gender,Gender), MaritalStatus=ISNULL(@MaritalStatus,MaritalStatus),
        HighestQualification=ISNULL(@HighestQualification,HighestQualification), Phone=ISNULL(@Phone,Phone),
        WhatsApp=ISNULL(@WhatsApp,WhatsApp), AltPhone=ISNULL(@AltPhone,AltPhone), AltEmail=ISNULL(@AltEmail,AltEmail),
        PermHouseNo=ISNULL(@PermHouseNo,PermHouseNo), PermAptName=ISNULL(@PermAptName,PermAptName),
        PermLocality=ISNULL(@PermLocality,PermLocality), PermCountry=ISNULL(@PermCountry,PermCountry),
        PermCity=ISNULL(@PermCity,PermCity), PermPincode=ISNULL(@PermPincode,PermPincode),
        CurrHouseNo=ISNULL(@CurrHouseNo,CurrHouseNo), CurrAptName=ISNULL(@CurrAptName,CurrAptName),
        CurrLocality=ISNULL(@CurrLocality,CurrLocality), CurrCountry=ISNULL(@CurrCountry,CurrCountry),
        CurrCity=ISNULL(@CurrCity,CurrCity), CurrPincode=ISNULL(@CurrPincode,CurrPincode),
        FatherName=ISNULL(@FatherName,FatherName), FatherEducation=ISNULL(@FatherEducation,FatherEducation),
        MotherName=ISNULL(@MotherName,MotherName), MotherEducation=ISNULL(@MotherEducation,MotherEducation),
        ParentMobile=ISNULL(@ParentMobile,ParentMobile), LinkedIn=ISNULL(@LinkedIn,LinkedIn),
        GitHub=ISNULL(@GitHub,GitHub), Instagram=ISNULL(@Instagram,Instagram), UpdatedAt=GETDATE()
    WHERE Id=@UserId;
    SELECT * FROM UsersProfile WHERE Id=@UserId;
END;
GO

-- ============================================================
-- PART 5: NAVBAR, LEADS, BANNER SPs
-- ============================================================
CREATE PROCEDURE sp_AddNavbarLink @Title VARCHAR(100), @Url VARCHAR(255)=NULL, @Slug VARCHAR(150)=NULL, @Category VARCHAR(50)=NULL, @ParentId INT=NULL, @BadgeText VARCHAR(20)=NULL, @SortOrder INT=0 AS BEGIN SET NOCOUNT ON; INSERT INTO NavbarLinks (Title,Url,Slug,Category,ParentId,BadgeText,SortOrder) VALUES (@Title,@Url,@Slug,@Category,@ParentId,@BadgeText,@SortOrder); SELECT SCOPE_IDENTITY() AS Id; END;
GO
CREATE PROCEDURE sp_GetNavbarLinks @ShowAll BIT=0 AS BEGIN SET NOCOUNT ON; IF @ShowAll=1 SELECT * FROM NavbarLinks ORDER BY SortOrder ASC,Id ASC; ELSE SELECT * FROM NavbarLinks WHERE IsActive=1 ORDER BY SortOrder ASC,Id ASC; END;
GO
CREATE PROCEDURE sp_UpdateNavbarLink @Id INT, @Title VARCHAR(100), @Url VARCHAR(255)=NULL, @Slug VARCHAR(150)=NULL, @Category VARCHAR(50)=NULL, @BadgeText VARCHAR(20)=NULL, @IsActive BIT=1, @SortOrder INT=0 AS BEGIN SET NOCOUNT ON; UPDATE NavbarLinks SET Title=@Title,Url=@Url,Slug=@Slug,Category=@Category,BadgeText=@BadgeText,IsActive=@IsActive,SortOrder=@SortOrder WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_DeleteNavbarLink @Id INT AS BEGIN SET NOCOUNT ON; IF EXISTS (SELECT 1 FROM NavbarLinks WHERE ParentId=@Id) BEGIN SELECT -1 AS result,'Pehle iske andar ke dropdown links delete karein.' AS message; RETURN; END DELETE FROM CourseDetails WHERE NavbarLinkId=@Id; DELETE FROM NavbarLinks WHERE Id=@Id; SELECT 1 AS result,'Link deleted successfully' AS message; END;
GO
CREATE PROCEDURE sp_ToggleNavbarLink @Id INT AS BEGIN SET NOCOUNT ON; UPDATE NavbarLinks SET IsActive=CASE WHEN IsActive=1 THEN 0 ELSE 1 END WHERE Id=@Id; SELECT IsActive FROM NavbarLinks WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_SubmitCallback @FullName VARCHAR(100), @Phone VARCHAR(20), @Email VARCHAR(150)=NULL, @Domain VARCHAR(100)=NULL, @Message VARCHAR(500)=NULL AS BEGIN SET NOCOUNT ON; INSERT INTO CallbackRequests (FullName,Phone,Email,Domain,Message) VALUES (@FullName,@Phone,@Email,@Domain,@Message); END;
GO
CREATE PROCEDURE sp_GetCallbacks AS BEGIN SET NOCOUNT ON; SELECT * FROM CallbackRequests ORDER BY CreatedAt DESC; END;
GO
CREATE PROCEDURE sp_MarkCallbackRead @Id INT AS BEGIN SET NOCOUNT ON; UPDATE CallbackRequests SET IsRead=1 WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_MarkAllCallbacksRead AS BEGIN SET NOCOUNT ON; UPDATE CallbackRequests SET IsRead=1; END;
GO
CREATE PROCEDURE sp_SubmitAdmission @FullName VARCHAR(100), @Email VARCHAR(150), @Phone VARCHAR(20), @CourseInterest VARCHAR(150), @Qualification VARCHAR(100)=NULL, @WorkExperience VARCHAR(50)=NULL, @City VARCHAR(100)=NULL, @Message VARCHAR(500)=NULL AS BEGIN SET NOCOUNT ON; INSERT INTO AdmissionApplications (FullName,Email,Phone,CourseInterest,Qualification,WorkExperience,City,Message) VALUES (@FullName,@Email,@Phone,@CourseInterest,@Qualification,@WorkExperience,@City,@Message); END;
GO
CREATE PROCEDURE sp_GetAdmissions AS BEGIN SET NOCOUNT ON; SELECT * FROM AdmissionApplications ORDER BY CreatedAt DESC; END;
GO
CREATE PROCEDURE sp_MarkAdmissionRead @Id INT AS BEGIN SET NOCOUNT ON; UPDATE AdmissionApplications SET IsRead=1 WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_UpdateAdmissionStatus @Id INT, @Status VARCHAR(30) AS BEGIN SET NOCOUNT ON; UPDATE AdmissionApplications SET Status=@Status WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_GetUnreadCount AS BEGIN SET NOCOUNT ON; SELECT (SELECT COUNT(*) FROM CallbackRequests WHERE IsRead=0) AS callbacks,(SELECT COUNT(*) FROM AdmissionApplications WHERE IsRead=0) AS admissions; END;
GO
CREATE PROCEDURE sp_GetBanners @ShowAll BIT=0 AS BEGIN SET NOCOUNT ON; IF @ShowAll=1 SELECT * FROM Banners ORDER BY SortOrder ASC,Id ASC; ELSE SELECT * FROM Banners WHERE IsActive=1 ORDER BY SortOrder ASC,Id ASC; END;
GO
CREATE PROCEDURE sp_GetBannerById @Id INT AS BEGIN SET NOCOUNT ON; SELECT * FROM Banners WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_AddBanner @BadgeText VARCHAR(150)=NULL, @HeadingLine1 VARCHAR(255)=NULL, @HeadingLine2 VARCHAR(255)=NULL, @SubText1 VARCHAR(500)=NULL, @SubText2 NVARCHAR(MAX)=NULL, @Btn1Text VARCHAR(100)=NULL, @Btn1Link VARCHAR(255)=NULL, @Btn2Text VARCHAR(100)=NULL, @Btn2Link VARCHAR(255)=NULL, @BannerImage VARCHAR(MAX)=NULL, @VideoUrl VARCHAR(500)=NULL, @VideoCardLabel VARCHAR(150)=NULL, @VideoCardTitle VARCHAR(150)=NULL, @BgImage VARCHAR(MAX)=NULL, @SortOrder INT=0, @IsActive BIT=1 AS BEGIN SET NOCOUNT ON; INSERT INTO Banners (BadgeText,HeadingLine1,HeadingLine2,SubText1,SubText2,Btn1Text,Btn1Link,Btn2Text,Btn2Link,BannerImage,VideoUrl,VideoCardLabel,VideoCardTitle,BgImage,SortOrder,IsActive) VALUES (@BadgeText,@HeadingLine1,@HeadingLine2,@SubText1,@SubText2,@Btn1Text,@Btn1Link,@Btn2Text,@Btn2Link,@BannerImage,@VideoUrl,@VideoCardLabel,@VideoCardTitle,@BgImage,@SortOrder,@IsActive); SELECT SCOPE_IDENTITY() AS Id; END;
GO
CREATE PROCEDURE sp_UpdateBanner @Id INT, @BadgeText VARCHAR(150)=NULL, @HeadingLine1 VARCHAR(255)=NULL, @HeadingLine2 VARCHAR(255)=NULL, @SubText1 VARCHAR(500)=NULL, @SubText2 NVARCHAR(MAX)=NULL, @Btn1Text VARCHAR(100)=NULL, @Btn1Link VARCHAR(255)=NULL, @Btn2Text VARCHAR(100)=NULL, @Btn2Link VARCHAR(255)=NULL, @BannerImage VARCHAR(MAX)=NULL, @VideoUrl VARCHAR(500)=NULL, @VideoCardLabel VARCHAR(150)=NULL, @VideoCardTitle VARCHAR(150)=NULL, @BgImage VARCHAR(MAX)=NULL, @SortOrder INT=0, @IsActive BIT=1 AS BEGIN SET NOCOUNT ON; UPDATE Banners SET BadgeText=@BadgeText,HeadingLine1=@HeadingLine1,HeadingLine2=@HeadingLine2,SubText1=@SubText1,SubText2=@SubText2,Btn1Text=@Btn1Text,Btn1Link=@Btn1Link,Btn2Text=@Btn2Text,Btn2Link=@Btn2Link,BannerImage=ISNULL(@BannerImage,BannerImage),VideoUrl=@VideoUrl,VideoCardLabel=@VideoCardLabel,VideoCardTitle=@VideoCardTitle,BgImage=ISNULL(@BgImage,BgImage),SortOrder=@SortOrder,IsActive=@IsActive,UpdatedAt=GETDATE() WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_DeleteBanner @Id INT AS BEGIN SET NOCOUNT ON; DELETE FROM Banners WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_ToggleBanner @Id INT AS BEGIN SET NOCOUNT ON; UPDATE Banners SET IsActive=CASE WHEN IsActive=1 THEN 0 ELSE 1 END WHERE Id=@Id; SELECT IsActive FROM Banners WHERE Id=@Id; END;
GO

-- ============================================================
-- PART 6: UNIVERSITY SPs (new Slides system)
-- ============================================================
CREATE PROCEDURE sp_GetUniversitySlides @ShowAll BIT=0 AS BEGIN SET NOCOUNT ON; IF @ShowAll=1 SELECT * FROM UniversitySlides ORDER BY SortOrder ASC,Id ASC; ELSE SELECT * FROM UniversitySlides WHERE IsActive=1 ORDER BY SortOrder ASC,Id ASC; SELECT * FROM UniversitySlideLogos WHERE IsActive=1 ORDER BY SlideId ASC,SortOrder ASC,Id ASC; END;
GO
CREATE PROCEDURE sp_AddUniversitySlide @BadgeText VARCHAR(200)=NULL, @Heading VARCHAR(255)=NULL, @Description NVARCHAR(MAX)=NULL, @BtnText VARCHAR(100)=NULL, @BtnLink VARCHAR(255)=NULL, @SortOrder INT=0, @IsActive BIT=1 AS BEGIN SET NOCOUNT ON; INSERT INTO UniversitySlides (BadgeText,Heading,Description,BtnText,BtnLink,SortOrder,IsActive) VALUES (@BadgeText,@Heading,@Description,@BtnText,@BtnLink,@SortOrder,@IsActive); SELECT SCOPE_IDENTITY() AS Id; END;
GO
CREATE PROCEDURE sp_UpdateUniversitySlide @Id INT, @BadgeText VARCHAR(200)=NULL, @Heading VARCHAR(255)=NULL, @Description NVARCHAR(MAX)=NULL, @BtnText VARCHAR(100)=NULL, @BtnLink VARCHAR(255)=NULL, @SortOrder INT=0, @IsActive BIT=1 AS BEGIN SET NOCOUNT ON; UPDATE UniversitySlides SET BadgeText=@BadgeText,Heading=@Heading,Description=@Description,BtnText=@BtnText,BtnLink=@BtnLink,SortOrder=@SortOrder,IsActive=@IsActive,UpdatedAt=GETDATE() WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_DeleteUniversitySlide @Id INT AS BEGIN SET NOCOUNT ON; DELETE FROM UniversitySlides WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_ToggleUniversitySlide @Id INT AS BEGIN SET NOCOUNT ON; UPDATE UniversitySlides SET IsActive=CASE WHEN IsActive=1 THEN 0 ELSE 1 END WHERE Id=@Id; SELECT IsActive FROM UniversitySlides WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_AddUniversitySlideLogo @SlideId INT, @Name VARCHAR(150)=NULL, @LogoUrl VARCHAR(MAX)=NULL, @SortOrder INT=0, @IsActive BIT=1 AS BEGIN SET NOCOUNT ON; INSERT INTO UniversitySlideLogos (SlideId,Name,LogoUrl,SortOrder,IsActive) VALUES (@SlideId,@Name,@LogoUrl,@SortOrder,@IsActive); SELECT SCOPE_IDENTITY() AS Id; END;
GO
CREATE PROCEDURE sp_UpdateUniversitySlideLogo @Id INT, @Name VARCHAR(150)=NULL, @LogoUrl VARCHAR(MAX)=NULL, @SortOrder INT=0, @IsActive BIT=1 AS BEGIN SET NOCOUNT ON; UPDATE UniversitySlideLogos SET Name=@Name,LogoUrl=@LogoUrl,SortOrder=@SortOrder,IsActive=@IsActive WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_DeleteUniversitySlideLogo @Id INT AS BEGIN SET NOCOUNT ON; DELETE FROM UniversitySlideLogos WHERE Id=@Id; END;
GO

-- ============================================================
-- PART 7: CAREER SPs
-- ============================================================
CREATE PROCEDURE sp_GetCareerCategories @ShowAll BIT=0 AS BEGIN SET NOCOUNT ON; IF @ShowAll=1 SELECT *,(SELECT COUNT(*) FROM CareerCourses WHERE CategoryId=cc.Id) AS CourseCount FROM CareerCategories cc ORDER BY SortOrder ASC,Id ASC; ELSE SELECT *,(SELECT COUNT(*) FROM CareerCourses WHERE CategoryId=cc.Id AND IsActive=1) AS CourseCount FROM CareerCategories cc WHERE IsActive=1 ORDER BY SortOrder ASC,Id ASC; END;
GO
CREATE PROCEDURE sp_AddCareerCategory @Name VARCHAR(100), @Image VARCHAR(MAX)=NULL, @SortOrder INT=0, @IsActive BIT=1 AS BEGIN SET NOCOUNT ON; INSERT INTO CareerCategories (Name,Image,SortOrder,IsActive) VALUES (@Name,@Image,@SortOrder,@IsActive); SELECT SCOPE_IDENTITY() AS Id; END;
GO
CREATE PROCEDURE sp_UpdateCareerCategory @Id INT, @Name VARCHAR(100), @Image VARCHAR(MAX)=NULL, @SortOrder INT=0, @IsActive BIT=1 AS BEGIN SET NOCOUNT ON; UPDATE CareerCategories SET Name=@Name,Image=ISNULL(@Image,Image),SortOrder=@SortOrder,IsActive=@IsActive,UpdatedAt=GETDATE() WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_DeleteCareerCategory @Id INT AS BEGIN SET NOCOUNT ON; DELETE FROM CareerCategories WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_ToggleCareerCategory @Id INT AS BEGIN SET NOCOUNT ON; UPDATE CareerCategories SET IsActive=CASE WHEN IsActive=1 THEN 0 ELSE 1 END,UpdatedAt=GETDATE() WHERE Id=@Id; SELECT IsActive FROM CareerCategories WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_GetCareerCourses @CategoryId INT, @ShowAll BIT=0 AS BEGIN SET NOCOUNT ON; IF @ShowAll=1 SELECT * FROM CareerCourses WHERE CategoryId=@CategoryId ORDER BY SortOrder ASC,Id ASC; ELSE SELECT * FROM CareerCourses WHERE CategoryId=@CategoryId AND IsActive=1 ORDER BY SortOrder ASC,Id ASC; END;
GO
CREATE PROCEDURE sp_GetCareerCourseById @Id INT AS BEGIN SET NOCOUNT ON; SELECT * FROM CareerCourses WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_AddCareerCourse @CategoryId INT, @Ribbon VARCHAR(50)=NULL, @RibbonColor VARCHAR(20)=NULL, @Logo VARCHAR(MAX)=NULL, @Location VARCHAR(150)=NULL, @Title VARCHAR(500), @Feature1Text VARCHAR(255)=NULL, @Feature1Icon VARCHAR(50)=NULL, @Feature2Text VARCHAR(255)=NULL, @Feature2Icon VARCHAR(50)=NULL, @SortOrder INT=0, @IsActive BIT=1 AS BEGIN SET NOCOUNT ON; INSERT INTO CareerCourses (CategoryId,Ribbon,RibbonColor,Logo,Location,Title,Feature1Text,Feature1Icon,Feature2Text,Feature2Icon,SortOrder,IsActive) VALUES (@CategoryId,@Ribbon,@RibbonColor,@Logo,@Location,@Title,@Feature1Text,@Feature1Icon,@Feature2Text,@Feature2Icon,@SortOrder,@IsActive); SELECT SCOPE_IDENTITY() AS Id; END;
GO
CREATE PROCEDURE sp_UpdateCareerCourse @Id INT, @CategoryId INT, @Ribbon VARCHAR(50)=NULL, @RibbonColor VARCHAR(20)=NULL, @Logo VARCHAR(MAX)=NULL, @Location VARCHAR(150)=NULL, @Title VARCHAR(500), @Feature1Text VARCHAR(255)=NULL, @Feature1Icon VARCHAR(50)=NULL, @Feature2Text VARCHAR(255)=NULL, @Feature2Icon VARCHAR(50)=NULL, @SortOrder INT=0, @IsActive BIT=1 AS BEGIN SET NOCOUNT ON; UPDATE CareerCourses SET CategoryId=@CategoryId,Ribbon=@Ribbon,RibbonColor=@RibbonColor,Logo=ISNULL(@Logo,Logo),Location=@Location,Title=@Title,Feature1Text=@Feature1Text,Feature1Icon=@Feature1Icon,Feature2Text=@Feature2Text,Feature2Icon=@Feature2Icon,SortOrder=@SortOrder,IsActive=@IsActive,UpdatedAt=GETDATE() WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_DeleteCareerCourse @Id INT AS BEGIN SET NOCOUNT ON; DELETE FROM CareerCourses WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_ToggleCareerCourse @Id INT AS BEGIN SET NOCOUNT ON; UPDATE CareerCourses SET IsActive=CASE WHEN IsActive=1 THEN 0 ELSE 1 END,UpdatedAt=GETDATE() WHERE Id=@Id; SELECT IsActive FROM CareerCourses WHERE Id=@Id; END;
GO

-- sp_GetPublicCareerData â€” Slug + BrochureUrl included (latest version)
CREATE PROCEDURE sp_GetPublicCareerData AS BEGIN
    SET NOCOUNT ON;
    SELECT cc.Id,cc.Name,cc.Image,cc.SortOrder,
           (SELECT COUNT(*) FROM CareerCourses WHERE CategoryId=cc.Id AND IsActive=1) AS CourseCount
    FROM CareerCategories cc WHERE cc.IsActive=1 ORDER BY cc.SortOrder ASC,cc.Id ASC;
    SELECT c.*,cpd.Slug AS Slug,cpd.BrochureUrl AS BrochureUrl
    FROM CareerCourses c
    LEFT JOIN CoursePageDetails cpd ON cpd.CareerCourseId=c.Id AND cpd.IsActive=1
    WHERE c.IsActive=1 ORDER BY c.CategoryId ASC,c.SortOrder ASC,c.Id ASC;
END;
GO

-- ============================================================
-- PART 8: FREE COURSES SPs
-- ============================================================
CREATE PROCEDURE sp_GetPublicFreeCourses AS BEGIN SET NOCOUNT ON; SELECT * FROM FreeCourses WHERE IsActive=1 ORDER BY SortOrder ASC,Id ASC; END;
GO
CREATE PROCEDURE sp_GetAllFreeCourses @ShowAll BIT=0 AS BEGIN SET NOCOUNT ON; IF @ShowAll=1 SELECT * FROM FreeCourses ORDER BY SortOrder ASC,Id ASC; ELSE SELECT * FROM FreeCourses WHERE IsActive=1 ORDER BY SortOrder ASC,Id ASC; END;
GO
CREATE PROCEDURE sp_AddFreeCourse @Title VARCHAR(300), @Image VARCHAR(MAX)=NULL, @Learners VARCHAR(50)=NULL, @Duration VARCHAR(50)=NULL, @ProgramUrl VARCHAR(500)=NULL, @EnrollUrl VARCHAR(500)=NULL, @SortOrder INT=0, @IsActive BIT=1 AS BEGIN SET NOCOUNT ON; INSERT INTO FreeCourses (Title,Image,Learners,Duration,ProgramUrl,EnrollUrl,SortOrder,IsActive) VALUES (@Title,@Image,@Learners,@Duration,@ProgramUrl,@EnrollUrl,@SortOrder,@IsActive); SELECT SCOPE_IDENTITY() AS Id; END;
GO
CREATE PROCEDURE sp_UpdateFreeCourse @Id INT, @Title VARCHAR(300), @Image VARCHAR(MAX)=NULL, @Learners VARCHAR(50)=NULL, @Duration VARCHAR(50)=NULL, @ProgramUrl VARCHAR(500)=NULL, @EnrollUrl VARCHAR(500)=NULL, @SortOrder INT=0, @IsActive BIT=1 AS BEGIN SET NOCOUNT ON; UPDATE FreeCourses SET Title=@Title,Image=ISNULL(@Image,Image),Learners=@Learners,Duration=@Duration,ProgramUrl=@ProgramUrl,EnrollUrl=@EnrollUrl,SortOrder=@SortOrder,IsActive=@IsActive,UpdatedAt=GETDATE() WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_DeleteFreeCourse @Id INT AS BEGIN SET NOCOUNT ON; DELETE FROM FreeCourses WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_ToggleFreeCourse @Id INT AS BEGIN SET NOCOUNT ON; UPDATE FreeCourses SET IsActive=CASE WHEN IsActive=1 THEN 0 ELSE 1 END,UpdatedAt=GETDATE() WHERE Id=@Id; SELECT IsActive FROM FreeCourses WHERE Id=@Id; END;
GO

-- ============================================================
-- PART 9: COURSE PAGE DETAILS SPs (Career + Online both)
-- ============================================================
CREATE PROCEDURE sp_GetCourseDetailBySlug @Slug VARCHAR(200) AS BEGIN SET NOCOUNT ON; SELECT cpd.*,cc.Title AS CourseTitle,cc.Logo AS CourseLogo,cc.Ribbon,cc.RibbonColor,cc.Location,nl.Title AS NavbarTitle FROM CoursePageDetails cpd LEFT JOIN CareerCourses cc ON cpd.CareerCourseId=cc.Id LEFT JOIN NavbarLinks nl ON cpd.NavbarLinkId=nl.Id WHERE cpd.Slug=@Slug AND cpd.IsActive=1; END;
GO
CREATE PROCEDURE sp_GetCourseDetailById @CareerCourseId INT AS BEGIN SET NOCOUNT ON; SELECT * FROM CoursePageDetails WHERE CareerCourseId=@CareerCourseId; END;
GO
CREATE PROCEDURE sp_GetAllCourseDetails AS BEGIN SET NOCOUNT ON; SELECT cpd.Id,cpd.CareerCourseId,cpd.Slug,cpd.University,cpd.HeroTitleNormal,cpd.IsActive,cpd.UpdatedAt,cc.Title AS CourseTitle FROM CoursePageDetails cpd JOIN CareerCourses cc ON cpd.CareerCourseId=cc.Id ORDER BY cpd.UpdatedAt DESC; END;
GO
CREATE PROCEDURE sp_DeleteCourseDetail @CareerCourseId INT AS BEGIN SET NOCOUNT ON; DELETE FROM CoursePageDetails WHERE CareerCourseId=@CareerCourseId; END;
GO

-- ============================================================
-- PART 10: sp_UpsertCourseDetail (Career Course Detail Pages)
-- ============================================================
CREATE PROCEDURE sp_UpsertCourseDetail
    @CareerCourseId INT, @Slug VARCHAR(200),
    @HeroBadge VARCHAR(100)=NULL, @University VARCHAR(150)=NULL,
    @HeroTitleNormal VARCHAR(300)=NULL, @HeroTitleOrange VARCHAR(300)=NULL,
    @HeroDescription NVARCHAR(MAX)=NULL, @HeroDuration VARCHAR(100)=NULL,
    @HeroMode VARCHAR(100)=NULL, @HeroStarts VARCHAR(100)=NULL,
    @HeroImage VARCHAR(MAX)=NULL, @HeroReviewText NVARCHAR(MAX)=NULL,
    @HeroReviewAuthor VARCHAR(150)=NULL, @HeroUrgencyText NVARCHAR(MAX)=NULL,
    @BrochureUrl VARCHAR(MAX)=NULL, @AlumniCompanies NVARCHAR(MAX)=NULL,
    @LegacyTitle VARCHAR(300)=NULL, @LegacySubtitle NVARCHAR(MAX)=NULL,
    @LegacyCards NVARCHAR(MAX)=NULL, @AiSectionTitle VARCHAR(300)=NULL,
    @AiSectionSubtext NVARCHAR(MAX)=NULL, @AiHighlights NVARCHAR(MAX)=NULL,
    @AiStat1Value VARCHAR(50)=NULL, @AiStat1Label VARCHAR(100)=NULL,
    @AiStat2Value VARCHAR(50)=NULL, @AiStat2Label VARCHAR(100)=NULL,
    @AiPromoTitle VARCHAR(200)=NULL, @AiPromoText NVARCHAR(MAX)=NULL,
    @QuickHighlights NVARCHAR(MAX)=NULL, @LearningJourneyTitle VARCHAR(300)=NULL,
    @LearningJourney NVARCHAR(MAX)=NULL, @Curriculum NVARCHAR(MAX)=NULL,
    @Tools NVARCHAR(MAX)=NULL, @RealWorldProjects NVARCHAR(MAX)=NULL,
    @CapstoneProjects NVARCHAR(MAX)=NULL, @Mentors NVARCHAR(MAX)=NULL,
    @CredentialTitle VARCHAR(300)=NULL, @CredentialSubtitle NVARCHAR(MAX)=NULL,
    @CredentialFeatures NVARCHAR(MAX)=NULL, @CertificateImage VARCHAR(MAX)=NULL,
    @CareerJourneySteps NVARCHAR(MAX)=NULL, @CareerStats NVARCHAR(MAX)=NULL,
    @SuccessStories NVARCHAR(MAX)=NULL, @LearningExperience NVARCHAR(MAX)=NULL,
    @ShowAlumni BIT=1, @ShowLegacy BIT=1, @ShowAiSection BIT=1,
    @ShowQuickHighlights BIT=1, @ShowLearningJourney BIT=1, @ShowCurriculum BIT=1,
    @ShowTools BIT=1, @ShowRealProjects BIT=1, @ShowCapstone BIT=1,
    @ShowMentors BIT=1, @ShowCredential BIT=1, @ShowCareerSupport BIT=1,
    @IsActive BIT=1
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM CoursePageDetails WHERE CareerCourseId=@CareerCourseId)
    BEGIN
        UPDATE CoursePageDetails SET
            Slug=@Slug, HeroBadge=@HeroBadge, University=@University,
            HeroTitleNormal=@HeroTitleNormal, HeroTitleOrange=@HeroTitleOrange,
            HeroDescription=@HeroDescription, HeroDuration=@HeroDuration,
            HeroMode=@HeroMode, HeroStarts=@HeroStarts,
            HeroImage=ISNULL(@HeroImage,HeroImage),
            HeroReviewText=@HeroReviewText, HeroReviewAuthor=@HeroReviewAuthor,
            HeroUrgencyText=@HeroUrgencyText, BrochureUrl=ISNULL(@BrochureUrl,BrochureUrl),
            AlumniCompanies=@AlumniCompanies, LegacyTitle=@LegacyTitle,
            LegacySubtitle=@LegacySubtitle, LegacyCards=@LegacyCards,
            AiSectionTitle=@AiSectionTitle, AiSectionSubtext=@AiSectionSubtext,
            AiHighlights=@AiHighlights, AiStat1Value=@AiStat1Value, AiStat1Label=@AiStat1Label,
            AiStat2Value=@AiStat2Value, AiStat2Label=@AiStat2Label,
            AiPromoTitle=@AiPromoTitle, AiPromoText=@AiPromoText,
            QuickHighlights=@QuickHighlights, LearningJourneyTitle=@LearningJourneyTitle,
            LearningJourney=@LearningJourney, Curriculum=@Curriculum, Tools=@Tools,
            RealWorldProjects=@RealWorldProjects, CapstoneProjects=@CapstoneProjects,
            Mentors=@Mentors, CredentialTitle=@CredentialTitle,
            CredentialSubtitle=@CredentialSubtitle, CredentialFeatures=@CredentialFeatures,
            CertificateImage=ISNULL(@CertificateImage,CertificateImage),
            CareerJourneySteps=@CareerJourneySteps, CareerStats=@CareerStats,
            SuccessStories=@SuccessStories, LearningExperience=@LearningExperience,
            ShowAlumni=@ShowAlumni, ShowLegacy=@ShowLegacy, ShowAiSection=@ShowAiSection,
            ShowQuickHighlights=@ShowQuickHighlights, ShowLearningJourney=@ShowLearningJourney,
            ShowCurriculum=@ShowCurriculum, ShowTools=@ShowTools, ShowRealProjects=@ShowRealProjects,
            ShowCapstone=@ShowCapstone, ShowMentors=@ShowMentors, ShowCredential=@ShowCredential,
            ShowCareerSupport=@ShowCareerSupport, IsActive=@IsActive, UpdatedAt=GETDATE()
        WHERE CareerCourseId=@CareerCourseId;
        SELECT 'updated' AS action;
    END
    ELSE
    BEGIN
        INSERT INTO CoursePageDetails (
            CareerCourseId,Slug,HeroBadge,University,HeroTitleNormal,HeroTitleOrange,
            HeroDescription,HeroDuration,HeroMode,HeroStarts,HeroImage,
            HeroReviewText,HeroReviewAuthor,HeroUrgencyText,BrochureUrl,
            AlumniCompanies,LegacyTitle,LegacySubtitle,LegacyCards,
            AiSectionTitle,AiSectionSubtext,AiHighlights,
            AiStat1Value,AiStat1Label,AiStat2Value,AiStat2Label,AiPromoTitle,AiPromoText,
            QuickHighlights,LearningJourneyTitle,LearningJourney,Curriculum,Tools,
            RealWorldProjects,CapstoneProjects,Mentors,
            CredentialTitle,CredentialSubtitle,CredentialFeatures,CertificateImage,
            CareerJourneySteps,CareerStats,SuccessStories,LearningExperience,
            ShowAlumni,ShowLegacy,ShowAiSection,ShowQuickHighlights,ShowLearningJourney,
            ShowCurriculum,ShowTools,ShowRealProjects,ShowCapstone,ShowMentors,
            ShowCredential,ShowCareerSupport,IsActive
        ) VALUES (
            @CareerCourseId,@Slug,@HeroBadge,@University,@HeroTitleNormal,@HeroTitleOrange,
            @HeroDescription,@HeroDuration,@HeroMode,@HeroStarts,@HeroImage,
            @HeroReviewText,@HeroReviewAuthor,@HeroUrgencyText,@BrochureUrl,
            @AlumniCompanies,@LegacyTitle,@LegacySubtitle,@LegacyCards,
            @AiSectionTitle,@AiSectionSubtext,@AiHighlights,
            @AiStat1Value,@AiStat1Label,@AiStat2Value,@AiStat2Label,@AiPromoTitle,@AiPromoText,
            @QuickHighlights,@LearningJourneyTitle,@LearningJourney,@Curriculum,@Tools,
            @RealWorldProjects,@CapstoneProjects,@Mentors,
            @CredentialTitle,@CredentialSubtitle,@CredentialFeatures,@CertificateImage,
            @CareerJourneySteps,@CareerStats,@SuccessStories,@LearningExperience,
            @ShowAlumni,@ShowLegacy,@ShowAiSection,@ShowQuickHighlights,@ShowLearningJourney,
            @ShowCurriculum,@ShowTools,@ShowRealProjects,@ShowCapstone,@ShowMentors,
            @ShowCredential,@ShowCareerSupport,@IsActive
        );
        SELECT 'inserted' AS action;
    END
END;
GO

-- ============================================================
-- PART 11: ONLINE COURSE SPs
-- ============================================================
CREATE PROCEDURE sp_GetOnlineCourseCategories @ShowAll BIT=0 AS BEGIN SET NOCOUNT ON; IF @ShowAll=1 SELECT *,(SELECT COUNT(*) FROM OnlineCourses WHERE CategoryId=oc.Id) AS CourseCount FROM OnlineCourseCategories oc ORDER BY SortOrder ASC,Id ASC; ELSE SELECT *,(SELECT COUNT(*) FROM OnlineCourses WHERE CategoryId=oc.Id AND IsActive=1) AS CourseCount FROM OnlineCourseCategories oc WHERE IsActive=1 ORDER BY SortOrder ASC,Id ASC; END;
GO
CREATE PROCEDURE sp_AddOnlineCourseCategory @Name VARCHAR(100), @SortOrder INT=0, @IsActive BIT=1 AS BEGIN SET NOCOUNT ON; INSERT INTO OnlineCourseCategories (Name,SortOrder,IsActive) VALUES (@Name,@SortOrder,@IsActive); SELECT SCOPE_IDENTITY() AS Id; END;
GO
CREATE PROCEDURE sp_UpdateOnlineCourseCategory @Id INT, @Name VARCHAR(100), @SortOrder INT=0, @IsActive BIT=1 AS BEGIN SET NOCOUNT ON; UPDATE OnlineCourseCategories SET Name=@Name,SortOrder=@SortOrder,IsActive=@IsActive,UpdatedAt=GETDATE() WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_DeleteOnlineCourseCategory @Id INT AS BEGIN SET NOCOUNT ON; DELETE FROM OnlineCourseCategories WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_ToggleOnlineCourseCategory @Id INT AS BEGIN SET NOCOUNT ON; UPDATE OnlineCourseCategories SET IsActive=CASE WHEN IsActive=1 THEN 0 ELSE 1 END,UpdatedAt=GETDATE() WHERE Id=@Id; SELECT IsActive FROM OnlineCourseCategories WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_GetOnlineCourses @CategoryId INT, @ShowAll BIT=0 AS BEGIN SET NOCOUNT ON; IF @ShowAll=1 SELECT * FROM OnlineCourses WHERE CategoryId=@CategoryId ORDER BY SortOrder ASC,Id ASC; ELSE SELECT * FROM OnlineCourses WHERE CategoryId=@CategoryId AND IsActive=1 ORDER BY SortOrder ASC,Id ASC; END;
GO
CREATE PROCEDURE sp_GetOnlineCourseById @Id INT AS BEGIN SET NOCOUNT ON; SELECT * FROM OnlineCourses WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_AddOnlineCourse @CategoryId INT, @Title VARCHAR(500), @Subtitle VARCHAR(300)=NULL, @Image VARCHAR(MAX)=NULL, @Feature1 VARCHAR(255)=NULL, @Feature2 VARCHAR(255)=NULL, @Feature3 VARCHAR(255)=NULL, @SkillImage VARCHAR(MAX)=NULL, @SkillImages NVARCHAR(MAX)=NULL, @ExtraSkills INT=0, @ProgramUrl VARCHAR(500)=NULL, @BrochureUrl VARCHAR(MAX)=NULL, @SortOrder INT=0, @IsActive BIT=1 AS BEGIN SET NOCOUNT ON; INSERT INTO OnlineCourses (CategoryId,Title,Subtitle,Image,Feature1,Feature2,Feature3,SkillImage,SkillImages,ExtraSkills,ProgramUrl,BrochureUrl,SortOrder,IsActive) VALUES (@CategoryId,@Title,@Subtitle,@Image,@Feature1,@Feature2,@Feature3,@SkillImage,@SkillImages,@ExtraSkills,@ProgramUrl,@BrochureUrl,@SortOrder,@IsActive); SELECT SCOPE_IDENTITY() AS Id; END;
GO
CREATE PROCEDURE sp_UpdateOnlineCourse @Id INT, @CategoryId INT, @Title VARCHAR(500), @Subtitle VARCHAR(300)=NULL, @Image VARCHAR(MAX)=NULL, @Feature1 VARCHAR(255)=NULL, @Feature2 VARCHAR(255)=NULL, @Feature3 VARCHAR(255)=NULL, @SkillImage VARCHAR(MAX)=NULL, @SkillImages NVARCHAR(MAX)=NULL, @ExtraSkills INT=0, @ProgramUrl VARCHAR(500)=NULL, @BrochureUrl VARCHAR(MAX)=NULL, @SortOrder INT=0, @IsActive BIT=1 AS BEGIN SET NOCOUNT ON; UPDATE OnlineCourses SET CategoryId=@CategoryId,Title=@Title,Subtitle=@Subtitle,Image=ISNULL(@Image,Image),Feature1=@Feature1,Feature2=@Feature2,Feature3=@Feature3,SkillImage=ISNULL(@SkillImage,SkillImage),SkillImages=@SkillImages,ExtraSkills=@ExtraSkills,ProgramUrl=@ProgramUrl,BrochureUrl=@BrochureUrl,SortOrder=@SortOrder,IsActive=@IsActive,UpdatedAt=GETDATE() WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_DeleteOnlineCourse @Id INT AS BEGIN SET NOCOUNT ON; DELETE FROM OnlineCourses WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_ToggleOnlineCourse @Id INT AS BEGIN SET NOCOUNT ON; UPDATE OnlineCourses SET IsActive=CASE WHEN IsActive=1 THEN 0 ELSE 1 END,UpdatedAt=GETDATE() WHERE Id=@Id; SELECT IsActive FROM OnlineCourses WHERE Id=@Id; END;
GO

-- Public: Homepage slider
CREATE PROCEDURE sp_GetPublicOnlineCourseData AS BEGIN
    SET NOCOUNT ON;
    SELECT Id,Name,SortOrder,(SELECT COUNT(*) FROM OnlineCourses WHERE CategoryId=oc.Id AND IsActive=1) AS CourseCount
    FROM OnlineCourseCategories oc WHERE IsActive=1 ORDER BY SortOrder ASC,Id ASC;
    SELECT oc.*,cpd.Slug AS Slug FROM OnlineCourses oc
    LEFT JOIN CoursePageDetails cpd ON cpd.OnlineCourseId=oc.Id AND cpd.IsActive=1
    WHERE oc.IsActive=1 ORDER BY oc.CategoryId ASC,oc.SortOrder ASC,oc.Id ASC;
END;
GO

-- Public: View All page (paginated)
CREATE PROCEDURE sp_GetAllPublicOnlineCourses @CategoryId INT=NULL, @PageNo INT=1, @PageSize INT=9 AS BEGIN
    SET NOCOUNT ON;
    DECLARE @Offset INT=(@PageNo-1)*@PageSize;
    SELECT COUNT(*) AS TotalCount FROM OnlineCourses oc WHERE oc.IsActive=1 AND (@CategoryId IS NULL OR oc.CategoryId=@CategoryId);
    SELECT oc.*,cat.Name AS CategoryName,cpd.Slug AS Slug
    FROM OnlineCourses oc
    INNER JOIN OnlineCourseCategories cat ON cat.Id=oc.CategoryId
    LEFT JOIN CoursePageDetails cpd ON cpd.OnlineCourseId=oc.Id AND cpd.IsActive=1
    WHERE oc.IsActive=1 AND cat.IsActive=1 AND (@CategoryId IS NULL OR oc.CategoryId=@CategoryId)
    ORDER BY oc.CategoryId ASC,oc.SortOrder ASC,oc.Id ASC
    OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;
END;
GO

-- Online Course Detail: Get by slug
CREATE PROCEDURE sp_GetOnlineCourseDetailBySlug @Slug VARCHAR(200) AS BEGIN SET NOCOUNT ON; SELECT cpd.*,oc.Title AS CourseTitle,oc.Image AS CourseImage,oc.Subtitle AS CourseSubtitle FROM CoursePageDetails cpd JOIN OnlineCourses oc ON cpd.OnlineCourseId=oc.Id WHERE cpd.Slug=@Slug AND cpd.IsActive=1 AND cpd.OnlineCourseId IS NOT NULL; END;
GO
CREATE PROCEDURE sp_GetOnlineCourseDetailById @OnlineCourseId INT AS BEGIN SET NOCOUNT ON; SELECT * FROM CoursePageDetails WHERE OnlineCourseId=@OnlineCourseId; END;
GO
CREATE PROCEDURE sp_GetAllOnlineCourseDetails AS BEGIN SET NOCOUNT ON; SELECT cpd.Id,cpd.OnlineCourseId,cpd.Slug,cpd.University,cpd.HeroTitleNormal,cpd.IsActive,cpd.UpdatedAt,oc.Title AS CourseTitle FROM CoursePageDetails cpd JOIN OnlineCourses oc ON cpd.OnlineCourseId=oc.Id WHERE cpd.OnlineCourseId IS NOT NULL ORDER BY cpd.UpdatedAt DESC; END;
GO
CREATE PROCEDURE sp_DeleteOnlineCourseDetail @OnlineCourseId INT AS BEGIN SET NOCOUNT ON; DELETE FROM CoursePageDetails WHERE OnlineCourseId=@OnlineCourseId; END;
GO

-- ============================================================
-- PART 12: sp_UpsertOnlineCourseDetail
-- ============================================================
CREATE PROCEDURE sp_UpsertOnlineCourseDetail
    @OnlineCourseId INT, @Slug VARCHAR(200),
    @HeroBadge VARCHAR(100)=NULL, @University VARCHAR(150)=NULL,
    @HeroTitleNormal VARCHAR(300)=NULL, @HeroTitleOrange VARCHAR(300)=NULL,
    @HeroDescription NVARCHAR(MAX)=NULL, @HeroDuration VARCHAR(100)=NULL,
    @HeroMode VARCHAR(100)=NULL, @HeroStarts VARCHAR(100)=NULL,
    @HeroImage VARCHAR(MAX)=NULL, @HeroReviewText NVARCHAR(MAX)=NULL,
    @HeroReviewAuthor VARCHAR(150)=NULL, @HeroUrgencyText NVARCHAR(MAX)=NULL,
    @BrochureUrl VARCHAR(MAX)=NULL, @AlumniCompanies NVARCHAR(MAX)=NULL,
    @LegacyTitle VARCHAR(300)=NULL, @LegacySubtitle NVARCHAR(MAX)=NULL,
    @LegacyCards NVARCHAR(MAX)=NULL, @AiSectionTitle VARCHAR(300)=NULL,
    @AiSectionSubtext NVARCHAR(MAX)=NULL, @AiHighlights NVARCHAR(MAX)=NULL,
    @AiStat1Value VARCHAR(50)=NULL, @AiStat1Label VARCHAR(100)=NULL,
    @AiStat2Value VARCHAR(50)=NULL, @AiStat2Label VARCHAR(100)=NULL,
    @AiPromoTitle VARCHAR(200)=NULL, @AiPromoText NVARCHAR(MAX)=NULL,
    @QuickHighlights NVARCHAR(MAX)=NULL, @LearningJourneyTitle VARCHAR(300)=NULL,
    @LearningJourney NVARCHAR(MAX)=NULL, @Curriculum NVARCHAR(MAX)=NULL,
    @Tools NVARCHAR(MAX)=NULL, @RealWorldProjects NVARCHAR(MAX)=NULL,
    @CapstoneProjects NVARCHAR(MAX)=NULL, @Mentors NVARCHAR(MAX)=NULL,
    @CredentialTitle VARCHAR(300)=NULL, @CredentialSubtitle NVARCHAR(MAX)=NULL,
    @CredentialFeatures NVARCHAR(MAX)=NULL, @CertificateImage VARCHAR(MAX)=NULL,
    @CareerJourneySteps NVARCHAR(MAX)=NULL, @CareerStats NVARCHAR(MAX)=NULL,
    @SuccessStories NVARCHAR(MAX)=NULL, @LearningExperience NVARCHAR(MAX)=NULL,
    @ShowAlumni BIT=1, @ShowLegacy BIT=1, @ShowAiSection BIT=1,
    @ShowQuickHighlights BIT=1, @ShowLearningJourney BIT=1, @ShowCurriculum BIT=1,
    @ShowTools BIT=1, @ShowRealProjects BIT=1, @ShowCapstone BIT=1,
    @ShowMentors BIT=1, @ShowCredential BIT=1, @ShowCareerSupport BIT=1,
    @IsActive BIT=1
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM CoursePageDetails WHERE OnlineCourseId=@OnlineCourseId)
    BEGIN
        UPDATE CoursePageDetails SET
            Slug=@Slug, HeroBadge=@HeroBadge, University=@University,
            HeroTitleNormal=@HeroTitleNormal, HeroTitleOrange=@HeroTitleOrange,
            HeroDescription=@HeroDescription, HeroDuration=@HeroDuration,
            HeroMode=@HeroMode, HeroStarts=@HeroStarts,
            HeroImage=ISNULL(@HeroImage,HeroImage),
            HeroReviewText=@HeroReviewText, HeroReviewAuthor=@HeroReviewAuthor,
            HeroUrgencyText=@HeroUrgencyText, BrochureUrl=ISNULL(@BrochureUrl,BrochureUrl),
            AlumniCompanies=@AlumniCompanies, LegacyTitle=@LegacyTitle,
            LegacySubtitle=@LegacySubtitle, LegacyCards=@LegacyCards,
            AiSectionTitle=@AiSectionTitle, AiSectionSubtext=@AiSectionSubtext,
            AiHighlights=@AiHighlights, AiStat1Value=@AiStat1Value, AiStat1Label=@AiStat1Label,
            AiStat2Value=@AiStat2Value, AiStat2Label=@AiStat2Label,
            AiPromoTitle=@AiPromoTitle, AiPromoText=@AiPromoText,
            QuickHighlights=@QuickHighlights, LearningJourneyTitle=@LearningJourneyTitle,
            LearningJourney=@LearningJourney, Curriculum=@Curriculum, Tools=@Tools,
            RealWorldProjects=@RealWorldProjects, CapstoneProjects=@CapstoneProjects,
            Mentors=@Mentors, CredentialTitle=@CredentialTitle,
            CredentialSubtitle=@CredentialSubtitle, CredentialFeatures=@CredentialFeatures,
            CertificateImage=ISNULL(@CertificateImage,CertificateImage),
            CareerJourneySteps=@CareerJourneySteps, CareerStats=@CareerStats,
            SuccessStories=@SuccessStories, LearningExperience=@LearningExperience,
            ShowAlumni=@ShowAlumni, ShowLegacy=@ShowLegacy, ShowAiSection=@ShowAiSection,
            ShowQuickHighlights=@ShowQuickHighlights, ShowLearningJourney=@ShowLearningJourney,
            ShowCurriculum=@ShowCurriculum, ShowTools=@ShowTools, ShowRealProjects=@ShowRealProjects,
            ShowCapstone=@ShowCapstone, ShowMentors=@ShowMentors, ShowCredential=@ShowCredential,
            ShowCareerSupport=@ShowCareerSupport, IsActive=@IsActive, UpdatedAt=GETDATE()
        WHERE OnlineCourseId=@OnlineCourseId;
        SELECT 'updated' AS action;
    END
    ELSE
    BEGIN
        INSERT INTO CoursePageDetails (
            OnlineCourseId,Slug,HeroBadge,University,HeroTitleNormal,HeroTitleOrange,
            HeroDescription,HeroDuration,HeroMode,HeroStarts,HeroImage,
            HeroReviewText,HeroReviewAuthor,HeroUrgencyText,BrochureUrl,
            AlumniCompanies,LegacyTitle,LegacySubtitle,LegacyCards,
            AiSectionTitle,AiSectionSubtext,AiHighlights,
            AiStat1Value,AiStat1Label,AiStat2Value,AiStat2Label,AiPromoTitle,AiPromoText,
            QuickHighlights,LearningJourneyTitle,LearningJourney,Curriculum,Tools,
            RealWorldProjects,CapstoneProjects,Mentors,
            CredentialTitle,CredentialSubtitle,CredentialFeatures,CertificateImage,
            CareerJourneySteps,CareerStats,SuccessStories,LearningExperience,
            ShowAlumni,ShowLegacy,ShowAiSection,ShowQuickHighlights,ShowLearningJourney,
            ShowCurriculum,ShowTools,ShowRealProjects,ShowCapstone,ShowMentors,
            ShowCredential,ShowCareerSupport,IsActive
        ) VALUES (
            @OnlineCourseId,@Slug,@HeroBadge,@University,@HeroTitleNormal,@HeroTitleOrange,
            @HeroDescription,@HeroDuration,@HeroMode,@HeroStarts,@HeroImage,
            @HeroReviewText,@HeroReviewAuthor,@HeroUrgencyText,@BrochureUrl,
            @AlumniCompanies,@LegacyTitle,@LegacySubtitle,@LegacyCards,
            @AiSectionTitle,@AiSectionSubtext,@AiHighlights,
            @AiStat1Value,@AiStat1Label,@AiStat2Value,@AiStat2Label,@AiPromoTitle,@AiPromoText,
            @QuickHighlights,@LearningJourneyTitle,@LearningJourney,@Curriculum,@Tools,
            @RealWorldProjects,@CapstoneProjects,@Mentors,
            @CredentialTitle,@CredentialSubtitle,@CredentialFeatures,@CertificateImage,
            @CareerJourneySteps,@CareerStats,@SuccessStories,@LearningExperience,
            @ShowAlumni,@ShowLegacy,@ShowAiSection,@ShowQuickHighlights,@ShowLearningJourney,
            @ShowCurriculum,@ShowTools,@ShowRealProjects,@ShowCapstone,@ShowMentors,
            @ShowCredential,@ShowCareerSupport,@IsActive
        );
        SELECT 'inserted' AS action;
    END
END;
GO
-- ============================================================
-- PART 13: NAVBAR COURSEDETAIL MIGRATION
-- ============================================================

-- NavbarLinkId column add to CoursePageDetails (agar nahi hai)
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='CoursePageDetails' AND COLUMN_NAME='NavbarLinkId')
BEGIN
    ALTER TABLE CoursePageDetails ADD NavbarLinkId INT NULL;
    PRINT 'NavbarLinkId column added to CoursePageDetails';
END
GO

-- CareerCourseId unique constraint drop (NULL pe fail karta tha)
DECLARE @c1 NVARCHAR(200);
SELECT @c1 = kc.CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE kc
JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc ON kc.CONSTRAINT_NAME = tc.CONSTRAINT_NAME
WHERE kc.TABLE_NAME='CoursePageDetails' AND kc.COLUMN_NAME='CareerCourseId' AND tc.CONSTRAINT_TYPE='UNIQUE';
IF @c1 IS NOT NULL EXEC('ALTER TABLE CoursePageDetails DROP CONSTRAINT ' + @c1);
GO

-- OnlineCourseId unique constraint drop
DECLARE @c2 NVARCHAR(200);
SELECT @c2 = kc.CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE kc
JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc ON kc.CONSTRAINT_NAME = tc.CONSTRAINT_NAME
WHERE kc.TABLE_NAME='CoursePageDetails' AND kc.COLUMN_NAME='OnlineCourseId' AND tc.CONSTRAINT_TYPE='UNIQUE';
IF @c2 IS NOT NULL EXEC('ALTER TABLE CoursePageDetails DROP CONSTRAINT ' + @c2);
GO

-- Filtered unique indexes
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='UQ_CPD_CareerCourseId' AND object_id=OBJECT_ID('CoursePageDetails'))
    CREATE UNIQUE INDEX UQ_CPD_CareerCourseId ON CoursePageDetails(CareerCourseId) WHERE CareerCourseId IS NOT NULL;
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='UQ_CPD_OnlineCourseId' AND object_id=OBJECT_ID('CoursePageDetails'))
    CREATE UNIQUE INDEX UQ_CPD_OnlineCourseId ON CoursePageDetails(OnlineCourseId) WHERE OnlineCourseId IS NOT NULL;
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='UQ_CPD_NavbarLinkId' AND object_id=OBJECT_ID('CoursePageDetails'))
    CREATE UNIQUE INDEX UQ_CPD_NavbarLinkId ON CoursePageDetails(NavbarLinkId) WHERE NavbarLinkId IS NOT NULL;
GO

-- FK NavbarLinks
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE TABLE_NAME='CoursePageDetails' AND CONSTRAINT_NAME='FK_CoursePageDetails_NavbarLinks')
BEGIN
    ALTER TABLE CoursePageDetails ADD CONSTRAINT FK_CoursePageDetails_NavbarLinks
    FOREIGN KEY (NavbarLinkId) REFERENCES NavbarLinks(Id) ON DELETE SET NULL;
END
GO
-- ============================================================
-- PART 14: NEW SECTION SPs (Achieve Goals, Awards, Course Instructors,
--          Course Overview, Course Projects, Curriculum, Curriculum Comparison,
--          FAQ, Instructors, Skills Comparison, Subscription Banner,
--          Success Section, Tools & Tech)
-- ============================================================

-- ── Achieve Goals SPs ────────────────────────────────────────
CREATE PROCEDURE sp_GetAchieveGoalsSettings
AS BEGIN SET NOCOUNT ON; SELECT * FROM AchieveGoalsSettings WHERE Id=1; END;
GO
CREATE PROCEDURE sp_SaveAchieveGoalsSettings
    @HeadingNormal VARCHAR(255)=NULL, @HeadingOrange VARCHAR(255)=NULL, @SubHeading NVARCHAR(MAX)=NULL
AS BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM AchieveGoalsSettings WHERE Id=1)
        UPDATE AchieveGoalsSettings SET HeadingNormal=@HeadingNormal,HeadingOrange=@HeadingOrange,SubHeading=@SubHeading,UpdatedAt=GETDATE() WHERE Id=1;
    ELSE INSERT INTO AchieveGoalsSettings (Id,HeadingNormal,HeadingOrange,SubHeading) VALUES (1,@HeadingNormal,@HeadingOrange,@SubHeading);
    SELECT * FROM AchieveGoalsSettings WHERE Id=1;
END;
GO
CREATE PROCEDURE sp_GetAchieveGoalsTabs @ShowAll BIT=0
AS BEGIN
    SET NOCOUNT ON;
    IF @ShowAll=1 SELECT * FROM AchieveGoalsTabs ORDER BY SortOrder ASC,Id ASC;
    ELSE SELECT * FROM AchieveGoalsTabs WHERE IsActive=1 ORDER BY SortOrder ASC,Id ASC;
END;
GO
CREATE PROCEDURE sp_GetAchieveGoalsAllData
AS BEGIN
    SET NOCOUNT ON;
    SELECT * FROM AchieveGoalsSettings WHERE Id=1;
    SELECT * FROM AchieveGoalsTabs WHERE IsActive=1 ORDER BY SortOrder ASC,Id ASC;
END;
GO
CREATE PROCEDURE sp_AddAchieveGoalsTab
    @TabLabel VARCHAR(255), @InfoTag VARCHAR(255)=NULL, @InfoSubtitle VARCHAR(255)=NULL,
    @CardHeading VARCHAR(255)=NULL, @CardDesc NVARCHAR(MAX)=NULL, @ImageUrl VARCHAR(MAX)=NULL,
    @VideoUrl VARCHAR(MAX)=NULL, @Points NVARCHAR(MAX)=NULL, @SortOrder INT=0, @IsActive BIT=1
AS BEGIN
    SET NOCOUNT ON;
    INSERT INTO AchieveGoalsTabs (TabLabel,InfoTag,InfoSubtitle,CardHeading,CardDesc,ImageUrl,VideoUrl,Points,SortOrder,IsActive)
    VALUES (@TabLabel,@InfoTag,@InfoSubtitle,@CardHeading,@CardDesc,@ImageUrl,@VideoUrl,@Points,@SortOrder,@IsActive);
    SELECT SCOPE_IDENTITY() AS Id;
END;
GO
CREATE PROCEDURE sp_UpdateAchieveGoalsTab
    @Id INT, @TabLabel VARCHAR(255), @InfoTag VARCHAR(255)=NULL, @InfoSubtitle VARCHAR(255)=NULL,
    @CardHeading VARCHAR(255)=NULL, @CardDesc NVARCHAR(MAX)=NULL, @ImageUrl VARCHAR(MAX)=NULL,
    @VideoUrl VARCHAR(MAX)=NULL, @Points NVARCHAR(MAX)=NULL, @SortOrder INT=0, @IsActive BIT=1
AS BEGIN
    SET NOCOUNT ON;
    UPDATE AchieveGoalsTabs SET TabLabel=@TabLabel,InfoTag=@InfoTag,InfoSubtitle=@InfoSubtitle,
        CardHeading=@CardHeading,CardDesc=@CardDesc,ImageUrl=@ImageUrl,VideoUrl=@VideoUrl,
        Points=@Points,SortOrder=@SortOrder,IsActive=@IsActive,UpdatedAt=GETDATE() WHERE Id=@Id;
END;
GO
CREATE PROCEDURE sp_DeleteAchieveGoalsTab @Id INT
AS BEGIN SET NOCOUNT ON; DELETE FROM AchieveGoalsTabs WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_ToggleAchieveGoalsTab @Id INT
AS BEGIN
    SET NOCOUNT ON;
    UPDATE AchieveGoalsTabs SET IsActive=CASE WHEN IsActive=1 THEN 0 ELSE 1 END WHERE Id=@Id;
    SELECT IsActive FROM AchieveGoalsTabs WHERE Id=@Id;
END;
GO
-- ── Awards Section SPs ───────────────────────────────────────
CREATE PROCEDURE sp_GetAwardsSectionConfig
AS BEGIN SET NOCOUNT ON; SELECT TOP 1 * FROM AwardsSectionConfig ORDER BY Id; END;
GO
CREATE PROCEDURE sp_UpsertAwardsSectionConfig
    @HeadingNormal NVARCHAR(200), @HeadingOrange NVARCHAR(200), @MainImage NVARCHAR(MAX),
    @SupportHeadingBold NVARCHAR(200), @SupportHeadingNormal NVARCHAR(200),
    @SupportDesc NVARCHAR(500), @SupportCard1Image NVARCHAR(MAX), @SupportCard2Image NVARCHAR(MAX), @IsActive BIT
AS BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM AwardsSectionConfig)
        UPDATE AwardsSectionConfig SET HeadingNormal=@HeadingNormal,HeadingOrange=@HeadingOrange,
            MainImage=@MainImage,SupportHeadingBold=@SupportHeadingBold,SupportHeadingNormal=@SupportHeadingNormal,
            SupportDesc=@SupportDesc,SupportCard1Image=@SupportCard1Image,SupportCard2Image=@SupportCard2Image,
            IsActive=@IsActive,UpdatedAt=GETDATE();
    ELSE INSERT INTO AwardsSectionConfig (HeadingNormal,HeadingOrange,MainImage,SupportHeadingBold,SupportHeadingNormal,SupportDesc,SupportCard1Image,SupportCard2Image,IsActive)
        VALUES (@HeadingNormal,@HeadingOrange,@MainImage,@SupportHeadingBold,@SupportHeadingNormal,@SupportDesc,@SupportCard1Image,@SupportCard2Image,@IsActive);
    SELECT TOP 1 * FROM AwardsSectionConfig ORDER BY Id;
END;
GO
CREATE PROCEDURE sp_GetAwardCards @ShowAll BIT=0
AS BEGIN SET NOCOUNT ON; IF @ShowAll=1 SELECT * FROM AwardCards ORDER BY SortOrder,Id; ELSE SELECT * FROM AwardCards WHERE IsActive=1 ORDER BY SortOrder,Id; END;
GO
CREATE PROCEDURE sp_GetAwardCardById @Id INT
AS BEGIN SET NOCOUNT ON; SELECT * FROM AwardCards WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_AddAwardCard
    @CardImage NVARCHAR(MAX), @DataText NVARCHAR(300), @Title NVARCHAR(300),
    @Description NVARCHAR(MAX), @SortOrder INT, @IsActive BIT
AS BEGIN
    SET NOCOUNT ON;
    INSERT INTO AwardCards (CardImage,DataText,Title,Description,SortOrder,IsActive)
    VALUES (@CardImage,@DataText,@Title,@Description,@SortOrder,@IsActive);
    SELECT SCOPE_IDENTITY() AS Id;
END;
GO
CREATE PROCEDURE sp_UpdateAwardCard
    @Id INT, @CardImage NVARCHAR(MAX), @DataText NVARCHAR(300), @Title NVARCHAR(300),
    @Description NVARCHAR(MAX), @SortOrder INT, @IsActive BIT
AS BEGIN
    SET NOCOUNT ON;
    UPDATE AwardCards SET CardImage=@CardImage,DataText=@DataText,Title=@Title,
        Description=@Description,SortOrder=@SortOrder,IsActive=@IsActive WHERE Id=@Id;
END;
GO
CREATE PROCEDURE sp_DeleteAwardCard @Id INT
AS BEGIN SET NOCOUNT ON; DELETE FROM AwardCards WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_ToggleAwardCard @Id INT
AS BEGIN
    SET NOCOUNT ON;
    UPDATE AwardCards SET IsActive=CASE WHEN IsActive=1 THEN 0 ELSE 1 END WHERE Id=@Id;
    SELECT IsActive FROM AwardCards WHERE Id=@Id;
END;
GO

-- ── Course Instructors SPs ────────────────────────────────────
CREATE PROCEDURE sp_GetCourseInstructorSettings
AS BEGIN SET NOCOUNT ON; SELECT * FROM CourseInstructorSettings WHERE Id=1; END;
GO
CREATE PROCEDURE sp_SaveCourseInstructorSettings
    @HeadingNormal VARCHAR(200)=NULL, @HeadingOrange VARCHAR(200)=NULL, @Subtitle VARCHAR(300)=NULL
AS BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM CourseInstructorSettings WHERE Id=1)
        UPDATE CourseInstructorSettings SET HeadingNormal=@HeadingNormal,HeadingOrange=@HeadingOrange,Subtitle=@Subtitle,UpdatedAt=GETDATE() WHERE Id=1;
    ELSE INSERT INTO CourseInstructorSettings (Id,HeadingNormal,HeadingOrange,Subtitle) VALUES (1,@HeadingNormal,@HeadingOrange,@Subtitle);
    SELECT * FROM CourseInstructorSettings WHERE Id=1;
END;
GO
CREATE PROCEDURE sp_GetCourseInstructorTabs @ShowAll BIT=0
AS BEGIN
    SET NOCOUNT ON;
    IF @ShowAll=1 SELECT * FROM CourseInstructorTabs ORDER BY SortOrder ASC,Id ASC;
    ELSE SELECT * FROM CourseInstructorTabs WHERE IsActive=1 ORDER BY SortOrder ASC,Id ASC;
END;
GO
CREATE PROCEDURE sp_AddCourseInstructorTab
    @TabName VARCHAR(150), @SortOrder INT=0, @IsActive BIT=1
AS BEGIN SET NOCOUNT ON; INSERT INTO CourseInstructorTabs (TabName,SortOrder,IsActive) VALUES (@TabName,@SortOrder,@IsActive); SELECT SCOPE_IDENTITY() AS Id; END;
GO
CREATE PROCEDURE sp_UpdateCourseInstructorTab
    @Id INT, @TabName VARCHAR(150), @SortOrder INT=0, @IsActive BIT=1
AS BEGIN SET NOCOUNT ON; UPDATE CourseInstructorTabs SET TabName=@TabName,SortOrder=@SortOrder,IsActive=@IsActive WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_DeleteCourseInstructorTab @Id INT
AS BEGIN SET NOCOUNT ON; DELETE FROM CourseInstructorTabs WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_ToggleCourseInstructorTab @Id INT
AS BEGIN
    SET NOCOUNT ON;
    UPDATE CourseInstructorTabs SET IsActive=CASE WHEN IsActive=1 THEN 0 ELSE 1 END WHERE Id=@Id;
    SELECT IsActive FROM CourseInstructorTabs WHERE Id=@Id;
END;
GO
CREATE PROCEDURE sp_GetCourseInstructorCards @TabId INT, @ShowAll BIT=0
AS BEGIN
    SET NOCOUNT ON;
    IF @ShowAll=1 SELECT * FROM CourseInstructorCards WHERE TabId=@TabId ORDER BY SortOrder ASC,Id ASC;
    ELSE SELECT * FROM CourseInstructorCards WHERE TabId=@TabId AND IsActive=1 ORDER BY SortOrder ASC,Id ASC;
END;
GO
CREATE PROCEDURE sp_AddCourseInstructorCard
    @TabId INT, @Name VARCHAR(150), @Role VARCHAR(200)=NULL, @Photo VARCHAR(MAX)=NULL,
    @LinkedinUrl VARCHAR(300)=NULL, @CardBg VARCHAR(20)='card-bg-1', @SortOrder INT=0, @IsActive BIT=1
AS BEGIN
    SET NOCOUNT ON;
    INSERT INTO CourseInstructorCards (TabId,Name,Role,Photo,LinkedinUrl,CardBg,SortOrder,IsActive)
    VALUES (@TabId,@Name,@Role,@Photo,@LinkedinUrl,@CardBg,@SortOrder,@IsActive);
    SELECT SCOPE_IDENTITY() AS Id;
END;
GO
CREATE PROCEDURE sp_UpdateCourseInstructorCard
    @Id INT, @Name VARCHAR(150), @Role VARCHAR(200)=NULL, @Photo VARCHAR(MAX)=NULL,
    @LinkedinUrl VARCHAR(300)=NULL, @CardBg VARCHAR(20)='card-bg-1', @SortOrder INT=0, @IsActive BIT=1
AS BEGIN
    SET NOCOUNT ON;
    UPDATE CourseInstructorCards SET Name=@Name,Role=@Role,Photo=ISNULL(@Photo,Photo),
        LinkedinUrl=@LinkedinUrl,CardBg=@CardBg,SortOrder=@SortOrder,IsActive=@IsActive,UpdatedAt=GETDATE() WHERE Id=@Id;
END;
GO
CREATE PROCEDURE sp_DeleteCourseInstructorCard @Id INT
AS BEGIN SET NOCOUNT ON; DELETE FROM CourseInstructorCards WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_ToggleCourseInstructorCard @Id INT
AS BEGIN
    SET NOCOUNT ON;
    UPDATE CourseInstructorCards SET IsActive=CASE WHEN IsActive=1 THEN 0 ELSE 1 END WHERE Id=@Id;
    SELECT IsActive FROM CourseInstructorCards WHERE Id=@Id;
END;
GO
CREATE PROCEDURE sp_GetAllCourseInstructors
AS BEGIN
    SET NOCOUNT ON;
    SELECT * FROM CourseInstructorTabs WHERE IsActive=1 ORDER BY SortOrder ASC,Id ASC;
    SELECT * FROM CourseInstructorCards WHERE IsActive=1 ORDER BY TabId ASC,SortOrder ASC,Id ASC;
END;
GO
-- ── Course Overview SPs ──────────────────────────────────────
CREATE PROCEDURE sp_GetCourseOverviewSettings
AS BEGIN SET NOCOUNT ON; SELECT * FROM CourseOverviewSettings WHERE Id=1; END;
GO
CREATE PROCEDURE sp_SaveCourseOverviewSettings
    @HeadingNormal VARCHAR(255)=NULL, @HeadingOrange VARCHAR(255)=NULL, @MainDesc NVARCHAR(MAX)=NULL
AS BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM CourseOverviewSettings WHERE Id=1)
        UPDATE CourseOverviewSettings SET HeadingNormal=@HeadingNormal,HeadingOrange=@HeadingOrange,MainDesc=@MainDesc,UpdatedAt=GETDATE() WHERE Id=1;
    ELSE INSERT INTO CourseOverviewSettings (Id,HeadingNormal,HeadingOrange,MainDesc) VALUES (1,@HeadingNormal,@HeadingOrange,@MainDesc);
    SELECT * FROM CourseOverviewSettings WHERE Id=1;
END;
GO
CREATE PROCEDURE sp_GetCourseOverviewSections @ShowAll BIT=0
AS BEGIN
    SET NOCOUNT ON;
    IF @ShowAll=1 SELECT * FROM CourseOverviewSections ORDER BY SortOrder ASC,Id ASC;
    ELSE SELECT * FROM CourseOverviewSections WHERE IsActive=1 ORDER BY SortOrder ASC,Id ASC;
END;
GO
CREATE PROCEDURE sp_GetCourseOverviewAllData
AS BEGIN
    SET NOCOUNT ON;
    SELECT * FROM CourseOverviewSettings WHERE Id=1;
    SELECT * FROM CourseOverviewSections WHERE IsActive=1 ORDER BY SortOrder ASC,Id ASC;
END;
GO
CREATE PROCEDURE sp_AddCourseOverviewSection
    @Title VARCHAR(255), @SectionType VARCHAR(20)='text', @Paragraphs NVARCHAR(MAX)=NULL,
    @Subtitle VARCHAR(MAX)=NULL, @BulletPoints NVARCHAR(MAX)=NULL, @SortOrder INT=0, @IsActive BIT=1
AS BEGIN
    SET NOCOUNT ON;
    INSERT INTO CourseOverviewSections (Title,SectionType,Paragraphs,Subtitle,BulletPoints,SortOrder,IsActive)
    VALUES (@Title,@SectionType,@Paragraphs,@Subtitle,@BulletPoints,@SortOrder,@IsActive);
    SELECT SCOPE_IDENTITY() AS Id;
END;
GO
CREATE PROCEDURE sp_UpdateCourseOverviewSection
    @Id INT, @Title VARCHAR(255), @SectionType VARCHAR(20)='text', @Paragraphs NVARCHAR(MAX)=NULL,
    @Subtitle VARCHAR(MAX)=NULL, @BulletPoints NVARCHAR(MAX)=NULL, @SortOrder INT=0, @IsActive BIT=1
AS BEGIN
    SET NOCOUNT ON;
    UPDATE CourseOverviewSections SET Title=@Title,SectionType=@SectionType,Paragraphs=@Paragraphs,
        Subtitle=@Subtitle,BulletPoints=@BulletPoints,SortOrder=@SortOrder,IsActive=@IsActive,UpdatedAt=GETDATE() WHERE Id=@Id;
END;
GO
CREATE PROCEDURE sp_DeleteCourseOverviewSection @Id INT
AS BEGIN SET NOCOUNT ON; DELETE FROM CourseOverviewSections WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_ToggleCourseOverviewSection @Id INT
AS BEGIN
    SET NOCOUNT ON;
    UPDATE CourseOverviewSections SET IsActive=CASE WHEN IsActive=1 THEN 0 ELSE 1 END WHERE Id=@Id;
    SELECT IsActive FROM CourseOverviewSections WHERE Id=@Id;
END;
GO

-- ── Course Projects SPs ───────────────────────────────────────
CREATE PROCEDURE sp_GetCourseProjectSettings
AS BEGIN SET NOCOUNT ON; SELECT * FROM CourseProjectSettings WHERE Id=1; END;
GO
CREATE PROCEDURE sp_SaveCourseProjectSettings
    @HeadingLine1 VARCHAR(255)=NULL, @HeadingLine2 VARCHAR(255)=NULL,
    @HeadingLine3 VARCHAR(255)=NULL, @BadgeText VARCHAR(100)=NULL
AS BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM CourseProjectSettings WHERE Id=1)
        UPDATE CourseProjectSettings SET HeadingLine1=@HeadingLine1,HeadingLine2=@HeadingLine2,HeadingLine3=@HeadingLine3,BadgeText=@BadgeText,UpdatedAt=GETDATE() WHERE Id=1;
    ELSE INSERT INTO CourseProjectSettings (Id,HeadingLine1,HeadingLine2,HeadingLine3,BadgeText) VALUES (1,@HeadingLine1,@HeadingLine2,@HeadingLine3,@BadgeText);
    SELECT * FROM CourseProjectSettings WHERE Id=1;
END;
GO
CREATE PROCEDURE sp_GetCourseProjects @ShowAll BIT=0
AS BEGIN
    SET NOCOUNT ON;
    IF @ShowAll=1 SELECT * FROM CourseProjects ORDER BY SortOrder ASC,Id ASC;
    ELSE SELECT * FROM CourseProjects WHERE IsActive=1 ORDER BY SortOrder ASC,Id ASC;
END;
GO
CREATE PROCEDURE sp_AddCourseProject
    @Title VARCHAR(255), @Description NVARCHAR(MAX)=NULL, @IconUrl VARCHAR(MAX)=NULL,
    @Skills NVARCHAR(MAX)=NULL, @SortOrder INT=0, @IsActive BIT=1
AS BEGIN
    SET NOCOUNT ON;
    INSERT INTO CourseProjects (Title,Description,IconUrl,Skills,SortOrder,IsActive)
    VALUES (@Title,@Description,@IconUrl,@Skills,@SortOrder,@IsActive);
    SELECT SCOPE_IDENTITY() AS Id;
END;
GO
CREATE PROCEDURE sp_UpdateCourseProject
    @Id INT, @Title VARCHAR(255), @Description NVARCHAR(MAX)=NULL, @IconUrl VARCHAR(MAX)=NULL,
    @Skills NVARCHAR(MAX)=NULL, @SortOrder INT=0, @IsActive BIT=1
AS BEGIN
    SET NOCOUNT ON;
    UPDATE CourseProjects SET Title=@Title,Description=@Description,IconUrl=@IconUrl,
        Skills=@Skills,SortOrder=@SortOrder,IsActive=@IsActive,UpdatedAt=GETDATE() WHERE Id=@Id;
END;
GO
CREATE PROCEDURE sp_DeleteCourseProject @Id INT
AS BEGIN SET NOCOUNT ON; DELETE FROM CourseProjects WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_ToggleCourseProject @Id INT
AS BEGIN
    SET NOCOUNT ON;
    UPDATE CourseProjects SET IsActive=CASE WHEN IsActive=1 THEN 0 ELSE 1 END WHERE Id=@Id;
    SELECT IsActive FROM CourseProjects WHERE Id=@Id;
END;
GO
-- ── Curriculum Comparison SPs ─────────────────────────────────
CREATE PROCEDURE sp_GetCurriculumCompSettings
AS BEGIN SET NOCOUNT ON; SELECT * FROM CurriculumCompSettings WHERE Id=1; END;
GO
CREATE PROCEDURE sp_SaveCurriculumCompSettings
    @HeadingNormal VARCHAR(255)=NULL, @HeadingOrange VARCHAR(255)=NULL, @TabsJson NVARCHAR(MAX)=NULL
AS BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM CurriculumCompSettings WHERE Id=1)
        UPDATE CurriculumCompSettings SET HeadingNormal=@HeadingNormal,HeadingOrange=@HeadingOrange,TabsJson=@TabsJson,UpdatedAt=GETDATE() WHERE Id=1;
    ELSE INSERT INTO CurriculumCompSettings (Id,HeadingNormal,HeadingOrange,TabsJson) VALUES (1,@HeadingNormal,@HeadingOrange,@TabsJson);
    SELECT * FROM CurriculumCompSettings WHERE Id=1;
END;
GO
CREATE PROCEDURE sp_GetCurriculumCompCards @ShowAll BIT=0
AS BEGIN
    SET NOCOUNT ON;
    IF @ShowAll=1 SELECT * FROM CurriculumCompCards ORDER BY TabKey ASC,Part ASC,SortOrder ASC,Id ASC;
    ELSE SELECT * FROM CurriculumCompCards WHERE IsActive=1 ORDER BY TabKey ASC,Part ASC,SortOrder ASC,Id ASC;
END;
GO
CREATE PROCEDURE sp_GetCurriculumCompAllData
AS BEGIN
    SET NOCOUNT ON;
    SELECT * FROM CurriculumCompSettings WHERE Id=1;
    SELECT * FROM CurriculumCompCards WHERE IsActive=1 ORDER BY TabKey ASC,Part ASC,SortOrder ASC,Id ASC;
END;
GO
CREATE PROCEDURE sp_AddCurriculumCompCard
    @TabKey VARCHAR(100), @Part VARCHAR(10), @PartTitle VARCHAR(255)=NULL, @PartBadge VARCHAR(255)=NULL,
    @Title VARCHAR(255), @Descr NVARCHAR(MAX)=NULL, @Hours VARCHAR(100)=NULL, @Projects VARCHAR(100)=NULL,
    @Extra VARCHAR(100)=NULL, @IconUrl VARCHAR(MAX)=NULL, @SortOrder INT=0, @IsActive BIT=1
AS BEGIN
    SET NOCOUNT ON;
    INSERT INTO CurriculumCompCards (TabKey,Part,PartTitle,PartBadge,Title,Descr,Hours,Projects,Extra,IconUrl,SortOrder,IsActive)
    VALUES (@TabKey,@Part,@PartTitle,@PartBadge,@Title,@Descr,@Hours,@Projects,@Extra,@IconUrl,@SortOrder,@IsActive);
    SELECT SCOPE_IDENTITY() AS Id;
END;
GO
CREATE PROCEDURE sp_UpdateCurriculumCompCard
    @Id INT, @TabKey VARCHAR(100), @Part VARCHAR(10), @PartTitle VARCHAR(255)=NULL, @PartBadge VARCHAR(255)=NULL,
    @Title VARCHAR(255), @Descr NVARCHAR(MAX)=NULL, @Hours VARCHAR(100)=NULL, @Projects VARCHAR(100)=NULL,
    @Extra VARCHAR(100)=NULL, @IconUrl VARCHAR(MAX)=NULL, @SortOrder INT=0, @IsActive BIT=1
AS BEGIN
    SET NOCOUNT ON;
    UPDATE CurriculumCompCards SET TabKey=@TabKey,Part=@Part,PartTitle=@PartTitle,PartBadge=@PartBadge,
        Title=@Title,Descr=@Descr,Hours=@Hours,Projects=@Projects,Extra=@Extra,IconUrl=@IconUrl,
        SortOrder=@SortOrder,IsActive=@IsActive,UpdatedAt=GETDATE() WHERE Id=@Id;
END;
GO
CREATE PROCEDURE sp_DeleteCurriculumCompCard @Id INT
AS BEGIN SET NOCOUNT ON; DELETE FROM CurriculumCompCards WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_ToggleCurriculumCompCard @Id INT
AS BEGIN
    SET NOCOUNT ON;
    UPDATE CurriculumCompCards SET IsActive=CASE WHEN IsActive=1 THEN 0 ELSE 1 END WHERE Id=@Id;
    SELECT IsActive FROM CurriculumCompCards WHERE Id=@Id;
END;
GO

-- ── Curriculum SPs ────────────────────────────────────────────
CREATE PROCEDURE sp_GetCurriculumSettings
AS BEGIN SET NOCOUNT ON; SELECT * FROM CurriculumSettings WHERE Id=1; END;
GO
CREATE PROCEDURE sp_SaveCurriculumSettings
    @HeadingLine1 VARCHAR(255)=NULL, @HeadingLine2 VARCHAR(255)=NULL, @BrochureUrl VARCHAR(MAX)=NULL
AS BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM CurriculumSettings WHERE Id=1)
        UPDATE CurriculumSettings SET HeadingLine1=@HeadingLine1,HeadingLine2=@HeadingLine2,BrochureUrl=@BrochureUrl,UpdatedAt=GETDATE() WHERE Id=1;
    ELSE INSERT INTO CurriculumSettings (Id,HeadingLine1,HeadingLine2,BrochureUrl) VALUES (1,@HeadingLine1,@HeadingLine2,@BrochureUrl);
    SELECT * FROM CurriculumSettings WHERE Id=1;
END;
GO
CREATE PROCEDURE sp_GetCurriculumCards @ShowAll BIT=0
AS BEGIN
    SET NOCOUNT ON;
    IF @ShowAll=1 SELECT * FROM CurriculumCards ORDER BY SortOrder ASC,Id ASC;
    ELSE SELECT * FROM CurriculumCards WHERE IsActive=1 ORDER BY SortOrder ASC,Id ASC;
END;
GO
CREATE PROCEDURE sp_AddCurriculumCard
    @Title VARCHAR(255), @Points NVARCHAR(MAX), @CardColor VARCHAR(20)='white', @SortOrder INT=0, @IsActive BIT=1
AS BEGIN
    SET NOCOUNT ON;
    INSERT INTO CurriculumCards (Title,Points,CardColor,SortOrder,IsActive) VALUES (@Title,@Points,@CardColor,@SortOrder,@IsActive);
    SELECT SCOPE_IDENTITY() AS Id;
END;
GO
CREATE PROCEDURE sp_UpdateCurriculumCard
    @Id INT, @Title VARCHAR(255), @Points NVARCHAR(MAX), @CardColor VARCHAR(20)='white', @SortOrder INT=0, @IsActive BIT=1
AS BEGIN
    SET NOCOUNT ON;
    UPDATE CurriculumCards SET Title=@Title,Points=@Points,CardColor=@CardColor,SortOrder=@SortOrder,IsActive=@IsActive,UpdatedAt=GETDATE() WHERE Id=@Id;
END;
GO
CREATE PROCEDURE sp_DeleteCurriculumCard @Id INT
AS BEGIN SET NOCOUNT ON; DELETE FROM CurriculumCards WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_ToggleCurriculumCard @Id INT
AS BEGIN
    SET NOCOUNT ON;
    UPDATE CurriculumCards SET IsActive=CASE WHEN IsActive=1 THEN 0 ELSE 1 END WHERE Id=@Id;
    SELECT IsActive FROM CurriculumCards WHERE Id=@Id;
END;
GO

-- ── FAQ SPs ───────────────────────────────────────────────────
CREATE PROCEDURE sp_GetFaqSettings
AS BEGIN SET NOCOUNT ON; SELECT * FROM FaqSettings WHERE Id=1; END;
GO
CREATE PROCEDURE sp_SaveFaqSettings
    @HeadingNormal VARCHAR(255)=NULL, @HeadingOrange VARCHAR(255)=NULL
AS BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM FaqSettings WHERE Id=1)
        UPDATE FaqSettings SET HeadingNormal=@HeadingNormal,HeadingOrange=@HeadingOrange,UpdatedAt=GETDATE() WHERE Id=1;
    ELSE INSERT INTO FaqSettings (Id,HeadingNormal,HeadingOrange) VALUES (1,@HeadingNormal,@HeadingOrange);
    SELECT * FROM FaqSettings WHERE Id=1;
END;
GO
CREATE PROCEDURE sp_GetFaqItems @ShowAll BIT=0
AS BEGIN
    SET NOCOUNT ON;
    IF @ShowAll=1 SELECT * FROM FaqItems ORDER BY SortOrder ASC,Id ASC;
    ELSE SELECT * FROM FaqItems WHERE IsActive=1 ORDER BY SortOrder ASC,Id ASC;
END;
GO
CREATE PROCEDURE sp_GetFaqAllData
AS BEGIN
    SET NOCOUNT ON;
    SELECT * FROM FaqSettings WHERE Id=1;
    SELECT * FROM FaqItems WHERE IsActive=1 ORDER BY SortOrder ASC,Id ASC;
END;
GO
CREATE PROCEDURE sp_AddFaqItem
    @Question NVARCHAR(MAX), @Answer NVARCHAR(MAX)=NULL, @SubHeading VARCHAR(500)=NULL,
    @IntroText NVARCHAR(MAX)=NULL, @BulletPoints NVARCHAR(MAX)=NULL, @OutroText NVARCHAR(MAX)=NULL,
    @ExampleHeading VARCHAR(500)=NULL, @Examples NVARCHAR(MAX)=NULL, @SortOrder INT=0, @IsActive BIT=1
AS BEGIN
    SET NOCOUNT ON;
    INSERT INTO FaqItems (Question,Answer,SubHeading,IntroText,BulletPoints,OutroText,ExampleHeading,Examples,SortOrder,IsActive)
    VALUES (@Question,@Answer,@SubHeading,@IntroText,@BulletPoints,@OutroText,@ExampleHeading,@Examples,@SortOrder,@IsActive);
    SELECT SCOPE_IDENTITY() AS Id;
END;
GO
CREATE PROCEDURE sp_UpdateFaqItem
    @Id INT, @Question NVARCHAR(MAX), @Answer NVARCHAR(MAX)=NULL, @SubHeading VARCHAR(500)=NULL,
    @IntroText NVARCHAR(MAX)=NULL, @BulletPoints NVARCHAR(MAX)=NULL, @OutroText NVARCHAR(MAX)=NULL,
    @ExampleHeading VARCHAR(500)=NULL, @Examples NVARCHAR(MAX)=NULL, @SortOrder INT=0, @IsActive BIT=1
AS BEGIN
    SET NOCOUNT ON;
    UPDATE FaqItems SET Question=@Question,Answer=@Answer,SubHeading=@SubHeading,IntroText=@IntroText,
        BulletPoints=@BulletPoints,OutroText=@OutroText,ExampleHeading=@ExampleHeading,Examples=@Examples,
        SortOrder=@SortOrder,IsActive=@IsActive,UpdatedAt=GETDATE() WHERE Id=@Id;
END;
GO
CREATE PROCEDURE sp_DeleteFaqItem @Id INT
AS BEGIN SET NOCOUNT ON; DELETE FROM FaqItems WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_ToggleFaqItem @Id INT
AS BEGIN
    SET NOCOUNT ON;
    UPDATE FaqItems SET IsActive=CASE WHEN IsActive=1 THEN 0 ELSE 1 END WHERE Id=@Id;
    SELECT IsActive FROM FaqItems WHERE Id=@Id;
END;
GO
-- ── Instructors SPs ──────────────────────────────────────────
CREATE PROCEDURE sp_GetInstructorSection
AS BEGIN SET NOCOUNT ON; SELECT TOP 1 * FROM InstructorSection ORDER BY Id; END;
GO
CREATE PROCEDURE sp_UpsertInstructorSection
    @TagText VARCHAR(100)=NULL, @HeadingNormal VARCHAR(200)=NULL, @HeadingOrange VARCHAR(200)=NULL,
    @ViewAllText VARCHAR(100)=NULL, @ViewAllLink VARCHAR(300)=NULL
AS BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM InstructorSection)
        UPDATE TOP(1) InstructorSection SET TagText=@TagText,HeadingNormal=@HeadingNormal,HeadingOrange=@HeadingOrange,ViewAllText=@ViewAllText,ViewAllLink=@ViewAllLink,UpdatedAt=GETDATE();
    ELSE INSERT INTO InstructorSection (TagText,HeadingNormal,HeadingOrange,ViewAllText,ViewAllLink) VALUES (@TagText,@HeadingNormal,@HeadingOrange,@ViewAllText,@ViewAllLink);
    SELECT TOP 1 * FROM InstructorSection ORDER BY Id;
END;
GO
CREATE PROCEDURE sp_GetInstructors @ShowAll BIT=0
AS BEGIN
    SET NOCOUNT ON;
    IF @ShowAll=1 SELECT * FROM Instructors ORDER BY SortOrder ASC,Id ASC;
    ELSE SELECT * FROM Instructors WHERE IsActive=1 ORDER BY SortOrder ASC,Id ASC;
END;
GO
CREATE PROCEDURE sp_GetInstructorById @Id INT
AS BEGIN SET NOCOUNT ON; SELECT * FROM Instructors WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_AddInstructor
    @Name VARCHAR(150), @Role VARCHAR(150)=NULL, @Photo VARCHAR(MAX)=NULL, @CompanyLogo VARCHAR(MAX)=NULL,
    @Description NVARCHAR(MAX)=NULL, @CardBg VARCHAR(20)='blue', @FacebookUrl VARCHAR(300)=NULL,
    @TwitterUrl VARCHAR(300)=NULL, @LinkedinUrl VARCHAR(300)=NULL, @YoutubeUrl VARCHAR(300)=NULL,
    @SortOrder INT=0, @IsActive BIT=1
AS BEGIN
    SET NOCOUNT ON;
    INSERT INTO Instructors (Name,Role,Photo,CompanyLogo,Description,CardBg,FacebookUrl,TwitterUrl,LinkedinUrl,YoutubeUrl,SortOrder,IsActive)
    VALUES (@Name,@Role,@Photo,@CompanyLogo,@Description,@CardBg,@FacebookUrl,@TwitterUrl,@LinkedinUrl,@YoutubeUrl,@SortOrder,@IsActive);
    SELECT SCOPE_IDENTITY() AS Id;
END;
GO
CREATE PROCEDURE sp_UpdateInstructor
    @Id INT, @Name VARCHAR(150), @Role VARCHAR(150)=NULL, @Photo VARCHAR(MAX)=NULL, @CompanyLogo VARCHAR(MAX)=NULL,
    @Description NVARCHAR(MAX)=NULL, @CardBg VARCHAR(20)='blue', @FacebookUrl VARCHAR(300)=NULL,
    @TwitterUrl VARCHAR(300)=NULL, @LinkedinUrl VARCHAR(300)=NULL, @YoutubeUrl VARCHAR(300)=NULL,
    @SortOrder INT=0, @IsActive BIT=1
AS BEGIN
    SET NOCOUNT ON;
    UPDATE Instructors SET Name=@Name,Role=@Role,Photo=ISNULL(@Photo,Photo),CompanyLogo=ISNULL(@CompanyLogo,CompanyLogo),
        Description=@Description,CardBg=@CardBg,FacebookUrl=@FacebookUrl,TwitterUrl=@TwitterUrl,
        LinkedinUrl=@LinkedinUrl,YoutubeUrl=@YoutubeUrl,SortOrder=@SortOrder,IsActive=@IsActive,UpdatedAt=GETDATE() WHERE Id=@Id;
END;
GO
CREATE PROCEDURE sp_DeleteInstructor @Id INT
AS BEGIN SET NOCOUNT ON; DELETE FROM Instructors WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_ToggleInstructor @Id INT
AS BEGIN
    SET NOCOUNT ON;
    UPDATE Instructors SET IsActive=CASE WHEN IsActive=1 THEN 0 ELSE 1 END,UpdatedAt=GETDATE() WHERE Id=@Id;
    SELECT IsActive FROM Instructors WHERE Id=@Id;
END;
GO
CREATE PROCEDURE sp_GetAllProgramsHero
AS BEGIN SET NOCOUNT ON; SELECT TOP 1 * FROM AllProgramsHero ORDER BY Id; END;
GO
CREATE PROCEDURE sp_UpsertAllProgramsHero
    @HeadingLine1 VARCHAR(300)=NULL, @HeadingLine2 VARCHAR(300)=NULL, @BgImage VARCHAR(MAX)=NULL
AS BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM AllProgramsHero)
        UPDATE TOP(1) AllProgramsHero SET HeadingLine1=@HeadingLine1,HeadingLine2=@HeadingLine2,BgImage=ISNULL(@BgImage,BgImage),UpdatedAt=GETDATE();
    ELSE INSERT INTO AllProgramsHero (HeadingLine1,HeadingLine2,BgImage) VALUES (@HeadingLine1,@HeadingLine2,@BgImage);
    SELECT TOP 1 * FROM AllProgramsHero ORDER BY Id;
END;
GO

-- ── Skills Comparison SPs ─────────────────────────────────────
CREATE PROCEDURE sp_GetSkillsCompSettings
AS BEGIN SET NOCOUNT ON; SELECT * FROM SkillsCompSettings WHERE Id=1; END;
GO
CREATE PROCEDURE sp_SaveSkillsCompSettings
    @HeadingNormal VARCHAR(255)=NULL, @HeadingOrange VARCHAR(255)=NULL
AS BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM SkillsCompSettings WHERE Id=1)
        UPDATE SkillsCompSettings SET HeadingNormal=@HeadingNormal,HeadingOrange=@HeadingOrange,UpdatedAt=GETDATE() WHERE Id=1;
    ELSE INSERT INTO SkillsCompSettings (Id,HeadingNormal,HeadingOrange) VALUES (1,@HeadingNormal,@HeadingOrange);
    SELECT * FROM SkillsCompSettings WHERE Id=1;
END;
GO
CREATE PROCEDURE sp_GetSkillsCompCards @ShowAll BIT=0
AS BEGIN
    SET NOCOUNT ON;
    IF @ShowAll=1 SELECT * FROM SkillsCompCards ORDER BY SortOrder ASC,Id ASC;
    ELSE SELECT * FROM SkillsCompCards WHERE IsActive=1 ORDER BY SortOrder ASC,Id ASC;
END;
GO
CREATE PROCEDURE sp_GetSkillsCompAllData
AS BEGIN
    SET NOCOUNT ON;
    SELECT * FROM SkillsCompSettings WHERE Id=1;
    SELECT * FROM SkillsCompCards WHERE IsActive=1 ORDER BY SortOrder ASC,Id ASC;
END;
GO
CREATE PROCEDURE sp_AddSkillsCompCard
    @CardTitle VARCHAR(255), @CardSubtitle NVARCHAR(MAX)=NULL, @Skills NVARCHAR(MAX)=NULL, @SortOrder INT=0, @IsActive BIT=1
AS BEGIN
    SET NOCOUNT ON;
    INSERT INTO SkillsCompCards (CardTitle,CardSubtitle,Skills,SortOrder,IsActive) VALUES (@CardTitle,@CardSubtitle,@Skills,@SortOrder,@IsActive);
    SELECT SCOPE_IDENTITY() AS Id;
END;
GO
CREATE PROCEDURE sp_UpdateSkillsCompCard
    @Id INT, @CardTitle VARCHAR(255), @CardSubtitle NVARCHAR(MAX)=NULL, @Skills NVARCHAR(MAX)=NULL, @SortOrder INT=0, @IsActive BIT=1
AS BEGIN
    SET NOCOUNT ON;
    UPDATE SkillsCompCards SET CardTitle=@CardTitle,CardSubtitle=@CardSubtitle,Skills=@Skills,SortOrder=@SortOrder,IsActive=@IsActive,UpdatedAt=GETDATE() WHERE Id=@Id;
END;
GO
CREATE PROCEDURE sp_DeleteSkillsCompCard @Id INT
AS BEGIN SET NOCOUNT ON; DELETE FROM SkillsCompCards WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_ToggleSkillsCompCard @Id INT
AS BEGIN
    SET NOCOUNT ON;
    UPDATE SkillsCompCards SET IsActive=CASE WHEN IsActive=1 THEN 0 ELSE 1 END WHERE Id=@Id;
    SELECT IsActive FROM SkillsCompCards WHERE Id=@Id;
END;
GO
-- ── Subscription Banner SPs ──────────────────────────────────
CREATE PROCEDURE sp_GetSubscriptionBanner
AS BEGIN SET NOCOUNT ON; SELECT TOP 1 * FROM SubscriptionBanner ORDER BY Id; END;
GO
CREATE PROCEDURE sp_UpsertSubscriptionBanner
    @Heading NVARCHAR(300)=NULL, @Description NVARCHAR(MAX)=NULL,
    @Feature1Label VARCHAR(150)=NULL, @Feature1Icon VARCHAR(50)=NULL, @Feature1Color VARCHAR(20)=NULL,
    @Feature2Label VARCHAR(150)=NULL, @Feature2Icon VARCHAR(50)=NULL, @Feature2Color VARCHAR(20)=NULL,
    @Feature3Label VARCHAR(150)=NULL, @Feature3Icon VARCHAR(50)=NULL, @Feature3Color VARCHAR(20)=NULL,
    @Feature4Label VARCHAR(150)=NULL, @Feature4Icon VARCHAR(50)=NULL, @Feature4Color VARCHAR(20)=NULL,
    @BtnText VARCHAR(100)=NULL, @BtnLink VARCHAR(300)=NULL, @Image VARCHAR(MAX)=NULL, @IsActive BIT=1
AS BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM SubscriptionBanner)
        UPDATE TOP(1) SubscriptionBanner SET Heading=@Heading,Description=@Description,
            Feature1Label=@Feature1Label,Feature1Icon=@Feature1Icon,Feature1Color=@Feature1Color,
            Feature2Label=@Feature2Label,Feature2Icon=@Feature2Icon,Feature2Color=@Feature2Color,
            Feature3Label=@Feature3Label,Feature3Icon=@Feature3Icon,Feature3Color=@Feature3Color,
            Feature4Label=@Feature4Label,Feature4Icon=@Feature4Icon,Feature4Color=@Feature4Color,
            BtnText=@BtnText,BtnLink=@BtnLink,Image=ISNULL(@Image,Image),IsActive=@IsActive,UpdatedAt=GETDATE();
    ELSE INSERT INTO SubscriptionBanner (Heading,Description,Feature1Label,Feature1Icon,Feature1Color,Feature2Label,Feature2Icon,Feature2Color,Feature3Label,Feature3Icon,Feature3Color,Feature4Label,Feature4Icon,Feature4Color,BtnText,BtnLink,Image,IsActive)
        VALUES (@Heading,@Description,@Feature1Label,@Feature1Icon,@Feature1Color,@Feature2Label,@Feature2Icon,@Feature2Color,@Feature3Label,@Feature3Icon,@Feature3Color,@Feature4Label,@Feature4Icon,@Feature4Color,@BtnText,@BtnLink,@Image,@IsActive);
    SELECT TOP 1 * FROM SubscriptionBanner ORDER BY Id;
END;
GO

-- ── Success Section SPs ───────────────────────────────────────
CREATE PROCEDURE sp_GetSuccessSectionConfig
AS BEGIN SET NOCOUNT ON; SELECT TOP 1 * FROM SuccessSectionConfig ORDER BY Id; END;
GO
CREATE PROCEDURE sp_UpsertSuccessSectionConfig
    @TagText NVARCHAR(150), @HeadingNormal NVARCHAR(300), @HeadingOrange NVARCHAR(300),
    @Stat1Value NVARCHAR(100), @Stat1Label NVARCHAR(150), @Stat2Value NVARCHAR(100), @Stat2Label NVARCHAR(150),
    @Stat3Value NVARCHAR(100), @Stat3Label NVARCHAR(150), @Stat4Value NVARCHAR(100), @Stat4Label NVARCHAR(150),
    @BannerTopLabel NVARCHAR(200), @BannerHeading NVARCHAR(500), @BannerDesc NVARCHAR(MAX),
    @BannerBtnText NVARCHAR(100), @BannerBtnLink NVARCHAR(500), @LearnerImages NVARCHAR(MAX), @IsActive BIT
AS BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM SuccessSectionConfig)
        UPDATE SuccessSectionConfig SET TagText=@TagText,HeadingNormal=@HeadingNormal,HeadingOrange=@HeadingOrange,
            Stat1Value=@Stat1Value,Stat1Label=@Stat1Label,Stat2Value=@Stat2Value,Stat2Label=@Stat2Label,
            Stat3Value=@Stat3Value,Stat3Label=@Stat3Label,Stat4Value=@Stat4Value,Stat4Label=@Stat4Label,
            BannerTopLabel=@BannerTopLabel,BannerHeading=@BannerHeading,BannerDesc=@BannerDesc,
            BannerBtnText=@BannerBtnText,BannerBtnLink=@BannerBtnLink,LearnerImages=@LearnerImages,IsActive=@IsActive,UpdatedAt=GETDATE();
    ELSE INSERT INTO SuccessSectionConfig (TagText,HeadingNormal,HeadingOrange,Stat1Value,Stat1Label,Stat2Value,Stat2Label,Stat3Value,Stat3Label,Stat4Value,Stat4Label,BannerTopLabel,BannerHeading,BannerDesc,BannerBtnText,BannerBtnLink,LearnerImages,IsActive)
        VALUES (@TagText,@HeadingNormal,@HeadingOrange,@Stat1Value,@Stat1Label,@Stat2Value,@Stat2Label,@Stat3Value,@Stat3Label,@Stat4Value,@Stat4Label,@BannerTopLabel,@BannerHeading,@BannerDesc,@BannerBtnText,@BannerBtnLink,@LearnerImages,@IsActive);
    SELECT TOP 1 * FROM SuccessSectionConfig ORDER BY Id;
END;
GO
CREATE PROCEDURE sp_GetSuccessStories @ShowAll BIT=0
AS BEGIN SET NOCOUNT ON; IF @ShowAll=1 SELECT * FROM SuccessStories ORDER BY SortOrder,Id; ELSE SELECT * FROM SuccessStories WHERE IsActive=1 ORDER BY SortOrder,Id; END;
GO
CREATE PROCEDURE sp_GetSuccessStoryById @Id INT
AS BEGIN SET NOCOUNT ON; SELECT * FROM SuccessStories WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_AddSuccessStory
    @Quote NVARCHAR(500), @DescStrong NVARCHAR(200), @DescRest NVARCHAR(MAX), @Name NVARCHAR(150),
    @Program NVARCHAR(300), @RoleText NVARCHAR(200), @Image NVARCHAR(MAX), @VideoLink NVARCHAR(500),
    @SortOrder INT, @IsActive BIT
AS BEGIN
    SET NOCOUNT ON;
    INSERT INTO SuccessStories (Quote,DescStrong,DescRest,Name,Program,RoleText,Image,VideoLink,SortOrder,IsActive)
    VALUES (@Quote,@DescStrong,@DescRest,@Name,@Program,@RoleText,@Image,@VideoLink,@SortOrder,@IsActive);
    SELECT SCOPE_IDENTITY() AS Id;
END;
GO
CREATE PROCEDURE sp_UpdateSuccessStory
    @Id INT, @Quote NVARCHAR(500), @DescStrong NVARCHAR(200), @DescRest NVARCHAR(MAX), @Name NVARCHAR(150),
    @Program NVARCHAR(300), @RoleText NVARCHAR(200), @Image NVARCHAR(MAX), @VideoLink NVARCHAR(500),
    @SortOrder INT, @IsActive BIT
AS BEGIN
    SET NOCOUNT ON;
    UPDATE SuccessStories SET Quote=@Quote,DescStrong=@DescStrong,DescRest=@DescRest,Name=@Name,
        Program=@Program,RoleText=@RoleText,Image=@Image,VideoLink=@VideoLink,SortOrder=@SortOrder,IsActive=@IsActive WHERE Id=@Id;
END;
GO
CREATE PROCEDURE sp_DeleteSuccessStory @Id INT
AS BEGIN SET NOCOUNT ON; DELETE FROM SuccessStories WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_ToggleSuccessStory @Id INT
AS BEGIN
    SET NOCOUNT ON;
    UPDATE SuccessStories SET IsActive=CASE WHEN IsActive=1 THEN 0 ELSE 1 END WHERE Id=@Id;
    SELECT IsActive FROM SuccessStories WHERE Id=@Id;
END;
GO

-- ── Tools & Technologies SPs ──────────────────────────────────
CREATE PROCEDURE sp_GetToolsSettings
AS BEGIN SET NOCOUNT ON; SELECT * FROM ToolsSettings WHERE Id=1; END;
GO
CREATE PROCEDURE sp_SaveToolsSettings
    @HeadingNormal VARCHAR(200)=NULL, @HeadingOrange VARCHAR(200)=NULL
AS BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM ToolsSettings WHERE Id=1)
        UPDATE ToolsSettings SET HeadingNormal=@HeadingNormal,HeadingOrange=@HeadingOrange,UpdatedAt=GETDATE() WHERE Id=1;
    ELSE INSERT INTO ToolsSettings (Id,HeadingNormal,HeadingOrange) VALUES (1,@HeadingNormal,@HeadingOrange);
    SELECT * FROM ToolsSettings WHERE Id=1;
END;
GO
CREATE PROCEDURE sp_GetTools @ShowAll BIT=0
AS BEGIN
    SET NOCOUNT ON;
    IF @ShowAll=1 SELECT * FROM Tools ORDER BY SortOrder ASC,Id ASC;
    ELSE SELECT * FROM Tools WHERE IsActive=1 ORDER BY SortOrder ASC,Id ASC;
END;
GO
CREATE PROCEDURE sp_AddTool
    @Name VARCHAR(150), @IconUrl VARCHAR(MAX)=NULL, @SortOrder INT=0, @IsActive BIT=1
AS BEGIN
    SET NOCOUNT ON;
    INSERT INTO Tools (Name,IconUrl,SortOrder,IsActive) VALUES (@Name,@IconUrl,@SortOrder,@IsActive);
    SELECT SCOPE_IDENTITY() AS Id;
END;
GO
CREATE PROCEDURE sp_UpdateTool
    @Id INT, @Name VARCHAR(150), @IconUrl VARCHAR(MAX)=NULL, @SortOrder INT=0, @IsActive BIT=1
AS BEGIN SET NOCOUNT ON; UPDATE Tools SET Name=@Name,IconUrl=@IconUrl,SortOrder=@SortOrder,IsActive=@IsActive,UpdatedAt=GETDATE() WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_DeleteTool @Id INT
AS BEGIN SET NOCOUNT ON; DELETE FROM Tools WHERE Id=@Id; END;
GO
CREATE PROCEDURE sp_ToggleTool @Id INT
AS BEGIN
    SET NOCOUNT ON;
    UPDATE Tools SET IsActive=CASE WHEN IsActive=1 THEN 0 ELSE 1 END WHERE Id=@Id;
    SELECT IsActive FROM Tools WHERE Id=@Id;
END;
GO


-- ============================================================
--  FOOTER  —  Tables + Stored Procedures
-- ============================================================

-- 1. Tables
-- ──────────────────────────────────────────────────────────
IF NOT EXISTS (SELECT 1 FROM sysobjects WHERE name='FooterColumns' AND xtype='U')
CREATE TABLE FooterColumns (
    Id         INT IDENTITY(1,1) PRIMARY KEY,
    Heading    NVARCHAR(200)     NOT NULL,
    SortOrder  INT               DEFAULT 0,
    IsActive   BIT               DEFAULT 1,
    CreatedAt  DATETIME          DEFAULT GETDATE()
);

IF NOT EXISTS (SELECT 1 FROM sysobjects WHERE name='FooterLinks' AND xtype='U')
CREATE TABLE FooterLinks (
    Id           INT IDENTITY(1,1) PRIMARY KEY,
    ColumnId     INT               NOT NULL REFERENCES FooterColumns(Id) ON DELETE CASCADE,
    Title        NVARCHAR(200)     NOT NULL,
    Url          NVARCHAR(500)     NOT NULL,
    NavbarLinkId INT               NULL,   -- NULL = custom link
    SortOrder    INT               DEFAULT 0,
    IsActive     BIT               DEFAULT 1,
    CreatedAt    DATETIME          DEFAULT GETDATE()
);
GO

-- ============================================================
--  sp_GetFooterColumns  (admin — all; public — active only)
-- ============================================================
IF OBJECT_ID('sp_GetFooterColumns','P') IS NOT NULL DROP PROC sp_GetFooterColumns;
GO
CREATE PROCEDURE sp_GetFooterColumns
    @ShowAll BIT = 0
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, Heading, SortOrder, IsActive, CreatedAt
    FROM   FooterColumns
    WHERE  (@ShowAll = 1 OR IsActive = 1)
    ORDER  BY SortOrder, Id;
END
GO

-- ============================================================
--  sp_GetFooterLinks  (by ColumnId; admin = all, public = active)
-- ============================================================
IF OBJECT_ID('sp_GetFooterLinks','P') IS NOT NULL DROP PROC sp_GetFooterLinks;
GO
CREATE PROCEDURE sp_GetFooterLinks
    @ColumnId INT,
    @ShowAll  BIT = 0
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, ColumnId, Title, Url, NavbarLinkId, SortOrder, IsActive, CreatedAt
    FROM   FooterLinks
    WHERE  ColumnId = @ColumnId
      AND  (@ShowAll = 1 OR IsActive = 1)
    ORDER  BY SortOrder, Id;
END
GO

-- ============================================================
--  sp_GetFooterAllData  (public — one call, all active data)
-- ============================================================
IF OBJECT_ID('sp_GetFooterAllData','P') IS NOT NULL DROP PROC sp_GetFooterAllData;
GO
CREATE PROCEDURE sp_GetFooterAllData
AS
BEGIN
    SET NOCOUNT ON;
    -- Result Set 1: active columns
    SELECT Id, Heading, SortOrder
    FROM   FooterColumns
    WHERE  IsActive = 1
    ORDER  BY SortOrder, Id;

    -- Result Set 2: active links (all columns)
    SELECT fl.Id, fl.ColumnId, fl.Title, fl.Url, fl.NavbarLinkId, fl.SortOrder
    FROM   FooterLinks fl
    INNER JOIN FooterColumns fc ON fc.Id = fl.ColumnId
    WHERE  fl.IsActive = 1 AND fc.IsActive = 1
    ORDER  BY fl.SortOrder, fl.Id;
END
GO

-- ============================================================
--  sp_AddFooterColumn
-- ============================================================
IF OBJECT_ID('sp_AddFooterColumn','P') IS NOT NULL DROP PROC sp_AddFooterColumn;
GO
CREATE PROCEDURE sp_AddFooterColumn
    @Heading   NVARCHAR(200),
    @SortOrder INT = 0
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO FooterColumns (Heading, SortOrder)
    VALUES (@Heading, @SortOrder);
    SELECT SCOPE_IDENTITY() AS Id;
END
GO

-- ============================================================
--  sp_UpdateFooterColumn
-- ============================================================
IF OBJECT_ID('sp_UpdateFooterColumn','P') IS NOT NULL DROP PROC sp_UpdateFooterColumn;
GO
CREATE PROCEDURE sp_UpdateFooterColumn
    @Id        INT,
    @Heading   NVARCHAR(200),
    @SortOrder INT = 0,
    @IsActive  BIT = 1
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE FooterColumns
    SET    Heading   = @Heading,
           SortOrder = @SortOrder,
           IsActive  = @IsActive
    WHERE  Id = @Id;
END
GO

-- ============================================================
--  sp_DeleteFooterColumn  (cascade deletes links too)
-- ============================================================
IF OBJECT_ID('sp_DeleteFooterColumn','P') IS NOT NULL DROP PROC sp_DeleteFooterColumn;
GO
CREATE PROCEDURE sp_DeleteFooterColumn
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM FooterColumns WHERE Id = @Id;
END
GO

-- ============================================================
--  sp_ToggleFooterColumn
-- ============================================================
IF OBJECT_ID('sp_ToggleFooterColumn','P') IS NOT NULL DROP PROC sp_ToggleFooterColumn;
GO
CREATE PROCEDURE sp_ToggleFooterColumn
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE FooterColumns SET IsActive = 1 - IsActive WHERE Id = @Id;
    SELECT IsActive FROM FooterColumns WHERE Id = @Id;
END
GO

-- ============================================================
--  sp_AddFooterLink
-- ============================================================
IF OBJECT_ID('sp_AddFooterLink','P') IS NOT NULL DROP PROC sp_AddFooterLink;
GO
CREATE PROCEDURE sp_AddFooterLink
    @ColumnId     INT,
    @Title        NVARCHAR(200),
    @Url          NVARCHAR(500),
    @NavbarLinkId INT  = NULL,
    @SortOrder    INT  = 0
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO FooterLinks (ColumnId, Title, Url, NavbarLinkId, SortOrder)
    VALUES (@ColumnId, @Title, @Url, @NavbarLinkId, @SortOrder);
    SELECT SCOPE_IDENTITY() AS Id;
END
GO

-- ============================================================
--  sp_UpdateFooterLink
-- ============================================================
IF OBJECT_ID('sp_UpdateFooterLink','P') IS NOT NULL DROP PROC sp_UpdateFooterLink;
GO
CREATE PROCEDURE sp_UpdateFooterLink
    @Id           INT,
    @Title        NVARCHAR(200),
    @Url          NVARCHAR(500),
    @NavbarLinkId INT  = NULL,
    @SortOrder    INT  = 0,
    @IsActive     BIT  = 1
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE FooterLinks
    SET    Title        = @Title,
           Url          = @Url,
           NavbarLinkId = @NavbarLinkId,
           SortOrder    = @SortOrder,
           IsActive     = @IsActive
    WHERE  Id = @Id;
END
GO

-- ============================================================
--  sp_DeleteFooterLink
-- ============================================================
IF OBJECT_ID('sp_DeleteFooterLink','P') IS NOT NULL DROP PROC sp_DeleteFooterLink;
GO
CREATE PROCEDURE sp_DeleteFooterLink
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM FooterLinks WHERE Id = @Id;
END
GO

-- ============================================================
--  sp_ToggleFooterLink
-- ============================================================
IF OBJECT_ID('sp_ToggleFooterLink','P') IS NOT NULL DROP PROC sp_ToggleFooterLink;
GO
CREATE PROCEDURE sp_ToggleFooterLink
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE FooterLinks SET IsActive = 1 - IsActive WHERE Id = @Id;
    SELECT IsActive FROM FooterLinks WHERE Id = @Id;
END
GO

-- ============================================================
--  CoursePageDetails mein FooterLinkId column add karo
-- ============================================================
IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID('CoursePageDetails') AND name = 'FooterLinkId'
)
ALTER TABLE CoursePageDetails ADD FooterLinkId INT NULL;
GO

-- ============================================================
--  sp_GetCourseDetailByFooterLinkId
-- ============================================================
IF OBJECT_ID('sp_GetCourseDetailByFooterLinkId','P') IS NOT NULL
    DROP PROC sp_GetCourseDetailByFooterLinkId;
GO
CREATE PROCEDURE sp_GetCourseDetailByFooterLinkId
    @FooterLinkId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM CoursePageDetails WHERE FooterLinkId = @FooterLinkId;
END
GO


-- ══════════════════════════════════════════════════════
--  Migration: AllProgramsHero table mein BgImage column
--  add karo agar exist nahi karta
-- ══════════════════════════════════════════════════════

-- 1. HeadingLine2 bhi add karo agar missing ho
IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'AllProgramsHero' AND COLUMN_NAME = 'HeadingLine2'
)
BEGIN
    ALTER TABLE AllProgramsHero ADD HeadingLine2 VARCHAR(300) NULL;
    PRINT 'HeadingLine2 column added to AllProgramsHero';
END
GO

-- 2. BgImage column add karo
IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'AllProgramsHero' AND COLUMN_NAME = 'BgImage'
)
BEGIN
    ALTER TABLE AllProgramsHero ADD BgImage VARCHAR(MAX) NULL;
    PRINT 'BgImage column added to AllProgramsHero';
END
ELSE
BEGIN
    PRINT 'BgImage column already exists';
END
GO

-- 3. Verify
SELECT * FROM AllProgramsHero;
GO


-- ============================================================
-- PART 15: FINAL VERIFY
-- ============================================================
SELECT name AS SP_Name FROM sys.procedures
WHERE name IN (
    'sp_RegisterUser','sp_CheckUserForRegister','sp_UpdateUnverifiedUser','sp_VerifyOtp',
    'sp_MarkUserVerified','sp_EnsureUserProfile','sp_GetUserByEmail','sp_UpdateLastLogin',
    'sp_GetProfileImage','sp_SetForgotOtp','sp_VerifyResetOtp','sp_ResetPassword',
    'sp_ResendOtp','sp_UpdateProfileImage','sp_GetUserProfile','sp_GetAllUsers','UpdateUserProfile',
    'sp_AddNavbarLink','sp_GetNavbarLinks','sp_UpdateNavbarLink','sp_DeleteNavbarLink','sp_ToggleNavbarLink',
    'sp_SubmitCallback','sp_GetCallbacks','sp_MarkCallbackRead','sp_MarkAllCallbacksRead',
    'sp_SubmitAdmission','sp_GetAdmissions','sp_MarkAdmissionRead','sp_UpdateAdmissionStatus','sp_GetUnreadCount',
    'sp_GetBanners','sp_GetBannerById','sp_AddBanner','sp_UpdateBanner','sp_DeleteBanner','sp_ToggleBanner',
    'sp_GetUniversitySection','sp_UpdateUniversitySection','sp_GetUniversityLogos',
    'sp_GetUniversityLogoById','sp_AddUniversityLogo','sp_UpdateUniversityLogo',
    'sp_DeleteUniversityLogo','sp_ToggleUniversityLogo','sp_ReorderUniversityLogo',
    'sp_GetCareerCategories','sp_AddCareerCategory','sp_UpdateCareerCategory',
    'sp_DeleteCareerCategory','sp_ToggleCareerCategory','sp_GetCareerCourses',
    'sp_GetCareerCourseById','sp_AddCareerCourse','sp_UpdateCareerCourse',
    'sp_DeleteCareerCourse','sp_ToggleCareerCourse','sp_GetPublicCareerData',
    'sp_GetCourseDetailBySlug','sp_GetCourseDetailById','sp_GetAllCourseDetails',
    'sp_UpsertCourseDetail','sp_DeleteCourseDetail',
    'sp_GetPublicFreeCourses','sp_GetAllFreeCourses','sp_AddFreeCourse',
    'sp_UpdateFreeCourse','sp_DeleteFreeCourse','sp_ToggleFreeCourse',
    'sp_GetOnlineCourseCategories','sp_AddOnlineCourseCategory','sp_UpdateOnlineCourseCategory',
    'sp_DeleteOnlineCourseCategory','sp_ToggleOnlineCourseCategory',
    'sp_GetOnlineCourses','sp_GetOnlineCourseById','sp_AddOnlineCourse',
    'sp_UpdateOnlineCourse','sp_DeleteOnlineCourse','sp_ToggleOnlineCourse',
    'sp_GetPublicOnlineCourseData','sp_GetAllPublicOnlineCourses',
    'sp_GetOnlineCourseDetailBySlug','sp_GetOnlineCourseDetailById',
    'sp_GetAllOnlineCourseDetails','sp_UpsertOnlineCourseDetail','sp_DeleteOnlineCourseDetail'
)
ORDER BY name;
GO

PRINT '====================================================';
PRINT 'COMPLETE SETUP DONE! Sab tables + SPs ready hain.';
PRINT '====================================================';
GO
