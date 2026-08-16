import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef } from 'react'
import MovieCard from './MovieCard'

export default function MovieRow({ title, movies, onMovieClick, wide = false }) {
  const rowRef = useRef(null)
  const scroll = (direction) => rowRef.current?.scrollBy({ left: direction * 520, behavior: 'smooth' })

  return (
    <section className="movie-section">
      <div className="section-heading">
        <h2>{title}</h2>
        <div className="row-buttons">
          <button onClick={() => scroll(-1)} aria-label="Geser ke kiri"><ChevronLeft /></button>
          <button onClick={() => scroll(1)} aria-label="Geser ke kanan"><ChevronRight /></button>
        </div>
      </div>
      <div className="movie-row" ref={rowRef}>
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} wide={wide} onClick={onMovieClick} />
        ))}
      </div>
    </section>
  )
}
