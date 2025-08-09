import { ConfigEnv, defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';

export default ({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd());

  const TargetHost = env.VITE_TARGET_HOST ?? 'localhost:8080';
  const TargetServer = `https://${TargetHost}`;

  return defineConfig({
    plugins: [react(), tsconfigPaths(), tailwindcss(), svgr()],
    proxy: {
      '/api': {
        target: TargetServer,
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/admin': {
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
  });
};
