import { Check, Play, Plus, X } from 'lucide-react'

export default function MovieDetail({ movie, onClose }) {
  if (!movie) return null

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <article className="detail-modal" onMouseDown={(event) => event.stopPropagation()}>
        <button className="close-button" onClick={onClose} aria-label="Tutup"><X /></button>
        <div className="detail-cover" style={{ backgroundImage: `url(${movie.backdropUrl})` }}>
          <div className="detail-actions">
            <button className="primary-button"><Play fill="currentColor" size={18} /> Mulai</button>
            <button className="round-button" aria-label="Tambahkan ke daftar"><Plus /></button>
            <button className="round-button" aria-label="Sudah ditonton"><Check /></button>
          </div>
        </div>
        <div className="detail-content">
          <div className="detail-title">
            <div><h2>{movie.title}</h2><p>{movie.year} · {movie.duration} · {movie.age}</p></div>
            <span className="rating">★ {movie.rating}</span>
          </div>
          <p>{movie.description}</p>
          <p className="muted"><b>Genre:</b> {movie.genre} &nbsp; <b>Tipe:</b> {movie.type}</p>
        </div>
      </article>
    </div>
  )
}
