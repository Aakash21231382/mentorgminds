const { sql, config } = require('../config/database');

// ── GET settings ──────────────────────────────────────────────
const getSettings = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().execute('sp_GetCurriculumCompSettings');
        res.status(200).json({ success: true, settings: result.recordset[0] || null });
    } catch (err) {
        console.error('Get CurriculumComp Settings Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── SAVE settings ─────────────────────────────────────────────
const saveSettings = async (req, res) => {
    try {
        const { headingNormal, headingOrange, tabsJson } = req.body;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('HeadingNormal', sql.VarChar(255),      headingNormal || null)
            .input('HeadingOrange', sql.VarChar(255),      headingOrange || null)
            .input('TabsJson',      sql.NVarChar(sql.MAX), tabsJson      || null)
            .execute('sp_SaveCurriculumCompSettings');
        res.status(200).json({ success: true, settings: result.recordset[0] });
    } catch (err) {
        console.error('Save CurriculumComp Settings Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// ── GET all cards (admin) ─────────────────────────────────────
const getCards = async (req, res) => {
    try {
        const showAll = req.query.all === '1' ? 1 : 0;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('ShowAll', sql.Bit, showAll)
            .execute('sp_GetCurriculumCompCards');
        res.status(200).json({ success: true, cards: result.recordset });
    } catch (err) {
        console.error('Get CurriculumComp Cards Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── GET all data (public) ─────────────────────────────────────
const getAllData = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().execute('sp_GetCurriculumCompAllData');
        res.status(200).json({
            success:  true,
            settings: result.recordsets[0]?.[0] || null,
            cards:    result.recordsets[1]       || [],
        });
    } catch (err) {
        console.error('Get CurriculumComp AllData Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── ADD card ──────────────────────────────────────────────────
const addCard = async (req, res) => {
    try {
        const { tabKey, part, partTitle, partBadge, title, descr, hours, projects, extra, iconUrl, sortOrder, isActive } = req.body;
        if (!tabKey) return res.status(400).json({ success: false, message: 'TabKey is required' });
        if (!title)  return res.status(400).json({ success: false, message: 'Title is required' });
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('TabKey',    sql.VarChar(100),      tabKey)
            .input('Part',      sql.VarChar(10),       part      || 'A')
            .input('PartTitle', sql.VarChar(255),      partTitle || null)
            .input('PartBadge', sql.VarChar(255),      partBadge || null)
            .input('Title',     sql.VarChar(255),      title)
            .input('Descr',     sql.NVarChar(sql.MAX), descr     || null)
            .input('Hours',     sql.VarChar(100),      hours     || null)
            .input('Projects',  sql.VarChar(100),      projects  || null)
            .input('Extra',     sql.VarChar(100),      extra     || null)
            .input('IconUrl',   sql.VarChar(sql.MAX),  iconUrl   || null)
            .input('SortOrder', sql.Int,               parseInt(sortOrder) || 0)
            .input('IsActive',  sql.Bit,               isActive !== false ? 1 : 0)
            .execute('sp_AddCurriculumCompCard');
        res.status(201).json({ success: true, id: result.recordset[0].Id });
    } catch (err) {
        console.error('Add CurriculumComp Card Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// ── UPDATE card ───────────────────────────────────────────────
const updateCard = async (req, res) => {
    try {
        const { id } = req.params;
        const { tabKey, part, partTitle, partBadge, title, descr, hours, projects, extra, iconUrl, sortOrder, isActive } = req.body;
        if (!title) return res.status(400).json({ success: false, message: 'Title is required' });
        const pool = await sql.connect(config);
        await pool.request()
            .input('Id',        sql.Int,               id)
            .input('TabKey',    sql.VarChar(100),      tabKey    || 'iitkgp')
            .input('Part',      sql.VarChar(10),       part      || 'A')
            .input('PartTitle', sql.VarChar(255),      partTitle || null)
            .input('PartBadge', sql.VarChar(255),      partBadge || null)
            .input('Title',     sql.VarChar(255),      title)
            .input('Descr',     sql.NVarChar(sql.MAX), descr     || null)
            .input('Hours',     sql.VarChar(100),      hours     || null)
            .input('Projects',  sql.VarChar(100),      projects  || null)
            .input('Extra',     sql.VarChar(100),      extra     || null)
            .input('IconUrl',   sql.VarChar(sql.MAX),  iconUrl   || null)
            .input('SortOrder', sql.Int,               parseInt(sortOrder) || 0)
            .input('IsActive',  sql.Bit,               isActive !== false ? 1 : 0)
            .execute('sp_UpdateCurriculumCompCard');
        res.status(200).json({ success: true, message: 'Card updated' });
    } catch (err) {
        console.error('Update CurriculumComp Card Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// ── DELETE card ───────────────────────────────────────────────
const deleteCard = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        await pool.request().input('Id', sql.Int, id).execute('sp_DeleteCurriculumCompCard');
        res.status(200).json({ success: true, message: 'Card deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── TOGGLE card ───────────────────────────────────────────────
const toggleCard = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request().input('Id', sql.Int, id).execute('sp_ToggleCurriculumCompCard');
        res.status(200).json({ success: true, isActive: result.recordset[0]?.IsActive });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = { getSettings, saveSettings, getAllData, getCards, addCard, updateCard, deleteCard, toggleCard };
