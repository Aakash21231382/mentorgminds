const { sql, config } = require('../config/database');

// ── GET settings ──────────────────────────────────────────────
const getSettings = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().execute('sp_GetAchieveGoalsSettings');
        res.status(200).json({ success: true, settings: result.recordset[0] || null });
    } catch (err) {
        console.error('Get AchieveGoals Settings Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── SAVE settings ─────────────────────────────────────────────
const saveSettings = async (req, res) => {
    try {
        const { headingNormal, headingOrange, subHeading } = req.body;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('HeadingNormal', sql.VarChar(255),      headingNormal || null)
            .input('HeadingOrange', sql.VarChar(255),      headingOrange || null)
            .input('SubHeading',    sql.NVarChar(sql.MAX), subHeading    || null)
            .execute('sp_SaveAchieveGoalsSettings');
        res.status(200).json({ success: true, settings: result.recordset[0] });
    } catch (err) {
        console.error('Save AchieveGoals Settings Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// ── GET all tabs (admin) ──────────────────────────────────────
const getTabs = async (req, res) => {
    try {
        const showAll = req.query.all === '1' ? 1 : 0;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('ShowAll', sql.Bit, showAll)
            .execute('sp_GetAchieveGoalsTabs');
        res.status(200).json({ success: true, tabs: result.recordset });
    } catch (err) {
        console.error('Get AchieveGoals Tabs Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── GET all data (public) ─────────────────────────────────────
const getAllData = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().execute('sp_GetAchieveGoalsAllData');
        res.status(200).json({
            success:  true,
            settings: result.recordsets[0]?.[0] || null,
            tabs:     result.recordsets[1]       || [],
        });
    } catch (err) {
        console.error('Get AchieveGoals AllData Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── ADD tab ───────────────────────────────────────────────────
const addTab = async (req, res) => {
    try {
        const { tabLabel, infoTag, infoSubtitle, cardHeading, cardDesc, imageUrl, videoUrl, points, sortOrder, isActive } = req.body;
        if (!tabLabel) return res.status(400).json({ success: false, message: 'TabLabel is required' });
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('TabLabel',     sql.VarChar(255),      tabLabel)
            .input('InfoTag',      sql.VarChar(255),      infoTag      || null)
            .input('InfoSubtitle', sql.VarChar(255),      infoSubtitle || null)
            .input('CardHeading',  sql.VarChar(255),      cardHeading  || null)
            .input('CardDesc',     sql.NVarChar(sql.MAX), cardDesc     || null)
            .input('ImageUrl',     sql.VarChar(sql.MAX),  imageUrl     || null)
            .input('VideoUrl',     sql.VarChar(sql.MAX),  videoUrl     || null)
            .input('Points',       sql.NVarChar(sql.MAX), points       || null)
            .input('SortOrder',    sql.Int,               parseInt(sortOrder) || 0)
            .input('IsActive',     sql.Bit,               isActive !== false ? 1 : 0)
            .execute('sp_AddAchieveGoalsTab');
        res.status(201).json({ success: true, id: result.recordset[0].Id });
    } catch (err) {
        console.error('Add AchieveGoals Tab Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// ── UPDATE tab ────────────────────────────────────────────────
const updateTab = async (req, res) => {
    try {
        const { id } = req.params;
        const { tabLabel, infoTag, infoSubtitle, cardHeading, cardDesc, imageUrl, videoUrl, points, sortOrder, isActive } = req.body;
        if (!tabLabel) return res.status(400).json({ success: false, message: 'TabLabel is required' });
        const pool = await sql.connect(config);
        await pool.request()
            .input('Id',           sql.Int,               id)
            .input('TabLabel',     sql.VarChar(255),      tabLabel)
            .input('InfoTag',      sql.VarChar(255),      infoTag      || null)
            .input('InfoSubtitle', sql.VarChar(255),      infoSubtitle || null)
            .input('CardHeading',  sql.VarChar(255),      cardHeading  || null)
            .input('CardDesc',     sql.NVarChar(sql.MAX), cardDesc     || null)
            .input('ImageUrl',     sql.VarChar(sql.MAX),  imageUrl     || null)
            .input('VideoUrl',     sql.VarChar(sql.MAX),  videoUrl     || null)
            .input('Points',       sql.NVarChar(sql.MAX), points       || null)
            .input('SortOrder',    sql.Int,               parseInt(sortOrder) || 0)
            .input('IsActive',     sql.Bit,               isActive !== false ? 1 : 0)
            .execute('sp_UpdateAchieveGoalsTab');
        res.status(200).json({ success: true, message: 'Tab updated' });
    } catch (err) {
        console.error('Update AchieveGoals Tab Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// ── DELETE tab ────────────────────────────────────────────────
const deleteTab = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        await pool.request().input('Id', sql.Int, id).execute('sp_DeleteAchieveGoalsTab');
        res.status(200).json({ success: true, message: 'Tab deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── TOGGLE tab ────────────────────────────────────────────────
const toggleTab = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request().input('Id', sql.Int, id).execute('sp_ToggleAchieveGoalsTab');
        res.status(200).json({ success: true, isActive: result.recordset[0]?.IsActive });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = { getSettings, saveSettings, getAllData, getTabs, addTab, updateTab, deleteTab, toggleTab };
