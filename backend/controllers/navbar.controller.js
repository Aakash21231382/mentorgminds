const { sql, config } = require('../config/database');
const { getOrSet, clear } = require('../utils/cache');

// Helper: title se slug banana  e.g. "Machine Learning" -> "machine-learning"
const makeSlug = (title) =>
    title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// ============================================================
// 1. Add New Navbar Link (Clear cache after adding)
// ============================================================
const addNavbarLink = async (req, res) => {
    try {
        const { title, url, category, parentId, badgeText, sortOrder, viewAllUrl } = req.body;

        if (!title) return res.status(400).json({ success: false, message: "Title is required" });

        const slug = makeSlug(title);

        let finalUrl = url || null;
        if (!finalUrl && parentId && category) {
            finalUrl = `/${category}/${slug}`;
        }

        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Title', sql.VarChar(100), title)
            .input('Url', sql.VarChar(255), finalUrl)
            .input('Slug', sql.VarChar(150), slug)
            .input('Category', sql.VarChar(50), category || null)
            .input('ParentId', sql.Int, parentId || null)
            .input('BadgeText', sql.VarChar(20), badgeText || null)
            .input('SortOrder', sql.Int, sortOrder || 0)
            .input('ViewAllUrl', sql.VarChar(255), viewAllUrl || null)
            .execute('sp_AddNavbarLink');

        const newId = result.recordset[0].Id;

        // Clear cache
        clear('navbar_links_0');
        clear('navbar_links_1');

        res.status(201).json({ success: true, message: "Navbar link added successfully", id: newId, slug });
    } catch (error) {
        console.error("Add Navbar Link Error:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// ============================================================
// 2. Get All Navbar Links — nested tree + flatLinks (WITH CACHING)
// ============================================================
const getNavbarLinks = async (req, res) => {
    try {
        const showAll = req.query.all === '1' ? 1 : 0;
        const cacheKey = `navbar_links_${showAll}`;

        // Get from cache or fetch fresh
        const data = await getOrSet(cacheKey, async () => {
            const pool = await sql.connect(config);
            const result = await pool.request()
                .input('ShowAll', sql.Bit, showAll)
                .execute('sp_GetNavbarLinks');

            const links = result.recordset;
            const linkMap = {};

            links.forEach(link => {
                link.children = [];
                linkMap[link.Id] = link;
            });

            const navbarTree = [];
            links.forEach(link => {
                if (link.ParentId) {
                    if (linkMap[link.ParentId]) {
                        linkMap[link.ParentId].children.push(link);
                    }
                } else {
                    navbarTree.push(link);
                }
            });

            return {
                success: true,
                links: navbarTree,  // Frontend Navbar ke liye (nested)
                flatLinks: links    // Admin table ke liye (flat)
            };
        }, 600); // 10 minutes cache

        res.status(200).json(data);
    } catch (error) {
        console.error("Get Navbar Links Error:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// ============================================================
// 3. Update Navbar Link (Clear cache after update)
// ============================================================
const updateNavbarLink = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, url, category, badgeText, isActive, sortOrder, viewAllUrl } = req.body;

        if (!title) return res.status(400).json({ success: false, message: "Title is required" });

        const slug = makeSlug(title);

        const pool = await sql.connect(config);
        await pool.request()
            .input('Id', sql.Int, id)
            .input('Title', sql.VarChar(100), title)
            .input('Url', sql.VarChar(255), url || null)
            .input('Slug', sql.VarChar(150), slug)
            .input('Category', sql.VarChar(50), category || null)
            .input('BadgeText', sql.VarChar(20), badgeText || null)
            .input('IsActive', sql.Bit, isActive !== undefined ? isActive : 1)
            .input('SortOrder', sql.Int, sortOrder || 0)
            .input('ViewAllUrl', sql.VarChar(255), viewAllUrl || null)
            .execute('sp_UpdateNavbarLink');

        // Clear cache
        clear('navbar_links_0');
        clear('navbar_links_1');

        res.status(200).json({ success: true, message: "Link updated successfully", slug });
    } catch (error) {
        console.error("Update Navbar Link Error:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// ============================================================
// 4. Delete Navbar Link (Clear cache after delete)
// ============================================================
const deleteNavbarLink = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);

        const result = await pool.request()
            .input('Id', sql.Int, id)
            .execute('sp_DeleteNavbarLink');

        const row = result.recordset[0];

        if (row.result === -1) {
            return res.status(400).json({ success: false, message: row.message });
        }

        // Clear cache
        clear('navbar_links_0');
        clear('navbar_links_1');

        res.status(200).json({ success: true, message: row.message });
    } catch (error) {
        console.error("Delete Navbar Link Error:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// ============================================================
// 5. Toggle Active/Inactive (Clear cache after toggle)
// ============================================================
const toggleNavbarLinkStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);

        const result = await pool.request()
            .input('Id', sql.Int, id)
            .execute('sp_ToggleNavbarLink');

        const newStatus = result.recordset[0]?.IsActive;

        // Clear cache
        clear('navbar_links_0');
        clear('navbar_links_1');

        res.status(200).json({
            success: true,
            message: `Link ${newStatus ? 'activated' : 'deactivated'} successfully`,
            isActive: newStatus
        });
    } catch (error) {
        console.error("Toggle Status Error:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

module.exports = {
    addNavbarLink,
    getNavbarLinks,
    updateNavbarLink,
    deleteNavbarLink,
    toggleNavbarLinkStatus
};
