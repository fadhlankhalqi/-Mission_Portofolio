const db = require('../config/database');

// ========================
// DML SQL - Service Layer
// ========================

// 1. SELECT - Mengambil semua data course/kelas
const getAllCourses = async () => {
    const [rows] = await db.query('SELECT * FROM produk_kelas');
    return rows;
};

// 2. SELECT by ID - Mengambil data course berdasarkan id
const getCourseById = async (id) => {
    const [rows] = await db.query('SELECT * FROM produk_kelas WHERE id = ?', [id]);
    return rows[0];
};

// 3. UPDATE - Mengubah data course berdasarkan id
const updateCourse = async (id, data) => {
    const [result] = await db.query('UPDATE produk_kelas SET ? WHERE id = ?', [data, id]);
    return result;
};

// 4. DELETE - Menghapus data course berdasarkan id
const deleteCourse = async (id) => {
    const [result] = await db.query('DELETE FROM produk_kelas WHERE id = ?', [id]);
    return result;
};

// 5. INSERT - Menambahkan data course baru
const addCourse = async (data) => {
    const [result] = await db.query('INSERT INTO produk_kelas SET ?', [data]);
    return result;
};

module.exports = {
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    addCourse
};
