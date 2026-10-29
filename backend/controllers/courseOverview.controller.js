const { sql, config } = require('../config/database');

// ── GET settings ──────────────────────────────────────────────
const getSettings = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().execute('sp_GetCourseOverviewSettings');
        res.status(200).json({ success: true, settings: result.recordset[0] || null });
    } catch (err) {
        console.error('Get CourseOverview Settings Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── SAVE settings ─────────────────────────────────────────────
const saveSettings = async (req, res) => {
    try {
        const { headingNormal, headingOrange, mainDesc } = req.body;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('HeadingNormal', sql.VarChar(255),      headingNormal || null)
            .input('HeadingOrange', sql.VarChar(255),      headingOrange || null)
            .input('MainDesc',      sql.NVarChar(sql.MAX), mainDesc      || null)
            .execute('sp_SaveCourseOverviewSettings');
        res.status(200).json({ success: true, settings: result.recordset[0] });
    } catch (err) {
        console.error('Save CourseOverview Settings Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// ── GET all sections (admin) ──────────────────────────────────
const getSections = async (req, res) => {
    try {
        const showAll = req.query.all === '1' ? 1 : 0;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('ShowAll', sql.Bit, showAll)
            .execute('sp_GetCourseOverviewSections');
        res.status(200).json({ success: true, sections: result.recordset });
    } catch (err) {
        console.error('Get CourseOverview Sections Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── GET all data (public) ─────────────────────────────────────
const getAllData = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().execute('sp_GetCourseOverviewAllData');
        res.status(200).json({
            success:  true,
            settings: result.recordsets[0]?.[0] || null,
            sections: result.recordsets[1]       || [],
        });
    } catch (err) {
        console.error('Get CourseOverview AllData Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── ADD section ───────────────────────────────────────────────
const addSection = async (req, res) => {
    try {
        const { title, sectionType, paragraphs, subtitle, bulletPoints, sortOrder, isActive } = req.body;
        if (!title) return res.status(400).json({ success: false, message: 'Title is required' });
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Title',        sql.VarChar(255),      title)
            .input('SectionType',  sql.VarChar(20),       sectionType  || 'text')
            .input('Paragraphs',   sql.NVarChar(sql.MAX), paragraphs   || null)
            .input('Subtitle',     sql.VarChar(sql.MAX),  subtitle     || null)
            .input('BulletPoints', sql.NVarChar(sql.MAX), bulletPoints || null)
            .input('SortOrder',    sql.Int,               parseInt(sortOrder) || 0)
            .input('IsActive',     sql.Bit,               isActive !== false ? 1 : 0)
            .execute('sp_AddCourseOverviewSection');
        res.status(201).json({ success: true, id: result.recordset[0].Id });
    } catch (err) {
        console.error('Add CourseOverview Section Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// ── UPDATE section ────────────────────────────────────────────
const updateSection = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, sectionType, paragraphs, subtitle, bulletPoints, sortOrder, isActive } = req.body;
        if (!title) return res.status(400).json({ success: false, message: 'Title is required' });
        const pool = await sql.connect(config);
        await pool.request()
            .input('Id',           sql.Int,               id)
            .input('Title',        sql.VarChar(255),      title)
            .input('SectionType',  sql.VarChar(20),       sectionType  || 'text')
            .input('Paragraphs',   sql.NVarChar(sql.MAX), paragraphs   || null)
            .input('Subtitle',     sql.VarChar(sql.MAX),  subtitle     || null)
            .input('BulletPoints', sql.NVarChar(sql.MAX), bulletPoints || null)
            .input('SortOrder',    sql.Int,               parseInt(sortOrder) || 0)
            .input('IsActive',     sql.Bit,               isActive !== false ? 1 : 0)
            .execute('sp_UpdateCourseOverviewSection');
        res.status(200).json({ success: true, message: 'Section updated' });
    } catch (err) {
        console.error('Update CourseOverview Section Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// ── DELETE section ────────────────────────────────────────────
const deleteSection = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        await pool.request().input('Id', sql.Int, id).execute('sp_DeleteCourseOverviewSection');
        res.status(200).json({ success: true, message: 'Section deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── TOGGLE section ────────────────────────────────────────────
const toggleSection = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request().input('Id', sql.Int, id).execute('sp_ToggleCourseOverviewSection');
        res.status(200).json({ success: true, isActive: result.recordset[0]?.IsActive });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = { getSettings, saveSettings, getAllData, getSections, addSection, updateSection, deleteSection, toggleSection };
