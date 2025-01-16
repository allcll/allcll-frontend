import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths';
import WindiCSS from 'vite-plugin-windicss';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), WindiCSS()],
})
