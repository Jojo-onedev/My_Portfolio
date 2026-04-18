/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#871A1A',
        dark: {
          bg: '#121212',
          surface: '#1e1e1e',
          accent: '#871A1A',
        }
      },
      boxShadow: {
        'neumorph-dark': '9px 9px 16px rgb(0,0,0,0.4), -9px -9px 16px rgba(255,255,255, 0.05)',
        'neumorph-dark-inset': 'inset 9px 9px 16px rgb(0,0,0,0.4), inset -9px -9px 16px rgba(255,255,255, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out',
        'slide-in': 'slideIn 1s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-50px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}