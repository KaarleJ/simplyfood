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
      'blue': '#1fb6ff',
      'purple': '#7e5bef',
      'pink': '#ff49db',
      'orange': '#ff7849',
      'green': '#13ce66',
      'yellow': '#ffc82c',
      'gray-dark': '#273444',
      'gray': '#8492a6',
      'red': '#DB3734',
      'green-yellow': '#BFE57C',
      'off-white': '#FCFDEE',
      "light-gray": '#F5F5F2 ',
      'dark-gray': '#87877F',
      'white': '#FFFFFF'
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
