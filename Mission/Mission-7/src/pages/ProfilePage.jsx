import { CreditCard, LogOut, UserRound } from 'lucide-react'
import { useState } from 'react'

export default function ProfilePage() {
  const [name, setName] = useState('Rohid Adiat Alma’arij')
  const [saved, setSaved] = useState(false)

  return (
    <main className="inner-page profile-page">
      <div className="page-title"><span className="eyebrow">AKUN SAYA</span><h1>Profil</h1></div>
      <div className="profile-layout">
        <aside className="profile-card">
          <div className="big-avatar">R</div><h2>{name}</h2><p>rohid@chill.id</p>
          <span className="plan-badge">Paket Premium</span>
        </aside>
        <section className="profile-settings">
          <h2><UserRound /> Informasi Akun</h2>
          <label>Nama lengkap<input value={name} onChange={(event) => setName(event.target.value)} /></label>
          <label>Email<input value="rohid@chill.id" disabled /></label>
          <button className="primary-button" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }}>Simpan Perubahan</button>
          {saved && <p className="success-text">Profil berhasil disimpan.</p>}
          <hr />
          <button className="settings-row"><CreditCard /> Kelola Paket Langganan</button>
          <button className="settings-row danger"><LogOut /> Keluar</button>
        </section>
      </div>
    </main>
  )
}
