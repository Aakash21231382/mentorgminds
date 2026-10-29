const { sql, config } = require('../config/database');

// ── Config (heading, stats, banner) ───────────────────────────
const getConfig = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().execute('sp_GetSuccessSectionConfig');
        res.status(200).json({ success: true, config: result.recordset[0] || null });
    } catch (err) {
        console.error('Get SuccessSectionConfig Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const upsertConfig = async (req, res) => {
    try {
        const {
            tagText, headingNormal, headingOrange,
            stat1Value, stat1Label, stat2Value, stat2Label,
            stat3Value, stat3Label, stat4Value, stat4Label,
            bannerTopLabel, bannerHeading, bannerDesc, bannerBtnText, bannerBtnLink,
            learnerImages, isActive,
        } = req.body;

        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('TagText',        sql.NVarChar(150),  tagText        || null)
            .input('HeadingNormal',  sql.NVarChar(300),  headingNormal  || null)
            .input('HeadingOrange',  sql.NVarChar(300),  headingOrange  || null)
            .input('Stat1Value',     sql.NVarChar(100),  stat1Value     || null)
            .input('Stat1Label',     sql.NVarChar(150),  stat1Label     || null)
            .input('Stat2Value',     sql.NVarChar(100),  stat2Value     || null)
            .input('Stat2Label',     sql.NVarChar(150),  stat2Label     || null)
            .input('Stat3Value',     sql.NVarChar(100),  stat3Value     || null)
            .input('Stat3Label',     sql.NVarChar(150),  stat3Label     || null)
            .input('Stat4Value',     sql.NVarChar(100),  stat4Value     || null)
            .input('Stat4Label',     sql.NVarChar(150),  stat4Label     || null)
            .input('BannerTopLabel', sql.NVarChar(200),  bannerTopLabel || null)
            .input('BannerHeading',  sql.NVarChar(500),  bannerHeading  || null)
            .input('BannerDesc',     sql.NVarChar(sql.MAX), bannerDesc  || null)
            .input('BannerBtnText',  sql.NVarChar(100),  bannerBtnText  || null)
            .input('BannerBtnLink',  sql.NVarChar(500),  bannerBtnLink  || null)
            .input('LearnerImages',  sql.NVarChar(sql.MAX), learnerImages || null)
            .input('IsActive',       sql.Bit, isActive !== undefined ? parseInt(isActive) : 1)
            .execute('sp_UpsertSuccessSectionConfig');

        res.status(200).json({ success: true, message: 'Config saved', config: result.recordset[0] });
    } catch (err) {
        console.error('Upsert SuccessSectionConfig Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// ── Stories CRUD ──────────────────────────────────────────────
const getStories = async (req, res) => {
    try {
        const showAll = req.query.all === '1' ? 1 : 0;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('ShowAll', sql.Bit, showAll)
            .execute('sp_GetSuccessStories');
        res.status(200).json({ success: true, stories: result.recordset });
    } catch (err) {
        console.error('Get SuccessStories Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const getStoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Id', sql.Int, id)
            .execute('sp_GetSuccessStoryById');
        if (!result.recordset.length)
            return res.status(404).json({ success: false, message: 'Story not found' });
        res.status(200).json({ success: true, story: result.recordset[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const addStory = async (req, res) => {
    try {
        const { quote, descStrong, descRest, name, program, roleText, image, videoLink, sortOrder, isActive } = req.body;

        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Quote',      sql.NVarChar(500),      quote      || null)
            .input('DescStrong', sql.NVarChar(200),      descStrong || null)
            .input('DescRest',   sql.NVarChar(sql.MAX),  descRest   || null)
            .input('Name',       sql.NVarChar(150),      name       || null)
            .input('Program',    sql.NVarChar(300),      program    || null)
            .input('RoleText',   sql.NVarChar(200),      roleText   || null)
            .input('Image',      sql.NVarChar(sql.MAX),  image      || null)
            .input('VideoLink',  sql.NVarChar(500),      videoLink  || null)
            .input('SortOrder',  sql.Int,                parseInt(sortOrder) || 0)
            .input('IsActive',   sql.Bit,                isActive !== undefined ? parseInt(isActive) : 1)
            .execute('sp_AddSuccessStory');

        res.status(201).json({ success: true, message: 'Story added', id: result.recordset[0].Id });
    } catch (err) {
        console.error('Add SuccessStory Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

const updateStory = async (req, res) => {
    try {
        const { id } = req.params;
        const { quote, descStrong, descRest, name, program, roleText, image, videoLink, sortOrder, isActive } = req.body;

        const pool = await sql.connect(config);
        await pool.request()
            .input('Id',         sql.Int,                id)
            .input('Quote',      sql.NVarChar(500),      quote      || null)
            .input('DescStrong', sql.NVarChar(200),      descStrong || null)
            .input('DescRest',   sql.NVarChar(sql.MAX),  descRest   || null)
            .input('Name',       sql.NVarChar(150),      name       || null)
            .input('Program',    sql.NVarChar(300),      program    || null)
            .input('RoleText',   sql.NVarChar(200),      roleText   || null)
            .input('Image',      sql.NVarChar(sql.MAX),  image      || null)
            .input('VideoLink',  sql.NVarChar(500),      videoLink  || null)
            .input('SortOrder',  sql.Int,                parseInt(sortOrder) || 0)
            .input('IsActive',   sql.Bit,                isActive !== undefined ? parseInt(isActive) : 1)
            .execute('sp_UpdateSuccessStory');

        res.status(200).json({ success: true, message: 'Story updated' });
    } catch (err) {
        console.error('Update SuccessStory Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

const deleteStory = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        await pool.request().input('Id', sql.Int, id).execute('sp_DeleteSuccessStory');
        res.status(200).json({ success: true, message: 'Story deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const toggleStory = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request().input('Id', sql.Int, id).execute('sp_ToggleSuccessStory');
        res.status(200).json({ success: true, isActive: result.recordset[0]?.IsActive });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getConfig, upsertConfig,
    getStories, getStoryById, addStory, updateStory, deleteStory, toggleStory,
};
