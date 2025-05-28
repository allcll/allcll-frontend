import { ConfigEnv, defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default ({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd());
  const TargetHost = env.VITE_TARGET_HOST ?? 'localhost:8080';
  const TargetServer = `https://${TargetHost}`;

  const ScoreServer = env.VITE_SCORE_API_URL ?? 'http://localhost:8081';

  return defineConfig({
    plugins: [react(), tsconfigPaths(), tailwindcss(), svgr()],
    server: {
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
  });
};
