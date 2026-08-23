/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        medical: {
          50:  '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          900: '#134e4a',
        },
        ios: {
          bg:             '#f2f2f7',
          card:           '#ffffff',
          grouped:        '#f2f2f7',
          gray:           '#8e8e93',
          gray2:          '#aeaeb2',
          gray3:          '#c7c7cc',
          separator:      '#c6c6c8',
          label:          '#000000',
          secondLabel:    '#3c3c43',
          tertiaryLabel:  '#3c3c4399',
          blue:           '#007aff',
          green:          '#34c759',
          red:            '#ff3b30',
          orange:         '#ff9500',
          yellow:         '#ffcc00',
          indigo:         '#5856d6',
          pink:           '#ff2d55',
          purple:         '#af52de',
        },
      },
      fontFamily: {
        sans:    ['Inter', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', '-apple-system', 'SF Pro Display', 'sans-serif'],
      },
      borderRadius: {
        ios:      '14px',
        'ios-lg': '18px',
        'ios-xl': '22px',
        'ios-2xl':'28px',
      },
      boxShadow: {
        'ios-card':   '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)',
        'ios-lifted': '0 8px 24px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)',
        'ios-modal':  '0 20px 60px rgba(0,0,0,0.18)',
        'ios-button': '0 1px 2px rgba(0,0,0,0.06)',
      },
      backdropBlur: {
        ios: '20px',
      },
      animation: {
        'ios-spring': 'iosSpring 0.5s cubic-bezier(0.34,1.56,0.64,1)',
        'slide-up':   'slideUp 0.4s cubic-bezier(0.16,1,0.3,1)',
        'fade-in':    'fadeIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        iosSpring: {
          '0%':   { transform: 'scale(0.95)', opacity: 0 },
          '100%': { transform: 'scale(1)',    opacity: 1 },
        },
        slideUp: {
          '0%':   { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)',     opacity: 1 },
        },
        fadeIn: {
          '0%':   { opacity: 0 },
          '100%': { opacity: 1 },
        },
        pulseSoft: {
          '0%,100%': { opacity: 1 },
          '50%':     { opacity: 0.6 },
        },
      },
    },
  },
  plugins: [],
}
