const { sql, config } = require('../config/database');

// ── GET settings ──────────────────────────────────────────────
const getSettings = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().execute('sp_GetSkillsCompSettings');
        res.status(200).json({ success: true, settings: result.recordset[0] || null });
    } catch (err) {
        console.error('Get SkillsComp Settings Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── SAVE settings ─────────────────────────────────────────────
const saveSettings = async (req, res) => {
    try {
        const { headingNormal, headingOrange } = req.body;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('HeadingNormal', sql.VarChar(255), headingNormal || null)
            .input('HeadingOrange', sql.VarChar(255), headingOrange || null)
            .execute('sp_SaveSkillsCompSettings');
        res.status(200).json({ success: true, settings: result.recordset[0] });
    } catch (err) {
        console.error('Save SkillsComp Settings Error:', err);
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
            .execute('sp_GetSkillsCompCards');
        res.status(200).json({ success: true, cards: result.recordset });
    } catch (err) {
        console.error('Get SkillsComp Cards Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── GET all data (public) ─────────────────────────────────────
const getAllData = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().execute('sp_GetSkillsCompAllData');
        res.status(200).json({
            success:  true,
            settings: result.recordsets[0]?.[0] || null,
            cards:    result.recordsets[1]       || [],
        });
    } catch (err) {
        console.error('Get SkillsComp AllData Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── ADD card ──────────────────────────────────────────────────
const addCard = async (req, res) => {
    try {
        const { cardTitle, cardSubtitle, skills, sortOrder, isActive } = req.body;
        if (!cardTitle) return res.status(400).json({ success: false, message: 'CardTitle is required' });
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('CardTitle',    sql.VarChar(255),      cardTitle)
            .input('CardSubtitle', sql.NVarChar(sql.MAX), cardSubtitle || null)
            .input('Skills',       sql.NVarChar(sql.MAX), skills       || null)
            .input('SortOrder',    sql.Int,               parseInt(sortOrder) || 0)
            .input('IsActive',     sql.Bit,               isActive !== false ? 1 : 0)
            .execute('sp_AddSkillsCompCard');
        res.status(201).json({ success: true, id: result.recordset[0].Id });
    } catch (err) {
        console.error('Add SkillsComp Card Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// ── UPDATE card ───────────────────────────────────────────────
const updateCard = async (req, res) => {
    try {
        const { id } = req.params;
        const { cardTitle, cardSubtitle, skills, sortOrder, isActive } = req.body;
        if (!cardTitle) return res.status(400).json({ success: false, message: 'CardTitle is required' });
        const pool = await sql.connect(config);
        await pool.request()
            .input('Id',           sql.Int,               id)
            .input('CardTitle',    sql.VarChar(255),      cardTitle)
            .input('CardSubtitle', sql.NVarChar(sql.MAX), cardSubtitle || null)
            .input('Skills',       sql.NVarChar(sql.MAX), skills       || null)
            .input('SortOrder',    sql.Int,               parseInt(sortOrder) || 0)
            .input('IsActive',     sql.Bit,               isActive !== false ? 1 : 0)
            .execute('sp_UpdateSkillsCompCard');
        res.status(200).json({ success: true, message: 'Card updated' });
    } catch (err) {
        console.error('Update SkillsComp Card Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// ── DELETE card ───────────────────────────────────────────────
const deleteCard = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        await pool.request().input('Id', sql.Int, id).execute('sp_DeleteSkillsCompCard');
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
        const result = await pool.request().input('Id', sql.Int, id).execute('sp_ToggleSkillsCompCard');
        res.status(200).json({ success: true, isActive: result.recordset[0]?.IsActive });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = { getSettings, saveSettings, getAllData, getCards, addCard, updateCard, deleteCard, toggleCard };
