import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'node:path';

const VISX_DEPS = ['@visx/', 'd3', 'internmap', 'delaunator'];

export default defineConfig({
  plugins: [react(), visualizer({ filename: './dist/report.html', gzipSize: true, brotliSize: true })],
  resolve: {
    alias: {
      '@allcll/chart': path.resolve(__dirname, '../chart/index.ts'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/uplot')) {
            return 'chart-uplot';
          }
          if (VISX_DEPS.some(dep => id.includes(`node_modules/${dep}`))) {
            return 'chart-visx';
          }
          if (id.includes('/packages/chart/')) {
            return 'chart-custom';
          }
        },
      },
    },
  },
});
