/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'navigate-bar': '#7dd4a7',
        'main-text-color': '#236719',
        heading: '#216516',
        'primary-text-color': '#90a88c',
        'base-color': '#e6e8e6',
        primary: '#b2d3c2',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        360: '90rem',
      },
      height: {
        124: '35rem',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        oswald: ['Oswald', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
