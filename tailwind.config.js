const colors = require('tailwindcss/colors')
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1440px',
      '2xl': '1600px'
    },
    colors: {
      'green-yellow': '#BFE57C',
      'off-white': '#FCFDEE',
      'gray': colors.gray,
      'white': colors.white,
      'blue': colors.blue,
      'zinc': colors.zink,
      'cyan': colors.cyan,
      'stone': colors.stone,
      'lime': colors.lime,
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      transitionProperty: {
        'height': 'height',
        'max-height': 'max-height',
        'none': 'none',
        'all': 'all',
        'color': 'color',
        'bg': 'background-color',
        'border': 'border-color',
        'colors': ['color', 'background-color', 'border-color'],
        'opacity': 'opacity',
        'transform': 'transform',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    },
    minHeight: {
      'loose': '85vh'
    }
  },
  plugins: [],
}
