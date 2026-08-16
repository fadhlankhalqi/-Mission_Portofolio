const express = require('express');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk parsing JSON body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Import routes
const courseRoute = require('./routes/courseRoute');
const authRoute = require('./routes/authRoute');
const uploadRoute = require('./routes/uploadRoute');

// Mount routes
app.use('/course', courseRoute);
app.use('/', authRoute);
app.use('/upload', uploadRoute);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'Welcome to Edu Course API',
        endpoints: {
            'POST /register': 'Register user baru',
            'POST /login': 'Login dan mendapatkan JWT',
            'GET /verify-email?token=...': 'Verifikasi email',
            'POST /upload': 'Upload image',
            'GET /course': 'List courses (Authorization Bearer token required)',
            'GET /course/:id': 'Get course by ID (Authorization Bearer token required)',
            'POST /course': 'Tambah course baru',
            'PATCH /course/:id': 'Update course by ID',
            'DELETE /course/:id': 'Hapus course by ID'
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});

module.exports = app;
