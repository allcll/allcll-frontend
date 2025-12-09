import { Config } from 'tailwindcss';
import { colors } from '../allcll-ui/colors';

/** @type {import('tailwindcss').Config} */
const config: Config = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}',
    '../common/src/**/*.{ts,tsx,js,jsx}',
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
