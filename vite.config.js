import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import jsconfigPaths from 'vite-jsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    jsconfigPaths(),
    visualizer({
      filename: './dist/visualizer.html', // or anywhere you prefer
      open: false, // auto-opens report in browser
      gzipSize: true,
      brotliSize: true
    })
  ],
  define: {
    global: 'window'
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['@tanstack/react-router'],
          'redux': ['@reduxjs/toolkit', 'react-redux', 'redux-saga', 'redux-logger'],
          'ui': ['@kfonbss/bss-ui-components'],
          'form': ['@hookform/resolvers', 'yup'],
          'i18n': ['i18next', 'react-i18next'],
          'maps': ['@googlemaps/js-api-loader', '@vis.gl/react-google-maps'],
          'rich-text': ['quill', 'react-quilljs'],
          'motion': ['framer-motion'],
          'utils': ['axios', 'dayjs', 'crypto-js', 'query-string'],
          'icons': ['react-icons']
        }
      }
    }
  }
});
