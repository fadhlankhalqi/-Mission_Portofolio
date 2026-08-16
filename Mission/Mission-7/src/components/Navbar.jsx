import { Menu, Search, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="navbar">
      <NavLink to="/" className="logo">CHILL</NavLink>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Buka menu">
        {open ? <X /> : <Menu />}
      </button>
      <nav className={open ? 'nav-links open' : 'nav-links'}>
        <NavLink to="/" onClick={() => setOpen(false)}>Beranda</NavLink>
        <NavLink to="/movies" onClick={() => setOpen(false)}>Film</NavLink>
        <NavLink to="/manage" onClick={() => setOpen(false)}>Kelola Film</NavLink>
      </nav>
      <div className="nav-actions">
        <Search size={20} />
        <NavLink to="/profile" className="avatar">R</NavLink>
      </div>
    </header>
  )
}
