const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    namaKategori: { type: DataTypes.STRING(100), allowNull: false, field: 'nama_kategori' },
    deskripsi: { type: DataTypes.TEXT, allowNull: true }
}, {
    tableName: 'kategori_kelas',
    timestamps: false
});

module.exports = Category;
