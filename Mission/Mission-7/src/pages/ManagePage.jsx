import { Edit3, Plus, Search, Trash2 } from 'lucide-react'
import { useState } from 'react'
import MovieForm from '../components/MovieForm'
import { useMovies } from '../context/MovieContext'

export default function ManagePage() {
  const { movies, loading, createMovie, updateMovie, deleteMovie } = useMovies()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState('')

  const showMessage = (text) => {
    setMessage(text)
    setTimeout(() => setMessage(''), 2500)
  }

  const save = async (data) => {
    if (editing) {
      await updateMovie(editing.id, data)
      showMessage('Film berhasil diperbarui.')
    } else {
      await createMovie(data)
      showMessage('Film berhasil ditambahkan.')
    }
  }

  const remove = async (movie) => {
    if (window.confirm(`Hapus film "${movie.title}"?`)) {
      await deleteMovie(movie.id)
      showMessage('Film berhasil dihapus.')
    }
  }

  return (
    <main className="inner-page manage-page">
      <div className="manage-heading">
        <div><span className="eyebrow">CRUD MOVIE DATA</span><h1>Kelola Film</h1><p>Tambah, ubah, dan hapus katalog film Chill.</p></div>
        <button className="primary-button" onClick={() => { setEditing(null); setFormOpen(true) }}><Plus /> Tambah Film</button>
      </div>
      <label className="search-box manage-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari data film..." /></label>
      {message && <div className="toast">{message}</div>}
      <div className="movie-table-wrap">
        <table className="movie-table">
          <thead><tr><th>Film</th><th>Genre</th><th>Tahun</th><th>Rating</th><th>Aksi</th></tr></thead>
          <tbody>
            {!loading && movies.filter((movie) => movie.title.toLowerCase().includes(query.toLowerCase())).map((movie) => (
              <tr key={movie.id}>
                <td><div className="movie-cell"><img src={movie.posterUrl} alt="" /><div><b>{movie.title}</b><small>{movie.type}</small></div></div></td>
                <td>{movie.genre}</td><td>{movie.year}</td><td>★ {movie.rating}</td>
                <td><div className="table-actions">
                  <button onClick={() => { setEditing(movie); setFormOpen(true) }} aria-label="Edit"><Edit3 /></button>
                  <button className="delete-button" onClick={() => remove(movie)} aria-label="Hapus"><Trash2 /></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {formOpen && <MovieForm movie={editing} onClose={() => setFormOpen(false)} onSave={save} />}
    </main>
  )
}
