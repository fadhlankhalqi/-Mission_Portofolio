const crypto = require('crypto');
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { verifyToken } = require('../middleware/authMiddleware');

const uploadDirectory = path.join(__dirname, '..', '..', 'uploads');
fs.mkdirSync(uploadDirectory, { recursive: true });

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

const storage = multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, uploadDirectory),
    filename: (_req, file, callback) => {
        const extension = path.extname(file.originalname).toLowerCase();
        callback(null, `${crypto.randomUUID()}${extension}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, callback) => {
        const extension = path.extname(file.originalname).toLowerCase();
        const valid = allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(extension);
        callback(valid ? null : new Error('File harus berupa JPG, PNG, atau WEBP'), valid);
    }
});

const router = express.Router();
router.post('/', verifyToken, (req, res) => {
    upload.single('file')(req, res, (error) => {
        if (error) {
            const message = error.code === 'LIMIT_FILE_SIZE' ? 'Ukuran file maksimal 5 MB' : error.message;
            return res.status(400).json({ status: 'error', message });
        }
        if (!req.file) return res.status(400).json({ status: 'error', message: 'File gambar wajib diisi' });
        return res.status(201).json({
            status: 'success',
            message: 'Image uploaded successfully',
            data: { filename: req.file.filename, path: `/uploads/${req.file.filename}`, size: req.file.size }
        });
    });
});

module.exports = router;
