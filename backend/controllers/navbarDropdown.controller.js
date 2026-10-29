const { sql, config } = require('../config/database');
const { getOrSet, clear } = require('../utils/cache');

// Helper to clear all dropdown caches
const clearDropdownCache = (navbarLinkId = null) => {
    if (navbarLinkId) {
        clear(`public_dropdown_${navbarLinkId}`);
    }
    clear('all_public_dropdowns');
};

// ── GROUPS (Category / Country) ───────────────────────────────

const getGroups = async (req, res) => {
    try {
        const { navbarLinkId } = req.params;
        const showAll = req.query.all === '1' ? 1 : 0;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('NavbarLinkId', sql.Int, navbarLinkId)
            .input('ShowAll',      sql.Bit, showAll)
            .execute('sp_GetNavbarGroups');
        res.status(200).json({ success: true, groups: result.recordset });
    } catch (err) {
        console.error('GetGroups Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const addGroup = async (req, res) => {
    try {
        const { navbarLinkId } = req.params;
        const { name, image, sortOrder, isActive } = req.body;
        if (!name) return res.status(400).json({ success: false, message: 'Name is required' });

        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('NavbarLinkId', sql.Int,          navbarLinkId)
            .input('Name',         sql.VarChar(200),  name)
            .input('Image',        sql.VarChar(sql.MAX), image || null)
            .input('SortOrder',    sql.Int,          parseInt(sortOrder) || 0)
            .input('IsActive',     sql.Bit,          isActive !== undefined ? parseInt(isActive) : 1)
            .execute('sp_AddNavbarGroup');
        
        clearDropdownCache(navbarLinkId);
        
        res.status(201).json({ success: true, message: 'Group added', id: result.recordset[0].Id });
    } catch (err) {
        console.error('AddGroup Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

const updateGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const { navbarLinkId, name, image, sortOrder, isActive } = req.body;
        if (!name) return res.status(400).json({ success: false, message: 'Name is required' });

        const pool = await sql.connect(config);
        await pool.request()
            .input('Id',           sql.Int,          id)
            .input('NavbarLinkId', sql.Int,          navbarLinkId)
            .input('Name',         sql.VarChar(200),  name)
            .input('Image',        sql.VarChar(sql.MAX), image || null)
            .input('SortOrder',    sql.Int,          parseInt(sortOrder) || 0)
            .input('IsActive',     sql.Bit,          isActive !== undefined ? parseInt(isActive) : 1)
            .execute('sp_UpdateNavbarGroup');
        
        clearDropdownCache(navbarLinkId);
        
        res.status(200).json({ success: true, message: 'Group updated' });
    } catch (err) {
        console.error('UpdateGroup Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

const deleteGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        await pool.request()
            .input('Id', sql.Int, id)
            .execute('sp_DeleteNavbarGroup');
        
        clearDropdownCache();
        
        res.status(200).json({ success: true, message: 'Group deleted' });
    } catch (err) {
        console.error('DeleteGroup Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const toggleGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Id', sql.Int, id)
            .execute('sp_ToggleNavbarGroup');
        
        clearDropdownCache();
        
        res.status(200).json({ success: true, isActive: result.recordset[0]?.IsActive });
    } catch (err) {
        console.error('ToggleGroup Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── ITEMS (Courses / Programs) ────────────────────────────────

const getItems = async (req, res) => {
    try {
        const { groupId } = req.params;
        const showAll = req.query.all === '1' ? 1 : 0;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('GroupId', sql.Int, groupId)
            .input('ShowAll', sql.Bit, showAll)
            .execute('sp_GetNavbarItems');
        res.status(200).json({ success: true, items: result.recordset });
    } catch (err) {
        console.error('GetItems Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const getItemById = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Id', sql.Int, id)
            .execute('sp_GetNavbarItemById');
        if (!result.recordset.length)
            return res.status(404).json({ success: false, message: 'Item not found' });
        res.status(200).json({ success: true, item: result.recordset[0] });
    } catch (err) {
        console.error('GetItemById Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const addItem = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { universityName, universityLogo, title, url, slug, sortOrder, isActive } = req.body;
        if (!title) return res.status(400).json({ success: false, message: 'Title is required' });

        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('GroupId',        sql.Int,          groupId)
            .input('UniversityName', sql.VarChar(255),  universityName || null)
            .input('UniversityLogo', sql.VarChar(sql.MAX), universityLogo || null)
            .input('Title',          sql.VarChar(500),  title)
            .input('Url',            sql.VarChar(sql.MAX), url || null)
            .input('Slug',           sql.VarChar(200),  slug || null)
            .input('SortOrder',      sql.Int,          parseInt(sortOrder) || 0)
            .input('IsActive',       sql.Bit,          isActive !== undefined ? parseInt(isActive) : 1)
            .execute('sp_AddNavbarItem');
        
        clearDropdownCache();
        
        res.status(201).json({ success: true, message: 'Item added', id: result.recordset[0].Id });
    } catch (err) {
        console.error('AddItem Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { groupId, universityName, universityLogo, title, url, slug, sortOrder, isActive } = req.body;
        if (!title) return res.status(400).json({ success: false, message: 'Title is required' });

        const pool = await sql.connect(config);
        await pool.request()
            .input('Id',             sql.Int,          id)
            .input('GroupId',        sql.Int,          groupId)
            .input('UniversityName', sql.VarChar(255),  universityName || null)
            .input('UniversityLogo', sql.VarChar(sql.MAX), universityLogo || null)
            .input('Title',          sql.VarChar(500),  title)
            .input('Url',            sql.VarChar(sql.MAX), url || null)
            .input('Slug',           sql.VarChar(200),  slug || null)
            .input('SortOrder',      sql.Int,          parseInt(sortOrder) || 0)
            .input('IsActive',       sql.Bit,          isActive !== undefined ? parseInt(isActive) : 1)
            .execute('sp_UpdateNavbarItem');
        
        clearDropdownCache();
        
        res.status(200).json({ success: true, message: 'Item updated' });
    } catch (err) {
        console.error('UpdateItem Error:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        await pool.request()
            .input('Id', sql.Int, id)
            .execute('sp_DeleteNavbarItem');
        
        clearDropdownCache();
        
        res.status(200).json({ success: true, message: 'Item deleted' });
    } catch (err) {
        console.error('DeleteItem Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const toggleItem = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Id', sql.Int, id)
            .execute('sp_ToggleNavbarItem');
        
        clearDropdownCache();
        
        res.status(200).json({ success: true, isActive: result.recordset[0]?.IsActive });
    } catch (err) {
        console.error('ToggleItem Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── PUBLIC (WITH CACHING) ────────────────────────────────────

const getPublicDropdown = async (req, res) => {
    try {
        const { navbarLinkId } = req.params;
        const cacheKey = `public_dropdown_${navbarLinkId}`;
        
        const data = await getOrSet(cacheKey, async () => {
            const pool = await sql.connect(config);
            const result = await pool.request()
                .input('NavbarLinkId', sql.Int, navbarLinkId)
                .execute('sp_GetPublicNavbarDropdown');

            const groups = result.recordsets?.[0] || [];
            const items  = result.recordsets?.[1] || [];
            return { success: true, groups, items };
        }, 600); // 10 minutes cache

        res.status(200).json(data);
    } catch (err) {
        console.error('GetPublicDropdown Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const getAllPublicDropdowns = async (req, res) => {
    try {
        const cacheKey = 'all_public_dropdowns';
        
        const data = await getOrSet(cacheKey, async () => {
            const pool = await sql.connect(config);
            const result = await pool.request().execute('sp_GetAllPublicNavbarDropdowns');

            const groups = result.recordsets?.[0] || [];
            const items  = result.recordsets?.[1] || [];
            return { success: true, groups, items };
        }, 600); // 10 minutes cache

        res.status(200).json(data);
    } catch (err) {
        console.error('GetAllPublicDropdowns Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getGroups, addGroup, updateGroup, deleteGroup, toggleGroup,
    getItems, getItemById, addItem, updateItem, deleteItem, toggleItem,
    getPublicDropdown, getAllPublicDropdowns,
};
