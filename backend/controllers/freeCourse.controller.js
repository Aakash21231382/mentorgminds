const { sql, config } = require('../config/database');

// Public — frontend ke liye
const getPublicFreeCourses = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().execute('sp_GetPublicFreeCourses');
        res.status(200).json({ success: true, courses: result.recordset });
    } catch (err) {
        console.error('Get Public Free Courses Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Admin — all
const getAllFreeCourses = async (req, res) => {
    try {
        const showAll = req.query.all === '1' ? 1 : 0;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('ShowAll', sql.Bit, showAll)
            .execute('sp_GetAllFreeCourses');
        res.status(200).json({ success: true, courses: result.recordset });
    } catch (err) {
        console.error('Get All Free Courses Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Add
const addFreeCourse = async (req, res) => {
    try {
        const { title, image, learners, duration, programUrl, enrollUrl, sortOrder, isActive } = req.body;
        if (!title) return res.status(400).json({ success: false, message: 'Title is required' });

        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Title',      sql.VarChar(300), title)
            .input('Image',      sql.VarChar(sql.MAX), image || null)
            .input('Learners',   sql.VarChar(50),  learners   || null)
            .input('Duration',   sql.VarChar(50),  duration   || null)
            .input('ProgramUrl', sql.VarChar(500), programUrl || null)
            .input('EnrollUrl',  sql.VarChar(500), enrollUrl  || null)
            .input('SortOrder',  sql.Int,          parseInt(sortOrder) || 0)
            .input('IsActive',   sql.Bit,          isActive !== undefined ? parseInt(isActive) : 1)
            .execute('sp_AddFreeCourse');

        res.status(201).json({ success: true, message: 'Free course added', id: result.recordset[0].Id });
    } catch (err) {
        console.error('Add Free Course Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// Update
const updateFreeCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, image, learners, duration, programUrl, enrollUrl, sortOrder, isActive } = req.body;
        if (!title) return res.status(400).json({ success: false, message: 'Title is required' });

        const pool = await sql.connect(config);
        await pool.request()
            .input('Id',         sql.Int,          id)
            .input('Title',      sql.VarChar(300), title)
            .input('Image',      sql.VarChar(sql.MAX), image || null)
            .input('Learners',   sql.VarChar(50),  learners   || null)
            .input('Duration',   sql.VarChar(50),  duration   || null)
            .input('ProgramUrl', sql.VarChar(500), programUrl || null)
            .input('EnrollUrl',  sql.VarChar(500), enrollUrl  || null)
            .input('SortOrder',  sql.Int,          parseInt(sortOrder) || 0)
            .input('IsActive',   sql.Bit,          isActive !== undefined ? parseInt(isActive) : 1)
            .execute('sp_UpdateFreeCourse');

        res.status(200).json({ success: true, message: 'Free course updated' });
    } catch (err) {
        console.error('Update Free Course Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// Delete
const deleteFreeCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        await pool.request()
            .input('Id', sql.Int, id)
            .execute('sp_DeleteFreeCourse');
        res.status(200).json({ success: true, message: 'Free course deleted' });
    } catch (err) {
        console.error('Delete Free Course Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Toggle
const toggleFreeCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Id', sql.Int, id)
            .execute('sp_ToggleFreeCourse');
        res.status(200).json({ success: true, isActive: result.recordset[0]?.IsActive });
    } catch (err) {
        console.error('Toggle Free Course Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getPublicFreeCourses, getAllFreeCourses,
    addFreeCourse, updateFreeCourse, deleteFreeCourse, toggleFreeCourse
};
