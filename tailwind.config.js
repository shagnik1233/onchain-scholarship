/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  extend: {
  animation: {
    'fade-in-scale': 'fadeInScale 1.2s ease-out both',
    'slide-in-left': 'slideInLeft 1s ease-out both',
    'slide-in-right': 'slideInRight 1s ease-out both',
    'fade-in-delay': 'fadeIn 2s ease-out both',
    'float': 'floatUpDown 4s ease-in-out infinite',
    'slow-float': 'floatUpDownSlow 7s ease-in-out infinite',
    'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
  },
  keyframes: {
    fadeInScale: {
      '0%': { opacity: 0, transform: 'scale(0.9)' },
      '100%': { opacity: 1, transform: 'scale(1)' },
    },
    slideInLeft: {
      '0%': { opacity: 0, transform: 'translateX(-50px)' },
      '100%': { opacity: 1, transform: 'translateX(0)' },
    },
    slideInRight: {
      '0%': { opacity: 0, transform: 'translateX(50px)' },
      '100%': { opacity: 1, transform: 'translateX(0)' },
    },
    fadeIn: {
      '0%': { opacity: 0 },
      '100%': { opacity: 1 },
    },
    floatUpDown: {
      '0%, 100%': { transform: 'translateY(0px)' },
      '50%': { transform: 'translateY(-10px)' },
    },
    floatUpDownSlow: {
      '0%, 100%': { transform: 'translateY(0px)' },
      '50%': { transform: 'translateY(-14px)' },
    },
    pulseGlow: {
      '0%, 100%': { textShadow: '0 0 0 transparent' },
      '50%': { textShadow: '0 0 8px rgba(0,0,0,0.2)' },
    },
  },
},

},



  plugins: [],
}

