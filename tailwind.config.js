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
        },
        'slide-up-fade': {
          '0%': {
            opacity: '0',
            transform: 'translateX(-30px)',
            width: '0',
            padding: '0',
            margin: '0'
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
            width: 'var(--terminal-width, 96px)',
            padding: '0.5rem 1rem',
            margin: '0'
          }
        },
        'slide-up-fade-reverse': {
          '0%': {
            opacity: '1',
            transform: 'translateX(0)',
            width: 'var(--terminal-width, 96px)',
            padding: '0.5rem 1rem',
            margin: '0'
          },
          '30%': {
            opacity: '1',
            transform: 'translateX(-10px)',
            width: 'calc(var(--terminal-width, 96px) * 0.8)',
            padding: '0.5rem 1rem',
            margin: '0'
          },
          '100%': {
            opacity: '0',
            transform: 'translateX(-30px)',
            width: '0',
            padding: '0',
            margin: '0'
          }
        },
        'container-expand': {
          '0%': {
            width: 'var(--initial-width)'
          },
          '100%': {
            width: 'var(--final-width)'
          }
        },
        'container-shrink': {
          '0%': {
            width: 'var(--final-width)',
            opacity: '1'
          },
          '100%': {
            width: 'var(--initial-width)',
            opacity: '1'
          }
        },
        'fade-in': {
          '0%': {
            opacity: '0'
          },
          '100%': {
            opacity: '1'
          }
        },
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(5px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'fade-out-down': {
          '0%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
          '100%': {
            opacity: '0',
            transform: 'translateY(10px)'
          }
        },
        'slide-down': {
          '0%': {
            maxHeight: '0',
            opacity: '0',
            transform: 'translateY(-10px)'
          },
          '100%': {
            maxHeight: '200px',
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'slide-up': {
          '0%': {
            maxHeight: '200px',
            opacity: '1',
            transform: 'translateY(0)'
          },
          '100%': {
            maxHeight: '0',
            opacity: '0',
            transform: 'translateY(-10px)'
          }
        },
        'music-tip-in': {
          '0%': {
            opacity: '0',
            transform: 'translate(-50%, -10px)'
          },
          '10%': {
            opacity: '1',
            transform: 'translate(-50%, 0)'
          },
          '90%': {
            opacity: '1',
            transform: 'translate(-50%, 0)'
          },
          '100%': {
            opacity: '0',
            transform: 'translate(-50%, -10px)'
          }
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
        'marquee': 'marquee 10s linear infinite',
        'slide-up-fade': 'slide-up-fade 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'slide-up-fade-reverse': 'slide-up-fade-reverse 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'container-expand': 'container-expand 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'container-shrink': 'container-shrink 1s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.3s ease-out forwards',
        'fade-out-down': 'fade-out-down 0.5s ease-in-out forwards',
        'slide-down': 'slide-down 0.3s ease-out forwards',
        'slide-up': 'slide-up 0.3s ease-out forwards',
        'music-tip': 'music-tip-in 4s ease-in-out forwards'
      }
    }
  },
  plugins: [],
}; 