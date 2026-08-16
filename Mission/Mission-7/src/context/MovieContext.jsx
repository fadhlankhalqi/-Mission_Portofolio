import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { movieService } from '../services/api'

/* eslint-disable react-refresh/only-export-components */
const MovieContext = createContext(null)

export function MovieProvider({ children }) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setMovies(await movieService.getAll())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const value = useMemo(() => ({
    movies, loading, error, refresh,
    createMovie: async (payload) => {
      const created = await movieService.create(payload)
      setMovies((current) => [created, ...current])
    },
    updateMovie: async (id, payload) => {
      const updated = await movieService.update(id, payload)
      setMovies((current) => current.map((movie) => (movie.id === id ? updated : movie)))
    },
    deleteMovie: async (id) => {
      await movieService.remove(id)
      setMovies((current) => current.filter((movie) => movie.id !== id))
    },
  }), [movies, loading, error, refresh])

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
}

export function useMovies() {
  return useContext(MovieContext)
}
