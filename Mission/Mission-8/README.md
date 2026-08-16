# Mission 8 — EduCourse API

REST API Express yang menggunakan MySQL dan ORM Sequelize.

## Menjalankan aplikasi

1. Pastikan MySQL aktif.
2. Salin konfigurasi `.env.example` ke `.env`, lalu isi koneksi database, JWT secret, dan SMTP.
3. Jalankan `node setup_db.js`.
4. Jalankan `npm start`.

## Endpoint tugas

| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/register` | Payload: `fullname`, `username`, `email`, `password` |
| POST | `/login` | Payload: `email`, `password`; menghasilkan JWT |
| GET | `/verify-email?token=...` | Memvalidasi token yang dikirim melalui email |
| GET | `/course` | Membutuhkan header `Authorization: Bearer <token>` |
| GET | `/course?topic=Programming&sortBy=harga_desc&search=node` | Filter kategori, sorting, dan pencarian |
| POST | `/upload` | Multipart field `file`; membutuhkan JWT |

Pilihan `sortBy`: `judul_asc`, `judul_desc`, `harga_asc`, `harga_desc`, dan `terbaru`.

Email verifikasi dikirim melalui Nodemailer. Isi `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, dan `SMTP_FROM` pada `.env` menggunakan akun SMTP yang akan dipakai.

Koleksi `Mission-8.postman_collection.json` dapat langsung diimpor ke Postman. Setelah register, token verifikasi dapat dilihat pada kolom `verification_token` di tabel `users` atau melalui link yang diterima di email.
