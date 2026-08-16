const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fullname: { type: DataTypes.STRING(100), allowNull: false },
    username: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    emailVerified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'email_verified' },
    verificationToken: { type: DataTypes.STRING(100), allowNull: true, unique: true, field: 'verification_token' },
    fotoProfil: { type: DataTypes.STRING(255), allowNull: true, field: 'foto_profil' }
}, {
    tableName: 'users',
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = User;
