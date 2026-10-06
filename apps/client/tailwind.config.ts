import { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';
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
      fontFamily: {
        sans: ['Pretendard'],
      },
      // z-index 는 @allcll/allcll-ui/zIndex 에서 단일 관리 (z-content, z-modal 등 생성)
      zIndex: Object.fromEntries(Object.entries(Z_INDEX).map(([key, value]) => [key, String(value)])),
      colors: {
        primary: colors.primary,
        secondary: colors.secondary,
        text: colors.text,
        blue: {
          500: '#007aff',
        },
        banner: {
          skysoft: '#F4F9FF',
        },
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        updown: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },

      animation: {
        marquee: 'marquee 20s linear infinite',
        updown: 'updown 2s ease-in-out infinite',
      },
    },
  },
  plugins: [typography],
};

export default config;
