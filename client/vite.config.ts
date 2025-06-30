import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // Suppress deprecation warnings from Bootstrap
        quietDeps: true,
        silenceDeprecations: ['import', 'global-builtin', 'color-functions']
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    // Enable minification
    minify: 'terser',
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunk for React and core libraries
          vendor: ['react', 'react-dom'],
          // Bootstrap chunk
          bootstrap: ['bootstrap', 'react-bootstrap', 'react-bootstrap-icons'],
          // i18n chunk
          i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          // Utils chunk
          utils: ['validator']
        },
        // Optimize asset naming for better caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.ts', '').replace('.tsx', '') || 'chunk'
            : 'chunk';
          return `js/${facadeModuleId}-[hash].js`;
        },
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return 'assets/[name]-[hash][extname]';
          
          if (/\.(css)$/.test(assetInfo.name)) {
            return `css/[name]-[hash][extname]`;
          }
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(assetInfo.name)) {
            return `img/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        entryFileNames: 'js/[name]-[hash].js'
      }
    },
    // Improve chunk size limits
    chunkSizeWarningLimit: 1000,
    // Enable source maps for production debugging (optional)
    sourcemap: false,
    // Target modern browsers for smaller bundle
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
    // CSS code splitting
    cssCodeSplit: true,
    // Report compressed size
    reportCompressedSize: true
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'bootstrap',
      'react-bootstrap',
      'i18next',
      'react-i18next'
    ]
  }
})
