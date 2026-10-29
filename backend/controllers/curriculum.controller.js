const { sql, config } = require('../config/database');

// ── GET settings (header + brochure) ─────────────────────────
const getSettings = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().execute('sp_GetCurriculumSettings');
        res.status(200).json({ success: true, settings: result.recordset[0] || null });
    } catch (err) {
        console.error('Get Curriculum Settings Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── SAVE settings (admin) ─────────────────────────────────────
const saveSettings = async (req, res) => {
    try {
        const { headingLine1, headingLine2, brochureUrl } = req.body;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('HeadingLine1', sql.VarChar(255),      headingLine1 || null)
            .input('HeadingLine2', sql.VarChar(255),      headingLine2 || null)
            .input('BrochureUrl',  sql.VarChar(sql.MAX),  brochureUrl  || null)
            .execute('sp_SaveCurriculumSettings');
        res.status(200).json({ success: true, settings: result.recordset[0] });
    } catch (err) {
        console.error('Save Curriculum Settings Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// ── GET all cards ─────────────────────────────────────────────
const getCards = async (req, res) => {
    try {
        const showAll = req.query.all === '1' ? 1 : 0;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('ShowAll', sql.Bit, showAll)
            .execute('sp_GetCurriculumCards');
        res.status(200).json({ success: true, cards: result.recordset });
    } catch (err) {
        console.error('Get Curriculum Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── GET all data (settings + cards) — public ─────────────────
const getAllData = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const [settingsRes, cardsRes] = await Promise.all([
            pool.request().execute('sp_GetCurriculumSettings'),
            pool.request().input('ShowAll', sql.Bit, 0).execute('sp_GetCurriculumCards'),
        ]);
        res.status(200).json({
            success:  true,
            settings: settingsRes.recordset[0] || null,
            cards:    cardsRes.recordset || [],
        });
    } catch (err) {
        console.error('Get All Curriculum Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── ADD card ──────────────────────────────────────────────────
const addCard = async (req, res) => {
    try {
        const { title, points, cardColor, sortOrder, isActive } = req.body;
        if (!title) return res.status(400).json({ success: false, message: 'Title is required' });
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Title',     sql.VarChar(255),      title)
            .input('Points',    sql.NVarChar(sql.MAX), points    || '')
            .input('CardColor', sql.VarChar(20),       cardColor || 'white')
            .input('SortOrder', sql.Int,               parseInt(sortOrder) || 0)
            .input('IsActive',  sql.Bit,               isActive !== false ? 1 : 0)
            .execute('sp_AddCurriculumCard');
        res.status(201).json({ success: true, id: result.recordset[0].Id });
    } catch (err) {
        console.error('Add Curriculum Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// ── UPDATE card ───────────────────────────────────────────────
const updateCard = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, points, cardColor, sortOrder, isActive } = req.body;
        if (!title) return res.status(400).json({ success: false, message: 'Title is required' });
        const pool = await sql.connect(config);
        await pool.request()
            .input('Id',        sql.Int,               id)
            .input('Title',     sql.VarChar(255),      title)
            .input('Points',    sql.NVarChar(sql.MAX), points    || '')
            .input('CardColor', sql.VarChar(20),       cardColor || 'white')
            .input('SortOrder', sql.Int,               parseInt(sortOrder) || 0)
            .input('IsActive',  sql.Bit,               isActive !== false ? 1 : 0)
            .execute('sp_UpdateCurriculumCard');
        res.status(200).json({ success: true, message: 'Card updated' });
    } catch (err) {
        console.error('Update Curriculum Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// ── DELETE card ───────────────────────────────────────────────
const deleteCard = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        await pool.request().input('Id', sql.Int, id).execute('sp_DeleteCurriculumCard');
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
        const result = await pool.request().input('Id', sql.Int, id).execute('sp_ToggleCurriculumCard');
        res.status(200).json({ success: true, isActive: result.recordset[0]?.IsActive });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = { getSettings, saveSettings, getAllData, getCards, addCard, updateCard, deleteCard, toggleCard };
