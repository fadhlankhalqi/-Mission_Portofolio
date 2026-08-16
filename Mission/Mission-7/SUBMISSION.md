# Checklist Submission Mission 7

## Poin penilaian

- [x] ReactJS menggunakan Vite.
- [x] Data film diambil dari API menggunakan `GET`.
- [x] Film dapat ditambahkan menggunakan `POST`.
- [x] Film dapat diperbarui menggunakan `PUT`.
- [x] Film dapat dihapus menggunakan `DELETE`.
- [x] Pemanggilan API menggunakan Axios.
- [x] Base URL API disimpan dalam `.env`.
- [x] Fungsi API dipisahkan ke `src/services/api.js`.
- [x] State film dikelola menggunakan Context API.
- [x] Context digunakan melalui custom hook `useMovies`.
- [x] Tampilan mengikuti mockup Chill.
- [x] Tampilan mendukung desktop dan mobile.
- [x] Loading, pencarian, filter, dan konfirmasi hapus tersedia.

## Alur demo presentasi

1. Buka halaman **Beranda** untuk menunjukkan hasil `GET`.
2. Buka halaman **Kelola Film**.
3. Klik **Tambah Film**, isi form, lalu simpan untuk menunjukkan `POST`.
4. Klik tombol edit pada film yang baru dibuat untuk menunjukkan `PUT`.
5. Klik tombol hapus dan setujui konfirmasi untuk menunjukkan `DELETE`.
6. Buka dashboard MockAPI untuk menunjukkan bahwa datanya benar-benar berubah.

## Perintah pemeriksaan

```bash
npm run lint
npm run build
```
