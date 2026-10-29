const { sql, config } = require('../config/database');

// ============================================================
// OLD API — kept for backward compatibility
// ============================================================
const getSection = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().execute('sp_GetUniversitySection');
        res.status(200).json({ success: true, section: result.recordset[0] || null });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
const updateSection = async (req, res) => {
    try {
        const { badgeText, heading, description, btnText, btnLink } = req.body;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('BadgeText',   sql.VarChar(200),      badgeText   || null)
            .input('Heading',     sql.VarChar(255),      heading     || null)
            .input('Description', sql.NVarChar(sql.MAX), description || null)
            .input('BtnText',     sql.VarChar(100),      btnText     || null)
            .input('BtnLink',     sql.VarChar(255),      btnLink     || null)
            .execute('sp_UpdateUniversitySection');
        res.status(200).json({ success: true, message: 'Section updated', section: result.recordset[0] || null });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};
const getLogos = async (req, res) => {
    try {
        const showAll = req.query.all === '1' ? 1 : 0;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('ShowAll', sql.Bit, showAll)
            .execute('sp_GetUniversityLogos');
        res.status(200).json({ success: true, logos: result.recordset });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
const getLogoById = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request().input('Id', sql.Int, id).execute('sp_GetUniversityLogoById');
        if (!result.recordset.length) return res.status(404).json({ success: false, message: 'Not found' });
        res.status(200).json({ success: true, logo: result.recordset[0] });
    } catch (err) { res.status(500).json({ success: false, message: 'Server Error' }); }
};
const addLogo = async (req, res) => {
    try {
        const { name, logoUrl, sortOrder, isActive } = req.body;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Name', sql.VarChar(150), name || null)
            .input('LogoUrl', sql.VarChar(sql.MAX), logoUrl || null)
            .input('SortOrder', sql.Int, parseInt(sortOrder) || 0)
            .input('IsActive', sql.Bit, isActive !== undefined ? parseInt(isActive) : 1)
            .execute('sp_AddUniversityLogo');
        res.status(201).json({ success: true, id: result.recordset[0].Id });
    } catch (err) { res.status(500).json({ success: false, message: 'Server Error', error: err.message }); }
};
const updateLogo = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, logoUrl, sortOrder, isActive } = req.body;
        const pool = await sql.connect(config);
        await pool.request()
            .input('Id', sql.Int, id)
            .input('Name', sql.VarChar(150), name || null)
            .input('LogoUrl', sql.VarChar(sql.MAX), logoUrl || null)
            .input('SortOrder', sql.Int, parseInt(sortOrder) || 0)
            .input('IsActive', sql.Bit, isActive !== undefined ? parseInt(isActive) : 1)
            .execute('sp_UpdateUniversityLogo');
        res.status(200).json({ success: true });
    } catch (err) { res.status(500).json({ success: false, message: 'Server Error', error: err.message }); }
};
const deleteLogo = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        await pool.request().input('Id', sql.Int, id).execute('sp_DeleteUniversityLogo');
        res.status(200).json({ success: true });
    } catch (err) { res.status(500).json({ success: false, message: 'Server Error' }); }
};
const toggleLogo = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request().input('Id', sql.Int, id).execute('sp_ToggleUniversityLogo');
        res.status(200).json({ success: true, isActive: result.recordset[0]?.IsActive });
    } catch (err) { res.status(500).json({ success: false, message: 'Server Error' }); }
};
const reorderLogo = async (req, res) => {
    try {
        const { id } = req.params;
        const { sortOrder } = req.body;
        const pool = await sql.connect(config);
        await pool.request()
            .input('Id', sql.Int, id)
            .input('SortOrder', sql.Int, parseInt(sortOrder) || 0)
            .execute('sp_ReorderUniversityLogo');
        res.status(200).json({ success: true });
    } catch (err) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

// ============================================================
// NEW API — University Slides (full card slider)
// ============================================================

// GET all slides + logos — public
const getSlides = async (req, res) => {
    try {
        const showAll = req.query.all === '1' ? 1 : 0;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('ShowAll', sql.Bit, showAll)
            .execute('sp_GetUniversitySlides');

        const slides = result.recordsets[0] || [];
        const logos  = result.recordsets[1] || [];

        // Har slide mein uske logos attach karo
        const slidesWithLogos = slides.map(s => ({
            ...s,
            logos: logos.filter(l => l.SlideId === s.Id),
        }));

        res.status(200).json({ success: true, slides: slidesWithLogos });
    } catch (err) {
        console.error('Get Slides Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// ADD slide — admin
const addSlide = async (req, res) => {
    try {
        const { badgeText, heading, description, btnText, btnLink, sortOrder, isActive } = req.body;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('BadgeText',   sql.VarChar(200),      badgeText   || null)
            .input('Heading',     sql.VarChar(255),      heading     || null)
            .input('Description', sql.NVarChar(sql.MAX), description || null)
            .input('BtnText',     sql.VarChar(100),      btnText     || null)
            .input('BtnLink',     sql.VarChar(255),      btnLink     || null)
            .input('SortOrder',   sql.Int,               parseInt(sortOrder) || 0)
            .input('IsActive',    sql.Bit,               isActive !== false ? 1 : 0)
            .execute('sp_AddUniversitySlide');
        res.status(201).json({ success: true, id: result.recordset[0].Id });
    } catch (err) {
        console.error('Add Slide Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// UPDATE slide — admin
const updateSlide = async (req, res) => {
    try {
        const { id } = req.params;
        const { badgeText, heading, description, btnText, btnLink, sortOrder, isActive } = req.body;
        const pool = await sql.connect(config);
        await pool.request()
            .input('Id',          sql.Int,               id)
            .input('BadgeText',   sql.VarChar(200),      badgeText   || null)
            .input('Heading',     sql.VarChar(255),      heading     || null)
            .input('Description', sql.NVarChar(sql.MAX), description || null)
            .input('BtnText',     sql.VarChar(100),      btnText     || null)
            .input('BtnLink',     sql.VarChar(255),      btnLink     || null)
            .input('SortOrder',   sql.Int,               parseInt(sortOrder) || 0)
            .input('IsActive',    sql.Bit,               isActive !== false ? 1 : 0)
            .execute('sp_UpdateUniversitySlide');
        res.status(200).json({ success: true, message: 'Slide updated' });
    } catch (err) {
        console.error('Update Slide Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// DELETE slide — admin
const deleteSlide = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        await pool.request().input('Id', sql.Int, id).execute('sp_DeleteUniversitySlide');
        res.status(200).json({ success: true, message: 'Slide deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// TOGGLE slide — admin
const toggleSlide = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request().input('Id', sql.Int, id).execute('sp_ToggleUniversitySlide');
        res.status(200).json({ success: true, isActive: result.recordset[0]?.IsActive });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ADD logo to slide — admin
const addSlideLogo = async (req, res) => {
    try {
        const { slideId } = req.params;
        const { name, logoUrl, sortOrder, isActive } = req.body;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('SlideId',   sql.Int,              parseInt(slideId))
            .input('Name',      sql.VarChar(150),     name      || null)
            .input('LogoUrl',   sql.VarChar(sql.MAX), logoUrl   || null)
            .input('SortOrder', sql.Int,              parseInt(sortOrder) || 0)
            .input('IsActive',  sql.Bit,              isActive !== false ? 1 : 0)
            .execute('sp_AddUniversitySlideLogo');
        res.status(201).json({ success: true, id: result.recordset[0].Id });
    } catch (err) {
        console.error('Add Slide Logo Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// UPDATE slide logo — admin
const updateSlideLogo = async (req, res) => {
    try {
        const { logoId } = req.params;
        const { name, logoUrl, sortOrder, isActive } = req.body;
        const pool = await sql.connect(config);
        await pool.request()
            .input('Id',        sql.Int,              parseInt(logoId))
            .input('Name',      sql.VarChar(150),     name      || null)
            .input('LogoUrl',   sql.VarChar(sql.MAX), logoUrl   || null)
            .input('SortOrder', sql.Int,              parseInt(sortOrder) || 0)
            .input('IsActive',  sql.Bit,              isActive !== false ? 1 : 0)
            .execute('sp_UpdateUniversitySlideLogo');
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// DELETE slide logo — admin
const deleteSlideLogo = async (req, res) => {
    try {
        const { logoId } = req.params;
        const pool = await sql.connect(config);
        await pool.request().input('Id', sql.Int, parseInt(logoId)).execute('sp_DeleteUniversitySlideLogo');
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    // Old API
    getSection, updateSection,
    getLogos, getLogoById, addLogo, updateLogo, deleteLogo, toggleLogo, reorderLogo,
    // New Slides API
    getSlides, addSlide, updateSlide, deleteSlide, toggleSlide,
    addSlideLogo, updateSlideLogo, deleteSlideLogo,
};
