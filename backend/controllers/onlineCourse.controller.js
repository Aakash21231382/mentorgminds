const { sql, config } = require('../config/database');

// ── CATEGORIES ───────────────────────────────────────────────

// GET all categories (admin: all, public: active only)
const getCategories = async (req, res) => {
    try {
        const showAll = req.query.all === '1' ? 1 : 0;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('ShowAll', sql.Bit, showAll)
            .execute('sp_GetOnlineCourseCategories');
        res.status(200).json({ success: true, categories: result.recordset });
    } catch (err) {
        console.error('OC Get Categories Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ADD category
const addCategory = async (req, res) => {
    try {
        const { name, sortOrder, isActive } = req.body;
        if (!name) return res.status(400).json({ success: false, message: 'Name is required' });

        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Name',      sql.VarChar(100), name)
            .input('SortOrder', sql.Int,          parseInt(sortOrder) || 0)
            .input('IsActive',  sql.Bit,          isActive !== undefined ? parseInt(isActive) : 1)
            .execute('sp_AddOnlineCourseCategory');

        res.status(201).json({ success: true, message: 'Category added', id: result.recordset[0].Id });
    } catch (err) {
        console.error('OC Add Category Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// UPDATE category
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, sortOrder, isActive } = req.body;
        if (!name) return res.status(400).json({ success: false, message: 'Name is required' });

        const pool = await sql.connect(config);
        await pool.request()
            .input('Id',        sql.Int,          id)
            .input('Name',      sql.VarChar(100), name)
            .input('SortOrder', sql.Int,          parseInt(sortOrder) || 0)
            .input('IsActive',  sql.Bit,          isActive !== undefined ? parseInt(isActive) : 1)
            .execute('sp_UpdateOnlineCourseCategory');

        res.status(200).json({ success: true, message: 'Category updated' });
    } catch (err) {
        console.error('OC Update Category Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// DELETE category
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        await pool.request()
            .input('Id', sql.Int, id)
            .execute('sp_DeleteOnlineCourseCategory');
        res.status(200).json({ success: true, message: 'Category deleted' });
    } catch (err) {
        console.error('OC Delete Category Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// TOGGLE category
const toggleCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Id', sql.Int, id)
            .execute('sp_ToggleOnlineCourseCategory');
        res.status(200).json({ success: true, isActive: result.recordset[0]?.IsActive });
    } catch (err) {
        console.error('OC Toggle Category Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── COURSES ──────────────────────────────────────────────────

// GET courses by categoryId
const getCourses = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const showAll = req.query.all === '1' ? 1 : 0;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('CategoryId', sql.Int, categoryId)
            .input('ShowAll',    sql.Bit, showAll)
            .execute('sp_GetOnlineCourses');
        res.status(200).json({ success: true, courses: result.recordset });
    } catch (err) {
        console.error('OC Get Courses Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// GET single course
const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Id', sql.Int, id)
            .execute('sp_GetOnlineCourseById');
        if (!result.recordset.length)
            return res.status(404).json({ success: false, message: 'Course not found' });
        res.status(200).json({ success: true, course: result.recordset[0] });
    } catch (err) {
        console.error('OC Get Course By Id Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ADD course
const addCourse = async (req, res) => {
    try {
        const { categoryId, title, subtitle, image, feature1, feature2, feature3,
                skillImage, skillImages, extraSkills, programUrl, brochureUrl, sortOrder, isActive } = req.body;

        if (!title || !categoryId)
            return res.status(400).json({ success: false, message: 'Title and category are required' });

        // skillImages is array of URLs — stringify for DB
        const skillImagesJson = skillImages
            ? (typeof skillImages === 'string' ? skillImages : JSON.stringify(skillImages))
            : null;

        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('CategoryId',  sql.Int,              categoryId)
            .input('Title',       sql.VarChar(500),      title)
            .input('Subtitle',    sql.VarChar(300),      subtitle     || null)
            .input('Image',       sql.VarChar(sql.MAX),  image        || null)
            .input('Feature1',    sql.VarChar(255),      feature1     || null)
            .input('Feature2',    sql.VarChar(255),      feature2     || null)
            .input('Feature3',    sql.VarChar(255),      feature3     || null)
            .input('SkillImage',  sql.VarChar(sql.MAX),  skillImage   || null)
            .input('SkillImages', sql.NVarChar(sql.MAX), skillImagesJson)
            .input('ExtraSkills', sql.Int,               parseInt(extraSkills) || 0)
            .input('ProgramUrl',  sql.VarChar(500),      programUrl   || null)
            .input('BrochureUrl', sql.VarChar(500),      brochureUrl  || null)
            .input('SortOrder',   sql.Int,               parseInt(sortOrder) || 0)
            .input('IsActive',    sql.Bit,               isActive !== undefined ? parseInt(isActive) : 1)
            .execute('sp_AddOnlineCourse');

        res.status(201).json({ success: true, message: 'Course added', id: result.recordset[0].Id });
    } catch (err) {
        console.error('OC Add Course Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// UPDATE course
const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoryId, title, subtitle, image, feature1, feature2, feature3,
                skillImage, skillImages, extraSkills, programUrl, brochureUrl, sortOrder, isActive } = req.body;

        if (!title || !categoryId)
            return res.status(400).json({ success: false, message: 'Title and category are required' });

        const skillImagesJson = skillImages
            ? (typeof skillImages === 'string' ? skillImages : JSON.stringify(skillImages))
            : null;

        const pool = await sql.connect(config);
        await pool.request()
            .input('Id',          sql.Int,              id)
            .input('CategoryId',  sql.Int,              categoryId)
            .input('Title',       sql.VarChar(500),      title)
            .input('Subtitle',    sql.VarChar(300),      subtitle     || null)
            .input('Image',       sql.VarChar(sql.MAX),  image        || null)
            .input('Feature1',    sql.VarChar(255),      feature1     || null)
            .input('Feature2',    sql.VarChar(255),      feature2     || null)
            .input('Feature3',    sql.VarChar(255),      feature3     || null)
            .input('SkillImage',  sql.VarChar(sql.MAX),  skillImage   || null)
            .input('SkillImages', sql.NVarChar(sql.MAX), skillImagesJson)
            .input('ExtraSkills', sql.Int,               parseInt(extraSkills) || 0)
            .input('ProgramUrl',  sql.VarChar(500),      programUrl   || null)
            .input('BrochureUrl', sql.VarChar(500),      brochureUrl  || null)
            .input('SortOrder',   sql.Int,               parseInt(sortOrder) || 0)
            .input('IsActive',    sql.Bit,               isActive !== undefined ? parseInt(isActive) : 1)
            .execute('sp_UpdateOnlineCourse');

        res.status(200).json({ success: true, message: 'Course updated' });
    } catch (err) {
        console.error('OC Update Course Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// DELETE course
const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        await pool.request()
            .input('Id', sql.Int, id)
            .execute('sp_DeleteOnlineCourse');
        res.status(200).json({ success: true, message: 'Course deleted' });
    } catch (err) {
        console.error('OC Delete Course Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// TOGGLE course
const toggleCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Id', sql.Int, id)
            .execute('sp_ToggleOnlineCourse');
        res.status(200).json({ success: true, isActive: result.recordset[0]?.IsActive });
    } catch (err) {
        console.error('OC Toggle Course Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── PUBLIC ───────────────────────────────────────────────────

// Frontend OnlineCourse section ke liye
const getPublicOnlineCourseData = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().execute('sp_GetPublicOnlineCourseData');

        const categories = result.recordsets?.[0] || [];
        const courses    = result.recordsets?.[1] || [];

        res.status(200).json({ success: true, categories, courses });
    } catch (err) {
        console.error('OC Get Public Data Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// "View All Online Courses" page ke liye — paginated
const getAllPublicOnlineCourses = async (req, res) => {
    try {
        const categoryId = req.query.categoryId ? parseInt(req.query.categoryId) : null;
        const pageNo     = parseInt(req.query.page)     || 1;
        const pageSize   = parseInt(req.query.pageSize) || 9;

        const pool = await sql.connect(config);
        const request = pool.request()
            .input('PageNo',   sql.Int, pageNo)
            .input('PageSize', sql.Int, pageSize);

        if (categoryId) request.input('CategoryId', sql.Int, categoryId);
        else            request.input('CategoryId', sql.Int, null);

        const result = await request.execute('sp_GetAllPublicOnlineCourses');

        const totalCount = result.recordsets?.[0]?.[0]?.TotalCount || 0;
        const courses    = result.recordsets?.[1] || [];

        res.status(200).json({
            success: true,
            courses,
            totalCount,
            page:      pageNo,
            pageSize,
            totalPages: Math.ceil(totalCount / pageSize)
        });
    } catch (err) {
        console.error('OC Get All Public Courses Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getCategories, addCategory, updateCategory, deleteCategory, toggleCategory,
    getCourses, getCourseById, addCourse, updateCourse, deleteCourse, toggleCourse,
    getPublicOnlineCourseData, getAllPublicOnlineCourses
};
