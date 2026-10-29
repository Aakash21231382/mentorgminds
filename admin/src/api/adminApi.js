import axiosInstance from './axiosInstance';

// ── Login / Logout ────────────────────────────────────────────
export const adminLoginApi = (email, password) => axiosInstance.post('/auth/admin/login', { email, password });
export const adminLogoutApi = () => axiosInstance.post('/auth/admin/logout');

// ── Navbar ────────────────────────────────────────────────────
export const navbarApi = {
  getNavbarLinks: () => axiosInstance.get('/navbar?all=1'),
  addNavbarLink: (linkData) => axiosInstance.post('/navbar', linkData),
  updateNavbarLink: (id, data) => axiosInstance.put(`/navbar/${id}`, data),
  deleteNavbarLink: (id) => axiosInstance.delete(`/navbar/${id}`),
  toggleNavbarLinkStatus: (id) => axiosInstance.patch(`/navbar/${id}/toggle`),
};

// ── Course (navbar-based detail) ──────────────────────────────
export const courseApi = {
  getAllCourses: () => axiosInstance.get('/courses/all'),
  getCourseByNavbarId: (navbarLinkId) => axiosInstance.get(`/courses/navbar/${navbarLinkId}`),
  upsertCourseDetails: (navbarLinkId, payload) => axiosInstance.post(`/courses/navbar/${navbarLinkId}`, payload),
  deleteCourseDetails: (navbarLinkId) => axiosInstance.delete(`/courses/navbar/${navbarLinkId}`),
};

// ── Auth ──────────────────────────────────────────────────────
export const adminAuthApi = {
  getUsers: () => axiosInstance.get('/auth/admin/users'),
};

// ── Leads ─────────────────────────────────────────────────────
export const adminLeadsApi = {
  getAdmissions: () => axiosInstance.get('/leads/admissions'),
  markAdmissionRead: (id) => axiosInstance.patch(`/leads/admissions/${id}/read`),
  updateAdmissionStatus: (id, status) => axiosInstance.patch(`/leads/admissions/${id}/status`, { status }),

  getCallbacks: () => axiosInstance.get('/leads/callbacks'),
  markCallbackRead: (id) => axiosInstance.patch(`/leads/callbacks/${id}/read`),
  markAllCallbacksRead: () => axiosInstance.patch('/leads/callbacks/read-all'),
};

// ── Banners ───────────────────────────────────────────────────
export const adminBannerApi = {
  getBanners: () => axiosInstance.get('/banners?all=1'),
  addBanner: (payload) => axiosInstance.post('/banners', payload),
  updateBanner: (id, payload) => axiosInstance.put(`/banners/${id}`, payload),
  deleteBanner: (id) => axiosInstance.delete(`/banners/${id}`),
  toggleBanner: (id) => axiosInstance.patch(`/banners/${id}/toggle`),
};

// ── Instructors ───────────────────────────────────────────────
export const adminInstructorApi = {
  getSection: () => axiosInstance.get('/instructors/section'),
  saveSection: (payload) => axiosInstance.post('/instructors/section', payload),
  getInstructors: () => axiosInstance.get('/instructors?all=1'),
  addInstructor: (payload) => axiosInstance.post('/instructors', payload),
  updateInstructor: (id, payload) => axiosInstance.put(`/instructors/${id}`, payload),
  deleteInstructor: (id) => axiosInstance.delete(`/instructors/${id}`),
  toggleInstructor: (id) => axiosInstance.patch(`/instructors/${id}/toggle`),
  // AllPrograms Hero
  getAllProgramsHero: () => axiosInstance.get('/instructors/hero/all-programs'),
  saveAllProgramsHero: (payload) => axiosInstance.post('/instructors/hero/all-programs', payload),
};

// ── Subscription Banner ───────────────────────────────────────
export const adminSubscriptionBannerApi = {
  get: () => axiosInstance.get('/subscription-banner'),
  save: (payload) => axiosInstance.post('/subscription-banner', payload),
};

// ── Success Section ───────────────────────────────────────────
export const adminSuccessSectionApi = {
  getConfig: () => axiosInstance.get('/success-section/config'),
  saveConfig: (payload) => axiosInstance.post('/success-section/config', payload),
  getStories: () => axiosInstance.get('/success-section/stories?all=1'),
  addStory: (payload) => axiosInstance.post('/success-section/stories', payload),
  updateStory: (id, payload) => axiosInstance.put(`/success-section/stories/${id}`, payload),
  deleteStory: (id) => axiosInstance.delete(`/success-section/stories/${id}`),
  toggleStory: (id) => axiosInstance.patch(`/success-section/stories/${id}/toggle`),
};

// ── Awards Section ────────────────────────────────────────────
export const adminAwardsApi = {
  getConfig: () => axiosInstance.get('/awards-section/config'),
  saveConfig: (payload) => axiosInstance.post('/awards-section/config', payload),
  getCards: () => axiosInstance.get('/awards-section/cards?all=1'),
  addCard: (payload) => axiosInstance.post('/awards-section/cards', payload),
  updateCard: (id, payload) => axiosInstance.put(`/awards-section/cards/${id}`, payload),
  deleteCard: (id) => axiosInstance.delete(`/awards-section/cards/${id}`),
  toggleCard: (id) => axiosInstance.patch(`/awards-section/cards/${id}/toggle`),
};

// ── Career ────────────────────────────────────────────────────
export const adminCareerApi = {
  getCategories: () => axiosInstance.get('/career/categories?all=1'),
  addCategory: (payload) => axiosInstance.post('/career/categories', payload),
  updateCategory: (id, payload) => axiosInstance.put(`/career/categories/${id}`, payload),
  deleteCategory: (id) => axiosInstance.delete(`/career/categories/${id}`),
  toggleCategory: (id) => axiosInstance.patch(`/career/categories/${id}/toggle`),

  getCoursesByCategory: (catId) => axiosInstance.get(`/career/courses/category/${catId}?all=1`),
  getCourseById: (id) => axiosInstance.get(`/career/courses/${id}`),
  addCourse: (payload) => axiosInstance.post('/career/courses', payload),
  updateCourse: (id, payload) => axiosInstance.put(`/career/courses/${id}`, payload),
  deleteCourse: (id) => axiosInstance.delete(`/career/courses/${id}`),
  toggleCourse: (id) => axiosInstance.patch(`/career/courses/${id}/toggle`),
};

// ── Course Detail (Career + Navbar + Footer) ──────────────────
export const adminCourseDetailApi = {
  getByCareerCourseId:  (id) => axiosInstance.get(`/course-detail/${id}`),
  getByNavbarLinkId:    (id) => axiosInstance.get(`/course-detail/navbar/${id}`),
  getByFooterLinkId:    (id) => axiosInstance.get(`/course-detail/footer-link/${id}`),
  getBySlug:            (slug) => axiosInstance.get(`/course-detail/slug-admin/${slug}`),
  saveCareer:   (payload)    => axiosInstance.post('/course-detail', payload),
  saveNavbar:   (id, payload)=> axiosInstance.post(`/course-detail/navbar/${id}`, payload),
  saveFooter:   (id, payload)=> axiosInstance.post(`/course-detail/footer-link/${id}`, payload),
  saveBySlug:   (slug, payload) => axiosInstance.post(`/course-detail/slug/${slug}`, payload),
};

// ── Free Courses ──────────────────────────────────────────────
export const adminFreeCourseApi = {
  getAll: () => axiosInstance.get('/free-courses?all=1'),
  add: (payload) => axiosInstance.post('/free-courses', payload),
  update: (id, payload) => axiosInstance.put(`/free-courses/${id}`, payload),
  delete: (id) => axiosInstance.delete(`/free-courses/${id}`),
  toggle: (id) => axiosInstance.patch(`/free-courses/${id}/toggle`),
};

// ── University Slides ─────────────────────────────────────────
export const adminUniversityApi = {
  getSlides: () => axiosInstance.get('/university/slides?all=1'),
  addSlide: (payload) => axiosInstance.post('/university/slides', payload),
  updateSlide: (id, payload) => axiosInstance.put(`/university/slides/${id}`, payload),
  deleteSlide: (id) => axiosInstance.delete(`/university/slides/${id}`),
  toggleSlide: (id) => axiosInstance.patch(`/university/slides/${id}/toggle`),
  addLogo: (slideId, payload) => axiosInstance.post(`/university/slides/${slideId}/logos`, payload),
  updateLogo: (id, payload) => axiosInstance.put(`/university/slides/logos/${id}`, payload),
  deleteLogo: (id) => axiosInstance.delete(`/university/slides/logos/${id}`),
};

// ── Online Courses ────────────────────────────────────────────
export const adminOnlineCourseApi = {
  getCategories: () => axiosInstance.get('/online-courses/categories?all=1'),
  addCategory: (payload) => axiosInstance.post('/online-courses/categories', payload),
  updateCategory: (id, payload) => axiosInstance.put(`/online-courses/categories/${id}`, payload),
  deleteCategory: (id) => axiosInstance.delete(`/online-courses/categories/${id}`),
  toggleCategory: (id) => axiosInstance.patch(`/online-courses/categories/${id}/toggle`),

  getCoursesByCategory: (catId) => axiosInstance.get(`/online-courses/courses/category/${catId}?all=1`),
  getCourseById: (id) => axiosInstance.get(`/online-courses/courses/${id}`),
  addCourse: (payload) => axiosInstance.post('/online-courses/courses', payload),
  updateCourse: (id, payload) => axiosInstance.put(`/online-courses/courses/${id}`, payload),
  deleteCourse: (id) => axiosInstance.delete(`/online-courses/courses/${id}`),
  toggleCourse: (id) => axiosInstance.patch(`/online-courses/courses/${id}/toggle`),

  getDetail: (id) => axiosInstance.get(`/online-courses/detail/${id}`),
  saveDetail: (payload) => axiosInstance.post('/online-courses/detail', payload),
};

// ── Course Overview ───────────────────────────────────────────
export const adminCourseOverviewApi = {
  getSettings: () => axiosInstance.get('/course-overview/settings'),
  saveSettings: (payload) => axiosInstance.post('/course-overview/settings', payload),
  getSections: () => axiosInstance.get('/course-overview?all=1'),
  addSection: (payload) => axiosInstance.post('/course-overview', payload),
  updateSection: (id, payload) => axiosInstance.put(`/course-overview/${id}`, payload),
  deleteSection: (id) => axiosInstance.delete(`/course-overview/${id}`),
  toggleSection: (id) => axiosInstance.patch(`/course-overview/${id}/toggle`),
};

// ── Course Instructors ────────────────────────────────────────
export const adminCourseInstructorsApi = {
  getSettings: () => axiosInstance.get('/course-instructors/settings'),
  saveSettings: (payload) => axiosInstance.post('/course-instructors/settings', payload),
  getData: () => axiosInstance.get('/course-instructors/data'),
  getTabs: () => axiosInstance.get('/course-instructors/tabs?all=1'),
  addTab: (payload) => axiosInstance.post('/course-instructors/tabs', payload),
  updateTab: (id, payload) => axiosInstance.put(`/course-instructors/tabs/${id}`, payload),
  deleteTab: (id) => axiosInstance.delete(`/course-instructors/tabs/${id}`),
  toggleTab: (id) => axiosInstance.patch(`/course-instructors/tabs/${id}/toggle`),
  getCards: (tabId) => axiosInstance.get(`/course-instructors/tabs/${tabId}/cards?all=1`),
  addCard: (tabId, payload) => axiosInstance.post(`/course-instructors/tabs/${tabId}/cards`, payload),
  updateCard: (id, payload) => axiosInstance.put(`/course-instructors/cards/${id}`, payload),
  deleteCard: (id) => axiosInstance.delete(`/course-instructors/cards/${id}`),
  toggleCard: (id) => axiosInstance.patch(`/course-instructors/cards/${id}/toggle`),
};

// ── Course Projects ───────────────────────────────────────────
export const adminCourseProjectsApi = {
  getSettings: () => axiosInstance.get('/course-projects/settings'),
  saveSettings: (payload) => axiosInstance.post('/course-projects/settings', payload),
  getProjects: () => axiosInstance.get('/course-projects?all=1'),
  addProject: (payload) => axiosInstance.post('/course-projects', payload),
  updateProject: (id, payload) => axiosInstance.put(`/course-projects/${id}`, payload),
  deleteProject: (id) => axiosInstance.delete(`/course-projects/${id}`),
  toggleProject: (id) => axiosInstance.patch(`/course-projects/${id}/toggle`),
};

// ── Curriculum ────────────────────────────────────────────────
export const adminCurriculumApi = {
  getSettings: () => axiosInstance.get('/curriculum/settings'),
  saveSettings: (payload) => axiosInstance.post('/curriculum/settings', payload),
  getCards: () => axiosInstance.get('/curriculum?all=1'),
  addCard: (payload) => axiosInstance.post('/curriculum', payload),
  updateCard: (id, payload) => axiosInstance.put(`/curriculum/${id}`, payload),
  deleteCard: (id) => axiosInstance.delete(`/curriculum/${id}`),
  toggleCard: (id) => axiosInstance.patch(`/curriculum/${id}/toggle`),
};

// ── Curriculum Comparison ─────────────────────────────────────
export const adminCurriculumComparisonApi = {
  getSettings: () => axiosInstance.get('/curriculum-comparison/settings'),
  saveSettings: (payload) => axiosInstance.post('/curriculum-comparison/settings', payload),
  getCards: () => axiosInstance.get('/curriculum-comparison?all=1'),
  addCard: (payload) => axiosInstance.post('/curriculum-comparison', payload),
  updateCard: (id, payload) => axiosInstance.put(`/curriculum-comparison/${id}`, payload),
  deleteCard: (id) => axiosInstance.delete(`/curriculum-comparison/${id}`),
  toggleCard: (id) => axiosInstance.patch(`/curriculum-comparison/${id}/toggle`),
};

// ── FAQ ───────────────────────────────────────────────────────
export const adminFaqApi = {
  getSettings: () => axiosInstance.get('/faq/settings'),
  saveSettings: (payload) => axiosInstance.post('/faq/settings', payload),
  getItems: () => axiosInstance.get('/faq?all=1'),
  addItem: (payload) => axiosInstance.post('/faq', payload),
  updateItem: (id, payload) => axiosInstance.put(`/faq/${id}`, payload),
  deleteItem: (id) => axiosInstance.delete(`/faq/${id}`),
  toggleItem: (id) => axiosInstance.patch(`/faq/${id}/toggle`),
};

// ── Skills Comparison ─────────────────────────────────────────
export const adminSkillsComparisonApi = {
  getSettings: () => axiosInstance.get('/skills-comparison/settings'),
  saveSettings: (payload) => axiosInstance.post('/skills-comparison/settings', payload),
  getCards: () => axiosInstance.get('/skills-comparison?all=1'),
  addCard: (payload) => axiosInstance.post('/skills-comparison', payload),
  updateCard: (id, payload) => axiosInstance.put(`/skills-comparison/${id}`, payload),
  deleteCard: (id) => axiosInstance.delete(`/skills-comparison/${id}`),
  toggleCard: (id) => axiosInstance.patch(`/skills-comparison/${id}/toggle`),
};

// ── Tools & Tech ──────────────────────────────────────────────
export const adminToolsTechApi = {
  getSettings: () => axiosInstance.get('/tools-tech/settings'),
  saveSettings: (payload) => axiosInstance.post('/tools-tech/settings', payload),
  getTools: () => axiosInstance.get('/tools-tech?all=1'),
  addTool: (payload) => axiosInstance.post('/tools-tech', payload),
  updateTool: (id, payload) => axiosInstance.put(`/tools-tech/${id}`, payload),
  deleteTool: (id) => axiosInstance.delete(`/tools-tech/${id}`),
  toggleTool: (id) => axiosInstance.patch(`/tools-tech/${id}/toggle`),
};

// ── Achieve Goals ─────────────────────────────────────────────
export const adminAchieveGoalsApi = {
  getSettings: () => axiosInstance.get('/achieve-goals/settings'),
  saveSettings: (payload) => axiosInstance.post('/achieve-goals/settings', payload),
  getTabs: () => axiosInstance.get('/achieve-goals?all=1'),
  addTab: (payload) => axiosInstance.post('/achieve-goals', payload),
  updateTab: (id, payload) => axiosInstance.put(`/achieve-goals/${id}`, payload),
  deleteTab: (id) => axiosInstance.delete(`/achieve-goals/${id}`),
  toggleTab: (id) => axiosInstance.patch(`/achieve-goals/${id}/toggle`),
};

// ── Footer ────────────────────────────────────────────────────
export const adminFooterApi = {
  // Columns
  getColumns:     ()           => axiosInstance.get('/footer/columns?all=1'),
  addColumn:      (payload)    => axiosInstance.post('/footer/columns', payload),
  updateColumn:   (id, payload)=> axiosInstance.put(`/footer/columns/${id}`, payload),
  deleteColumn:   (id)         => axiosInstance.delete(`/footer/columns/${id}`),
  toggleColumn:   (id)         => axiosInstance.patch(`/footer/columns/${id}/toggle`),
  // Links
  getLinks:       (colId)      => axiosInstance.get(`/footer/columns/${colId}/links?all=1`),
  addLink:        (colId, payload) => axiosInstance.post(`/footer/columns/${colId}/links`, payload),
  updateLink:     (id, payload)=> axiosInstance.put(`/footer/links/${id}`, payload),
  deleteLink:     (id)         => axiosInstance.delete(`/footer/links/${id}`),
  toggleLink:     (id)         => axiosInstance.patch(`/footer/links/${id}/toggle`),
};

// ── Dashboard ─────────────────────────────────────────────────
export const adminDashboardApi = {
  getUsers: () => axiosInstance.get('/auth/admin/users'),
  getNavbarLinks: () => axiosInstance.get('/navbar?all=1'),
};

// ── Navbar Dropdown (Mega Menu) ───────────────────────────────
export const adminNavbarDropdownApi = {
  // Groups
  getGroups:   (navbarLinkId) => axiosInstance.get(`/navbar-dropdown/groups/${navbarLinkId}?all=1`),
  addGroup:    (navbarLinkId, payload) => axiosInstance.post(`/navbar-dropdown/groups/${navbarLinkId}`, payload),
  updateGroup: (id, payload)   => axiosInstance.put(`/navbar-dropdown/groups/${id}`, payload),
  deleteGroup: (id)            => axiosInstance.delete(`/navbar-dropdown/groups/${id}`),
  toggleGroup: (id)            => axiosInstance.patch(`/navbar-dropdown/groups/${id}/toggle`),
  // Items
  getItems:    (groupId)       => axiosInstance.get(`/navbar-dropdown/items/${groupId}?all=1`),
  getItemById: (id)            => axiosInstance.get(`/navbar-dropdown/items/detail/${id}`),
  addItem:     (groupId, payload) => axiosInstance.post(`/navbar-dropdown/items/${groupId}`, payload),
  updateItem:  (id, payload)   => axiosInstance.put(`/navbar-dropdown/items/${id}`, payload),
  deleteItem:  (id)            => axiosInstance.delete(`/navbar-dropdown/items/${id}`),
  toggleItem:  (id)            => axiosInstance.patch(`/navbar-dropdown/items/${id}/toggle`),
};




// ── Offline Centres ───────────────────────────────────────────
export const offlineCentres = {
  getAll:  () => axiosInstance.get('/offline-centres/admin/all'),
  getCitiesWithCount: () => axiosInstance.get('/offline-centres/public/cities'),
  getCentresByCity: (cityName) => axiosInstance.get(`/offline-centres/public/city/${cityName}`),
  upsert:  (payload) => axiosInstance.post('/offline-centres/admin/upsert', payload),
  delete:  (id) => axiosInstance.delete(`/offline-centres/admin/${id}`),
};

// ── Centres Why Choose ────────────────────────────────────────
export const centresWhyChooseApi = {
  getAll:  () => axiosInstance.get('/centres-whychoose/admin'),
  upsert:  (payload) => axiosInstance.post('/centres-whychoose/admin', payload),
  delete:  (id) => axiosInstance.delete(`/centres-whychoose/admin/${id}`),
  toggle:  (id) => axiosInstance.patch(`/centres-whychoose/admin/${id}/toggle`),
};

// ── Centres FAQ ───────────────────────────────────────────────
export const centresFAQApi = {
  getAll:  () => axiosInstance.get('/centres-faq/admin'),
  upsert:  (payload) => axiosInstance.post('/centres-faq/admin', payload),
  delete:  (id) => axiosInstance.delete(`/centres-faq/admin/${id}`),
  toggle:  (id) => axiosInstance.patch(`/centres-faq/admin/${id}/toggle`),
};

// ── Top Program Categories (Study Abroad) ─────────────────────
export const topProgramCategoriesApi = {
  getAll: () => axiosInstance.get('/top-program-categories/admin?showAll=true'),
  upsert: (payload) => axiosInstance.post('/top-program-categories/admin/upsert', payload),
  delete: (id) => axiosInstance.delete(`/top-program-categories/admin/${id}`),
};

// ── Top Programs (Study Abroad) ───────────────────────────────
export const topProgramsApi = {
  getAll: () => axiosInstance.get('/top-programs/admin/all'),
  getDetail: (id) => axiosInstance.get(`/top-programs/admin/detail/${id}`),
  upsert: (payload) => axiosInstance.post('/top-programs/admin/upsert', payload),
  delete: (id) => axiosInstance.delete(`/top-programs/admin/${id}`),
  saveDetails: (payload) => axiosInstance.post('/top-programs/admin/details', payload),
};

// ── Study Abroad Advisor Leads ────────────────────────────────
export const getStudyAbroadLeads = async () => {
  const response = await axiosInstance.get('/study-abroad-advisor/all');
  return response; // axiosInstance already returns response.data
};

export const updateLeadStatus = async (id, status) => {
  const response = await axiosInstance.put(`/study-abroad-advisor/status/${id}`, { status });
  return response; // axiosInstance already returns response.data
};

export const deleteStudyAbroadLead = async (id) => {
  const response = await axiosInstance.delete(`/study-abroad-advisor/${id}`);
  return response; // axiosInstance already returns response.data
};

// ── Unified Export ─────────────────────────────
export const adminApi = {
  auth: adminAuthApi,
  login: adminLoginApi,
  logout: adminLogoutApi,
  navbar: navbarApi,
  navbarDropdown: adminNavbarDropdownApi,
  course: courseApi,
  leads: adminLeadsApi,
  banners: adminBannerApi,
  instructors: adminInstructorApi,
  subscriptionBanner: adminSubscriptionBannerApi,
  successSection: adminSuccessSectionApi,
  awards: adminAwardsApi,
  career: adminCareerApi,
  courseDetail: adminCourseDetailApi,
  freeCourses: adminFreeCourseApi,
  university: adminUniversityApi,
  onlineCourses: adminOnlineCourseApi,
  courseOverview: adminCourseOverviewApi,
  courseInstructors: adminCourseInstructorsApi,
  courseProjects: adminCourseProjectsApi,
  curriculum: adminCurriculumApi,
  curriculumComparison: adminCurriculumComparisonApi,
  faq: adminFaqApi,
  skillsComparison: adminSkillsComparisonApi,
  toolsTech: adminToolsTechApi,
  achieveGoals: adminAchieveGoalsApi,
  footer: adminFooterApi,
  dashboard: adminDashboardApi,
  offlineCentres: offlineCentres,
  centresWhyChoose: centresWhyChooseApi,
  centresFAQ: centresFAQApi,
  topProgramCategories: topProgramCategoriesApi,
  topPrograms: topProgramsApi,
};
