import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import { MovieProvider } from './context/MovieContext'
import HomePage from './pages/HomePage'
import ManagePage from './pages/ManagePage'
import MoviesPage from './pages/MoviesPage'
import ProfilePage from './pages/ProfilePage'

export default function App() {
  return (
    <MovieProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/manage" element={<ManagePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </MovieProvider>
  )
}
