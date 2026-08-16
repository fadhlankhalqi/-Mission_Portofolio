const mysql = require('mysql2/promise');

async function setup() {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: ''
    });

    console.log('Connected to MySQL!');

    // Create database
    await conn.query('CREATE DATABASE IF NOT EXISTS edu_course');
    await conn.query('USE edu_course');
    console.log('Database edu_course created/selected');

    // 1. users
    await conn.query(`CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nama VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        foto_profil VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    console.log('Table users created');

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
    await conn.query("INSERT IGNORE INTO users (nama, email, password) VALUES ('Admin', 'admin@educourse.com', 'admin123'), ('Budi Tutor', 'budi@educourse.com', 'budi123')");
    await conn.query("INSERT IGNORE INTO tutors (user_id, bio, keahlian) VALUES (2, 'Tutor berpengalaman di bidang web development', 'Web Development')");
    await conn.query("INSERT IGNORE INTO kategori_kelas (nama_kategori, deskripsi) VALUES ('Programming', 'Kelas programming dan coding'), ('Design', 'Kelas desain grafis dan UI/UX')");
    await conn.query("INSERT IGNORE INTO produk_kelas (tutor_id, kategori_id, judul, deskripsi, harga, level) VALUES (1, 1, 'Belajar Node.js Dasar', 'Kelas belajar Node.js dari nol hingga mahir', 150000, 'pemula'), (1, 1, 'Express.js REST API', 'Membangun REST API profesional dengan Express.js', 200000, 'menengah'), (1, 2, 'Figma untuk Pemula', 'Belajar desain UI/UX dengan Figma dari awal', 100000, 'pemula')");

    console.log('\n=== SETUP COMPLETE ===');
    const [tables] = await conn.query('SHOW TABLES');
    console.log('Tables:', tables.map(t => Object.values(t)[0]));

    const [courses] = await conn.query('SELECT id, judul, harga, level FROM produk_kelas');
    console.log('Courses:', courses);

    await conn.end();
}

setup().catch(e => console.error('Setup error:', e));
