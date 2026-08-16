import { Info, Play, Volume2 } from 'lucide-react'
import { useState } from 'react'
import Footer from '../components/Footer'
import MovieDetail from '../components/MovieDetail'
import MovieRow from '../components/MovieRow'
import { useMovies } from '../context/MovieContext'

export default function HomePage() {
  const { movies, loading, error } = useMovies()
  const [selectedMovie, setSelectedMovie] = useState(null)
  const featured = movies.find((movie) => movie.featured) || movies[0]

  if (loading) return <div className="page-message"><span className="loader" />Memuat film...</div>
  if (error) return <div className="page-message">Gagal mengambil data: {error}</div>
  if (!featured) return <div className="page-message">Belum ada film.</div>

  return (
    <>
      <main>
        <section className="hero" style={{ backgroundImage: `url(${featured.backdropUrl})` }}>
          <div className="hero-content">
            <span className="eyebrow">CHILL ORIGINAL SERIES</span>
            <h1>{featured.title}</h1>
            <p>{featured.description}</p>
            <div className="hero-buttons">
              <button className="primary-button"><Play fill="currentColor" size={18} /> Mulai</button>
              <button className="secondary-button" onClick={() => setSelectedMovie(featured)}>
                <Info size={18} /> Selengkapnya
              </button>
              <span className="age">{featured.age}</span>
            </div>
          </div>
          <button className="sound-button" aria-label="Suara"><Volume2 /></button>
        </section>

        <div className="content">
          <MovieRow title="Melanjutkan Tonton Film" movies={movies.filter((movie) => movie.progress)} wide onMovieClick={setSelectedMovie} />
          <MovieRow title="Top Rating Film dan Series Hari ini" movies={movies.slice(2, 10)} onMovieClick={setSelectedMovie} />
          <MovieRow title="Film Trending" movies={[...movies].sort((a, b) => b.rating - a.rating)} onMovieClick={setSelectedMovie} />
          <MovieRow title="Rilis Baru" movies={[...movies].sort((a, b) => b.year - a.year)} onMovieClick={setSelectedMovie} />
        </div>
      </main>
      <Footer />
      <MovieDetail movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
    </>
  )
}
