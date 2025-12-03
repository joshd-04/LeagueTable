// tailwind.config.ts

const config = {
  theme: {
    extend: {
      fontFamily: {
        instrument: [
          'var(--font-instrument-sans)',
          'Helvetica Neue',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      color: {
        muted: ['opacity-80 dark:opacity-70'],
      },
      backgroundImage: {
        'gradient-title':
          'linear-gradient(91deg, #FFF 32.88%, rgba(255, 255, 255, 0.40) 99.12%)',
        'gradient-title-light':
          'linear-gradient(91deg, #000 32.88%, rgba(0, 0, 0, 0.60) 99.12%)',
      },
      rotate: {
        'x-12': '12deg',
      },
      perspective: {
        '1000': '1000px',
      },
    },
  },
  darkMode: 'class',
  keyframes: {
    'preserve-3d': { transformStyle: 'preserve-3d' },
  },
  utilities: {
    '.preserve-3d': { transformStyle: 'preserve-3d' },
    '.rotate-x-12': { transform: 'rotateX(12deg)' },
    '.rotate-z-neg-14': { transform: 'rotateZ(-14deg)' },
  },
};

export default config;
