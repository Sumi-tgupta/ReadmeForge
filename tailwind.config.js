/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gray: {
          150: '#f1f3f5',
          250: '#dcdfe4',
          350: '#babbc2',
          450: '#818894',
          550: '#6b7280',
          650: '#4b5260',  // body text muted (was undefined)
          750: '#374151',
          850: '#1f242e',
          905: '#111827',  // dark sidebar background (was undefined)
          955: '#0b0f17',
        },
        indigo: {
          450: '#5a5df0',
          550: '#544df1',
          650: '#473eeb',  // brand primary button (was undefined)
        },
        purple: {
          650: '#852ae7',  // brand gradient end (was undefined)
        },
        green: {
          450: '#22b14c',
        },
        emerald: {
          250: '#86efac',
          450: '#22c38e',
        },
      },
      zIndex: {
        35: '35',  // sticky header between sidebar (z-30) and modal (z-40)
      },
      animation: {
        'shimmer': 'shimmer 2s infinite linear',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'fade-in': 'fadeIn 0.15s ease-out',
        'pop': 'pop 0.2s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
