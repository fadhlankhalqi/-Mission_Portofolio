const nodemailer = require('nodemailer');

function createTransporter() {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
        throw new Error('Konfigurasi SMTP belum lengkap');
    }
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
    });
}

async function sendVerificationEmail(email, token) {
    const transporter = createTransporter();
    const verificationUrl = `${process.env.APP_URL || `http://localhost:${process.env.PORT || 3000}`}/verify-email?token=${token}`;
    await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: 'Verifikasi akun EduCourse',
        text: `Verifikasi akunmu melalui link berikut: ${verificationUrl}`
    });
    return { delivered: true };
}

module.exports = { sendVerificationEmail };
