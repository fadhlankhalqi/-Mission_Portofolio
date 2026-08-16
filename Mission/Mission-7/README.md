# Chill Movie App

Project ReactJS untuk Mission 7. Tampilan dibuat berdasarkan mockup Chill dan data film sudah mendukung operasi CRUD.

## Teknologi

- ReactJS + Vite
- React Router
- Axios
- Context API
- Custom hook `useMovies`
- CSS responsif

## Menjalankan project

```bash
npm install
npm run dev
```

## MockAPI yang digunakan

Project sudah terhubung ke resource `movies` melalui file `.env`:

```env
VITE_API_URL=https://6a6a7b9aeb87a96865a86a8c.mockapi.io/api/v1
```

Jika ingin mengisi ulang resource yang kosong, jalankan `npm run seed` satu kali. Jangan menjalankannya pada resource yang sudah berisi data karena data akan terduplikasi.

Jika `VITE_API_URL` tidak tersedia, aplikasi tetap menyediakan data demo melalui `localStorage`.

## Operasi API

- `GET /movies` — mengambil semua film
- `POST /movies` — menambahkan film
- `PUT /movies/:id` — mengubah film
- `DELETE /movies/:id` — menghapus film

Semua fungsi API berada di `src/services/api.js`. State global disimpan menggunakan Context API di `src/context/MovieContext.jsx`.

## Bukti pengujian

- `bukti-crud-add.png` — data film berhasil ditambahkan.
- `bukti-crud-update.png` — judul data film berhasil diperbarui.
- `bukti-crud-delete.png` — data uji sudah dihapus kembali.
- `bukti-mockapi.png` — dashboard MockAPI dengan 16 data film.
- `chill-home.png` — tampilan desktop.
- `chill-mobile.png` — tampilan mobile.
