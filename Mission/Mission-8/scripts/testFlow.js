require('dotenv').config();
const mysql = require('mysql2/promise');

async function run() {
    const leaveUnverified = process.argv.includes('--leave-unverified');
    const [mailbox, domain] = process.env.SMTP_USER.split('@');
    const stamp = Date.now();
    const email = `${mailbox}+mission8${stamp}@${domain}`;
    const username = `mission8_${stamp}`;
    const password = 'Password123!';

    const register = await fetch('http://127.0.0.1:3000/register', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ fullname: 'User Mission 8', username, email, password })
    });
    const registerBody = await register.json();
    console.log(`register-status=${register.status}`);
    console.log(`register-result=${registerBody.status}`);
    if (!register.ok) throw new Error(registerBody.message);

    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT || 3306),
        database: process.env.DB_NAME
    });

    const [rows] = await db.execute(
        'SELECT verification_token FROM users WHERE email = ?',
        [email]
    );
    const token = rows[0]?.verification_token;
    console.log(`verification-token-stored=${Boolean(token)}`);

    if (leaveUnverified) {
        console.log('verify-status=skipped-for-email-capture');
    } else {
        const verify = await fetch(
            `http://127.0.0.1:3000/verify-email?token=${encodeURIComponent(token)}`
        );
        console.log(`verify-status=${verify.status}`);
    }

    const login = await fetch('http://127.0.0.1:3000/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const loginBody = await login.json();
    console.log(`login-status=${login.status}`);
    console.log(`jwt-created=${Boolean(loginBody.data?.token)}`);
    await db.end();
}

run().catch((error) => {
    console.error(`flow-failed=${error.message}`);
    process.exitCode = 1;
});
