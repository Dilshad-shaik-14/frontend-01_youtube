import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";
  return {
    plugins: [react(), tailwindcss()],
    server: isDev ? {
      proxy: {
        '/api': {
          target: process.env.VITE_URI,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '')
        }
      }
    } : undefined
  };
});
