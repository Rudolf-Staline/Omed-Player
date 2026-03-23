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
      '/drive-stream': {
        target: 'https://www.googleapis.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/drive-stream/, '/drive/v3/files'),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            const url = new URL('http://localhost' + (req.url || ''));
            const token = url.searchParams.get('token');
            if (token) {
              proxyReq.setHeader('Authorization', `Bearer ${token}`);
              url.searchParams.delete('token');
              proxyReq.path = url.pathname + '?' + url.searchParams.toString() + '&alt=media';
            }
          });
        },
      },
    },
  },
})
