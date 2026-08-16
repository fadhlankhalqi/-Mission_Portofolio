import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

const emptyForm = {
  title: '', genre: 'Drama', type: 'Film', year: new Date().getFullYear(),
  rating: 8, duration: '120 min', age: '13+', posterUrl: '', backdropUrl: '',
  description: '', featured: false, progress: 0,
}

export default function MovieForm({ movie, onClose, onSave }) {
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => { setForm(movie || emptyForm) }, [movie])

  const change = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: name === 'year' || name === 'rating' ? Number(value) : value }))
  }

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      await onSave(form)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-backdrop">
      <form className="movie-form" onSubmit={submit}>
        <button type="button" className="close-button" onClick={onClose}><X /></button>
        <span className="eyebrow">{movie ? 'UPDATE DATA' : 'ADD DATA'}</span>
        <h2>{movie ? 'Edit Film' : 'Tambah Film'}</h2>
        <div className="form-grid">
          <label>Judul<input required name="title" value={form.title} onChange={change} /></label>
          <label>Genre<input required name="genre" value={form.genre} onChange={change} /></label>
          <label>Tipe<select name="type" value={form.type} onChange={change}><option>Film</option><option>Series</option></select></label>
          <label>Tahun<input required type="number" name="year" value={form.year} onChange={change} /></label>
          <label>Rating<input required type="number" min="1" max="10" step=".1" name="rating" value={form.rating} onChange={change} /></label>
          <label>Umur<input name="age" value={form.age} onChange={change} /></label>
          <label className="full-field">URL Poster<input required name="posterUrl" value={form.posterUrl} onChange={change} placeholder="https://..." /></label>
          <label className="full-field">URL Backdrop<input required name="backdropUrl" value={form.backdropUrl} onChange={change} placeholder="https://..." /></label>
          <label className="full-field">Deskripsi<textarea required rows="4" name="description" value={form.description} onChange={change} /></label>
        </div>
        <div className="form-actions">
          <button type="button" className="secondary-button" onClick={onClose}>Batal</button>
          <button className="primary-button" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan Film'}</button>
        </div>
      </form>
    </div>
  )
}
