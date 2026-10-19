/** Wraps a CSS variable holding "R G B" so Tailwind opacity modifiers keep working. */
const rgb = name => `rgb(var(--${name}) / <alpha-value>)`;

const scale = prefix =>
  Object.fromEntries(
    [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map(step => [
      step,
      rgb(`${prefix}-${step}`),
    ]),
  );

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        app: rgb('app'),
        surface: rgb('surface'),
        subtle: rgb('subtle'),
        line: { DEFAULT: rgb('line'), strong: rgb('line-strong') },
        field: rgb('field'),
        ink: rgb('ink'),
        muted: rgb('muted'),
        faint: rgb('faint'),
        brand: scale('brand'),
        primary: {
          DEFAULT: rgb('primary'),
          hover: rgb('primary-hover'),
          soft: rgb('primary-soft'),
          ink: rgb('primary-ink'),
        },
        'on-primary': rgb('on-primary'),
        accent: { DEFAULT: rgb('accent'), soft: rgb('accent-soft'), ink: rgb('accent-ink') },
        success: { DEFAULT: rgb('success'), soft: rgb('success-soft'), fg: rgb('success-fg') },
        warning: { DEFAULT: rgb('warning'), soft: rgb('warning-soft'), fg: rgb('warning-fg') },
        info: { DEFAULT: rgb('info'), soft: rgb('info-soft'), fg: rgb('info-fg') },
        danger: {
          DEFAULT: rgb('danger'),
          soft: rgb('danger-soft'),
          fg: rgb('danger-fg'),
          solid: rgb('danger-solid'),
        },
      },
      borderColor: { DEFAULT: rgb('line') },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        overlay: 'var(--shadow-overlay)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      maxWidth: { page: '84rem' },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'fade-out': { from: { opacity: '1' }, to: { opacity: '0' } },
        'pop-in': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'pop-out': {
          from: { opacity: '1', transform: 'scale(1)' },
          to: { opacity: '0', transform: 'scale(0.96)' },
        },
        'slide-in-end': {
          from: { transform: 'translateX(calc(100% * var(--dir-sign)))' },
          to: { transform: 'translateX(0)' },
        },
        'slide-out-end': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(100% * var(--dir-sign)))' },
        },
        'slide-in-start': {
          from: { transform: 'translateX(calc(-100% * var(--dir-sign)))' },
          to: { transform: 'translateX(0)' },
        },
        'slide-out-start': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% * var(--dir-sign)))' },
        },
      },
      animation: {
        'fade-in': 'fade-in 150ms ease-out',
        'fade-out': 'fade-out 150ms ease-in forwards',
        'pop-in': 'pop-in 180ms cubic-bezier(0.16, 1, 0.3, 1)',
        'pop-out': 'pop-out 150ms ease-in forwards',
        'slide-in-end': 'slide-in-end 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-out-end': 'slide-out-end 160ms ease-in forwards',
        'slide-in-start': 'slide-in-start 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-out-start': 'slide-out-start 160ms ease-in forwards',
      },
    },
  },
  plugins: [],
};
