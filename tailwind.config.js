/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        white: '#FFFFFF',
        gray: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        // Micro - labels, hints
        'micro': ['10px', { lineHeight: '1.4', letterSpacing: '0.08em' }],
        // Extra small - captions, metadata
        'xs': ['11px', { lineHeight: '1.5', letterSpacing: '0.02em' }],
        // Small - body small, nav
        'sm': ['13px', { lineHeight: '1.6', letterSpacing: '0.01em' }],
        // Base - body text
        'base': ['15px', { lineHeight: '1.7', letterSpacing: '0' }],
        // Large - lead paragraphs
        'lg': ['17px', { lineHeight: '1.6', letterSpacing: '-0.01em' }],
        // XL - small headings
        'xl': ['20px', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
        // 2XL - section headings
        '2xl': ['26px', { lineHeight: '1.25', letterSpacing: '-0.02em' }],
        // 3XL - page headings
        '3xl': ['34px', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        // 4XL - hero headings
        '4xl': ['44px', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        // 5XL - display
        '5xl': ['56px', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        // 6XL - large display
        '6xl': ['72px', { lineHeight: '1', letterSpacing: '-0.04em' }],
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '16px',
        4: '24px',
        5: '32px',
        6: '48px',
        7: '64px',
        8: '80px',
        9: '96px',
        10: '128px',
      },
      borderRadius: {
        none: '0px',
        DEFAULT: '0px',
      },
      boxShadow: {
        none: 'none',
      },
      aspectRatio: {
        'product': '3 / 4',
      },
      letterSpacing: {
        'tightest': '-0.04em',
        'tighter': '-0.02em',
        'tight': '-0.01em',
        'normal': '0',
        'wide': '0.02em',
        'wider': '0.05em',
        'widest': '0.1em',
        'ultra': '0.15em',
      },
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
        '400': '400ms',
      },
      transitionTimingFunction: {
        'ease-out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'ease-in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-out-right': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 300ms ease-out forwards',
        'fade-in-up': 'fade-in-up 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-right': 'slide-in-right 350ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-out-right': 'slide-out-right 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards',
        'slide-down': 'slide-down 250ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scale-in 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
};
