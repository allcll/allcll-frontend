import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths';
import WindiCSS from 'vite-plugin-windicss';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), WindiCSS(), svgr()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/sse': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/sse/, '')
      }
    },
  },
  publicDir: 'public', // Ensure this line is present
  optimizeDeps: {
    include: ['msw']
  }
})
