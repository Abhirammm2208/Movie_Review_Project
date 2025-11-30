// Use CommonJS export for CI environments parsing config
module.exports = {
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
};
