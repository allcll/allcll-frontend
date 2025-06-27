import { ConfigEnv, defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { visualizer } from 'rollup-plugin-visualizer';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default ({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd());
  const TargetHost = env.VITE_TARGET_HOST ?? 'localhost:8080';
  const TargetServer = `https://${TargetHost}`;

  const ScoreServer = env.VITE_SCORE_API_URL ?? 'http://localhost:8081';
  const isProduction = mode === 'production';

  return defineConfig({
    plugins: [
      react(),
      tsconfigPaths(),
      tailwindcss(),
      svgr(),
      visualizer({ open: true, filename: './dist/report.html' }),
      sentryVitePlugin({
        org: 'allcll-ly',
        project: 'javascript-react',
        authToken: process.env.SENTRY_AUTH_TOKEN,
        sourcemaps: {
          filesToDeleteAfterUpload: ['**/*.map'],
        },
        telemetry: false,
      }),
    ],
    server: {
      open: true,
      proxy: {
        '/api': {
          target: TargetServer,
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/api/, '')
        },
        '/sse': {
          target: TargetServer,
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/sse/, '')
        },
        '/scoreApi': {
          target: ScoreServer,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/scoreApi/, '/api'),
        },
      },
    },
    publicDir: 'public', // Ensure this line is present
    optimizeDeps: {
      include: ['msw'],
    },
    build: {
      sourcemap: isProduction, // Source map generation for Sentry
    },
  });
};
