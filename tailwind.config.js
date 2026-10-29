/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#08080a',
          900: '#0c0c0f',
          850: '#111115',
          800: '#16161c',
          700: '#1d1d24',
          600: '#26262f',
          500: '#34343f',
          400: '#4a4a57',
          300: '#6b6b7a',
          200: '#9a9aab',
          100: '#c5c5d2',
        },
        neon: {
          green: '#39ff88',
          'green-dim': '#22c968',
          purple: '#b16cff',
          'purple-dim': '#8a47ff',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neon-green': '0 0 20px -2px rgba(57, 255, 136, 0.35)',
        'neon-purple': '0 0 20px -2px rgba(177, 108, 255, 0.35)',
        card: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 30px -12px rgba(0,0,0,0.8)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-down': 'slideDown 0.3s ease forwards',
        'toast-in': 'toastIn 0.3s cubic-bezier(0.21, 1.02, 0.73, 1) forwards',
        'toast-out': 'toastOut 0.25s ease forwards',
        'spin-slow': 'spin 3s linear infinite',
        'count-up': 'countUp 0.6s ease forwards',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        toastIn: {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        toastOut: {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(12px) scale(0.96)' },
        },
        countUp: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
      },
    },
  },
  plugins: [],
};
