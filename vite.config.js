import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const urls = (process.env.VITE_URI || "").split(",").map(u => u.trim());
  const isDev = mode === "development";

  return {
    plugins: [react(), tailwindcss()],
    server: isDev ? {
      proxy: {
        '/api': {
          target: urls[0], // dev backend
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '')
        }
      }
    } : undefined
  };
});
