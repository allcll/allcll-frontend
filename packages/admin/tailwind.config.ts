import { Config } from 'tailwindcss';
import { colors } from '@allcll/allcll-ui/colors';
import { Z_INDEX } from '@allcll/allcll-ui/zIndex';

/** @type {import('tailwindcss').Config} */
const config: Config = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}',
    '../common/src/**/*.{ts,tsx,js,jsx}',
    // 현재는 모노레포 구조라 로컬 디자인 시스템 소스를 직접 참조함.
    '../allcll-ui/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      // z-index 단일 관리: @allcll/allcll-ui/zIndex (z-content, z-modal 등 생성)
      zIndex: Object.fromEntries(Object.entries(Z_INDEX).map(([key, value]) => [key, String(value)])),
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
