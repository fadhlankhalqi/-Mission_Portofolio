import { seedMovies } from '../src/data/seedMovies.js'

const apiUrl = process.env.VITE_API_URL

if (!apiUrl) {
  throw new Error('VITE_API_URL belum diisi di file .env.')
}

for (const movie of seedMovies) {
  const response = await fetch(`${apiUrl}/movies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(movie),
  })

  if (!response.ok) {
    throw new Error(`Gagal menambahkan ${movie.title}: ${response.status}`)
  }
}

console.log(`${seedMovies.length} data film berhasil ditambahkan ke MockAPI.`)
