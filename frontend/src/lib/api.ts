import axios, {AxiosHeaders} from 'axios'
import { auth } from '@/lib/firebase'

// Русский коммент: базовый клиент + перехватчик для ID-токена Firebase
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})


api.interceptors.request.use(async (config) => {
  const user = auth.currentUser
  if (user) {
    const token = await user.getIdToken()

    if (!config.headers) {
      config.headers = new AxiosHeaders()
    }
    const h = config.headers as AxiosHeaders
    h.set('Authorization', `Bearer ${token}`)

    h.set('Content-Type', 'application/json')
  }
  return config
})

let isRefreshing = false
api.interceptors.response.use(undefined, async (error) => {
  const original = error.config
  if (
    error.response?.status === 401 &&
    !original._retry &&
    auth.currentUser &&
    !isRefreshing
  ) {
    try {
      isRefreshing = true
      original._retry = true
      await auth.currentUser.getIdToken(true) // форс обновить токен
      const newToken = await auth.currentUser.getIdToken()
      original.headers = {
        ...original.headers,
        Authorization: `Bearer ${newToken}`
      }
      return api(original)
    } finally {
      isRefreshing = false
    }
  }
  throw error
})
