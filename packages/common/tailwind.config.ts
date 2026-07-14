import { Config } from 'tailwindcss';
import { Z_INDEX } from '@allcll/allcll-ui/zIndex';

/** @type {import('tailwindcss').Config} */
const config: Config = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      // z-index 단일 관리: @allcll/allcll-ui/zIndex (z-content, z-modal 등 생성)
      zIndex: Object.fromEntries(Object.entries(Z_INDEX).map(([key, value]) => [key, String(value)])),
      colors: {
        primary: '#007aff',
        blue: {
          500: '#007aff',
        },
      },
    },
  },
  plugins: [],
};

export default config;
