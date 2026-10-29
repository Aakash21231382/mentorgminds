const { sql, config } = require('../config/database');

// ── CATEGORIES ───────────────────────────────────────────────

// GET all categories (admin: all, public: active only)
const getCategories = async (req, res) => {
    try {
        const showAll = req.query.all === '1' ? 1 : 0;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('ShowAll', sql.Bit, showAll)
            .execute('sp_GetCareerCategories');
        res.status(200).json({ success: true, categories: result.recordset });
    } catch (err) {
        console.error('Get Categories Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ADD category
const addCategory = async (req, res) => {
    try {
        const { name, image, sortOrder, isActive } = req.body;
        if (!name) return res.status(400).json({ success: false, message: 'Name is required' });

        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Name',      sql.VarChar(100), name)
            .input('Image',     sql.VarChar(sql.MAX), image || null)
            .input('SortOrder', sql.Int, parseInt(sortOrder) || 0)
            .input('IsActive',  sql.Bit, isActive !== undefined ? parseInt(isActive) : 1)
            .execute('sp_AddCareerCategory');

        res.status(201).json({ success: true, message: 'Category added', id: result.recordset[0].Id });
    } catch (err) {
        console.error('Add Category Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// UPDATE category
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, image, sortOrder, isActive } = req.body;
        if (!name) return res.status(400).json({ success: false, message: 'Name is required' });

        const pool = await sql.connect(config);
        await pool.request()
            .input('Id',        sql.Int,          id)
            .input('Name',      sql.VarChar(100), name)
            .input('Image',     sql.VarChar(sql.MAX), image || null)
            .input('SortOrder', sql.Int,          parseInt(sortOrder) || 0)
            .input('IsActive',  sql.Bit,          isActive !== undefined ? parseInt(isActive) : 1)
            .execute('sp_UpdateCareerCategory');

        res.status(200).json({ success: true, message: 'Category updated' });
    } catch (err) {
        console.error('Update Category Error:', err);
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
            .execute('sp_DeleteCareerCategory');
        res.status(200).json({ success: true, message: 'Category deleted' });
    } catch (err) {
        console.error('Delete Category Error:', err);
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
            .execute('sp_ToggleCareerCategory');
        res.status(200).json({ success: true, isActive: result.recordset[0]?.IsActive });
    } catch (err) {
        console.error('Toggle Category Error:', err);
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
            .execute('sp_GetCareerCourses');
        res.status(200).json({ success: true, courses: result.recordset });
    } catch (err) {
        console.error('Get Courses Error:', err);
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
            .execute('sp_GetCareerCourseById');
        if (!result.recordset.length)
            return res.status(404).json({ success: false, message: 'Course not found' });
        res.status(200).json({ success: true, course: result.recordset[0] });
    } catch (err) {
        console.error('Get Course By Id Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ADD course
const addCourse = async (req, res) => {
    try {
        const { categoryId, ribbon, ribbonColor, logo, location, title,
                feature1Text, feature1Icon, feature2Text, feature2Icon,
                sortOrder, isActive } = req.body;

        if (!title || !categoryId)
            return res.status(400).json({ success: false, message: 'Title and category are required' });

        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('CategoryId',   sql.Int,          categoryId)
            .input('Ribbon',       sql.VarChar(50),  ribbon       || null)
            .input('RibbonColor',  sql.VarChar(20),  ribbonColor  || null)
            .input('Logo',         sql.VarChar(sql.MAX), logo     || null)
            .input('Location',     sql.VarChar(150), location     || null)
            .input('Title',        sql.VarChar(500), title)
            .input('Feature1Text', sql.VarChar(255), feature1Text || null)
            .input('Feature1Icon', sql.VarChar(50),  feature1Icon || null)
            .input('Feature2Text', sql.VarChar(255), feature2Text || null)
            .input('Feature2Icon', sql.VarChar(50),  feature2Icon || null)
            .input('SortOrder',    sql.Int,          parseInt(sortOrder) || 0)
            .input('IsActive',     sql.Bit,          isActive !== undefined ? parseInt(isActive) : 1)
            .execute('sp_AddCareerCourse');

        res.status(201).json({ success: true, message: 'Course added', id: result.recordset[0].Id });
    } catch (err) {
        console.error('Add Course Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// UPDATE course
const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoryId, ribbon, ribbonColor, logo, location, title,
                feature1Text, feature1Icon, feature2Text, feature2Icon,
                sortOrder, isActive } = req.body;

        if (!title || !categoryId)
            return res.status(400).json({ success: false, message: 'Title and category are required' });

        const pool = await sql.connect(config);
        await pool.request()
            .input('Id',           sql.Int,          id)
            .input('CategoryId',   sql.Int,          categoryId)
            .input('Ribbon',       sql.VarChar(50),  ribbon       || null)
            .input('RibbonColor',  sql.VarChar(20),  ribbonColor  || null)
            .input('Logo',         sql.VarChar(sql.MAX), logo     || null)
            .input('Location',     sql.VarChar(150), location     || null)
            .input('Title',        sql.VarChar(500), title)
            .input('Feature1Text', sql.VarChar(255), feature1Text || null)
            .input('Feature1Icon', sql.VarChar(50),  feature1Icon || null)
            .input('Feature2Text', sql.VarChar(255), feature2Text || null)
            .input('Feature2Icon', sql.VarChar(50),  feature2Icon || null)
            .input('SortOrder',    sql.Int,          parseInt(sortOrder) || 0)
            .input('IsActive',     sql.Bit,          isActive !== undefined ? parseInt(isActive) : 1)
            .execute('sp_UpdateCareerCourse');

        res.status(200).json({ success: true, message: 'Course updated' });
    } catch (err) {
        console.error('Update Course Error:', err);
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
            .execute('sp_DeleteCareerCourse');
        res.status(200).json({ success: true, message: 'Course deleted' });
    } catch (err) {
        console.error('Delete Course Error:', err);
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
            .execute('sp_ToggleCareerCourse');
        res.status(200).json({ success: true, isActive: result.recordset[0]?.IsActive });
    } catch (err) {
        console.error('Toggle Course Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── PUBLIC ───────────────────────────────────────────────────
// Frontend ke liye — categories + courses ek saath
const getPublicCareerData = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().execute('sp_GetPublicCareerData');

        // SP 2 result sets return karta hai:
        // recordsets[0] = categories, recordsets[1] = courses (with Slug + BrochureUrl)
        const categories = result.recordsets?.[0] || [];
        const courses    = result.recordsets?.[1] || [];

        res.status(200).json({ success: true, categories, courses });
    } catch (err) {
        console.error('Get Public Career Data Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getCategories, addCategory, updateCategory, deleteCategory, toggleCategory,
    getCourses, getCourseById, addCourse, updateCourse, deleteCourse, toggleCourse,
    getPublicCareerData
};
