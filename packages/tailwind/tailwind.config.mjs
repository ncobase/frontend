import tailwindTypography from '@tailwindcss/typography';
import tailwindAnimate from 'tailwindcss-animate';

import { brand, danger, primary, secondary, success, warning } from './colors.mjs';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx, mdx}',
    '../**/src/**/*.{js,jsx,ts,tsx,mdx}',
    './app/**/*.{js,jsx,ts,tsx,mdx}',
    '../**/app/**/*.{js,jsx,ts,tsx,mdx}',
    './pages/**/*.{js,jsx,ts,tsx,mdx}',
    '../**/pages/**/*.{js,jsx,ts,tsx,mdx}',
    './components/**/*.{js,jsx,ts,tsx,mdx}',
    '../**/components/**/*.{js,jsx,ts,tsx,mdx}'
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '1rem'
      },
      colors: {
        brand,
        primary,
        secondary,
        success,
        danger,
        warning
      },
      screens: {
        '3xl': '112rem'
      },
      fontSize: {
        xs: '0.675rem',
        sm: '0.7875rem',
        base: '0.9rem',
        lg: '1.0125rem',
        xl: '1.125rem',
        '2xl': '1.35rem',
        '3xl': '1.6875rem',
        '4xl': '2.25rem',
        '5xl': '2.7rem',
        '6xl': '3.375rem',
        '7xl': '4.05rem',
        '8xl': '5.4rem',
        '9xl': '7.2rem'
      },
      padding: {
        0: '0',
        0.5: '0.1125rem',
        1: '0.225rem',
        1.5: '0.3375rem',
        2: '0.45rem',
        2.5: '0.5625rem',
        3: '0.675rem',
        3.5: '0.7875rem',
        4: '0.9rem',
        5: '1.125rem',
        6: '1.35rem',
        7: '1.575rem',
        8: '1.8rem',
        9: '2.025rem',
        10: '2.25rem',
        11: '2.475rem',
        12: '2.7rem',
        16: '3.6rem',
        20: '4.5rem',
        24: '5.4rem',
        32: '7.2rem',
        40: '9rem',
        48: '10.8rem',
        56: '12.6rem',
        64: '14.4rem',
        72: '16.2rem',
        80: '18rem',
        96: '21.6rem'
      },
      margin: {
        0: '0',
        0.5: '0.1125rem',
        1: '0.225rem',
        1.5: '0.3375rem',
        2: '0.45rem',
        2.5: '0.5625rem',
        3: '0.675rem',
        3.5: '0.7875rem',
        4: '0.9rem',
        5: '1.125rem',
        6: '1.35rem',
        7: '1.575rem',
        8: '1.8rem',
        9: '2.025rem',
        10: '2.25rem',
        11: '2.475rem',
        12: '2.7rem',
        16: '3.6rem',
        20: '4.5rem',
        24: '5.4rem',
        32: '7.2rem',
        40: '9rem',
        48: '10.8rem',
        56: '12.6rem',
        64: '14.4rem',
        72: '16.2rem',
        80: '18rem',
        96: '21.6rem'
      },
      space: {
        0: '0',
        0.5: '0.1125rem',
        1: '0.225rem',
        1.5: '0.3375rem',
        2: '0.45rem',
        2.5: '0.5625rem',
        3: '0.675rem',
        3.5: '0.7875rem',
        4: '0.9rem',
        5: '1.125rem',
        6: '1.35rem',
        7: '1.575rem',
        8: '1.8rem',
        9: '2.025rem',
        10: '2.25rem',
        11: '2.475rem',
        12: '2.7rem',
        16: '3.6rem',
        20: '4.5rem',
        24: '5.4rem',
        32: '7.2rem',
        40: '9rem',
        48: '10.8rem',
        56: '12.6rem',
        64: '14.4rem',
        72: '16.2rem',
        80: '18rem',
        96: '21.6rem'
      },
      gap: {
        0: '0',
        0.5: '0.1125rem',
        1: '0.225rem',
        1.5: '0.3375rem',
        2: '0.45rem',
        2.5: '0.5625rem',
        3: '0.675rem',
        3.5: '0.7875rem',
        4: '0.9rem',
        5: '1.125rem',
        6: '1.35rem',
        7: '1.575rem',
        8: '1.8rem',
        9: '2.025rem',
        10: '2.25rem',
        11: '2.475rem',
        12: '2.7rem',
        16: '3.6rem',
        20: '4.5rem',
        24: '5.4rem',
        32: '7.2rem',
        40: '9rem',
        48: '10.8rem',
        56: '12.6rem',
        64: '14.4rem',
        72: '16.2rem',
        80: '18rem',
        96: '21.6rem'
      },
      keyframes: {
        leftToaster: {
          '0%': { left: '-20rem' },
          '100%': { left: '0' }
        },
        rightToaster: {
          '0%': { right: '-20rem' },
          '100%': { right: '0' }
        },
        'bar-loader': {
          from: { left: '-100%' },
          to: { left: '100%' }
        }
      }
    }
  },
  plugins: [tailwindAnimate, tailwindTypography],
  ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {})
};
