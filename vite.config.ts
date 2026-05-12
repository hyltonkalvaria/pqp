import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/pqp/',
  plugins: [
    react(),
  ],
  server: {
    proxy: {
      '/duffel-api': {
        target: 'https://api.duffel.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/duffel-api/, ''),
        headers: {
          'Duffel-Version': 'v2'
        }
      }
    }
  }
})
