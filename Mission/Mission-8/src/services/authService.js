const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../models/User');

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error('JWT_SECRET wajib diatur di file .env');

async function register({ fullname, username, email, password, verificationToken }) {
    const existing = await User.findOne({
        where: { [Op.or]: [{ email }, { username }] }
    });
    if (existing) {
        const error = new Error('Email atau username sudah digunakan');
        error.statusCode = 409;
        throw error;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
        fullname,
        username,
        email,
        password: passwordHash,
        verificationToken
    });

    return { id: user.id, fullname: user.fullname, username: user.username, email: user.email };
}

async function login({ email, password }) {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        const error = new Error('Email atau password salah');
        error.statusCode = 401;
        throw error;
    }

    const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: '1d' });
    return {
        user: {
            id: user.id,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            emailVerified: user.emailVerified
        },
        token
    };
}

async function verifyEmail(token) {
    const user = await User.findOne({ where: { verificationToken: token, emailVerified: false } });
    if (!user) return false;
    await user.update({ emailVerified: true, verificationToken: null });
    return true;
}

module.exports = { register, login, verifyEmail };
