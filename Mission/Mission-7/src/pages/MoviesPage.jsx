import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import MovieCard from '../components/MovieCard'
import MovieDetail from '../components/MovieDetail'
import { useMovies } from '../context/MovieContext'

export default function MoviesPage() {
  const { movies, loading } = useMovies()
  const [query, setQuery] = useState('')
  const [genre, setGenre] = useState('Semua')
  const [selectedMovie, setSelectedMovie] = useState(null)
  const genres = ['Semua', ...new Set(movies.map((movie) => movie.genre))]
  const filtered = useMemo(() => movies.filter((movie) => (
    movie.title.toLowerCase().includes(query.toLowerCase()) &&
    (genre === 'Semua' || movie.genre === genre)
  )), [movies, query, genre])

  return (
    <main className="inner-page">
      <div className="page-title">
        <span className="eyebrow">TEMUKAN TONTONANMU</span>
        <h1>Semua Film</h1>
        <p>Dari cerita yang menegangkan sampai kisah yang menghangatkan hati.</p>
      </div>
      <div className="filters">
        <label className="search-box"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari judul film..." /></label>
        <select value={genre} onChange={(event) => setGenre(event.target.value)}>
          {genres.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      {loading ? <div className="page-message"><span className="loader" />Memuat...</div> : (
        <div className="movie-grid">
          {filtered.map((movie) => <MovieCard key={movie.id} movie={movie} onClick={setSelectedMovie} />)}
        </div>
      )}
      {!loading && filtered.length === 0 && <div className="empty-state">Film yang kamu cari belum tersedia.</div>}
      <MovieDetail movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
    </main>
  )
}
