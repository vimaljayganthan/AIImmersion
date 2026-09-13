/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          sky: '#38BDF8',
          skyHover: '#0284C7',
          skyActive: '#0369A1',
          lightSky: '#E0F2FE',
          veryLight: '#F0F9FF',
          navy: '#0F172A',
          slate: '#475569',
          muted: '#64748B',
          border: '#E2E8F0',
          card: '#FFFFFF',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px 0 rgba(15, 23, 42, 0.04), 0 1px 3px 0 rgba(15, 23, 42, 0.02)',
        'card': '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.02)',
        'card-hover': '0 12px 30px -4px rgba(56, 189, 248, 0.15), 0 4px 12px -2px rgba(15, 23, 42, 0.04)',
        'sky-glow': '0 0 25px -3px rgba(56, 189, 248, 0.25)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      }
    },
  },
  plugins: [],
}
