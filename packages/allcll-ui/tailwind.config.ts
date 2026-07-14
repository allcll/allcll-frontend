import type { Config } from 'tailwindcss';
import { Z_INDEX } from './zIndex';
import { colors } from './colors';

/** @type {import('tailwindcss').Config} */
const config: Config = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      // z-index 단일 관리: ./zIndex.ts (z-content, z-modal 등 생성)
      zIndex: Object.fromEntries(Object.entries(Z_INDEX).map(([key, value]) => [key, String(value)])),
      // colors 단일 관리: ./colors.ts (기존 인라인 중복 제거)
      colors: {
        primary: colors.primary,
        secondary: colors.secondary,
        text: colors.text,
      },
    },
  },
  plugins: [],
};

export default config;
