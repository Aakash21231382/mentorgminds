const { sql, config } = require('../config/database');

// ── Callback (Talk to Expert) ────────────────────────────────
const submitCallback = async (req, res) => {
    try {
        const { fullName, phone, email, domain, message } = req.body;
        if (!fullName || !phone)
            return res.status(400).json({ success: false, message: 'Name and phone are required' });

        const pool = await sql.connect(config);
        await pool.request()
            .input('FullName', sql.VarChar(100), fullName)
            .input('Phone',    sql.VarChar(20),  phone)
            .input('Email',    sql.VarChar(150), email   || null)
            .input('Domain',   sql.VarChar(100), domain  || null)
            .input('Message',  sql.VarChar(500), message || null)
            .execute('sp_SubmitCallback');

        res.status(201).json({ success: true, message: 'Callback request submitted successfully' });
    } catch (error) {
        console.error('Submit Callback Error:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

const getCallbacks = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().execute('sp_GetCallbacks');
        const unreadCount = result.recordset.filter(r => !r.IsRead).length;
        res.status(200).json({ success: true, callbacks: result.recordset, unreadCount });
    } catch (error) {
        console.error('Get Callbacks Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const markCallbackRead = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        await pool.request()
            .input('Id', sql.Int, id)
            .execute('sp_MarkCallbackRead');
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Mark Callback Read Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const markAllCallbacksRead = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        await pool.request().execute('sp_MarkAllCallbacksRead');
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Mark All Callbacks Read Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── Admissions (Apply Now) ───────────────────────────────────
const submitAdmission = async (req, res) => {
    try {
        const { fullName, email, phone, courseInterest, qualification, workExperience, city, message } = req.body;
        if (!fullName || !email || !phone || !courseInterest)
            return res.status(400).json({ success: false, message: 'Name, email, phone and course are required' });

        const pool = await sql.connect(config);
        await pool.request()
            .input('FullName',       sql.VarChar(100), fullName)
            .input('Email',          sql.VarChar(150), email)
            .input('Phone',          sql.VarChar(20),  phone)
            .input('CourseInterest', sql.VarChar(150), courseInterest)
            .input('Qualification',  sql.VarChar(100), qualification  || null)
            .input('WorkExperience', sql.VarChar(50),  workExperience || null)
            .input('City',           sql.VarChar(100), city           || null)
            .input('Message',        sql.VarChar(500), message        || null)
            .execute('sp_SubmitAdmission');

        res.status(201).json({ success: true, message: 'Application submitted successfully' });
    } catch (error) {
        console.error('Submit Admission Error:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

const getAdmissions = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().execute('sp_GetAdmissions');
        const unreadCount = result.recordset.filter(r => !r.IsRead).length;
        res.status(200).json({ success: true, admissions: result.recordset, unreadCount });
    } catch (error) {
        console.error('Get Admissions Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const markAdmissionRead = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        await pool.request()
            .input('Id', sql.Int, id)
            .execute('sp_MarkAdmissionRead');
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Mark Admission Read Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const updateAdmissionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const allowedStatuses = ['New', 'Contacted', 'Enrolled', 'Rejected'];
        if (!allowedStatuses.includes(status))
            return res.status(400).json({ success: false, message: 'Invalid status value' });

        const pool = await sql.connect(config);
        await pool.request()
            .input('Id',     sql.Int,         id)
            .input('Status', sql.VarChar(30), status)
            .execute('sp_UpdateAdmissionStatus');

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Update Admission Status Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ── Combined unread count (for header bell) ──────────────────
const getUnreadCount = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().execute('sp_GetUnreadCount');
        const row = result.recordset[0];
        const callbacks  = row.callbacks  || 0;
        const admissions = row.admissions || 0;
        const total = callbacks + admissions;
        res.status(200).json({ success: true, total, callbacks, admissions });
    } catch (error) {
        console.error('Get Unread Count Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    submitCallback,
    getCallbacks,
    markCallbackRead,
    markAllCallbacksRead,
    submitAdmission,
    getAdmissions,
    markAdmissionRead,
    updateAdmissionStatus,
    getUnreadCount,
};
