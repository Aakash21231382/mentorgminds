const { sql, config } = require('../config/database');

const getSettings = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().execute('sp_GetFaqSettings');
        res.status(200).json({ success: true, settings: result.recordset[0] || null });
    } catch (err) {
        console.error('Get FAQ Settings Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const saveSettings = async (req, res) => {
    try {
        const { headingNormal, headingOrange } = req.body;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('HeadingNormal', sql.VarChar(255), headingNormal || null)
            .input('HeadingOrange', sql.VarChar(255), headingOrange || null)
            .execute('sp_SaveFaqSettings');
        res.status(200).json({ success: true, settings: result.recordset[0] });
    } catch (err) {
        console.error('Save FAQ Settings Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

const getItems = async (req, res) => {
    try {
        const showAll = req.query.all === '1' ? 1 : 0;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('ShowAll', sql.Bit, showAll)
            .execute('sp_GetFaqItems');
        res.status(200).json({ success: true, items: result.recordset });
    } catch (err) {
        console.error('Get FAQ Items Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const getAllData = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().execute('sp_GetFaqAllData');
        res.status(200).json({
            success:  true,
            settings: result.recordsets[0]?.[0] || null,
            items:    result.recordsets[1]       || [],
        });
    } catch (err) {
        console.error('Get FAQ AllData Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const addItem = async (req, res) => {
    try {
        const { question, answer, subHeading, introText, bulletPoints, outroText, exampleHeading, examples, sortOrder, isActive } = req.body;
        if (!question) return res.status(400).json({ success: false, message: 'Question is required' });
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Question',       sql.NVarChar(sql.MAX), question)
            .input('Answer',         sql.NVarChar(sql.MAX), answer         || null)
            .input('SubHeading',     sql.VarChar(500),      subHeading     || null)
            .input('IntroText',      sql.NVarChar(sql.MAX), introText      || null)
            .input('BulletPoints',   sql.NVarChar(sql.MAX), bulletPoints   || null)
            .input('OutroText',      sql.NVarChar(sql.MAX), outroText      || null)
            .input('ExampleHeading', sql.VarChar(500),      exampleHeading || null)
            .input('Examples',       sql.NVarChar(sql.MAX), examples       || null)
            .input('SortOrder',      sql.Int,               parseInt(sortOrder) || 0)
            .input('IsActive',       sql.Bit,               isActive !== false ? 1 : 0)
            .execute('sp_AddFaqItem');
        res.status(201).json({ success: true, id: result.recordset[0].Id });
    } catch (err) {
        console.error('Add FAQ Item Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { question, answer, subHeading, introText, bulletPoints, outroText, exampleHeading, examples, sortOrder, isActive } = req.body;
        if (!question) return res.status(400).json({ success: false, message: 'Question is required' });
        const pool = await sql.connect(config);
        await pool.request()
            .input('Id',             sql.Int,               id)
            .input('Question',       sql.NVarChar(sql.MAX), question)
            .input('Answer',         sql.NVarChar(sql.MAX), answer         || null)
            .input('SubHeading',     sql.VarChar(500),      subHeading     || null)
            .input('IntroText',      sql.NVarChar(sql.MAX), introText      || null)
            .input('BulletPoints',   sql.NVarChar(sql.MAX), bulletPoints   || null)
            .input('OutroText',      sql.NVarChar(sql.MAX), outroText      || null)
            .input('ExampleHeading', sql.VarChar(500),      exampleHeading || null)
            .input('Examples',       sql.NVarChar(sql.MAX), examples       || null)
            .input('SortOrder',      sql.Int,               parseInt(sortOrder) || 0)
            .input('IsActive',       sql.Bit,               isActive !== false ? 1 : 0)
            .execute('sp_UpdateFaqItem');
        res.status(200).json({ success: true, message: 'FAQ updated' });
    } catch (err) {
        console.error('Update FAQ Item Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        await pool.request().input('Id', sql.Int, id).execute('sp_DeleteFaqItem');
        res.status(200).json({ success: true, message: 'FAQ deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const toggleItem = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request().input('Id', sql.Int, id).execute('sp_ToggleFaqItem');
        res.status(200).json({ success: true, isActive: result.recordset[0]?.IsActive });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = { getSettings, saveSettings, getAllData, getItems, addItem, updateItem, deleteItem, toggleItem };
