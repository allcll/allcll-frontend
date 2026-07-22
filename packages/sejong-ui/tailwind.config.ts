import type { Config } from 'tailwindcss';
// z-index 는 디자인 시스템(allcll-ui)에서 단일 관리. sejong-ui 는 allcll-ui 를 런타임 의존하지
// 않으므로, 빌드타임 config 로드용으로만 형제 패키지를 상대경로로 참조한다.
import { Z_INDEX } from '../allcll-ui/zIndex';
import { colors } from '../allcll-ui/colors';

/** @type {import('tailwindcss').Config} */
const config: Config = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      // z-index 단일 관리 (z-content, z-modal 등 생성)
      zIndex: Object.fromEntries(Object.entries(Z_INDEX).map(([key, value]) => [key, String(value)])),
      // colors 단일 관리: allcll-ui/colors (client 기준으로 통일)
      colors: {
        primary: colors.primary,
        blue: {
          500: '#007aff',
        },
      },
    },
  },
  plugins: [],
};

export default config;
