const express = require('express');
const router = express.Router();
const { sql, config } = require('../config/database');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public: Submit center visit request
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, city, centre } = req.body;

        if (!name || !email || !phone || !city || !centre) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        const pool = await sql.connect(config);
        await pool.request()
            .input('Name', sql.VarChar(100), name)
            .input('Email', sql.VarChar(100), email)
            .input('Phone', sql.VarChar(15), phone)
            .input('City', sql.VarChar(50), city)
            .input('Centre', sql.VarChar(200), centre)
            .query(`
                INSERT INTO CenterVisits (Name, Email, Phone, City, Centre, CreatedAt, Status)
                VALUES (@Name, @Email, @Phone, @City, @Centre, GETDATE(), 'Pending')
            `);

        res.status(201).json({ 
            success: true, 
            message: 'Visit request submitted successfully' 
        });
    } catch (err) {
        console.error('Submit Center Visit Error:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Server Error' 
        });
    }
});

// Admin: Get all center visit requests
router.get('/all', adminMiddleware, async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`
            SELECT * FROM CenterVisits 
            ORDER BY CreatedAt DESC
        `);

        res.status(200).json({ 
            success: true, 
            visits: result.recordset 
        });
    } catch (err) {
        console.error('Get Center Visits Error:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Server Error' 
        });
    }
});

// Admin: Update status
router.put('/:id/status', adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const pool = await sql.connect(config);
        await pool.request()
            .input('Id', sql.Int, id)
            .input('Status', sql.VarChar(50), status)
            .query(`
                UPDATE CenterVisits 
                SET Status = @Status, UpdatedAt = GETDATE()
                WHERE Id = @Id
            `);

        res.status(200).json({ 
            success: true, 
            message: 'Status updated successfully' 
        });
    } catch (err) {
        console.error('Update Status Error:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Server Error' 
        });
    }
});

// Admin: Delete visit request
router.delete('/:id', adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await sql.connect(config);
        await pool.request()
            .input('Id', sql.Int, id)
            .query(`DELETE FROM CenterVisits WHERE Id = @Id`);

        res.status(200).json({ 
            success: true, 
            message: 'Visit request deleted' 
        });
    } catch (err) {
        console.error('Delete Center Visit Error:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Server Error' 
        });
    }
});

module.exports = router;
