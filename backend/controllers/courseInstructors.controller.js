const { sql, config } = require('../config/database');

// ── Public: all data in one call ─────────────────────────────
const getAllData = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const [sRes, allRes] = await Promise.all([
            pool.request().execute('sp_GetCourseInstructorSettings'),
            pool.request().execute('sp_GetAllCourseInstructors'),
        ]);
        const settings = sRes.recordset[0] || null;
        const tabs     = allRes.recordsets[0] || [];
        const cards    = allRes.recordsets[1] || [];

        // har tab mein uske cards attach karo
        const tabsWithCards = tabs.map(t => ({
            ...t,
            cards: cards.filter(c => c.TabId === t.Id),
        }));

        res.status(200).json({ success: true, settings, tabs: tabsWithCards });
    } catch (err) {
        console.error('Get All Course Instructors Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── Settings ─────────────────────────────────────────────────
const getSettings = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().execute('sp_GetCourseInstructorSettings');
        res.status(200).json({ success: true, settings: result.recordset[0] || null });
    } catch (err) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

const saveSettings = async (req, res) => {
    try {
        const { headingNormal, headingOrange, subtitle } = req.body;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('HeadingNormal', sql.VarChar(200), headingNormal || null)
            .input('HeadingOrange', sql.VarChar(200), headingOrange || null)
            .input('Subtitle',      sql.VarChar(300), subtitle      || null)
            .execute('sp_SaveCourseInstructorSettings');
        res.status(200).json({ success: true, settings: result.recordset[0] });
    } catch (err) { res.status(500).json({ success: false, message: 'Server Error', error: err.message }); }
};

// ── Tabs ──────────────────────────────────────────────────────
const getTabs = async (req, res) => {
    try {
        const showAll = req.query.all === '1' ? 1 : 0;
        const pool = await sql.connect(config);
        const result = await pool.request().input('ShowAll', sql.Bit, showAll).execute('sp_GetCourseInstructorTabs');
        res.status(200).json({ success: true, tabs: result.recordset });
    } catch (err) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

const addTab = async (req, res) => {
    try {
        const { tabName, sortOrder, isActive } = req.body;
        if (!tabName) return res.status(400).json({ success: false, message: 'Tab name required' });
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('TabName',   sql.VarChar(150), tabName)
            .input('SortOrder', sql.Int,          parseInt(sortOrder) || 0)
            .input('IsActive',  sql.Bit,          isActive !== false ? 1 : 0)
            .execute('sp_AddCourseInstructorTab');
        res.status(201).json({ success: true, id: result.recordset[0].Id });
    } catch (err) { res.status(500).json({ success: false, message: 'Server Error', error: err.message }); }
};

const updateTab = async (req, res) => {
    try {
        const { id } = req.params;
        const { tabName, sortOrder, isActive } = req.body;
        if (!tabName) return res.status(400).json({ success: false, message: 'Tab name required' });
        const pool = await sql.connect(config);
        await pool.request()
            .input('Id',        sql.Int,          id)
            .input('TabName',   sql.VarChar(150), tabName)
            .input('SortOrder', sql.Int,          parseInt(sortOrder) || 0)
            .input('IsActive',  sql.Bit,          isActive !== false ? 1 : 0)
            .execute('sp_UpdateCourseInstructorTab');
        res.status(200).json({ success: true });
    } catch (err) { res.status(500).json({ success: false, message: 'Server Error', error: err.message }); }
};

const deleteTab = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        await pool.request().input('Id', sql.Int, id).execute('sp_DeleteCourseInstructorTab');
        res.status(200).json({ success: true });
    } catch (err) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

const toggleTab = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request().input('Id', sql.Int, id).execute('sp_ToggleCourseInstructorTab');
        res.status(200).json({ success: true, isActive: result.recordset[0]?.IsActive });
    } catch (err) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

// ── Cards ─────────────────────────────────────────────────────
const getCards = async (req, res) => {
    try {
        const { tabId } = req.params;
        const showAll = req.query.all === '1' ? 1 : 0;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('TabId',   sql.Int, tabId)
            .input('ShowAll', sql.Bit, showAll)
            .execute('sp_GetCourseInstructorCards');
        res.status(200).json({ success: true, cards: result.recordset });
    } catch (err) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

const addCard = async (req, res) => {
    try {
        const { tabId } = req.params;
        const { name, role, photo, linkedinUrl, cardBg, sortOrder, isActive } = req.body;
        if (!name) return res.status(400).json({ success: false, message: 'Name required' });
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('TabId',       sql.Int,              parseInt(tabId))
            .input('Name',        sql.VarChar(150),      name)
            .input('Role',        sql.VarChar(200),      role        || null)
            .input('Photo',       sql.VarChar(sql.MAX),  photo       || null)
            .input('LinkedinUrl', sql.VarChar(300),      linkedinUrl || null)
            .input('CardBg',      sql.VarChar(20),       cardBg      || 'card-bg-1')
            .input('SortOrder',   sql.Int,               parseInt(sortOrder) || 0)
            .input('IsActive',    sql.Bit,               isActive !== false ? 1 : 0)
            .execute('sp_AddCourseInstructorCard');
        res.status(201).json({ success: true, id: result.recordset[0].Id });
    } catch (err) { res.status(500).json({ success: false, message: 'Server Error', error: err.message }); }
};

const updateCard = async (req, res) => {
    try {
        const { cardId } = req.params;
        const { name, role, photo, linkedinUrl, cardBg, sortOrder, isActive } = req.body;
        if (!name) return res.status(400).json({ success: false, message: 'Name required' });
        const pool = await sql.connect(config);
        await pool.request()
            .input('Id',          sql.Int,              cardId)
            .input('Name',        sql.VarChar(150),      name)
            .input('Role',        sql.VarChar(200),      role        || null)
            .input('Photo',       sql.VarChar(sql.MAX),  photo       || null)
            .input('LinkedinUrl', sql.VarChar(300),      linkedinUrl || null)
            .input('CardBg',      sql.VarChar(20),       cardBg      || 'card-bg-1')
            .input('SortOrder',   sql.Int,               parseInt(sortOrder) || 0)
            .input('IsActive',    sql.Bit,               isActive !== false ? 1 : 0)
            .execute('sp_UpdateCourseInstructorCard');
        res.status(200).json({ success: true });
    } catch (err) { res.status(500).json({ success: false, message: 'Server Error', error: err.message }); }
};

const deleteCard = async (req, res) => {
    try {
        const { cardId } = req.params;
        const pool = await sql.connect(config);
        await pool.request().input('Id', sql.Int, cardId).execute('sp_DeleteCourseInstructorCard');
        res.status(200).json({ success: true });
    } catch (err) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

const toggleCard = async (req, res) => {
    try {
        const { cardId } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request().input('Id', sql.Int, cardId).execute('sp_ToggleCourseInstructorCard');
        res.status(200).json({ success: true, isActive: result.recordset[0]?.IsActive });
    } catch (err) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

module.exports = {
    getAllData, getSettings, saveSettings,
    getTabs, addTab, updateTab, deleteTab, toggleTab,
    getCards, addCard, updateCard, deleteCard, toggleCard,
};
