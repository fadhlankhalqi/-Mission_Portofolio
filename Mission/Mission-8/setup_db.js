const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function setup() {
    const conn = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT || 3306)
    });

    console.log('Connected to MySQL!');

    // Create database
    const databaseName = process.env.DB_NAME || 'edu_course';
    if (!/^[a-zA-Z0-9_]+$/.test(databaseName)) throw new Error('Nama database tidak valid');
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``);
    await conn.query(`USE \`${databaseName}\``);
    console.log(`Database ${databaseName} created/selected`);

    // 1. users
    await conn.query(`CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        fullname VARCHAR(100) NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email_verified BOOLEAN NOT NULL DEFAULT FALSE,
        verification_token VARCHAR(100) UNIQUE,
        foto_profil VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    console.log('Table users created');

    // Migrasi aman untuk database yang dibuat pada Mission-6.
    const userColumns = await conn.query('SHOW COLUMNS FROM users');
    const columnNames = userColumns[0].map((column) => column.Field);
    if (columnNames.includes('nama') && !columnNames.includes('fullname')) {
        await conn.query('ALTER TABLE users CHANGE nama fullname VARCHAR(100) NOT NULL');
    }
    if (!columnNames.includes('username')) {
        await conn.query("ALTER TABLE users ADD COLUMN username VARCHAR(100) UNIQUE NULL AFTER fullname");
        await conn.query("UPDATE users SET username = CONCAT('user_', id) WHERE username IS NULL");
        await conn.query('ALTER TABLE users MODIFY username VARCHAR(100) UNIQUE NOT NULL');
    }
    if (!columnNames.includes('email_verified')) await conn.query('ALTER TABLE users ADD COLUMN email_verified BOOLEAN NOT NULL DEFAULT FALSE');
    if (!columnNames.includes('verification_token')) await conn.query('ALTER TABLE users ADD COLUMN verification_token VARCHAR(100) UNIQUE NULL');

    // 2. tutors
    await conn.query(`CREATE TABLE IF NOT EXISTS tutors (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        bio TEXT,
        keahlian VARCHAR(255),
        foto VARCHAR(255),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);
    console.log('Table tutors created');

    // 3. kategori_kelas
    await conn.query(`CREATE TABLE IF NOT EXISTS kategori_kelas (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nama_kategori VARCHAR(100) NOT NULL,
        deskripsi TEXT
    )`);
    console.log('Table kategori_kelas created');

    // 4. produk_kelas (course)
    await conn.query(`CREATE TABLE IF NOT EXISTS produk_kelas (
        id INT PRIMARY KEY AUTO_INCREMENT,
        tutor_id INT NOT NULL,
        kategori_id INT NOT NULL,
        judul VARCHAR(200) NOT NULL,
        deskripsi TEXT,
        harga DECIMAL(10,2) NOT NULL DEFAULT 0,
        thumbnail VARCHAR(255),
        level ENUM('pemula', 'menengah', 'lanjutan') DEFAULT 'pemula',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tutor_id) REFERENCES tutors(id) ON DELETE CASCADE,
        FOREIGN KEY (kategori_id) REFERENCES kategori_kelas(id)
    )`);
    console.log('Table produk_kelas created');

    // 5. modul_kelas
    await conn.query(`CREATE TABLE IF NOT EXISTS modul_kelas (
        id INT PRIMARY KEY AUTO_INCREMENT,
        produk_id INT NOT NULL,
        judul_modul VARCHAR(200) NOT NULL,
        urutan INT NOT NULL DEFAULT 1,
        FOREIGN KEY (produk_id) REFERENCES produk_kelas(id) ON DELETE CASCADE
    )`);
    console.log('Table modul_kelas created');

    // 6. material
    await conn.query(`CREATE TABLE IF NOT EXISTS material (
        id INT PRIMARY KEY AUTO_INCREMENT,
        modul_id INT NOT NULL,
        judul VARCHAR(200) NOT NULL,
        tipe ENUM('video', 'rangkuman', 'quiz') NOT NULL,
        konten_url VARCHAR(500),
        urutan INT NOT NULL DEFAULT 1,
        FOREIGN KEY (modul_id) REFERENCES modul_kelas(id) ON DELETE CASCADE
    )`);
    console.log('Table material created');

    // 7. pretest
    await conn.query(`CREATE TABLE IF NOT EXISTS pretest (
        id INT PRIMARY KEY AUTO_INCREMENT,
        produk_id INT NOT NULL,
        pertanyaan TEXT NOT NULL,
        pilihan_a VARCHAR(255),
        pilihan_b VARCHAR(255),
        pilihan_c VARCHAR(255),
        pilihan_d VARCHAR(255),
        jawaban_benar ENUM('a','b','c','d') NOT NULL,
        FOREIGN KEY (produk_id) REFERENCES produk_kelas(id) ON DELETE CASCADE
    )`);
    console.log('Table pretest created');

    // 8. hasil_pretest
    await conn.query(`CREATE TABLE IF NOT EXISTS hasil_pretest (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        produk_id INT NOT NULL,
        skor INT NOT NULL DEFAULT 0,
        dikerjakan_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (produk_id) REFERENCES produk_kelas(id) ON DELETE CASCADE
    )`);
    console.log('Table hasil_pretest created');

    // 9. orders
    await conn.query(`CREATE TABLE IF NOT EXISTS orders (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        produk_id INT NOT NULL,
        total_harga DECIMAL(10,2) NOT NULL,
        status ENUM('pending', 'selesai', 'tertunda', 'dibatalkan') DEFAULT 'pending',
        order_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (produk_id) REFERENCES produk_kelas(id)
    )`);
    console.log('Table orders created');

    // 10. pembayaran
    await conn.query(`CREATE TABLE IF NOT EXISTS pembayaran (
        id INT PRIMARY KEY AUTO_INCREMENT,
        order_id INT NOT NULL,
        metode VARCHAR(50) NOT NULL,
        status ENUM('menunggu', 'berhasil', 'gagal') DEFAULT 'menunggu',
        bayar_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    )`);
    console.log('Table pembayaran created');

    // 11. kelas_saya
    await conn.query(`CREATE TABLE IF NOT EXISTS kelas_saya (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        produk_id INT NOT NULL,
        tanggal_akses TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        progress VARCHAR(10) DEFAULT '0%',
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (produk_id) REFERENCES produk_kelas(id) ON DELETE CASCADE
    )`);
    console.log('Table kelas_saya created');

    // 12. review
    await conn.query(`CREATE TABLE IF NOT EXISTS review (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        produk_id INT NOT NULL,
        rating TINYINT NOT NULL,
        komentar TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (produk_id) REFERENCES produk_kelas(id) ON DELETE CASCADE
    )`);
    console.log('Table review created');

    // Insert sample data
    console.log('\nInserting sample data...');
    const adminPassword = await bcrypt.hash('admin123', 12);
    const tutorPassword = await bcrypt.hash('budi123', 12);
    await conn.query(
        `INSERT INTO users (fullname, username, email, password, email_verified)
         VALUES (?, ?, ?, ?, 1), (?, ?, ?, ?, 1)
         ON DUPLICATE KEY UPDATE password = VALUES(password), email_verified = 1`,
        ['Admin', 'admin', 'admin@educourse.com', adminPassword, 'Budi Tutor', 'budi', 'budi@educourse.com', tutorPassword]
    );
    await conn.query(`INSERT INTO tutors (user_id, bio, keahlian)
        SELECT 2, 'Tutor berpengalaman di bidang web development', 'Web Development'
        WHERE NOT EXISTS (SELECT 1 FROM tutors WHERE user_id = 2)`);
    await conn.query(`INSERT INTO kategori_kelas (nama_kategori, deskripsi)
        SELECT 'Programming', 'Kelas programming dan coding'
        WHERE NOT EXISTS (SELECT 1 FROM kategori_kelas WHERE nama_kategori = 'Programming')`);
    await conn.query(`INSERT INTO kategori_kelas (nama_kategori, deskripsi)
        SELECT 'Design', 'Kelas desain grafis dan UI/UX'
        WHERE NOT EXISTS (SELECT 1 FROM kategori_kelas WHERE nama_kategori = 'Design')`);

    const [tutorRows] = await conn.query('SELECT id FROM tutors WHERE user_id = 2 LIMIT 1');
    const [programmingRows] = await conn.query("SELECT id FROM kategori_kelas WHERE nama_kategori = 'Programming' LIMIT 1");
    const [designRows] = await conn.query("SELECT id FROM kategori_kelas WHERE nama_kategori = 'Design' LIMIT 1");
    const tutorId = tutorRows[0].id;
    const programmingId = programmingRows[0].id;
    const designId = designRows[0].id;

    await conn.query(`INSERT INTO produk_kelas (tutor_id, kategori_id, judul, deskripsi, harga, level)
        SELECT ?, ?, 'Belajar Node.js Dasar', 'Kelas belajar Node.js dari nol hingga mahir', 150000, 'pemula'
        WHERE NOT EXISTS (SELECT 1 FROM produk_kelas WHERE judul = 'Belajar Node.js Dasar')`, [tutorId, programmingId]);
    await conn.query(`INSERT INTO produk_kelas (tutor_id, kategori_id, judul, deskripsi, harga, level)
        SELECT ?, ?, 'Express.js REST API', 'Membangun REST API profesional dengan Express.js', 200000, 'menengah'
        WHERE NOT EXISTS (SELECT 1 FROM produk_kelas WHERE judul = 'Express.js REST API')`, [tutorId, programmingId]);
    await conn.query(`INSERT INTO produk_kelas (tutor_id, kategori_id, judul, deskripsi, harga, level)
        SELECT ?, ?, 'Figma untuk Pemula', 'Belajar desain UI/UX dengan Figma dari awal', 100000, 'pemula'
        WHERE NOT EXISTS (SELECT 1 FROM produk_kelas WHERE judul = 'Figma untuk Pemula')`, [tutorId, designId]);

    console.log('\n=== SETUP COMPLETE ===');
    const [tables] = await conn.query('SHOW TABLES');
    console.log('Tables:', tables.map(t => Object.values(t)[0]));

    const [courses] = await conn.query('SELECT id, judul, harga, level FROM produk_kelas');
    console.log('Courses:', courses);

    await conn.end();
}

setup().catch((error) => {
    console.error('Setup error:', error.message);
    process.exitCode = 1;
});
