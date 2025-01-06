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
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        clockFadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        clockFadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        reset: {
          '0%': { transform: 'translateX(var(--tw-translate-x, 0))' },
          '100%': { transform: 'translateX(0)' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        clockFadeIn: 'clockFadeIn 1s ease-out forwards',
        clockFadeOut: 'clockFadeOut 0.5s ease-out forwards',
        marquee: 'marquee 15s linear infinite',
        reset: 'reset 0.3s ease-out forwards'
      }
    }
  },
  plugins: [],
}; 