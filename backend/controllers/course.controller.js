const { sql, config } = require('../config/database');

// ============================================================
// 1. Upsert Course Details (Insert ya Update)
// ============================================================
const upsertCourseDetails = async (req, res) => {
    try {
        const { navbarLinkId } = req.params;
        const {
            slug, category,
            heroTitle, heroSubtitle, heroBadge, heroImage,
            overviewTitle, overviewDescription,
            keyHighlights, curriculum, whoShouldEnroll,
            originalFee, discountedFee, duration,
            rating, studentsEnrolled,
            institutionName, institutionLogo,
            certificateTitle, certificateImage,
            faqs, metaTitle, metaDescription, isActive,
            brochureUrl,
        } = req.body;

        const pool = await sql.connect(config);

        const result = await pool.request()
            .input('NavbarLinkId',        sql.Int,              navbarLinkId)
            .input('Slug',                sql.VarChar(150),     slug              || null)
            .input('Category',            sql.VarChar(50),      category          || null)
            .input('HeroTitle',           sql.VarChar(255),     heroTitle         || null)
            .input('HeroSubtitle',        sql.VarChar(500),     heroSubtitle      || null)
            .input('HeroImage',           sql.VarChar(sql.MAX), heroImage         || null)
            .input('HeroBadge',           sql.VarChar(100),     heroBadge         || null)
            .input('OverviewTitle',       sql.VarChar(255),     overviewTitle     || null)
            .input('OverviewDescription', sql.NVarChar(sql.MAX), overviewDescription || null)
            .input('KeyHighlights',       sql.NVarChar(sql.MAX), keyHighlights    || null)
            .input('Curriculum',          sql.NVarChar(sql.MAX), curriculum       || null)
            .input('WhoShouldEnroll',     sql.NVarChar(sql.MAX), whoShouldEnroll  || null)
            .input('OriginalFee',         sql.VarChar(50),      originalFee       || null)
            .input('DiscountedFee',       sql.VarChar(50),      discountedFee     || null)
            .input('Duration',            sql.VarChar(100),     duration          || null)
            .input('Rating',              sql.Decimal(2, 1),    rating ? parseFloat(rating) : null)
            .input('StudentsEnrolled',    sql.Int,              studentsEnrolled ? parseInt(studentsEnrolled) : null)
            .input('InstitutionName',     sql.VarChar(150),     institutionName   || null)
            .input('InstitutionLogo',     sql.VarChar(sql.MAX), institutionLogo   || null)
            .input('CertificateTitle',    sql.VarChar(255),     certificateTitle  || null)
            .input('CertificateImage',    sql.VarChar(sql.MAX), certificateImage  || null)
            .input('FAQs',                sql.NVarChar(sql.MAX), faqs             || null)
            .input('MetaTitle',           sql.VarChar(255),     metaTitle         || null)
            .input('MetaDescription',     sql.VarChar(500),     metaDescription   || null)
            .input('BrochureUrl',         sql.VarChar(sql.MAX), brochureUrl       || null)
            .input('IsActive',            sql.Bit,              isActive !== undefined ? isActive : 1)
            .execute('sp_UpsertCourseDetails');

        const action = result.recordset[0]?.action;
        if (action === 'updated') {
            return res.status(200).json({ success: true, message: 'Course details updated successfully' });
        } else {
            return res.status(201).json({ success: true, message: 'Course details added successfully' });
        }
    } catch (error) {
        console.error('Upsert Course Details Error:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// ============================================================
// 2. Get Course by Slug — Frontend detail page
// ============================================================
const getCourseBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Slug', sql.VarChar(150), slug)
            .execute('sp_GetCourseBySlug');

        if (!result.recordset.length)
            return res.status(404).json({ success: false, message: 'Course not found' });

        const course = result.recordset[0];
        try { course.KeyHighlights   = course.KeyHighlights   ? JSON.parse(course.KeyHighlights)   : []; } catch { course.KeyHighlights   = []; }
        try { course.Curriculum      = course.Curriculum      ? JSON.parse(course.Curriculum)      : []; } catch { course.Curriculum      = []; }
        try { course.WhoShouldEnroll = course.WhoShouldEnroll ? JSON.parse(course.WhoShouldEnroll) : []; } catch { course.WhoShouldEnroll = []; }
        try { course.FAQs            = course.FAQs            ? JSON.parse(course.FAQs)            : []; } catch { course.FAQs            = []; }

        res.status(200).json({ success: true, course });
    } catch (error) {
        console.error('Get Course By Slug Error:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// ============================================================
// 3. Get Course by NavbarLinkId — Admin edit form
// ============================================================
const getCourseByNavbarId = async (req, res) => {
    try {
        const { navbarLinkId } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('NavbarLinkId', sql.Int, navbarLinkId)
            .execute('sp_GetCourseByNavbarId');

        if (!result.recordset.length)
            return res.status(404).json({ success: false, message: 'No details found for this link' });

        res.status(200).json({ success: true, course: result.recordset[0] });
    } catch (error) {
        console.error('Get Course By NavbarId Error:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// ============================================================
// 4. Get All Courses — Admin listing
// ============================================================
const getAllCourses = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().execute('sp_GetAllCourses');
        res.status(200).json({ success: true, courses: result.recordset });
    } catch (error) {
        console.error('Get All Courses Error:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// ============================================================
// 5. Delete Course Details
// ============================================================
const deleteCourseDetails = async (req, res) => {
    try {
        const { navbarLinkId } = req.params;
        const pool = await sql.connect(config);
        await pool.request()
            .input('NavbarLinkId', sql.Int, navbarLinkId)
            .execute('sp_DeleteCourseDetails');
        res.status(200).json({ success: true, message: 'Course details deleted' });
    } catch (error) {
        console.error('Delete Course Details Error:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

module.exports = {
    upsertCourseDetails,
    getCourseBySlug,
    getCourseByNavbarId,
    getAllCourses,
    deleteCourseDetails,
};
