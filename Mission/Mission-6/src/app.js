const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk parsing JSON body
app.use(express.json());

// Import routes
const courseRoute = require('./routes/courseRoute');

// Mount routes
app.use('/course', courseRoute);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'Welcome to Edu Course API',
        endpoints: {
            'GET /course': 'List semua courses',
            'GET /course/:id': 'Get course by ID',
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
