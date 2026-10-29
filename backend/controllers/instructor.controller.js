const { sql, config } = require('../config/database');

// ── Section heading ───────────────────────────────────────────
const getSection = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().execute('sp_GetInstructorSection');
        res.status(200).json({ success: true, section: result.recordset[0] || null });
    } catch (err) {
        console.error('Get InstructorSection Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const upsertSection = async (req, res) => {
    try {
        const { tagText, headingNormal, headingOrange, viewAllText, viewAllLink } = req.body;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('TagText',       sql.VarChar(100),  tagText       || null)
            .input('HeadingNormal', sql.VarChar(200),  headingNormal || null)
            .input('HeadingOrange', sql.VarChar(200),  headingOrange || null)
            .input('ViewAllText',   sql.VarChar(100),  viewAllText   || null)
            .input('ViewAllLink',   sql.VarChar(300),  viewAllLink   || null)
            .execute('sp_UpsertInstructorSection');
        res.status(200).json({ success: true, section: result.recordset[0] });
    } catch (err) {
        console.error('Upsert InstructorSection Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// ── Instructors CRUD ──────────────────────────────────────────
const getInstructors = async (req, res) => {
    try {
        const showAll = req.query.all === '1' ? 1 : 0;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('ShowAll', sql.Bit, showAll)
            .execute('sp_GetInstructors');
        res.status(200).json({ success: true, instructors: result.recordset });
    } catch (err) {
        console.error('Get Instructors Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const getInstructorById = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Id', sql.Int, id)
            .execute('sp_GetInstructorById');
        if (!result.recordset.length)
            return res.status(404).json({ success: false, message: 'Not found' });
        res.status(200).json({ success: true, instructor: result.recordset[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const addInstructor = async (req, res) => {
    try {
        const { name, role, photo, companyLogo, description, cardBg,
                facebookUrl, twitterUrl, linkedinUrl, youtubeUrl, sortOrder, isActive } = req.body;
        if (!name) return res.status(400).json({ success: false, message: 'Name is required' });

        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Name',        sql.VarChar(150),      name)
            .input('Role',        sql.VarChar(150),      role         || null)
            .input('Photo',       sql.VarChar(sql.MAX),  photo        || null)
            .input('CompanyLogo', sql.VarChar(sql.MAX),  companyLogo  || null)
            .input('Description', sql.NVarChar(sql.MAX), description  || null)
            .input('CardBg',      sql.VarChar(20),       cardBg       || 'blue')
            .input('FacebookUrl', sql.VarChar(300),      facebookUrl  || null)
            .input('TwitterUrl',  sql.VarChar(300),      twitterUrl   || null)
            .input('LinkedinUrl', sql.VarChar(300),      linkedinUrl  || null)
            .input('YoutubeUrl',  sql.VarChar(300),      youtubeUrl   || null)
            .input('SortOrder',   sql.Int,               parseInt(sortOrder) || 0)
            .input('IsActive',    sql.Bit,               isActive !== undefined ? parseInt(isActive) : 1)
            .execute('sp_AddInstructor');
        res.status(201).json({ success: true, message: 'Instructor added', id: result.recordset[0].Id });
    } catch (err) {
        console.error('Add Instructor Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

const updateInstructor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, role, photo, companyLogo, description, cardBg,
                facebookUrl, twitterUrl, linkedinUrl, youtubeUrl, sortOrder, isActive } = req.body;
        if (!name) return res.status(400).json({ success: false, message: 'Name is required' });

        const pool = await sql.connect(config);
        await pool.request()
            .input('Id',          sql.Int,               id)
            .input('Name',        sql.VarChar(150),      name)
            .input('Role',        sql.VarChar(150),      role         || null)
            .input('Photo',       sql.VarChar(sql.MAX),  photo        || null)
            .input('CompanyLogo', sql.VarChar(sql.MAX),  companyLogo  || null)
            .input('Description', sql.NVarChar(sql.MAX), description  || null)
            .input('CardBg',      sql.VarChar(20),       cardBg       || 'blue')
            .input('FacebookUrl', sql.VarChar(300),      facebookUrl  || null)
            .input('TwitterUrl',  sql.VarChar(300),      twitterUrl   || null)
            .input('LinkedinUrl', sql.VarChar(300),      linkedinUrl  || null)
            .input('YoutubeUrl',  sql.VarChar(300),      youtubeUrl   || null)
            .input('SortOrder',   sql.Int,               parseInt(sortOrder) || 0)
            .input('IsActive',    sql.Bit,               isActive !== undefined ? parseInt(isActive) : 1)
            .execute('sp_UpdateInstructor');
        res.status(200).json({ success: true, message: 'Instructor updated' });
    } catch (err) {
        console.error('Update Instructor Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

const deleteInstructor = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        await pool.request().input('Id', sql.Int, id).execute('sp_DeleteInstructor');
        res.status(200).json({ success: true, message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const toggleInstructor = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request().input('Id', sql.Int, id).execute('sp_ToggleInstructor');
        res.status(200).json({ success: true, isActive: result.recordset[0]?.IsActive });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── AllPrograms Hero ──────────────────────────────────────────
const getAllProgramsHero = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().execute('sp_GetAllProgramsHero');
        res.status(200).json({ success: true, hero: result.recordset[0] || null });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const upsertAllProgramsHero = async (req, res) => {
    try {
        const { headingLine1, headingLine2, bgImage } = req.body;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('HeadingLine1', sql.VarChar(300), headingLine1 || null)
            .input('HeadingLine2', sql.VarChar(300), headingLine2 || null)
            .input('BgImage',      sql.VarChar(sql.MAX), bgImage  || null)
            .execute('sp_UpsertAllProgramsHero');
        res.status(200).json({ success: true, hero: result.recordset[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

module.exports = {
    getSection, upsertSection,
    getInstructors, getInstructorById, addInstructor, updateInstructor, deleteInstructor, toggleInstructor,
    getAllProgramsHero, upsertAllProgramsHero,
};
