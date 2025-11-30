// Use CommonJS export for CI environments parsing config
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  esbuild: {
    target: 'esnext'
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        main: 'index.html',
        login: 'login.html',
        register: 'register.html',
        addreview: 'add-review.html'
      }
    }
  }
});
