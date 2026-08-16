const express = require('express');
const router = express.Router();
const courseService = require('../services/courseService');

// ========================
// REST API Endpoints
// ========================

// 1. GET /course - List semua courses/kelas
router.get('/', async (req, res) => {
    try {
        const courses = await courseService.getAllCourses();
        res.status(200).json({
            status: 'success',
            message: 'Berhasil mengambil semua data course',
            data: courses
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// 2. GET /course/:id - Menampilkan satu course berdasarkan id
router.get('/:id', async (req, res) => {
    try {
        const course = await courseService.getCourseById(req.params.id);
        if (!course) {
            return res.status(404).json({
                status: 'error',
                message: 'Course tidak ditemukan'
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'Berhasil mengambil data course',
            data: course
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// 3. PATCH /course/:id - Mengubah data course berdasarkan id
router.patch('/:id', async (req, res) => {
    try {
        const result = await courseService.updateCourse(req.params.id, req.body);
        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Course tidak ditemukan'
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'Berhasil mengubah data course'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// 4. DELETE /course/:id - Menghapus data course berdasarkan id
router.delete('/:id', async (req, res) => {
    try {
        const result = await courseService.deleteCourse(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Course tidak ditemukan'
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'Berhasil menghapus data course'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// 5. POST /course - Menambahkan data course baru
router.post('/', async (req, res) => {
    try {
        const result = await courseService.addCourse(req.body);
        res.status(201).json({
            status: 'success',
            message: 'Berhasil menambahkan data course',
            data: { id: result.insertId }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

module.exports = router;
