const { sql, config } = require('../config/database');

// Public — settings + active tools
const getAllData = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const [sRes, tRes] = await Promise.all([
            pool.request().execute('sp_GetToolsSettings'),
            pool.request().input('ShowAll', sql.Bit, 0).execute('sp_GetTools'),
        ]);
        res.status(200).json({ success: true, settings: sRes.recordset[0] || null, tools: tRes.recordset || [] });
    } catch (err) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

const getSettings = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().execute('sp_GetToolsSettings');
        res.status(200).json({ success: true, settings: result.recordset[0] || null });
    } catch (err) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

const saveSettings = async (req, res) => {
    try {
        const { headingNormal, headingOrange } = req.body;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('HeadingNormal', sql.VarChar(200), headingNormal || null)
            .input('HeadingOrange', sql.VarChar(200), headingOrange || null)
            .execute('sp_SaveToolsSettings');
        res.status(200).json({ success: true, settings: result.recordset[0] });
    } catch (err) { res.status(500).json({ success: false, message: 'Server Error', error: err.message }); }
};

const getTools = async (req, res) => {
    try {
        const showAll = req.query.all === '1' ? 1 : 0;
        const pool = await sql.connect(config);
        const result = await pool.request().input('ShowAll', sql.Bit, showAll).execute('sp_GetTools');
        res.status(200).json({ success: true, tools: result.recordset });
    } catch (err) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

const addTool = async (req, res) => {
    try {
        const { name, iconUrl, sortOrder, isActive } = req.body;
        if (!name) return res.status(400).json({ success: false, message: 'Name required' });
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Name',      sql.VarChar(150),     name)
            .input('IconUrl',   sql.VarChar(sql.MAX), iconUrl   || null)
            .input('SortOrder', sql.Int,              parseInt(sortOrder) || 0)
            .input('IsActive',  sql.Bit,              isActive !== false ? 1 : 0)
            .execute('sp_AddTool');
        res.status(201).json({ success: true, id: result.recordset[0].Id });
    } catch (err) { res.status(500).json({ success: false, message: 'Server Error', error: err.message }); }
};

const updateTool = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, iconUrl, sortOrder, isActive } = req.body;
        if (!name) return res.status(400).json({ success: false, message: 'Name required' });
        const pool = await sql.connect(config);
        await pool.request()
            .input('Id',        sql.Int,              id)
            .input('Name',      sql.VarChar(150),     name)
            .input('IconUrl',   sql.VarChar(sql.MAX), iconUrl   || null)
            .input('SortOrder', sql.Int,              parseInt(sortOrder) || 0)
            .input('IsActive',  sql.Bit,              isActive !== false ? 1 : 0)
            .execute('sp_UpdateTool');
        res.status(200).json({ success: true });
    } catch (err) { res.status(500).json({ success: false, message: 'Server Error', error: err.message }); }
};

const deleteTool = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        await pool.request().input('Id', sql.Int, id).execute('sp_DeleteTool');
        res.status(200).json({ success: true });
    } catch (err) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

const toggleTool = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request().input('Id', sql.Int, id).execute('sp_ToggleTool');
        res.status(200).json({ success: true, isActive: result.recordset[0]?.IsActive });
    } catch (err) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

module.exports = { getAllData, getSettings, saveSettings, getTools, addTool, updateTool, deleteTool, toggleTool };
