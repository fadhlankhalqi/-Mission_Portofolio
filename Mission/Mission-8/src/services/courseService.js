const { Op } = require('sequelize');
const Course = require('../models/Course');
const Category = require('../models/Category');

const sortOptions = {
    judul_asc: ['judul', 'ASC'],
    judul_desc: ['judul', 'DESC'],
    harga_asc: ['harga', 'ASC'],
    harga_desc: ['harga', 'DESC'],
    terbaru: ['created_at', 'DESC']
};

async function getAllCourses({ topic, sortBy, search } = {}) {
    const where = {};
    if (search) {
        where[Op.or] = [
            { judul: { [Op.like]: `%${search}%` } },
            { deskripsi: { [Op.like]: `%${search}%` } }
        ];
    }

    return Course.findAll({
        where,
        include: [{
            model: Category,
            as: 'category',
            attributes: ['id', 'namaKategori'],
            ...(topic ? { where: { namaKategori: topic }, required: true } : {})
        }],
        order: [sortOptions[sortBy] || ['created_at', 'DESC']]
    });
}

async function getCourseById(id) {
    return Course.findByPk(id);
}

async function updateCourse(id, data) {
    const allowed = ['tutorId', 'kategoriId', 'judul', 'deskripsi', 'harga', 'thumbnail', 'level'];
    const values = Object.fromEntries(Object.entries(data).filter(([key]) => allowed.includes(key)));
    const [affectedRows] = await Course.update(values, { where: { id } });
    return { affectedRows };
}

async function deleteCourse(id) {
    const affectedRows = await Course.destroy({ where: { id } });
    return { affectedRows };
}

async function addCourse(data) {
    const course = await Course.create({
        tutorId: data.tutorId,
        kategoriId: data.kategoriId,
        judul: data.judul,
        deskripsi: data.deskripsi,
        harga: data.harga,
        thumbnail: data.thumbnail,
        level: data.level
    });
    return { insertId: course.id };
}

module.exports = { getAllCourses, getCourseById, updateCourse, deleteCourse, addCourse };
