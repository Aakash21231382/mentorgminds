const { sql, config } = require('../config/database');

// ============================================================
// 1. GET all banners — public (frontend carousel)
// ============================================================
const getBanners = async (req, res) => {
    try {
        const showAll = req.query.all === '1' ? 1 : 0;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('ShowAll', sql.Bit, showAll)
            .execute('sp_GetBanners');
        res.status(200).json({ success: true, banners: result.recordset });
    } catch (err) {
        console.error('Get Banners Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ============================================================
// 2. GET single banner — admin edit
// ============================================================
const getBannerById = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Id', sql.Int, id)
            .execute('sp_GetBannerById');
        if (!result.recordset.length)
            return res.status(404).json({ success: false, message: 'Banner not found' });
        res.status(200).json({ success: true, banner: result.recordset[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ============================================================
// 3. ADD banner
// ============================================================
const addBanner = async (req, res) => {
    try {
        const {
            badgeText, headingLine1, headingLine2,
            subText1, subText2,
            btn1Text, btn1Link, btn2Text, btn2Link,
            bannerImage, bgImage,
            videoUrl, videoCardLabel, videoCardTitle,
            sortOrder, isActive,
        } = req.body;

        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('BadgeText',      sql.VarChar(150),      badgeText      || null)
            .input('HeadingLine1',   sql.VarChar(255),      headingLine1   || null)
            .input('HeadingLine2',   sql.VarChar(255),      headingLine2   || null)
            .input('SubText1',       sql.VarChar(500),      subText1       || null)
            .input('SubText2',       sql.NVarChar(sql.MAX), subText2       || null)
            .input('Btn1Text',       sql.VarChar(100),      btn1Text       || null)
            .input('Btn1Link',       sql.VarChar(255),      btn1Link       || null)
            .input('Btn2Text',       sql.VarChar(100),      btn2Text       || null)
            .input('Btn2Link',       sql.VarChar(255),      btn2Link       || null)
            .input('BannerImage',    sql.VarChar(sql.MAX),  bannerImage    || null)
            .input('VideoUrl',       sql.VarChar(500),      videoUrl       || null)
            .input('VideoCardLabel', sql.VarChar(150),      videoCardLabel || null)
            .input('VideoCardTitle', sql.VarChar(150),      videoCardTitle || null)
            .input('BgImage',        sql.VarChar(sql.MAX),  bgImage        || null)
            .input('SortOrder',      sql.Int,               parseInt(sortOrder) || 0)
            .input('IsActive',       sql.Bit,               isActive !== undefined ? parseInt(isActive) : 1)
            .execute('sp_AddBanner');

        res.status(201).json({ success: true, message: 'Banner added', id: result.recordset[0].Id });
    } catch (err) {
        console.error('Add Banner Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// ============================================================
// 4. UPDATE banner
// ============================================================
const updateBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            badgeText, headingLine1, headingLine2,
            subText1, subText2,
            btn1Text, btn1Link, btn2Text, btn2Link,
            bannerImage, bgImage,
            videoUrl, videoCardLabel, videoCardTitle,
            sortOrder, isActive,
        } = req.body;

        const pool = await sql.connect(config);
        await pool.request()
            .input('Id',             sql.Int,               id)
            .input('BadgeText',      sql.VarChar(150),      badgeText      || null)
            .input('HeadingLine1',   sql.VarChar(255),      headingLine1   || null)
            .input('HeadingLine2',   sql.VarChar(255),      headingLine2   || null)
            .input('SubText1',       sql.VarChar(500),      subText1       || null)
            .input('SubText2',       sql.NVarChar(sql.MAX), subText2       || null)
            .input('Btn1Text',       sql.VarChar(100),      btn1Text       || null)
            .input('Btn1Link',       sql.VarChar(255),      btn1Link       || null)
            .input('Btn2Text',       sql.VarChar(100),      btn2Text       || null)
            .input('Btn2Link',       sql.VarChar(255),      btn2Link       || null)
            .input('BannerImage',    sql.VarChar(sql.MAX),  bannerImage    || null)
            .input('VideoUrl',       sql.VarChar(500),      videoUrl       || null)
            .input('VideoCardLabel', sql.VarChar(150),      videoCardLabel || null)
            .input('VideoCardTitle', sql.VarChar(150),      videoCardTitle || null)
            .input('BgImage',        sql.VarChar(sql.MAX),  bgImage        || null)
            .input('SortOrder',      sql.Int,               parseInt(sortOrder) || 0)
            .input('IsActive',       sql.Bit,               isActive !== undefined ? parseInt(isActive) : 1)
            .execute('sp_UpdateBanner');

        res.status(200).json({ success: true, message: 'Banner updated' });
    } catch (err) {
        console.error('Update Banner Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// ============================================================
// 5. DELETE banner
// ============================================================
const deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        await pool.request()
            .input('Id', sql.Int, id)
            .execute('sp_DeleteBanner');
        res.status(200).json({ success: true, message: 'Banner deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ============================================================
// 6. TOGGLE active/inactive
// ============================================================
const toggleBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Id', sql.Int, id)
            .execute('sp_ToggleBanner');
        res.status(200).json({ success: true, isActive: result.recordset[0]?.IsActive });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = { getBanners, getBannerById, addBanner, updateBanner, deleteBanner, toggleBanner };
