/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#0A0A0A',
        white: '#FAFAFA',
        cream: '#F5F3EF',
        stone: '#E8E4DE',
        gray: {
          50: '#F9F9F9',
          100: '#F3F3F3',
          200: '#E8E8E8',
          300: '#D4D4D4',
          400: '#A1A1A1',
          500: '#6B6B6B',
          600: '#4A4A4A',
          700: '#333333',
          800: '#1F1F1F',
          900: '#141414',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'Times New Roman', 'serif'],
        mono: ['var(--font-mono)', 'Consolas', 'monospace'],
      },
      fontSize: {
        // Micro - labels, hints (10px)
        'micro': ['0.625rem', { lineHeight: '1.4', letterSpacing: '0.12em' }],
        // Extra small - captions, metadata (11px)
        'xs': ['0.6875rem', { lineHeight: '1.5', letterSpacing: '0.04em' }],
        // Small - body small, nav (13px)
        'sm': ['0.8125rem', { lineHeight: '1.65', letterSpacing: '0.02em' }],
        // Base - body text (15px)
        'base': ['0.9375rem', { lineHeight: '1.75', letterSpacing: '0.01em' }],
        // Large - lead paragraphs (18px)
        'lg': ['1.125rem', { lineHeight: '1.65', letterSpacing: '0' }],
        // XL - small headings (22px)
        'xl': ['1.375rem', { lineHeight: '1.35', letterSpacing: '-0.01em' }],
        // 2XL - section headings (28px)
        '2xl': ['1.75rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        // 3XL - page headings (36px)
        '3xl': ['2.25rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
        // 4XL - hero headings (48px)
        '4xl': ['3rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        // 5XL - display (64px)
        '5xl': ['4rem', { lineHeight: '1', letterSpacing: '-0.035em' }],
        // 6XL - large display (80px)
        '6xl': ['5rem', { lineHeight: '0.95', letterSpacing: '-0.04em' }],
        // 7XL - hero display (96px)
        '7xl': ['6rem', { lineHeight: '0.9', letterSpacing: '-0.045em' }],
        // 8XL - massive display (128px)
        '8xl': ['8rem', { lineHeight: '0.85', letterSpacing: '-0.05em' }],
      },
      spacing: {
        'px': '1px',
        '0': '0',
        '0.5': '2px',
        '1': '4px',
        '1.5': '6px',
        '2': '8px',
        '2.5': '10px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '7': '28px',
        '8': '32px',
        '9': '36px',
        '10': '40px',
        '11': '44px',
        '12': '48px',
        '14': '56px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
        '28': '112px',
        '32': '128px',
        '36': '144px',
        '40': '160px',
        '44': '176px',
        '48': '192px',
        '52': '208px',
        '56': '224px',
        '60': '240px',
        '64': '256px',
        '72': '288px',
        '80': '320px',
        '96': '384px',
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
        'hero': '16 / 9',
        'square': '1 / 1',
        'portrait': '2 / 3',
      },
      letterSpacing: {
        'tightest': '-0.05em',
        'tighter': '-0.03em',
        'tight': '-0.015em',
        'normal': '0',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.1em',
        'ultra': '0.2em',
        'mega': '0.3em',
      },
      lineHeight: {
        'none': '1',
        'tight': '1.1',
        'snug': '1.25',
        'normal': '1.5',
        'relaxed': '1.65',
        'loose': '1.85',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
        '300': '300ms',
        '350': '350ms',
        '400': '400ms',
        '500': '500ms',
      },
      transitionTimingFunction: {
        'ease-out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'ease-in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)',
        'ease-out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
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
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'reveal-up': {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 400ms ease-out forwards',
        'fade-in-up': 'fade-in-up 500ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-right': 'slide-in-right 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-out-right': 'slide-out-right 350ms cubic-bezier(0.87, 0, 0.13, 1) forwards',
        'slide-down': 'slide-down 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scale-in 350ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'reveal-up': 'reveal-up 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      maxWidth: {
        'prose': '65ch',
        'narrow': '540px',
        'content': '720px',
        'wide': '1200px',
        'full': '1440px',
      },
    },
  },
  plugins: [],
};
