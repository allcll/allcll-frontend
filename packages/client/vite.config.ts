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
  const TargetServer = `https://${TargetHost}`;

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
      rollupOptions: {
        output: {
          manualChunks(id) {
            // @allcll workspace packages (resolved as local paths in monorepo)
            if (id.includes('/packages/allcll-ui/') || id.includes('@allcll/allcll-ui')) return 'vendor-allcll-ui';
            if (id.includes('/packages/sejong-ui/') || id.includes('@allcll/sejong-ui')) return 'vendor-sejong-ui';

            if (!id.includes('node_modules')) return undefined;

            // react core & scheduler → vendor-react (exact package boundary to avoid matching react-router)
            if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'vendor-react';

            // react-router & remix router → vendor-router
            if (id.includes('/react-router') || id.includes('/@remix-run/router')) return 'vendor-router';

            // tanstack (react-query, etc.) → vendor-tanstack
            if (id.includes('/@tanstack/')) return 'vendor-tanstack';

            // all other node_modules → vendor
            return 'vendor';
          },
        },
      },
    },
  });
};
