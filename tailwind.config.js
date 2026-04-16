/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette: deep navy, charcoal, metallic silver, coral
        brand: {
          navy: '#0D2137',
          charcoal: '#1A1A1A',
          carbon: '#2B2B2B',
          silver: '#9AA0A6',
          'silver-light': '#B8BFC6',
          coral: '#C9785A',
          'coral-vivid': '#D4614A',
          ivory: '#F5F5F0',
          'ivory-warm': '#ECEFF1',
          gold: '#C8893A',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        // Capitol terminal font for easter egg
        terminal: ['"Share Tech Mono"', '"Courier New"', 'monospace'],
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease forwards',
        'fade-in': 'fadeIn 1s ease forwards',
        'scan-line': 'scanLine 3s linear infinite',
        'type-cursor': 'typeCursor 1s step-end infinite',
        'counter-up': 'counterUp 2s ease-out forwards',
        'slide-in-right': 'slideInRight 0.6s ease forwards',
        'glitch': 'glitch 0.3s ease infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        typeCursor: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        counterUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(32px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(2px, -2px)' },
          '60%': { transform: 'translate(-2px, 0)' },
          '80%': { transform: 'translate(2px, 2px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
