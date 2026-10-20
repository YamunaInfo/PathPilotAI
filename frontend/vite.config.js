import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const frontendRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    {
      name: 'react-source-entry',
      transformIndexHtml(html, { server }) {
        if (!server) return html;
        return html
          .replace('<script type="module" crossorigin src="/assets/app.js"></script>', '<script type="module" src="/src/main.jsx"></script>')
          .replace('<link rel="stylesheet" crossorigin href="/assets/index.css">', '');
      },
    },
    react(),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': 'http://127.0.0.1:5000',
      '/health': 'http://127.0.0.1:5000',
    },
  },
  build: {
    emptyOutDir: false,
    outDir: '.',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        index: resolve(frontendRoot, 'index.html'),
      },
      output: {
        entryFileNames: 'assets/app.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
});
