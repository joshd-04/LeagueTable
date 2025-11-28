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
    },
  },
  darkMode: 'class',
};

export default config;
