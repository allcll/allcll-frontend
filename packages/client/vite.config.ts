import { ConfigEnv, defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import tsconfigPaths from 'vite-tsconfig-paths';
import { visualizer } from 'rollup-plugin-visualizer';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default ({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd());
  const TargetHost = env.VITE_TARGET_HOST ?? 'localhost:8080';
  // 스킴을 직접 지정할 수 있게 한다. 로컬 백엔드는 http 라 https 로 고정하면 프록시가 붙지 않는다.
  const TargetServer = /^https?:\/\//.test(TargetHost ?? '') ? TargetHost : `https://${TargetHost}`;

  const isProduction = mode === 'production';
  const base = env.VITE_BASE ?? '/';

  return defineConfig({
    base,
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
      basicSsl({
        name: 'localhost',
        domains: ['localhost'],
        certDir: '.cert',
      }),
    ],
    server: {
      open: true,
      https: {
        key: '.cert/_cert-key.pem',
        cert: '.cert/_cert.pem',
      },
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
