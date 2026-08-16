import { Play, Star } from 'lucide-react'

export default function MovieCard({ movie, onClick, wide = false }) {
  return (
    <button className={wide ? 'movie-card wide' : 'movie-card'} onClick={() => onClick?.(movie)}>
      <img src={wide ? movie.backdropUrl : movie.posterUrl} alt={`Poster ${movie.title}`} />
      <span className="card-shade" />
      {movie.progress > 0 && <span className="progress" style={{ width: `${movie.progress}%` }} />}
      <span className="card-info">
        <strong>{movie.title}</strong>
        <small><Star size={12} fill="currentColor" /> {movie.rating}</small>
      </span>
      <span className="card-play"><Play size={17} fill="currentColor" /></span>
    </button>
  )
}
