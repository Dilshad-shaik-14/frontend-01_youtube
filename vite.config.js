import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://dsbackend.vercel.app/api/v1', // deployed backend
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // remove /api before sending
      }
    }
  },
  plugins: [react(), tailwindcss()]
})
