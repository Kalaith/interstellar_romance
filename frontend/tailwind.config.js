/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Stellaris Color Palette
        'stellaris-space': '#0a0e13',
        'stellaris-panel': '#1a2330',
        'stellaris-section': '#152028',
        'stellaris-item': '#1e2d3a',
        'stellaris-text': '#e8f4fa',
        'stellaris-muted': '#6b8395',
        'stellaris-cyan': '#00d4ff',
        'stellaris-teal': '#4ae6c8',
        'stellaris-energy': '#f1c40f',
        'stellaris-minerals': '#e74c3c',
        'stellaris-food': '#27ae60',
        'stellaris-alloys': '#9b59b6',
        'stellaris-research': '#3498db',
        'stellaris-influence': '#f39c12',
        'stellaris-success': '#2ed573',
        'stellaris-warning': '#f39c12',
        'stellaris-danger': '#e74c3c',

        // Legacy colors for compatibility
        gold: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        dragon: {
          50: '#f3f0ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
      },
      fontFamily: {
        fantasy: ['Cinzel', 'serif'],
      },
      animation: {
        'pulse-gold': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounce 2s infinite',
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
