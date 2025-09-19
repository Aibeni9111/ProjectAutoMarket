import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Русский коммент: всё, что начинается с /api, уходит на бэкенд на 8080
      '/api': { target: 'http://localhost:8080', changeOrigin: true }
    }
  },
  resolve: { alias: { '@': '/src' } }
})
