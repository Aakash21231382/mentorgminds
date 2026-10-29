const { sql, config } = require('../config/database');

// ── Config (heading, main image, support section) ─────────────
const getConfig = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().execute('sp_GetAwardsSectionConfig');
        res.status(200).json({ success: true, config: result.recordset[0] || null });
    } catch (err) {
        console.error('Get AwardsSectionConfig Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const upsertConfig = async (req, res) => {
    try {
        const {
            headingNormal, headingOrange, mainImage,
            supportHeadingBold, supportHeadingNormal, supportDesc,
            supportCard1Image, supportCard2Image, isActive,
        } = req.body;

        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('HeadingNormal',        sql.NVarChar(200),    headingNormal        || null)
            .input('HeadingOrange',        sql.NVarChar(200),    headingOrange        || null)
            .input('MainImage',            sql.NVarChar(sql.MAX), mainImage           || null)
            .input('SupportHeadingBold',   sql.NVarChar(200),    supportHeadingBold   || null)
            .input('SupportHeadingNormal', sql.NVarChar(200),    supportHeadingNormal || null)
            .input('SupportDesc',          sql.NVarChar(500),    supportDesc          || null)
            .input('SupportCard1Image',    sql.NVarChar(sql.MAX), supportCard1Image   || null)
            .input('SupportCard2Image',    sql.NVarChar(sql.MAX), supportCard2Image   || null)
            .input('IsActive',             sql.Bit, isActive !== undefined ? parseInt(isActive) : 1)
            .execute('sp_UpsertAwardsSectionConfig');

        res.status(200).json({ success: true, message: 'Config saved', config: result.recordset[0] });
    } catch (err) {
        console.error('Upsert AwardsSectionConfig Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// ── Award Cards CRUD ──────────────────────────────────────────
const getCards = async (req, res) => {
    try {
        const showAll = req.query.all === '1' ? 1 : 0;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('ShowAll', sql.Bit, showAll)
            .execute('sp_GetAwardCards');
        res.status(200).json({ success: true, cards: result.recordset });
    } catch (err) {
        console.error('Get AwardCards Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const getCardById = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Id', sql.Int, id)
            .execute('sp_GetAwardCardById');
        if (!result.recordset.length)
            return res.status(404).json({ success: false, message: 'Card not found' });
        res.status(200).json({ success: true, card: result.recordset[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const addCard = async (req, res) => {
    try {
        const { cardImage, dataText, title, description, sortOrder, isActive } = req.body;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('CardImage',   sql.NVarChar(sql.MAX), cardImage   || null)
            .input('DataText',    sql.NVarChar(300),     dataText    || null)
            .input('Title',       sql.NVarChar(300),     title       || null)
            .input('Description', sql.NVarChar(sql.MAX), description || null)
            .input('SortOrder',   sql.Int,               parseInt(sortOrder) || 0)
            .input('IsActive',    sql.Bit,               isActive !== undefined ? parseInt(isActive) : 1)
            .execute('sp_AddAwardCard');
        res.status(201).json({ success: true, message: 'Card added', id: result.recordset[0].Id });
    } catch (err) {
        console.error('Add AwardCard Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

const updateCard = async (req, res) => {
    try {
        const { id } = req.params;
        const { cardImage, dataText, title, description, sortOrder, isActive } = req.body;
        const pool = await sql.connect(config);
        await pool.request()
            .input('Id',          sql.Int,               id)
            .input('CardImage',   sql.NVarChar(sql.MAX), cardImage   || null)
            .input('DataText',    sql.NVarChar(300),     dataText    || null)
            .input('Title',       sql.NVarChar(300),     title       || null)
            .input('Description', sql.NVarChar(sql.MAX), description || null)
            .input('SortOrder',   sql.Int,               parseInt(sortOrder) || 0)
            .input('IsActive',    sql.Bit,               isActive !== undefined ? parseInt(isActive) : 1)
            .execute('sp_UpdateAwardCard');
        res.status(200).json({ success: true, message: 'Card updated' });
    } catch (err) {
        console.error('Update AwardCard Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

const deleteCard = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        await pool.request().input('Id', sql.Int, id).execute('sp_DeleteAwardCard');
        res.status(200).json({ success: true, message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const toggleCard = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request().input('Id', sql.Int, id).execute('sp_ToggleAwardCard');
        res.status(200).json({ success: true, isActive: result.recordset[0]?.IsActive });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getConfig, upsertConfig,
    getCards, getCardById, addCard, updateCard, deleteCard, toggleCard,
};
