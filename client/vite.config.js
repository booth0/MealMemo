import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login/index.html'),
        register: resolve(__dirname, 'register/index.html'),
        recipes: resolve(__dirname, 'recipes/index.html'),
        'recipes-create': resolve(__dirname, 'recipes/create.html'),
        'recipes-edit': resolve(__dirname, 'recipes/edit.html'),
        'recipes-detail': resolve(__dirname, 'recipes/detail.html'),
        featured: resolve(__dirname, 'featured/index.html'),
        'featured-detail': resolve(__dirname, 'featured/detail.html'),
        contributor: resolve(__dirname, 'contributor/index.html'),
        'contributor-review': resolve(__dirname, 'contributor/review.html'),
        admin: resolve(__dirname, 'admin/index.html'),
      }
    }
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
});