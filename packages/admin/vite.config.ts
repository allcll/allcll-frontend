import { ConfigEnv, defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';
import basicSsl from '@vitejs/plugin-basic-ssl';
import dotenv from 'dotenv';

export default ({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd());

  const TargetHost = env.VITE_TARGET_HOST;
  const TargetServer = `https://${TargetHost}`;
  const base = env.VITE_BASE ?? '/';
  dotenv.config();

  return defineConfig({
    base,
    plugins: [react(), tsconfigPaths(), tailwindcss(), svgr(), basicSsl()],
    server: {
      open: true,
      https: {
        key: '.cert/localhost-key.pem',
        cert: '.cert/localhost.pem',
      },
      proxy: {
        '/api': {
          target: TargetServer,
          changeOrigin: true,
        },
        '/admin': {
          target: TargetServer,
          changeOrigin: true,
          // rewrite: path => path.replace(/^\/api/, ''), // '/api' 경로 제거
        },
        '/sse': {
          target: TargetServer,
          changeOrigin: true,
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // @allcll/charts 내부 의존성(chart.js/react-chartjs-2)을 별도 vendor 청크로 분리
            if (id.includes('chart.js') || id.includes('react-chartjs-2')) {
              return 'vendor-chartjs';
            }
          },
        },
      },
    },
  });
};
