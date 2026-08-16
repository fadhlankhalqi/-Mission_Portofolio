const express = require('express');
const { v4: uuidv4 } = require('uuid');
const authService = require('../services/authService');
const { sendVerificationEmail } = require('../services/emailService');

const router = express.Router();

function requireFields(body, fields) {
    return fields.filter((field) => typeof body[field] !== 'string' || !body[field].trim());
}

function validEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

router.post('/register', async (req, res) => {
    const missing = requireFields(req.body, ['fullname', 'username', 'email', 'password']);
    if (missing.length) return res.status(400).json({ status: 'error', message: `Field wajib: ${missing.join(', ')}` });
    if (!validEmail(req.body.email)) return res.status(400).json({ status: 'error', message: 'Format email tidak valid' });

    try {
        const verificationToken = uuidv4();
        const user = await authService.register({ ...req.body, verificationToken });
        await sendVerificationEmail(user.email, verificationToken);
        return res.status(201).json({ status: 'success', message: 'Registrasi berhasil. Silakan verifikasi email.', data: user });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ status: 'error', message: error.message });
    }
});

router.post('/login', async (req, res) => {
    const missing = requireFields(req.body, ['email', 'password']);
    if (missing.length) return res.status(400).json({ status: 'error', message: `Field wajib: ${missing.join(', ')}` });

    try {
        const data = await authService.login(req.body);
        return res.status(200).json({ status: 'success', message: 'Login berhasil', data });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ status: 'error', message: error.message });
    }
});

router.get('/verify-email', async (req, res) => {
    if (typeof req.query.token !== 'string' || !req.query.token) {
        return res.status(400).json({ status: 'error', message: 'Token verifikasi wajib diisi' });
    }
    try {
        const verified = await authService.verifyEmail(req.query.token);
        if (!verified) return res.status(404).json({ status: 'error', message: 'Invalid Verification Token' });
        return res.status(200).json({ status: 'success', message: 'Email Verified Successfully' });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;
