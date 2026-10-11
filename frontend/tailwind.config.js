/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#0d0e11',
          900: '#131417',
          850: '#18191d',
          800: '#1f2026',
          750: '#262830',
          700: '#2e303a',
          600: '#424552',
          500: '#64687a',
          400: '#8b8f9f',
          300: '#b2b5c4',
          200: '#d7d9e3',
          100: '#eeeff4',
        },
        brand: {
          blue: '#3b82f6',
          'blue-dark': '#2563eb',
          'blue-light': '#60a5fa',
          green: '#10b981',
          orange: '#f97316',
          purple: '#8b5cf6',
          red: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['Quicksand', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
