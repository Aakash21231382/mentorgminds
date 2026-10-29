const { sql, config } = require('../config/database');

// ── GET (public + admin) ──────────────────────────────────────
const getSubscriptionBanner = async (req, res) => {
    try {
        const pool   = await sql.connect(config);
        const result = await pool.request().execute('sp_GetSubscriptionBanner');
        const data   = result.recordset[0] || null;
        res.status(200).json({ success: true, data });
    } catch (err) {
        console.error('Get SubscriptionBanner Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── UPSERT (admin save) ───────────────────────────────────────
const upsertSubscriptionBanner = async (req, res) => {
    try {
        const {
            heading, description,
            feature1Label, feature1Icon, feature1Color,
            feature2Label, feature2Icon, feature2Color,
            feature3Label, feature3Icon, feature3Color,
            feature4Label, feature4Icon, feature4Color,
            btnText, btnLink, image, isActive,
        } = req.body;

        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Heading',       sql.NVarChar(300),     heading       || null)
            .input('Description',   sql.NVarChar(sql.MAX), description   || null)
            .input('Feature1Label', sql.VarChar(150),      feature1Label || null)
            .input('Feature1Icon',  sql.VarChar(50),       feature1Icon  || null)
            .input('Feature1Color', sql.VarChar(20),       feature1Color || null)
            .input('Feature2Label', sql.VarChar(150),      feature2Label || null)
            .input('Feature2Icon',  sql.VarChar(50),       feature2Icon  || null)
            .input('Feature2Color', sql.VarChar(20),       feature2Color || null)
            .input('Feature3Label', sql.VarChar(150),      feature3Label || null)
            .input('Feature3Icon',  sql.VarChar(50),       feature3Icon  || null)
            .input('Feature3Color', sql.VarChar(20),       feature3Color || null)
            .input('Feature4Label', sql.VarChar(150),      feature4Label || null)
            .input('Feature4Icon',  sql.VarChar(50),       feature4Icon  || null)
            .input('Feature4Color', sql.VarChar(20),       feature4Color || null)
            .input('BtnText',       sql.VarChar(100),      btnText       || null)
            .input('BtnLink',       sql.VarChar(300),      btnLink       || null)
            .input('Image',         sql.VarChar(sql.MAX),  image         || null)
            .input('IsActive',      sql.Bit,               isActive !== undefined ? parseInt(isActive) : 1)
            .execute('sp_UpsertSubscriptionBanner');

        res.status(200).json({ success: true, message: 'Saved', data: result.recordset[0] });
    } catch (err) {
        console.error('Upsert SubscriptionBanner Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

module.exports = { getSubscriptionBanner, upsertSubscriptionBanner };
