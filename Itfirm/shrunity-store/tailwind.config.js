/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: { 50: '#FFFCF8', 100: '#FBF7F2', 200: '#F3EBE1' },
        blush: {
          50: '#FDF3F5',
          100: '#FBE4E9',
          200: '#F6CBD5',
          300: '#EFA9B9',
          400: '#E4829A',
          500: '#D4607F',
          600: '#B84868',
        },
        ink: { DEFAULT: '#2A2226', soft: '#5B4F54', mute: '#74686D' },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Jost', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
