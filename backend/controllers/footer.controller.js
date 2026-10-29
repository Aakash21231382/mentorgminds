const { sql, config } = require('../config/database');

// ── GET all columns (admin = all, public = active only) ────
const getColumns = async (req, res) => {
    try {
        const showAll = req.query.all === '1' ? 1 : 0;
        const pool    = await sql.connect(config);
        const result  = await pool.request()
            .input('ShowAll', sql.Bit, showAll)
            .execute('sp_GetFooterColumns');
        res.status(200).json({ success: true, columns: result.recordset });
    } catch (err) {
        console.error('Get Footer Columns Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── GET links by column ─────────────────────────────────────
const getLinksByColumn = async (req, res) => {
    try {
        const { columnId } = req.params;
        const showAll = req.query.all === '1' ? 1 : 0;
        const pool    = await sql.connect(config);
        const result  = await pool.request()
            .input('ColumnId', sql.Int, columnId)
            .input('ShowAll',  sql.Bit, showAll)
            .execute('sp_GetFooterLinks');
        res.status(200).json({ success: true, links: result.recordset });
    } catch (err) {
        console.error('Get Footer Links Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── GET all data (public — one call) ────────────────────────
const getAllData = async (req, res) => {
    try {
        const pool   = await sql.connect(config);
        const result = await pool.request().execute('sp_GetFooterAllData');

        const columns = result.recordsets[0] || [];
        const links   = result.recordsets[1] || [];

        // Attach links to their column
        const data = columns.map(col => ({
            ...col,
            links: links.filter(l => l.ColumnId === col.Id),
        }));

        res.status(200).json({ success: true, columns: data });
    } catch (err) {
        console.error('Get Footer AllData Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── ADD column ──────────────────────────────────────────────
const addColumn = async (req, res) => {
    try {
        const { heading, sortOrder } = req.body;
        if (!heading) return res.status(400).json({ success: false, message: 'Heading is required' });

        const pool   = await sql.connect(config);
        const result = await pool.request()
            .input('Heading',   sql.NVarChar(200), heading)
            .input('SortOrder', sql.Int, parseInt(sortOrder) || 0)
            .execute('sp_AddFooterColumn');

        res.status(201).json({ success: true, id: result.recordset[0].Id, message: 'Column added' });
    } catch (err) {
        console.error('Add Footer Column Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// ── UPDATE column ───────────────────────────────────────────
const updateColumn = async (req, res) => {
    try {
        const { id } = req.params;
        const { heading, sortOrder, isActive } = req.body;
        if (!heading) return res.status(400).json({ success: false, message: 'Heading is required' });

        const pool = await sql.connect(config);
        await pool.request()
            .input('Id',        sql.Int,          id)
            .input('Heading',   sql.NVarChar(200), heading)
            .input('SortOrder', sql.Int,           parseInt(sortOrder) || 0)
            .input('IsActive',  sql.Bit,           isActive !== false ? 1 : 0)
            .execute('sp_UpdateFooterColumn');

        res.status(200).json({ success: true, message: 'Column updated' });
    } catch (err) {
        console.error('Update Footer Column Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// ── DELETE column ───────────────────────────────────────────
const deleteColumn = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        await pool.request().input('Id', sql.Int, id).execute('sp_DeleteFooterColumn');
        res.status(200).json({ success: true, message: 'Column deleted' });
    } catch (err) {
        console.error('Delete Footer Column Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── TOGGLE column ───────────────────────────────────────────
const toggleColumn = async (req, res) => {
    try {
        const { id } = req.params;
        const pool   = await sql.connect(config);
        const result = await pool.request().input('Id', sql.Int, id).execute('sp_ToggleFooterColumn');
        res.status(200).json({ success: true, isActive: result.recordset[0]?.IsActive });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── ADD link ────────────────────────────────────────────────
const addLink = async (req, res) => {
    try {
        const { columnId } = req.params;
        const { title, url, navbarLinkId, sortOrder } = req.body;
        if (!title) return res.status(400).json({ success: false, message: 'Title is required' });
        if (!url)   return res.status(400).json({ success: false, message: 'URL is required' });

        const pool   = await sql.connect(config);
        const result = await pool.request()
            .input('ColumnId',     sql.Int,          columnId)
            .input('Title',        sql.NVarChar(200), title)
            .input('Url',          sql.NVarChar(500), url)
            .input('NavbarLinkId', sql.Int,           navbarLinkId || null)
            .input('SortOrder',    sql.Int,           parseInt(sortOrder) || 0)
            .execute('sp_AddFooterLink');

        res.status(201).json({ success: true, id: result.recordset[0].Id, message: 'Link added' });
    } catch (err) {
        console.error('Add Footer Link Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// ── UPDATE link ─────────────────────────────────────────────
const updateLink = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, url, navbarLinkId, sortOrder, isActive } = req.body;
        if (!title) return res.status(400).json({ success: false, message: 'Title is required' });
        if (!url)   return res.status(400).json({ success: false, message: 'URL is required' });

        const pool = await sql.connect(config);
        await pool.request()
            .input('Id',           sql.Int,          id)
            .input('Title',        sql.NVarChar(200), title)
            .input('Url',          sql.NVarChar(500), url)
            .input('NavbarLinkId', sql.Int,           navbarLinkId || null)
            .input('SortOrder',    sql.Int,           parseInt(sortOrder) || 0)
            .input('IsActive',     sql.Bit,           isActive !== false ? 1 : 0)
            .execute('sp_UpdateFooterLink');

        res.status(200).json({ success: true, message: 'Link updated' });
    } catch (err) {
        console.error('Update Footer Link Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// ── DELETE link ─────────────────────────────────────────────
const deleteLink = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        await pool.request().input('Id', sql.Int, id).execute('sp_DeleteFooterLink');
        res.status(200).json({ success: true, message: 'Link deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── TOGGLE link ─────────────────────────────────────────────
const toggleLink = async (req, res) => {
    try {
        const { id } = req.params;
        const pool   = await sql.connect(config);
        const result = await pool.request().input('Id', sql.Int, id).execute('sp_ToggleFooterLink');
        res.status(200).json({ success: true, isActive: result.recordset[0]?.IsActive });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getColumns, getLinksByColumn, getAllData,
    addColumn, updateColumn, deleteColumn, toggleColumn,
    addLink, updateLink, deleteLink, toggleLink,
};
