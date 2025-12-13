import { Config } from 'tailwindcss';
import { colors } from '../allcll-ui/colors';

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
      colors: {
        primary: colors.primary,
        secondary: colors.secondary,
      },
    },
  },
  plugins: [],
};

export default config;
