const express  = require('express');
const router   = express.Router();
const multer   = require('multer');
const { proxyUpload } = require('../controllers/upload.controller');
const adminMiddleware = require('../middleware/adminMiddleware');

// Memory storage — file buffer mein rakho, disk pe mat likho
const upload = multer({
    storage: multer.memoryStorage(),
    limits:  { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp|svg/;
        const ok = allowed.test(file.mimetype) || allowed.test(file.originalname.toLowerCase());
        cb(null, ok);
    },
});

// POST /api/upload — admin only
router.post('/', adminMiddleware, upload.single('file'), proxyUpload);

module.exports = router;


