const { sql, config } = require('../config/database');

const getAllData = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const [sRes, pRes] = await Promise.all([
            pool.request().execute('sp_GetCourseProjectSettings'),
            pool.request().input('ShowAll', sql.Bit, 0).execute('sp_GetCourseProjects'),
        ]);
        res.status(200).json({ success: true, settings: sRes.recordset[0] || null, projects: pRes.recordset || [] });
    } catch (err) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

const getSettings = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().execute('sp_GetCourseProjectSettings');
        res.status(200).json({ success: true, settings: result.recordset[0] || null });
    } catch (err) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

const saveSettings = async (req, res) => {
    try {
        const { headingLine1, headingLine2, headingLine3, badgeText } = req.body;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('HeadingLine1', sql.VarChar(255), headingLine1 || null)
            .input('HeadingLine2', sql.VarChar(255), headingLine2 || null)
            .input('HeadingLine3', sql.VarChar(255), headingLine3 || null)
            .input('BadgeText',    sql.VarChar(100), badgeText    || null)
            .execute('sp_SaveCourseProjectSettings');
        res.status(200).json({ success: true, settings: result.recordset[0] });
    } catch (err) { res.status(500).json({ success: false, message: 'Server Error', error: err.message }); }
};

const getProjects = async (req, res) => {
    try {
        const showAll = req.query.all === '1' ? 1 : 0;
        const pool = await sql.connect(config);
        const result = await pool.request().input('ShowAll', sql.Bit, showAll).execute('sp_GetCourseProjects');
        res.status(200).json({ success: true, projects: result.recordset });
    } catch (err) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

const addProject = async (req, res) => {
    try {
        const { title, description, iconUrl, skills, sortOrder, isActive } = req.body;
        if (!title) return res.status(400).json({ success: false, message: 'Title required' });
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Title',       sql.VarChar(255),      title)
            .input('Description', sql.NVarChar(sql.MAX), description || null)
            .input('IconUrl',     sql.VarChar(sql.MAX),  iconUrl     || null)
            .input('Skills',      sql.NVarChar(sql.MAX), skills      || null)
            .input('SortOrder',   sql.Int,               parseInt(sortOrder) || 0)
            .input('IsActive',    sql.Bit,               isActive !== false ? 1 : 0)
            .execute('sp_AddCourseProject');
        res.status(201).json({ success: true, id: result.recordset[0].Id });
    } catch (err) { res.status(500).json({ success: false, message: 'Server Error', error: err.message }); }
};

const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, iconUrl, skills, sortOrder, isActive } = req.body;
        if (!title) return res.status(400).json({ success: false, message: 'Title required' });
        const pool = await sql.connect(config);
        await pool.request()
            .input('Id',          sql.Int,               id)
            .input('Title',       sql.VarChar(255),      title)
            .input('Description', sql.NVarChar(sql.MAX), description || null)
            .input('IconUrl',     sql.VarChar(sql.MAX),  iconUrl     || null)
            .input('Skills',      sql.NVarChar(sql.MAX), skills      || null)
            .input('SortOrder',   sql.Int,               parseInt(sortOrder) || 0)
            .input('IsActive',    sql.Bit,               isActive !== false ? 1 : 0)
            .execute('sp_UpdateCourseProject');
        res.status(200).json({ success: true });
    } catch (err) { res.status(500).json({ success: false, message: 'Server Error', error: err.message }); }
};

const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        await pool.request().input('Id', sql.Int, id).execute('sp_DeleteCourseProject');
        res.status(200).json({ success: true });
    } catch (err) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

const toggleProject = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request().input('Id', sql.Int, id).execute('sp_ToggleCourseProject');
        res.status(200).json({ success: true, isActive: result.recordset[0]?.IsActive });
    } catch (err) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

module.exports = { getAllData, getSettings, saveSettings, getProjects, addProject, updateProject, deleteProject, toggleProject };
