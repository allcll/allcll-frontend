import { Config } from 'tailwindcss';

/** @type {import('tailwindcss').Config} */
const config: Config = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
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
