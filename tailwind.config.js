/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'hint-fade-in': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'hint-fade-out': {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-10px)' }
        },
        'clock-fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'clock-fade-out': {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-20px)' }
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        'needle-down': {
          '0%': { transform: 'rotate(-100deg)' },
          '30%': { transform: 'rotate(-15deg)' },
          '60%': { transform: 'rotate(-23deg)' },
          '100%': { transform: 'rotate(-20deg)' }
        },
        'needle-up': {
          '0%': { transform: 'rotate(-20deg)' },
          '30%': { transform: 'rotate(-110deg)' },
          '60%': { transform: 'rotate(-95deg)' },
          '100%': { transform: 'rotate(-100deg)' }
        },
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-25%)' }
        },
        'hint-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' }
        },
        'mode-rotate': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        'hint-fade-in': 'hint-fade-in 0.5s ease-out forwards',
        'hint-fade-out': 'hint-fade-out 0.5s ease-out forwards',
        'clock-fade-in': 'clock-fade-in 0.8s ease-out forwards',
        'clock-fade-out': 'clock-fade-out 0.5s ease-out forwards',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-slow': 'bounce-slow 2s ease-in-out infinite',
        'hint-bounce': 'hint-bounce 2s ease-in-out infinite',
        'mode-rotate': 'mode-rotate 0.3s ease-out',
        'marquee': 'marquee 10s linear infinite'
      }
    }
  },
  plugins: [],
}; 