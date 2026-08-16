import axios from 'axios'
import { seedMovies } from '../data/seedMovies'

const baseURL = import.meta.env.VITE_API_URL?.trim()
const STORAGE_KEY = 'chill_movies_v1'

const api = axios.create({ baseURL })

const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), 260))

function readLocal() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) return JSON.parse(stored)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedMovies))
  return seedMovies
}

function writeLocal(movies) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(movies))
}

export const movieService = {
  async getAll() {
    if (baseURL) return (await api.get('/movies')).data
    return delay(readLocal())
  },
  async create(payload) {
    if (baseURL) return (await api.post('/movies', payload)).data
    const movies = readLocal()
    const movie = { ...payload, id: crypto.randomUUID() }
    writeLocal([movie, ...movies])
    return delay(movie)
  },
  async update(id, payload) {
    if (baseURL) return (await api.put(`/movies/${id}`, payload)).data
    const movies = readLocal().map((movie) => (movie.id === id ? { ...movie, ...payload } : movie))
    writeLocal(movies)
    return delay(movies.find((movie) => movie.id === id))
  },
  async remove(id) {
    if (baseURL) await api.delete(`/movies/${id}`)
    else writeLocal(readLocal().filter((movie) => movie.id !== id))
    return delay(true)
  },
}
