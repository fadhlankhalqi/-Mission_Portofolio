const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./Category');

const Course = sequelize.define('Course', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    tutorId: { type: DataTypes.INTEGER, allowNull: false, field: 'tutor_id' },
    kategoriId: { type: DataTypes.INTEGER, allowNull: false, field: 'kategori_id' },
    judul: { type: DataTypes.STRING(200), allowNull: false },
    deskripsi: { type: DataTypes.TEXT, allowNull: true },
    harga: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
    thumbnail: { type: DataTypes.STRING(255), allowNull: true },
    level: { type: DataTypes.ENUM('pemula', 'menengah', 'lanjutan'), defaultValue: 'pemula' }
}, {
    tableName: 'produk_kelas',
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Course;

Course.belongsTo(Category, { foreignKey: 'kategoriId', as: 'category' });
