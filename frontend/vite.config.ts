// frontend/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5209,
    strictPort: true, // ← НЕ прыгаем по портам, если занят — скажет прямо
    proxy: {
      '/api':   { target: 'http://localhost:8080', changeOrigin: true },
      '/admin': { target: 'http://localhost:8080', changeOrigin: true },
    }
  },
  resolve: { alias: { '@': '/src' } }
})
