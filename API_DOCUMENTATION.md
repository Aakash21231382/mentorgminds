# 📋 COMPLETE API DOCUMENTATION — FULL PROJECT
> Last Updated: Final Version — All APIs Included

---

## 🔗 BASE URL
```
http://localhost:5000/api
```
> Admin Panel aur Frontend dono ka same base URL hai.
> Production mein `.env` file mein `VITE_API_URL` change karo.

---

## 🔐 AUTH HEADERS

### Admin Protected Routes ke liye:
```
Authorization: Bearer <adminToken>
Content-Type: application/json
```

### User Protected Routes ke liye:
```
Authorization: Bearer <userToken>
Content-Type: application/json
```

> Token login response mein milta hai. Frontend/Admin dono `localStorage` mein save karte hain.

---

# ═══════════════════════════════════════════════════
# 1. AUTH APIs
# ═══════════════════════════════════════════════════

## 1.1 User Register
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/auth/register`
- **Auth:** ❌ Not required
- **Body (JSON):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

## 1.2 Verify OTP (Register ke baad)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/auth/verify-otp`
- **Auth:** ❌ Not required
- **Body (JSON):**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

## 1.3 Resend OTP
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/auth/resend-otp`
- **Auth:** ❌ Not required
- **Body (JSON):**
```json
{
  "email": "john@example.com"
}
```

## 1.4 User Login
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/auth/login`
- **Auth:** ❌ Not required
- **Body (JSON):**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

## 1.5 User Logout
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/auth/logout`
- **Auth:** ✅ Required (User token)
- **Body:** None


## 1.6 Forgot Password
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/auth/forgot-password`
- **Auth:** ❌ Not required
- **Body (JSON):**
```json
{
  "email": "john@example.com"
}
```

## 1.7 Verify Reset OTP
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/auth/verify-reset-otp`
- **Auth:** ❌ Not required
- **Body (JSON):**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

## 1.8 Reset Password
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/auth/reset-password`
- **Auth:** ❌ Not required
- **Body (JSON):**
```json
{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "newpassword123"
}
```

## 1.9 Admin Login
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/auth/admin/login`
- **Auth:** ❌ Not required
- **Body (JSON):**
```json
{
  "email": "admin@example.com",
  "password": "adminpassword"
}
```

## 1.10 Admin Logout
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/auth/admin/logout`
- **Auth:** ✅ Required (Admin token)
- **Body:** None

## 1.11 Get User Profile
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/auth/profile`
- **Auth:** ✅ Required (User token)
- **Body:** None

## 1.12 Update User Profile
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/auth/profile`
- **Auth:** ✅ Required (User token)
- **Body (JSON):**
```json
{
  "name": "John Updated",
  "phone": "9876543210"
}
```

## 1.13 Update Profile Image URL
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/auth/profile/image`
- **Auth:** ✅ Required (User token)
- **Body (JSON):**
```json
{
  "image_url": "https://cdn.example.com/images/profile.jpg"
}
```

## 1.14 Get All Users (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/auth/admin/users`
- **Auth:** ✅ Required (Admin token)
- **Body:** None


---

# ═══════════════════════════════════════════════════
# 2. IMAGE UPLOAD API
# ═══════════════════════════════════════════════════

## 2.1 Upload Image (Admin Only)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/upload`
- **Auth:** ✅ Required (Admin token)
- **Content-Type:** `multipart/form-data`
- **Body (Form-Data):**
```
Key:  file
Type: File
Value: <select image file>
Allowed: jpeg, jpg, png, gif, webp, svg — max 5MB
```
> Backend CDN pe proxy karke upload karta hai aur CDN URL return karta hai.

---

# ═══════════════════════════════════════════════════
# 3. NAVBAR APIs
# ═══════════════════════════════════════════════════

## 3.1 Get Navbar Links (Public — Frontend)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/navbar`
- **Auth:** ❌ Not required
- **Response:** Nested tree structure (links + children)

## 3.2 Get All Navbar Links (Admin — includes inactive)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/navbar?all=1`
- **Auth:** ✅ Required (Admin token)

## 3.3 Add Navbar Link (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/navbar`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "title": "Machine Learning",
  "url": "/courses/machine-learning",
  "category": "courses",
  "parentId": null,
  "badgeText": "New",
  "sortOrder": 1
}
```
> `url` optional hai — agar nahi diya toh `category + title slug` se auto-generate hoga.
> `parentId` — parent navbar link ka ID (sub-menu ke liye).

## 3.4 Update Navbar Link (Admin)
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/navbar/:id`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "title": "ML Course Updated",
  "url": "/courses/ml-updated",
  "category": "courses",
  "badgeText": "Hot",
  "isActive": true,
  "sortOrder": 2
}
```

## 3.5 Delete Navbar Link (Admin)
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/navbar/:id`
- **Auth:** ✅ Required (Admin token)
- **Body:** None

## 3.6 Toggle Navbar Link Status (Admin)
- **Method:** `PATCH`
- **URL:** `http://localhost:5000/api/navbar/:id/toggle`
- **Auth:** ✅ Required (Admin token)
- **Body:** None


---

# ═══════════════════════════════════════════════════
# 4. BANNERS APIs
# ═══════════════════════════════════════════════════

## 4.1 Get Active Banners (Public — Frontend)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/banners`
- **Auth:** ❌ Not required

## 4.2 Get All Banners (Admin — includes inactive)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/banners?all=1`
- **Auth:** ✅ Required (Admin token)

## 4.3 Get Banner By ID (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/banners/:id`
- **Auth:** ✅ Required (Admin token)

## 4.4 Add Banner (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/banners`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "badgeText": "Top Ranked",
  "headingLine1": "Learn Data Science",
  "headingLine2": "From Industry Experts",
  "subText1": "Join 50,000+ learners",
  "subText2": "Get certified and land your dream job",
  "btn1Text": "Enroll Now",
  "btn1Link": "/enroll",
  "btn2Text": "Know More",
  "btn2Link": "/courses",
  "bannerImage": "https://cdn.example.com/banner.jpg",
  "bgImage": "https://cdn.example.com/bg.jpg",
  "videoUrl": "https://youtube.com/watch?v=xxx",
  "videoCardLabel": "Watch Demo",
  "videoCardTitle": "Course Preview",
  "sortOrder": 1,
  "isActive": true
}
```

## 4.5 Update Banner (Admin)
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/banners/:id`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):** Same as Add Banner

## 4.6 Delete Banner (Admin)
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/banners/:id`
- **Auth:** ✅ Required (Admin token)
- **Body:** None

## 4.7 Toggle Banner Status (Admin)
- **Method:** `PATCH`
- **URL:** `http://localhost:5000/api/banners/:id/toggle`
- **Auth:** ✅ Required (Admin token)
- **Body:** None


---

# ═══════════════════════════════════════════════════
# 5. LEADS APIs
# ═══════════════════════════════════════════════════

## 5.1 Submit Callback Request (Public — Frontend)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/leads/callback`
- **Auth:** ❌ Not required
- **Body (JSON):**
```json
{
  "fullName": "John Doe",
  "phone": "9876543210",
  "email": "john@example.com",
  "domain": "Data Science",
  "message": "Please call me back"
}
```
> `fullName` aur `phone` required hain. Baaki optional.

## 5.2 Submit Admission Enquiry (Public — Frontend)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/leads/admission`
- **Auth:** ❌ Not required
- **Body (JSON):**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "courseInterest": "MBA Data Science",
  "qualification": "B.Tech",
  "workExperience": "2 years",
  "city": "Delhi",
  "message": "I am interested in this course"
}
```
> `fullName`, `email`, `phone`, `courseInterest` required hain.

## 5.3 Get All Callbacks (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/leads/callbacks`
- **Auth:** ✅ Required (Admin token)
- **Body:** None

## 5.4 Mark Callback as Read (Admin)
- **Method:** `PATCH`
- **URL:** `http://localhost:5000/api/leads/callbacks/:id/read`
- **Auth:** ✅ Required (Admin token)
- **Body:** None

## 5.5 Mark All Callbacks as Read (Admin)
- **Method:** `PATCH`
- **URL:** `http://localhost:5000/api/leads/callbacks/read-all`
- **Auth:** ✅ Required (Admin token)
- **Body:** None

## 5.6 Get All Admissions (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/leads/admissions`
- **Auth:** ✅ Required (Admin token)
- **Body:** None

## 5.7 Mark Admission as Read (Admin)
- **Method:** `PATCH`
- **URL:** `http://localhost:5000/api/leads/admissions/:id/read`
- **Auth:** ✅ Required (Admin token)
- **Body:** None

## 5.8 Update Admission Status (Admin)
- **Method:** `PATCH`
- **URL:** `http://localhost:5000/api/leads/admissions/:id/status`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "status": "Contacted"
}
```
> Allowed values: `"New"` | `"Contacted"` | `"Enrolled"` | `"Rejected"`

## 5.9 Get Unread Count (Admin — Header Bell)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/leads/unread-count`
- **Auth:** ✅ Required (Admin token)
- **Body:** None
- **Response:** `{ total, callbacks, admissions }`


---

# ═══════════════════════════════════════════════════
# 6. CAREER APIs
# ═══════════════════════════════════════════════════

## 6.1 Get Public Career Data (Frontend — Home + AllPrograms)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/career/public`
- **Auth:** ❌ Not required
- **Body:** None

## 6.2 Get All Categories (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/career/categories?all=1`
- **Auth:** ✅ Required (Admin token)

## 6.3 Add Category (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/career/categories`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "name": "Engineering",
  "image": "https://cdn.example.com/category.jpg",
  "sortOrder": 1,
  "isActive": true
}
```
> `name` required hai. `image` optional.

## 6.4 Update Category (Admin)
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/career/categories/:id`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):** Same as Add

## 6.5 Delete Category (Admin)
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/career/categories/:id`
- **Auth:** ✅ Required (Admin token)
- **Body:** None

## 6.6 Toggle Category (Admin)
- **Method:** `PATCH`
- **URL:** `http://localhost:5000/api/career/categories/:id/toggle`
- **Auth:** ✅ Required (Admin token)
- **Body:** None

## 6.7 Get Courses by Category (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/career/courses/category/:categoryId?all=1`
- **Auth:** ✅ Required (Admin token)
- **Example:** `http://localhost:5000/api/career/courses/category/3?all=1`

## 6.8 Get Course by ID (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/career/courses/:id`
- **Auth:** ✅ Required (Admin token)

## 6.9 Add Course (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/career/courses`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "categoryId": 1,
  "title": "Full Stack Development",
  "ribbon": "Popular",
  "ribbonColor": "#FF5722",
  "logo": "https://cdn.example.com/course-logo.jpg",
  "location": "Online + Offline",
  "feature1Text": "6 Months",
  "feature1Icon": "clock",
  "feature2Text": "Live Classes",
  "feature2Icon": "video",
  "sortOrder": 1,
  "isActive": true
}
```
> `title` aur `categoryId` **required** hain. Baaki sab optional.

## 6.10 Update Course (Admin)
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/career/courses/:id`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):** Same as Add — `title` aur `categoryId` required

## 6.11 Delete Course (Admin)
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/career/courses/:id`
- **Auth:** ✅ Required (Admin token)
- **Body:** None

## 6.12 Toggle Course (Admin)
- **Method:** `PATCH`
- **URL:** `http://localhost:5000/api/career/courses/:id/toggle`
- **Auth:** ✅ Required (Admin token)
- **Body:** None


---

# ═══════════════════════════════════════════════════
# 7. COURSE DETAIL APIs
# ═══════════════════════════════════════════════════

## 7.1 Get Course Detail by Slug (Frontend)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/course-detail/slug/:slug`
- **Auth:** ❌ Not required
- **Example:** `http://localhost:5000/api/course-detail/slug/full-stack-development`

## 7.2 Get by Career Course ID (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/course-detail/:careerCourseId`
- **Auth:** ✅ Required (Admin token)
- **Example:** `http://localhost:5000/api/course-detail/5`

## 7.3 Get by Navbar Link ID (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/course-detail/navbar/:navbarLinkId`
- **Auth:** ✅ Required (Admin token)
- **Example:** `http://localhost:5000/api/course-detail/navbar/3`

## 7.4 Get by Footer Link ID (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/course-detail/footer-link/:footerLinkId`
- **Auth:** ✅ Required (Admin token)
- **Example:** `http://localhost:5000/api/course-detail/footer-link/7`

## 7.5 Save via Career Course (Admin — POST = upsert)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/course-detail`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "careerCourseId": 5,
  "slug": "full-stack-development",
  "category": "courses",
  "heroTitle": "Master Full Stack Development",
  "heroSubtitle": "Build complete web apps from scratch",
  "heroBadge": "Most Popular",
  "heroImage": "https://cdn.example.com/hero.jpg",
  "overviewTitle": "What is this course?",
  "overviewDescription": "Detailed description here...",
  "keyHighlights": "[{\"icon\":\"FaClock\",\"text\":\"6 Months Duration\"}]",
  "curriculum": "[{\"moduleTitle\":\"Introduction\",\"topics\":[\"Overview\",\"Setup\"]}]",
  "whoShouldEnroll": "[\"Software Engineers\",\"Data Analysts\"]",
  "originalFee": "₹1,20,000",
  "discountedFee": "₹84,000",
  "duration": "6 Months",
  "rating": 4.5,
  "studentsEnrolled": 5000,
  "institutionName": "IIT Kharagpur",
  "institutionLogo": "https://cdn.example.com/iit.jpg",
  "certificateTitle": "Post Graduate Certificate",
  "certificateImage": "https://cdn.example.com/cert.jpg",
  "faqs": "[{\"question\":\"Duration?\",\"answer\":\"6 months\"}]",
  "metaTitle": "Full Stack Course",
  "metaDescription": "SEO description here",
  "brochureUrl": "https://cdn.example.com/brochure.pdf",
  "isActive": true
}
```
> Sab fields optional hain sirf `careerCourseId` required hai.
> `keyHighlights`, `curriculum`, `whoShouldEnroll`, `faqs` — JSON string format mein bhejo.

## 7.6 Save via Navbar Link (Admin — POST = upsert)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/course-detail/navbar/:navbarLinkId`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):** Same as 7.5 — `careerCourseId` ki jagah URL mein `navbarLinkId` jaata hai

## 7.7 Save via Footer Link (Admin — POST = upsert)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/course-detail/footer-link/:footerLinkId`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):** Same as 7.5 — `careerCourseId` ki jagah URL mein `footerLinkId` jaata hai

---

# ═══════════════════════════════════════════════════
# 8. FREE COURSES APIs
# ═══════════════════════════════════════════════════

## 8.1 Get Public Free Courses (Frontend)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/free-courses/public`
- **Auth:** ❌ Not required

## 8.2 Get All Free Courses (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/free-courses?all=1`
- **Auth:** ✅ Required (Admin token)

## 8.3 Add Free Course (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/free-courses`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "title": "Python Basics",
  "duration": "4 hours",
  "image_url": "https://cdn.example.com/python.jpg",
  "link": "https://youtube.com/watch?v=xxx",
  "order": 1,
  "isActive": true
}
```

## 8.4 Update Free Course (Admin)
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/free-courses/:id`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):** Same as Add

## 8.5 Delete Free Course (Admin)
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/free-courses/:id`
- **Auth:** ✅ Required (Admin token)
- **Body:** None

## 8.6 Toggle Free Course (Admin)
- **Method:** `PATCH`
- **URL:** `http://localhost:5000/api/free-courses/:id/toggle`
- **Auth:** ✅ Required (Admin token)
- **Body:** None


---

# ═══════════════════════════════════════════════════
# 9. ONLINE COURSES APIs
# ═══════════════════════════════════════════════════

## 9.1 Get Online Courses Slider (Frontend — Home page)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/online-courses/public`
- **Auth:** ❌ Not required

## 9.2 Get All Public Online Courses (Frontend — ViewAll page)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/online-courses/public/all?pageSize=999`
- **Auth:** ❌ Not required

## 9.3 Get Online Course Detail by Slug (Frontend)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/online-courses/detail/slug/:slug`
- **Auth:** ❌ Not required
- **Example:** `http://localhost:5000/api/online-courses/detail/slug/react-js-bootcamp`

## 9.4 Get All Categories (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/online-courses/categories?all=1`
- **Auth:** ✅ Required (Admin token)

## 9.5 Add Category (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/online-courses/categories`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "name": "Programming",
  "sortOrder": 1,
  "isActive": true
}
```
> `name` **required** hai. `sortOrder` aur `isActive` optional.

## 9.6 Update Category (Admin)
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/online-courses/categories/:id`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):** Same as Add

## 9.7 Delete Category (Admin)
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/online-courses/categories/:id`
- **Auth:** ✅ Required (Admin token)

## 9.8 Toggle Category (Admin)
- **Method:** `PATCH`
- **URL:** `http://localhost:5000/api/online-courses/categories/:id/toggle`
- **Auth:** ✅ Required (Admin token)

## 9.9 Get Courses by Category (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/online-courses/courses/category/:categoryId?all=1`
- **Auth:** ✅ Required (Admin token)
- **Example:** `http://localhost:5000/api/online-courses/courses/category/2?all=1`

## 9.10 Get Course by ID (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/online-courses/courses/:id`
- **Auth:** ✅ Required (Admin token)

## 9.11 Add Online Course (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/online-courses/courses`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "categoryId": 2,
  "title": "React JS Bootcamp",
  "subtitle": "with Placement Assistant",
  "image": "https://cdn.example.com/react.jpg",
  "feature1": "Master Product Life Cycle",
  "feature2": "Unlimited AI mock interviews",
  "feature3": "Priority Access to opportunities",
  "skillImage": "https://cdn.example.com/skill.png",
  "skillImages": ["https://cdn.example.com/react.png", "https://cdn.example.com/js.png"],
  "extraSkills": 2,
  "programUrl": "/online-course-detail/react-js-bootcamp",
  "brochureUrl": "https://cdn.example.com/brochure.pdf",
  "sortOrder": 1,
  "isActive": true
}
```
> `title` aur `categoryId` **required** hain. Baaki sab optional (null allowed).
> `skillImages` — array of image URLs (skills/tools icons).
> `extraSkills` — "& 2 more" wala number.
> `programUrl` — course detail page ka link.
> `brochureUrl` — PDF download link.

## 9.12 Update Online Course (Admin)
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/online-courses/courses/:id`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):** Same as Add

## 9.13 Delete Online Course (Admin)
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/online-courses/courses/:id`
- **Auth:** ✅ Required (Admin token)

## 9.14 Toggle Online Course (Admin)
- **Method:** `PATCH`
- **URL:** `http://localhost:5000/api/online-courses/courses/:id/toggle`
- **Auth:** ✅ Required (Admin token)

## 9.15 Get Online Course Detail by ID (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/online-courses/detail/:onlineCourseId`
- **Auth:** ✅ Required (Admin token)

## 9.16 Save Online Course Detail (Admin — POST = upsert)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/online-courses/detail`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "onlineCourseId": 3,
  "slug": "react-js-bootcamp",

  "heroBadge": "Most Popular",
  "university": "IIT Delhi",
  "heroTitleNormal": "Master React JS",
  "heroTitleOrange": "With Placement",
  "heroDescription": "Complete React JS course with hands-on projects...",
  "heroDuration": "6 Months",
  "heroMode": "Online + Live",
  "heroStarts": "15 Jan 2025",
  "heroImage": "https://cdn.example.com/hero.jpg",
  "heroReviewText": "This course changed my career completely!",
  "heroReviewAuthor": "Priya Sharma, Google",
  "heroUrgencyText": "Only 20 seats left — Enroll Now!",
  "brochureUrl": "https://cdn.example.com/brochure.pdf",

  "alumniCompanies": ["https://cdn.example.com/google.png", "https://cdn.example.com/meta.png"],

  "legacyTitle": "Why Choose Us?",
  "legacySubtitle": "10 years of excellence in education",
  "legacyCards": [
    { "icon": "FaAward", "title": "Top Ranked", "desc": "Ranked #1 in India" }
  ],

  "aiSectionTitle": "AI-Powered Learning",
  "aiSectionSubtext": "Learn with cutting-edge AI tools",
  "aiHighlights": [
    { "icon": "FaRobot", "text": "AI Mock Interviews" }
  ],
  "aiStat1Value": "50,000+",
  "aiStat1Label": "Students Placed",
  "aiStat2Value": "95%",
  "aiStat2Label": "Placement Rate",
  "aiPromoTitle": "Powered by AI",
  "aiPromoText": "Get personalized learning path using AI",

  "quickHighlights": [
    { "icon": "FaClock", "label": "Duration", "value": "6 Months" },
    { "icon": "FaLaptop", "label": "Mode", "value": "Online Live" }
  ],

  "learningJourneyTitle": "Your Learning Path",
  "learningJourney": [
    { "step": 1, "title": "Foundations", "desc": "HTML, CSS, JS basics" },
    { "step": 2, "title": "React Core", "desc": "Components, Hooks, State" }
  ],

  "curriculum": [
    { "moduleTitle": "Introduction", "topics": ["Overview", "Setup", "Hello World"] },
    { "moduleTitle": "Advanced React", "topics": ["Redux", "Context API"] }
  ],

  "tools": [
    { "name": "React", "icon": "https://cdn.example.com/react.png" },
    { "name": "Node.js", "icon": "https://cdn.example.com/node.png" }
  ],

  "realWorldProjects": [
    { "title": "E-Commerce App", "desc": "Build a full e-commerce platform", "image": "https://cdn.example.com/proj1.jpg" }
  ],

  "capstoneProjects": [
    { "title": "Final Project", "desc": "End-to-end full stack app", "image": "https://cdn.example.com/cap.jpg" }
  ],

  "mentors": [
    { "name": "Raj Kumar", "role": "Senior Engineer at Google", "photo": "https://cdn.example.com/raj.jpg", "company": "https://cdn.example.com/google.png" }
  ],

  "credentialTitle": "Certificate of Completion",
  "credentialSubtitle": "Industry-recognized certificate",
  "credentialFeatures": [
    { "icon": "FaCertificate", "text": "Globally Recognized" },
    { "icon": "FaShieldAlt", "text": "Verified by IIT" }
  ],
  "certificateImage": "https://cdn.example.com/cert.jpg",

  "careerJourneySteps": [
    { "step": 1, "title": "Learn", "desc": "Master the skills" },
    { "step": 2, "title": "Build", "desc": "Create real projects" },
    { "step": 3, "title": "Get Hired", "desc": "Land your dream job" }
  ],

  "careerStats": [
    { "value": "95%", "label": "Placement Rate" },
    { "value": "3x", "label": "Salary Hike" }
  ],

  "successStories": [
    { "name": "Priya Sharma", "role": "SDE at Amazon", "quote": "Best decision of my life!", "photo": "https://cdn.example.com/priya.jpg" }
  ],

  "learningExperience": [
    { "icon": "FaVideo", "title": "Live Classes", "desc": "Daily live sessions with experts" }
  ],

  "showAlumni": true,
  "showLegacy": true,
  "showAiSection": true,
  "showQuickHighlights": true,
  "showLearningJourney": true,
  "showCurriculum": true,
  "showTools": true,
  "showRealProjects": true,
  "showCapstone": true,
  "showMentors": true,
  "showCredential": true,
  "showCareerSupport": true,
  "isActive": true
}
```
> `onlineCourseId` aur `slug` **required** hain. Baaki sab optional (null allowed).
> Array fields (`alumniCompanies`, `curriculum`, `tools`, etc.) — array ya JSON string dono chalega.
> `show*` fields — `false` dene pe wo section frontend pe hide ho jaata hai.


---

# ═══════════════════════════════════════════════════
# 10. INSTRUCTORS APIs
# ═══════════════════════════════════════════════════

## 10.1 Get Instructor Section Heading (Public — Frontend)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/instructors/section`
- **Auth:** ❌ Not required

## 10.2 Get Active Instructors (Public — Frontend)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/instructors`
- **Auth:** ❌ Not required

## 10.3 Get AllPrograms Hero (Public — Frontend)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/instructors/hero/all-programs`
- **Auth:** ❌ Not required

## 10.4 Get All Instructors (Admin — includes inactive)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/instructors?all=1`
- **Auth:** ✅ Required (Admin token)

## 10.5 Get Instructor by ID (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/instructors/:id`
- **Auth:** ✅ Required (Admin token)

## 10.6 Save Instructor Section Heading (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/instructors/section`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "tagText": "Expert Faculty",
  "headingNormal": "Learn from the",
  "headingOrange": "Best Instructors",
  "viewAllText": "View All",
  "viewAllLink": "/instructors"
}
```

## 10.7 Add Instructor (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/instructors`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "name": "Dr. Raj Kumar",
  "role": "Data Science Expert",
  "photo": "https://cdn.example.com/instructor.jpg",
  "companyLogo": "https://cdn.example.com/company.jpg",
  "description": "10+ years experience in Data Science and ML",
  "cardBg": "blue",
  "facebookUrl": "https://facebook.com/rajkumar",
  "twitterUrl": "https://twitter.com/rajkumar",
  "linkedinUrl": "https://linkedin.com/in/rajkumar",
  "youtubeUrl": "https://youtube.com/rajkumar",
  "sortOrder": 1,
  "isActive": true
}
```
> `cardBg` values: `"blue"` | `"purple"` | `"green"` etc.

## 10.8 Update Instructor (Admin)
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/instructors/:id`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):** Same as Add

## 10.9 Delete Instructor (Admin)
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/instructors/:id`
- **Auth:** ✅ Required (Admin token)

## 10.10 Toggle Instructor (Admin)
- **Method:** `PATCH`
- **URL:** `http://localhost:5000/api/instructors/:id/toggle`
- **Auth:** ✅ Required (Admin token)

## 10.11 Save AllPrograms Hero (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/instructors/hero/all-programs`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "headingLine1": "All Our Programs",
  "headingLine2": "Designed for Future Leaders",
  "bgImage": "https://cdn.example.com/hero-bg.jpg"
}
```


---

# ═══════════════════════════════════════════════════
# 11. SUBSCRIPTION BANNER APIs
# ═══════════════════════════════════════════════════

## 11.1 Get Subscription Banner (Public — Frontend)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/subscription-banner`
- **Auth:** ❌ Not required

## 11.2 Save Subscription Banner (Admin — POST/PUT = upsert)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/subscription-banner`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "heading": "Start Learning Today",
  "description": "Get access to all premium courses",
  "feature1Label": "Live Classes",
  "feature1Icon": "video",
  "feature1Color": "#FF5722",
  "feature2Label": "Mentorship",
  "feature2Icon": "user",
  "feature2Color": "#2196F3",
  "feature3Label": "Certificate",
  "feature3Icon": "award",
  "feature3Color": "#4CAF50",
  "feature4Label": "Placement",
  "feature4Icon": "briefcase",
  "feature4Color": "#9C27B0",
  "btnText": "Enroll Now",
  "btnLink": "/enroll",
  "image": "https://cdn.example.com/sub-banner.jpg",
  "isActive": true
}
```

---

# ═══════════════════════════════════════════════════
# 12. SUCCESS SECTION APIs
# ═══════════════════════════════════════════════════

## 12.1 Get Success Section Config (Public — Frontend)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/success-section/config`
- **Auth:** ❌ Not required

## 12.2 Get Active Success Stories (Public — Frontend)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/success-section/stories`
- **Auth:** ❌ Not required

## 12.3 Save Success Section Config (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/success-section/config`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "tagText": "Alumni Success",
  "headingNormal": "Our Learners",
  "headingOrange": "Are Placed Everywhere",
  "stat1Value": "50,000+",
  "stat1Label": "Learners",
  "stat2Value": "95%",
  "stat2Label": "Placement Rate",
  "stat3Value": "500+",
  "stat3Label": "Companies",
  "stat4Value": "3x",
  "stat4Label": "Salary Hike",
  "bannerTopLabel": "Join the community",
  "bannerHeading": "Become a Success Story",
  "bannerDesc": "Enroll today and transform your career",
  "bannerBtnText": "Get Started",
  "bannerBtnLink": "/enroll",
  "learnerImages": "[\"url1\",\"url2\",\"url3\"]",
  "isActive": true
}
```

## 12.4 Get All Stories (Admin — includes inactive)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/success-section/stories?all=1`
- **Auth:** ✅ Required (Admin token)

## 12.5 Get Story by ID (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/success-section/stories/:id`
- **Auth:** ✅ Required (Admin token)

## 12.6 Add Success Story (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/success-section/stories`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "quote": "This course changed my life completely!",
  "descStrong": "Got placed at Google",
  "descRest": "with a package of 25 LPA after completing this course",
  "name": "Priya Sharma",
  "program": "Data Science & ML",
  "roleText": "Software Engineer at Google",
  "image": "https://cdn.example.com/priya.jpg",
  "videoLink": "https://youtube.com/watch?v=xxx",
  "sortOrder": 1,
  "isActive": true
}
```

## 12.7 Update Success Story (Admin)
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/success-section/stories/:id`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):** Same as Add

## 12.8 Delete Success Story (Admin)
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/success-section/stories/:id`
- **Auth:** ✅ Required (Admin token)

## 12.9 Toggle Success Story (Admin)
- **Method:** `PATCH`
- **URL:** `http://localhost:5000/api/success-section/stories/:id/toggle`
- **Auth:** ✅ Required (Admin token)


---

# ═══════════════════════════════════════════════════
# 13. AWARDS SECTION APIs
# ═══════════════════════════════════════════════════

## 13.1 Get Awards Config (Public — Frontend)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/awards-section/config`
- **Auth:** ❌ Not required

## 13.2 Get Active Award Cards (Public — Frontend)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/awards-section/cards`
- **Auth:** ❌ Not required

## 13.3 Save Awards Config (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/awards-section/config`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "headingNormal": "Our",
  "headingOrange": "Awards & Recognition",
  "mainImage": "https://cdn.example.com/awards-main.jpg",
  "supportHeadingBold": "Trusted",
  "supportHeadingNormal": "by Industry Leaders",
  "supportDesc": "Recognized globally for excellence in education",
  "supportCard1Image": "https://cdn.example.com/card1.jpg",
  "supportCard2Image": "https://cdn.example.com/card2.jpg",
  "isActive": true
}
```

## 13.4 Get All Award Cards (Admin — includes inactive)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/awards-section/cards?all=1`
- **Auth:** ✅ Required (Admin token)

## 13.5 Get Award Card by ID (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/awards-section/cards/:id`
- **Auth:** ✅ Required (Admin token)

## 13.6 Add Award Card (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/awards-section/cards`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "cardImage": "https://cdn.example.com/award1.jpg",
  "dataText": "Best EdTech 2024",
  "title": "Education Excellence Award",
  "description": "Awarded by India Education Summit for outstanding contributions",
  "sortOrder": 1,
  "isActive": true
}
```

## 13.7 Update Award Card (Admin)
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/awards-section/cards/:id`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):** Same as Add

## 13.8 Delete Award Card (Admin)
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/awards-section/cards/:id`
- **Auth:** ✅ Required (Admin token)

## 13.9 Toggle Award Card (Admin)
- **Method:** `PATCH`
- **URL:** `http://localhost:5000/api/awards-section/cards/:id/toggle`
- **Auth:** ✅ Required (Admin token)

---

# ═══════════════════════════════════════════════════
# 14. UNIVERSITY SLIDES APIs
# ═══════════════════════════════════════════════════

## 14.1 Get University Slides (Public — Frontend)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/university/slides`
- **Auth:** ❌ Not required
- **Response:** Slides array, har slide mein uske logos embedded hote hain

## 14.2 Get All University Slides (Admin — includes inactive)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/university/slides?all=1`
- **Auth:** ✅ Required (Admin token)

## 14.3 Add University Slide (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/university/slides`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "badgeText": "Top Universities",
  "heading": "Partner Universities",
  "description": "Learn from courses designed with top universities",
  "btnText": "Explore",
  "btnLink": "/universities",
  "sortOrder": 1,
  "isActive": true
}
```

## 14.4 Update University Slide (Admin)
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/university/slides/:id`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):** Same as Add

## 14.5 Delete University Slide (Admin)
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/university/slides/:id`
- **Auth:** ✅ Required (Admin token)

## 14.6 Toggle University Slide (Admin)
- **Method:** `PATCH`
- **URL:** `http://localhost:5000/api/university/slides/:id/toggle`
- **Auth:** ✅ Required (Admin token)

## 14.7 Add Logo to Slide (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/university/slides/:slideId/logos`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "name": "IIT Bombay",
  "logoUrl": "https://cdn.example.com/iitb.jpg",
  "sortOrder": 1,
  "isActive": true
}
```

## 14.8 Update Slide Logo (Admin)
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/university/slides/logos/:logoId`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):** Same as Add Logo

## 14.9 Delete Slide Logo (Admin)
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/university/slides/logos/:logoId`
- **Auth:** ✅ Required (Admin token)


---

# ═══════════════════════════════════════════════════
# 15. CURRICULUM APIs
# ═══════════════════════════════════════════════════

## 15.1 Get Curriculum Data (Public — Frontend)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/curriculum/data`
- **Auth:** ❌ Not required
- **Response:** `{ settings, cards }`

## 15.2 Get Curriculum Settings (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/curriculum/settings`
- **Auth:** ✅ Required (Admin token)

## 15.3 Save Curriculum Settings (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/curriculum/settings`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "headingLine1": "What You Will",
  "headingLine2": "Learn in This Course",
  "brochureUrl": "https://cdn.example.com/brochure.pdf"
}
```

## 15.4 Get All Curriculum Cards (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/curriculum?all=1`
- **Auth:** ✅ Required (Admin token)

## 15.5 Add Curriculum Card (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/curriculum`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "title": "Module 1: Python Fundamentals",
  "points": "[\"Variables\",\"Data Types\",\"Functions\",\"OOP\"]",
  "cardColor": "blue",
  "sortOrder": 1,
  "isActive": true
}
```
> `points` — JSON string of array. `cardColor` values: `"white"` | `"blue"` | `"purple"` etc.

## 15.6 Update Curriculum Card (Admin)
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/curriculum/:id`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):** Same as Add

## 15.7 Delete Curriculum Card (Admin)
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/curriculum/:id`
- **Auth:** ✅ Required (Admin token)

## 15.8 Toggle Curriculum Card (Admin)
- **Method:** `PATCH`
- **URL:** `http://localhost:5000/api/curriculum/:id/toggle`
- **Auth:** ✅ Required (Admin token)

---

# ═══════════════════════════════════════════════════
# 16. CURRICULUM COMPARISON APIs
# ═══════════════════════════════════════════════════

## 16.1 Get Curriculum Comparison Data (Public — Frontend)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/curriculum-comparison/data`
- **Auth:** ❌ Not required

## 16.2 Get Settings (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/curriculum-comparison/settings`
- **Auth:** ✅ Required (Admin token)

## 16.3 Save Settings (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/curriculum-comparison/settings`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "headingNormal": "Compare",
  "headingOrange": "Curriculum",
  "tabsJson": "[{\"key\":\"iitkgp\",\"label\":\"IIT KGP\"},{\"key\":\"online\",\"label\":\"Online\"}]"
}
```

## 16.4 Get All Cards (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/curriculum-comparison?all=1`
- **Auth:** ✅ Required (Admin token)

## 16.5 Add Card (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/curriculum-comparison`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "tabKey": "iitkgp",
  "part": "A",
  "partTitle": "Core Modules",
  "partBadge": "Foundation",
  "title": "Machine Learning Basics",
  "descr": "Introduction to ML concepts and algorithms",
  "hours": "40 Hours",
  "projects": "3 Projects",
  "extra": "Live Sessions",
  "iconUrl": "https://cdn.example.com/ml-icon.png",
  "sortOrder": 1,
  "isActive": true
}
```

## 16.6 Update Card (Admin)
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/curriculum-comparison/:id`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):** Same as Add

## 16.7 Delete Card (Admin)
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/curriculum-comparison/:id`
- **Auth:** ✅ Required (Admin token)

## 16.8 Toggle Card (Admin)
- **Method:** `PATCH`
- **URL:** `http://localhost:5000/api/curriculum-comparison/:id/toggle`
- **Auth:** ✅ Required (Admin token)


---

# ═══════════════════════════════════════════════════
# 17. SKILLS COMPARISON APIs
# ═══════════════════════════════════════════════════

## 17.1 Get Skills Comparison Data (Public — Frontend)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/skills-comparison/data`
- **Auth:** ❌ Not required

## 17.2 Get Settings (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/skills-comparison/settings`
- **Auth:** ✅ Required (Admin token)

## 17.3 Save Settings (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/skills-comparison/settings`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "headingNormal": "Skills You Will",
  "headingOrange": "Master"
}
```

## 17.4 Get All Cards (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/skills-comparison?all=1`
- **Auth:** ✅ Required (Admin token)

## 17.5 Add Card (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/skills-comparison`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "cardTitle": "Before This Course",
  "cardSubtitle": "Traditional Skills",
  "skills": "[\"Basic Excel\",\"Manual Reporting\",\"No ML Knowledge\"]",
  "sortOrder": 1,
  "isActive": true
}
```
> `skills` — JSON string of array.

## 17.6 Update Card (Admin)
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/skills-comparison/:id`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):** Same as Add

## 17.7 Delete Card (Admin)
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/skills-comparison/:id`
- **Auth:** ✅ Required (Admin token)

## 17.8 Toggle Card (Admin)
- **Method:** `PATCH`
- **URL:** `http://localhost:5000/api/skills-comparison/:id/toggle`
- **Auth:** ✅ Required (Admin token)

---

# ═══════════════════════════════════════════════════
# 18. TOOLS & TECH APIs
# ═══════════════════════════════════════════════════

## 18.1 Get Tools & Tech Data (Public — Frontend)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/tools-tech/data`
- **Auth:** ❌ Not required

## 18.2 Get Settings (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/tools-tech/settings`
- **Auth:** ✅ Required (Admin token)

## 18.3 Save Settings (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/tools-tech/settings`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "headingNormal": "Tools &",
  "headingOrange": "Technologies"
}
```

## 18.4 Get All Tools (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/tools-tech?all=1`
- **Auth:** ✅ Required (Admin token)

## 18.5 Add Tool (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/tools-tech`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "name": "TensorFlow",
  "iconUrl": "https://cdn.example.com/tensorflow.png",
  "sortOrder": 1,
  "isActive": true
}
```

## 18.6 Update Tool (Admin)
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/tools-tech/:id`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):** Same as Add

## 18.7 Delete Tool (Admin)
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/tools-tech/:id`
- **Auth:** ✅ Required (Admin token)

## 18.8 Toggle Tool (Admin)
- **Method:** `PATCH`
- **URL:** `http://localhost:5000/api/tools-tech/:id/toggle`
- **Auth:** ✅ Required (Admin token)


---

# ═══════════════════════════════════════════════════
# 19. COURSE OVERVIEW APIs
# ═══════════════════════════════════════════════════

## 19.1 Get Course Overview Data (Public — Frontend)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/course-overview/data`
- **Auth:** ❌ Not required

## 19.2 Get Settings (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/course-overview/settings`
- **Auth:** ✅ Required (Admin token)

## 19.3 Save Settings (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/course-overview/settings`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "headingNormal": "About",
  "headingOrange": "This Course",
  "mainDesc": "A comprehensive course designed for working professionals"
}
```

## 19.4 Get All Sections (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/course-overview?all=1`
- **Auth:** ✅ Required (Admin token)

## 19.5 Add Section (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/course-overview`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "title": "Program Highlights",
  "sectionType": "bullet",
  "paragraphs": "This is a detailed paragraph about the course overview",
  "subtitle": "Key Features",
  "bulletPoints": "[\"IIT KGP Certificate\",\"Live Sessions\",\"Placement Support\"]",
  "sortOrder": 1,
  "isActive": true
}
```
> `sectionType` values: `"text"` | `"bullet"` | `"mixed"`

## 19.6 Update Section (Admin)
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/course-overview/:id`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):** Same as Add

## 19.7 Delete Section (Admin)
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/course-overview/:id`
- **Auth:** ✅ Required (Admin token)

## 19.8 Toggle Section (Admin)
- **Method:** `PATCH`
- **URL:** `http://localhost:5000/api/course-overview/:id/toggle`
- **Auth:** ✅ Required (Admin token)

---

# ═══════════════════════════════════════════════════
# 20. COURSE PROJECTS APIs
# ═══════════════════════════════════════════════════

## 20.1 Get Course Projects Data (Public — Frontend)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/course-projects/data`
- **Auth:** ❌ Not required

## 20.2 Get Settings (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/course-projects/settings`
- **Auth:** ✅ Required (Admin token)

## 20.3 Save Settings (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/course-projects/settings`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "headingLine1": "Work on",
  "headingLine2": "Real World",
  "headingLine3": "Projects",
  "badgeText": "Hands-on Learning"
}
```

## 20.4 Get All Projects (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/course-projects?all=1`
- **Auth:** ✅ Required (Admin token)

## 20.5 Add Project (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/course-projects`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "title": "Customer Churn Prediction",
  "description": "Build an ML model to predict customer churn for a telecom company",
  "iconUrl": "https://cdn.example.com/project-icon.png",
  "skills": "[\"Python\",\"Scikit-learn\",\"Pandas\",\"Matplotlib\"]",
  "sortOrder": 1,
  "isActive": true
}
```

## 20.6 Update Project (Admin)
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/course-projects/:id`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):** Same as Add

## 20.7 Delete Project (Admin)
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/course-projects/:id`
- **Auth:** ✅ Required (Admin token)

## 20.8 Toggle Project (Admin)
- **Method:** `PATCH`
- **URL:** `http://localhost:5000/api/course-projects/:id/toggle`
- **Auth:** ✅ Required (Admin token)


---

# ═══════════════════════════════════════════════════
# 21. COURSE INSTRUCTORS APIs
# ═══════════════════════════════════════════════════

## 21.1 Get Course Instructors Data (Public — Frontend)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/course-instructors/data`
- **Auth:** ❌ Not required
- **Response:** `{ settings, tabs: [{ ...tab, cards: [...] }] }`

## 21.2 Get Settings (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/course-instructors/settings`
- **Auth:** ✅ Required (Admin token)

## 21.3 Save Settings (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/course-instructors/settings`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "headingNormal": "Meet Your",
  "headingOrange": "Instructors",
  "subtitle": "Learn from industry experts with years of experience"
}
```

## 21.4 Get All Tabs (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/course-instructors/tabs?all=1`
- **Auth:** ✅ Required (Admin token)

## 21.5 Add Tab (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/course-instructors/tabs`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "tabName": "Core Faculty",
  "sortOrder": 1,
  "isActive": true
}
```

## 21.6 Update Tab (Admin)
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/course-instructors/tabs/:id`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):** Same as Add

## 21.7 Delete Tab (Admin)
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/course-instructors/tabs/:id`
- **Auth:** ✅ Required (Admin token)

## 21.8 Toggle Tab (Admin)
- **Method:** `PATCH`
- **URL:** `http://localhost:5000/api/course-instructors/tabs/:id/toggle`
- **Auth:** ✅ Required (Admin token)

## 21.9 Get Cards by Tab (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/course-instructors/tabs/:tabId/cards?all=1`
- **Auth:** ✅ Required (Admin token)
- **Example:** `http://localhost:5000/api/course-instructors/tabs/2/cards?all=1`

## 21.10 Add Card to Tab (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/course-instructors/tabs/:tabId/cards`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "name": "Prof. Amit Verma",
  "role": "ML & AI Specialist",
  "photo": "https://cdn.example.com/amit.jpg",
  "linkedinUrl": "https://linkedin.com/in/amitverma",
  "cardBg": "card-bg-1",
  "sortOrder": 1,
  "isActive": true
}
```
> `cardBg` values: `"card-bg-1"` | `"card-bg-2"` | `"card-bg-3"` etc.

## 21.11 Update Card (Admin)
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/course-instructors/cards/:id`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):** Same as Add Card

## 21.12 Delete Card (Admin)
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/course-instructors/cards/:id`
- **Auth:** ✅ Required (Admin token)

## 21.13 Toggle Card (Admin)
- **Method:** `PATCH`
- **URL:** `http://localhost:5000/api/course-instructors/cards/:id/toggle`
- **Auth:** ✅ Required (Admin token)


---

# ═══════════════════════════════════════════════════
# 22. FAQ APIs
# ═══════════════════════════════════════════════════

## 22.1 Get FAQ Data (Public — Frontend)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/faq/data`
- **Auth:** ❌ Not required

## 22.2 Get Settings (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/faq/settings`
- **Auth:** ✅ Required (Admin token)

## 22.3 Save Settings (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/faq/settings`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "headingNormal": "Frequently Asked",
  "headingOrange": "Questions"
}
```

## 22.4 Get All FAQ Items (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/faq?all=1`
- **Auth:** ✅ Required (Admin token)

## 22.5 Add FAQ Item (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/faq`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "question": "What is the duration of this course?",
  "answer": "The course duration is 6 months with live sessions every weekend.",
  "subHeading": "Course Duration Details",
  "introText": "Here is everything you need to know about the timeline",
  "bulletPoints": "[\"6 months total\",\"Weekend live sessions\",\"Recorded backups available\"]",
  "outroText": "You can complete it at your own pace if needed.",
  "exampleHeading": "Sample Schedule",
  "examples": "[\"Week 1: Python Basics\",\"Week 2: Data Structures\"]",
  "sortOrder": 1,
  "isActive": true
}
```

## 22.6 Update FAQ Item (Admin)
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/faq/:id`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):** Same as Add

## 22.7 Delete FAQ Item (Admin)
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/faq/:id`
- **Auth:** ✅ Required (Admin token)

## 22.8 Toggle FAQ Item (Admin)
- **Method:** `PATCH`
- **URL:** `http://localhost:5000/api/faq/:id/toggle`
- **Auth:** ✅ Required (Admin token)

---

# ═══════════════════════════════════════════════════
# 23. ACHIEVE GOALS APIs
# ═══════════════════════════════════════════════════

## 23.1 Get Achieve Goals Data (Public — Frontend)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/achieve-goals/data`
- **Auth:** ❌ Not required

## 23.2 Get Settings (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/achieve-goals/settings`
- **Auth:** ✅ Required (Admin token)

## 23.3 Save Settings (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/achieve-goals/settings`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "headingNormal": "Achieve Your",
  "headingOrange": "Career Goals",
  "subHeading": "Everything you need to succeed in your career journey"
}
```

## 23.4 Get All Tabs (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/achieve-goals?all=1`
- **Auth:** ✅ Required (Admin token)

## 23.5 Add Tab (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/achieve-goals`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "tabLabel": "Get a Job",
  "infoTag": "Career",
  "infoSubtitle": "Land your dream job",
  "cardHeading": "Job Ready Program",
  "cardDesc": "Complete hands-on training with placement support",
  "imageUrl": "https://cdn.example.com/goal1.jpg",
  "videoUrl": "https://youtube.com/watch?v=xxx",
  "points": "[\"Resume Building\",\"Mock Interviews\",\"Placement Support\"]",
  "sortOrder": 1,
  "isActive": true
}
```

## 23.6 Update Tab (Admin)
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/achieve-goals/:id`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):** Same as Add

## 23.7 Delete Tab (Admin)
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/achieve-goals/:id`
- **Auth:** ✅ Required (Admin token)

## 23.8 Toggle Tab (Admin)
- **Method:** `PATCH`
- **URL:** `http://localhost:5000/api/achieve-goals/:id/toggle`
- **Auth:** ✅ Required (Admin token)


---

# ═══════════════════════════════════════════════════
# 24. FOOTER APIs
# ═══════════════════════════════════════════════════

## 24.1 Get Footer Data (Public — Frontend, one-call)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/footer/data`
- **Auth:** ❌ Not required
- **Response:** `{ columns: [{ ...col, links: [...] }] }`

## 24.2 Get All Columns (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/footer/columns?all=1`
- **Auth:** ✅ Required (Admin token)

## 24.3 Add Footer Column (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/footer/columns`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "heading": "Quick Links",
  "sortOrder": 1
}
```

## 24.4 Update Footer Column (Admin)
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/footer/columns/:id`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "heading": "Quick Links Updated",
  "sortOrder": 1,
  "isActive": true
}
```

## 24.5 Delete Footer Column (Admin)
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/footer/columns/:id`
- **Auth:** ✅ Required (Admin token)

## 24.6 Toggle Footer Column (Admin)
- **Method:** `PATCH`
- **URL:** `http://localhost:5000/api/footer/columns/:id/toggle`
- **Auth:** ✅ Required (Admin token)

## 24.7 Get Links by Column (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/footer/columns/:columnId/links?all=1`
- **Auth:** ✅ Required (Admin token)
- **Example:** `http://localhost:5000/api/footer/columns/3/links?all=1`

## 24.8 Add Footer Link (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/footer/columns/:columnId/links`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "title": "About Us",
  "url": "/about",
  "navbarLinkId": null,
  "sortOrder": 1
}
```
> `navbarLinkId` — optional. Agar footer link kisi navbar link se connected hai toh ID dalna.

## 24.9 Update Footer Link (Admin)
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/footer/links/:id`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "title": "About Us Updated",
  "url": "/about-us",
  "navbarLinkId": null,
  "sortOrder": 1,
  "isActive": true
}
```

## 24.10 Delete Footer Link (Admin)
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/footer/links/:id`
- **Auth:** ✅ Required (Admin token)

## 24.11 Toggle Footer Link (Admin)
- **Method:** `PATCH`
- **URL:** `http://localhost:5000/api/footer/links/:id/toggle`
- **Auth:** ✅ Required (Admin token)


---

# ═══════════════════════════════════════════════════
# 25. COURSES (Navbar-based Old API) APIs
# ═══════════════════════════════════════════════════

## 25.1 Get Course by Slug (Frontend)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/courses/slug/:slug`
- **Auth:** ❌ Not required
- **Example:** `http://localhost:5000/api/courses/slug/machine-learning`

## 25.2 Get All Courses (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/courses/all`
- **Auth:** ✅ Required (Admin token)

## 25.3 Get Course by Navbar ID (Admin)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/courses/navbar/:navbarLinkId`
- **Auth:** ✅ Required (Admin token)

## 25.4 Upsert Course by Navbar ID (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/courses/navbar/:navbarLinkId`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):** Full course detail object

## 25.5 Delete Course by Navbar ID (Admin)
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/courses/navbar/:navbarLinkId`
- **Auth:** ✅ Required (Admin token)

---

# ═══════════════════════════════════════════════════
# 26. UNIVERSITY (Old API — Logos) — DEPRECATED
# ═══════════════════════════════════════════════════
> Ye purana API hai. Nayi Slides API (#14) use karo. Yeh backward compatibility ke liye hai.

## 26.1 Get University Section (Public)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/university/section`
- **Auth:** ❌ Not required

## 26.2 Update University Section (Admin)
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/university/section`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "badgeText": "Trusted Partners",
  "heading": "Our University Partners",
  "description": "We collaborate with top universities worldwide",
  "btnText": "View All",
  "btnLink": "/universities"
}
```

## 26.3 Get All Logos (Public)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/university/logos`
- **Auth:** ❌ Not required

## 26.4 Add Logo (Admin)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/university/logos`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):**
```json
{
  "name": "IIT Delhi",
  "logoUrl": "https://cdn.example.com/iitd.jpg",
  "sortOrder": 1,
  "isActive": true
}
```

## 26.5 Update Logo (Admin)
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/university/logos/:id`
- **Auth:** ✅ Required (Admin token)
- **Body (JSON):** Same as Add

## 26.6 Delete Logo (Admin)
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/university/logos/:id`
- **Auth:** ✅ Required (Admin token)

## 26.7 Toggle Logo (Admin)
- **Method:** `PATCH`
- **URL:** `http://localhost:5000/api/university/logos/:id/toggle`
- **Auth:** ✅ Required (Admin token)


---

# ═══════════════════════════════════════════════════
# 🗂️ QUICK REFERENCE — SAARI APIS EK JAGAH
# ═══════════════════════════════════════════════════

| # | Section | Method | URL | Auth |
|---|---------|--------|-----|------|
| 1.1 | User Register | POST | /api/auth/register | ❌ |
| 1.2 | Verify OTP | POST | /api/auth/verify-otp | ❌ |
| 1.3 | Resend OTP | POST | /api/auth/resend-otp | ❌ |
| 1.4 | User Login | POST | /api/auth/login | ❌ |
| 1.5 | User Logout | POST | /api/auth/logout | ✅ User |
| 1.6 | Forgot Password | POST | /api/auth/forgot-password | ❌ |
| 1.7 | Verify Reset OTP | POST | /api/auth/verify-reset-otp | ❌ |
| 1.8 | Reset Password | POST | /api/auth/reset-password | ❌ |
| 1.9 | Admin Login | POST | /api/auth/admin/login | ❌ |
| 1.10 | Admin Logout | POST | /api/auth/admin/logout | ✅ Admin |
| 1.11 | Get Profile | GET | /api/auth/profile | ✅ User |
| 1.12 | Update Profile | PUT | /api/auth/profile | ✅ User |
| 1.13 | Update Profile Image | PUT | /api/auth/profile/image | ✅ User |
| 1.14 | Get All Users | GET | /api/auth/admin/users | ✅ Admin |
| 2.1 | Upload Image | POST | /api/upload | ✅ Admin |
| 3.1 | Get Navbar (Public) | GET | /api/navbar | ❌ |
| 3.2 | Get Navbar (Admin) | GET | /api/navbar?all=1 | ✅ Admin |
| 3.3 | Add Navbar Link | POST | /api/navbar | ✅ Admin |
| 3.4 | Update Navbar Link | PUT | /api/navbar/:id | ✅ Admin |
| 3.5 | Delete Navbar Link | DELETE | /api/navbar/:id | ✅ Admin |
| 3.6 | Toggle Navbar | PATCH | /api/navbar/:id/toggle | ✅ Admin |
| 4.1 | Get Banners (Public) | GET | /api/banners | ❌ |
| 4.2 | Get All Banners (Admin) | GET | /api/banners?all=1 | ✅ Admin |
| 4.3 | Get Banner By ID | GET | /api/banners/:id | ✅ Admin |
| 4.4 | Add Banner | POST | /api/banners | ✅ Admin |
| 4.5 | Update Banner | PUT | /api/banners/:id | ✅ Admin |
| 4.6 | Delete Banner | DELETE | /api/banners/:id | ✅ Admin |
| 4.7 | Toggle Banner | PATCH | /api/banners/:id/toggle | ✅ Admin |
| 5.1 | Submit Callback | POST | /api/leads/callback | ❌ |
| 5.2 | Submit Admission | POST | /api/leads/admission | ❌ |
| 5.3 | Get Callbacks | GET | /api/leads/callbacks | ✅ Admin |
| 5.4 | Mark Callback Read | PATCH | /api/leads/callbacks/:id/read | ✅ Admin |
| 5.5 | Mark All Callbacks Read | PATCH | /api/leads/callbacks/read-all | ✅ Admin |
| 5.6 | Get Admissions | GET | /api/leads/admissions | ✅ Admin |
| 5.7 | Mark Admission Read | PATCH | /api/leads/admissions/:id/read | ✅ Admin |
| 5.8 | Update Admission Status | PATCH | /api/leads/admissions/:id/status | ✅ Admin |
| 5.9 | Unread Count | GET | /api/leads/unread-count | ✅ Admin |
| 6.1 | Career Public Data | GET | /api/career/public | ❌ |
| 6.2 | Get Categories (Admin) | GET | /api/career/categories?all=1 | ✅ Admin |
| 6.3 | Add Category | POST | /api/career/categories | ✅ Admin |
| 6.4 | Update Category | PUT | /api/career/categories/:id | ✅ Admin |
| 6.5 | Delete Category | DELETE | /api/career/categories/:id | ✅ Admin |
| 6.7 | Get Courses by Category | GET | /api/career/courses/category/:id | ✅ Admin |
| 6.9 | Add Career Course | POST | /api/career/courses | ✅ Admin |
| 6.10 | Update Career Course | PUT | /api/career/courses/:id | ✅ Admin |
| 6.11 | Delete Career Course | DELETE | /api/career/courses/:id | ✅ Admin |
| 7.1 | Course Detail (Slug) | GET | /api/course-detail/slug/:slug | ❌ |
| 7.2 | Course Detail (Career ID) | GET | /api/course-detail/:id | ✅ Admin |
| 7.3 | Course Detail (Navbar ID) | GET | /api/course-detail/navbar/:id | ✅ Admin |
| 7.4 | Course Detail (Footer ID) | GET | /api/course-detail/footer-link/:id | ✅ Admin |
| 7.5 | Save Course Detail (Career) | POST | /api/course-detail | ✅ Admin |
| 7.6 | Save Course Detail (Navbar) | POST | /api/course-detail/navbar/:id | ✅ Admin |
| 7.7 | Save Course Detail (Footer) | POST | /api/course-detail/footer-link/:id | ✅ Admin |
| 8.1 | Free Courses Public | GET | /api/free-courses/public | ❌ |
| 8.2 | Get All Free Courses (Admin) | GET | /api/free-courses?all=1 | ✅ Admin |
| 8.3 | Add Free Course | POST | /api/free-courses | ✅ Admin |
| 8.4 | Update Free Course | PUT | /api/free-courses/:id | ✅ Admin |
| 8.5 | Delete Free Course | DELETE | /api/free-courses/:id | ✅ Admin |
| 9.1 | Online Courses Slider | GET | /api/online-courses/public | ❌ |
| 9.2 | All Online Courses | GET | /api/online-courses/public/all | ❌ |
| 9.3 | Online Course (Slug) | GET | /api/online-courses/detail/slug/:slug | ❌ |
| 9.4 | Get OC Categories (Admin) | GET | /api/online-courses/categories?all=1 | ✅ Admin |
| 9.5 | Add OC Category | POST | /api/online-courses/categories | ✅ Admin |
| 9.9 | Get OC by Category | GET | /api/online-courses/courses/category/:id | ✅ Admin |
| 9.11 | Add Online Course | POST | /api/online-courses/courses | ✅ Admin |
| 9.12 | Update Online Course | PUT | /api/online-courses/courses/:id | ✅ Admin |
| 9.15 | Get OC Detail (Admin) | GET | /api/online-courses/detail/:id | ✅ Admin |
| 9.16 | Save OC Detail | POST | /api/online-courses/detail | ✅ Admin |
| 10.1 | Instructor Section | GET | /api/instructors/section | ❌ |
| 10.2 | Get Instructors | GET | /api/instructors | ❌ |
| 10.3 | AllPrograms Hero | GET | /api/instructors/hero/all-programs | ❌ |
| 10.6 | Save Instructor Section | POST | /api/instructors/section | ✅ Admin |
| 10.7 | Add Instructor | POST | /api/instructors | ✅ Admin |
| 10.8 | Update Instructor | PUT | /api/instructors/:id | ✅ Admin |
| 10.9 | Delete Instructor | DELETE | /api/instructors/:id | ✅ Admin |
| 10.11 | Save AllPrograms Hero | POST | /api/instructors/hero/all-programs | ✅ Admin |
| 11.1 | Subscription Banner | GET | /api/subscription-banner | ❌ |
| 11.2 | Save Subscription Banner | POST | /api/subscription-banner | ✅ Admin |
| 12.1 | Success Config | GET | /api/success-section/config | ❌ |
| 12.2 | Success Stories | GET | /api/success-section/stories | ❌ |
| 12.3 | Save Success Config | POST | /api/success-section/config | ✅ Admin |
| 12.6 | Add Success Story | POST | /api/success-section/stories | ✅ Admin |
| 12.7 | Update Success Story | PUT | /api/success-section/stories/:id | ✅ Admin |
| 12.8 | Delete Success Story | DELETE | /api/success-section/stories/:id | ✅ Admin |
| 13.1 | Awards Config | GET | /api/awards-section/config | ❌ |
| 13.2 | Award Cards | GET | /api/awards-section/cards | ❌ |
| 13.3 | Save Awards Config | POST | /api/awards-section/config | ✅ Admin |
| 13.6 | Add Award Card | POST | /api/awards-section/cards | ✅ Admin |
| 13.7 | Update Award Card | PUT | /api/awards-section/cards/:id | ✅ Admin |
| 13.8 | Delete Award Card | DELETE | /api/awards-section/cards/:id | ✅ Admin |
| 14.1 | University Slides | GET | /api/university/slides | ❌ |
| 14.3 | Add University Slide | POST | /api/university/slides | ✅ Admin |
| 14.7 | Add Slide Logo | POST | /api/university/slides/:id/logos | ✅ Admin |
| 15.1 | Curriculum Data | GET | /api/curriculum/data | ❌ |
| 15.3 | Save Curriculum Settings | POST | /api/curriculum/settings | ✅ Admin |
| 15.5 | Add Curriculum Card | POST | /api/curriculum | ✅ Admin |
| 16.1 | Curriculum Comp Data | GET | /api/curriculum-comparison/data | ❌ |
| 16.3 | Save CurrComp Settings | POST | /api/curriculum-comparison/settings | ✅ Admin |
| 16.5 | Add CurrComp Card | POST | /api/curriculum-comparison | ✅ Admin |
| 17.1 | Skills Comp Data | GET | /api/skills-comparison/data | ❌ |
| 17.3 | Save Skills Settings | POST | /api/skills-comparison/settings | ✅ Admin |
| 17.5 | Add Skills Card | POST | /api/skills-comparison | ✅ Admin |
| 18.1 | Tools Tech Data | GET | /api/tools-tech/data | ❌ |
| 18.3 | Save Tools Settings | POST | /api/tools-tech/settings | ✅ Admin |
| 18.5 | Add Tool | POST | /api/tools-tech | ✅ Admin |
| 19.1 | Course Overview Data | GET | /api/course-overview/data | ❌ |
| 19.3 | Save Overview Settings | POST | /api/course-overview/settings | ✅ Admin |
| 19.5 | Add Overview Section | POST | /api/course-overview | ✅ Admin |
| 20.1 | Course Projects Data | GET | /api/course-projects/data | ❌ |
| 20.3 | Save Projects Settings | POST | /api/course-projects/settings | ✅ Admin |
| 20.5 | Add Project | POST | /api/course-projects | ✅ Admin |
| 21.1 | Course Instructors Data | GET | /api/course-instructors/data | ❌ |
| 21.3 | Save CI Settings | POST | /api/course-instructors/settings | ✅ Admin |
| 21.5 | Add CI Tab | POST | /api/course-instructors/tabs | ✅ Admin |
| 21.10 | Add CI Card | POST | /api/course-instructors/tabs/:id/cards | ✅ Admin |
| 22.1 | FAQ Data | GET | /api/faq/data | ❌ |
| 22.3 | Save FAQ Settings | POST | /api/faq/settings | ✅ Admin |
| 22.5 | Add FAQ Item | POST | /api/faq | ✅ Admin |
| 23.1 | Achieve Goals Data | GET | /api/achieve-goals/data | ❌ |
| 23.3 | Save AG Settings | POST | /api/achieve-goals/settings | ✅ Admin |
| 23.5 | Add AG Tab | POST | /api/achieve-goals | ✅ Admin |
| 24.1 | Footer Data | GET | /api/footer/data | ❌ |
| 24.3 | Add Footer Column | POST | /api/footer/columns | ✅ Admin |
| 24.8 | Add Footer Link | POST | /api/footer/columns/:id/links | ✅ Admin |
| 24.9 | Update Footer Link | PUT | /api/footer/links/:id | ✅ Admin |
| 25.1 | Course by Slug (Old) | GET | /api/courses/slug/:slug | ❌ |
| 25.4 | Upsert Course (Navbar) | POST | /api/courses/navbar/:id | ✅ Admin |
| 26.1 | University Section (Old) | GET | /api/university/section | ❌ |
| 26.3 | University Logos (Old) | GET | /api/university/logos | ❌ |

---

# ═══════════════════════════════════════════════════
# 📝 POSTMAN SETUP GUIDE
# ═══════════════════════════════════════════════════

## Step 1: Environment Variables banao
Postman mein ek Environment banao "Local Dev" aur ye variables add karo:
```
base_url    = http://localhost:5000/api
adminToken  = (admin login ke baad yahan paste karo)
userToken   = (user login ke baad yahan paste karo)
```

## Step 2: Admin Token lena
1. POST `{{base_url}}/auth/admin/login` call karo
2. Response mein token milega — use `adminToken` variable mein save karo

## Step 3: Protected Routes mein Header lagao
```
Key:   Authorization
Value: Bearer {{adminToken}}
```

## Step 4: Body Format
- JSON body ke liye: `Body → raw → JSON` select karo
- Image upload ke liye: `Body → form-data` select karo

## Step 5: Toggle/Delete APIs
- Toggle: PATCH method, body khali rakho
- Delete: DELETE method, body khali rakho

---
> **Note:** Saari `isActive` fields mein `true`/`false` ya `1`/`0` dono kaam karte hain.
> **Note:** Saari array fields (points, skills, bulletPoints, examples) JSON string format mein bhejo: `"[\"item1\",\"item2\"]"`
