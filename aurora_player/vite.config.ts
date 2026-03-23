import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/rss2json-proxy': {
        target: 'https://api.rss2json.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/rss2json-proxy/, ''),
      },
      '/itunes-proxy': {
        target: 'https://itunes.apple.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/itunes-proxy/, ''),
      },
    },
  },
})
