import { heroui } from '@heroui/react';

export default heroui({
  // layout tokens (sizes, radii, line-heights) tuned to your globals.css variables
  layout: {
    dividerWeight: '1px',
    disabledOpacity: 0.5,
    fontSize: {
      tiny: '0.75rem', // maps to small UI text
      small: '0.875rem',
      medium: '1rem',
      large: '1.125rem',
    },
    lineHeight: {
      tiny: '1rem',
      small: '1.25rem',
      medium: '1.5rem',
      large: '1.75rem',
    },
    radius: {
      small: '8px', // corresponds to your rounded-small
      medium: '12px', // rounded-medium
      large: '14px', // rounded-large
    },
    borderWidth: {
      small: '1px',
      medium: '2px',
      large: '3px',
    },
  },

  // theme palettes use your CSS variables so switching dark/light (class) affects hero tokens
  themes: {
    light: {
      layout: {
        radius: {
          small: '6px',
          medium: '10px',
          large: '16px',
        },
        borderWidth: {
          small: '1px',
          medium: '2px',
        },
        boxShadow: {
          small:
            '0px 2px 2px hsla(0, 0%, 0%, 0.07), 0px 4px 4px hsla(0, 0%, 0%, 0.15)',
          medium:
            '0px 4px 8px hsla(0, 0%, 0%, 0.08), 0px 8px 16px hsla(0, 0%, 0%, 0.12)',
        },
      },
      colors: {
        background: 'hsl(0, 0%, 95%)', // --bg
        foreground: 'hsl(0, 0%, 5%)', // --text
        divider: 'hsl(0, 0%, 70%)', // --border
        overlay: 'white', // used for modal, popover, etc.
        focus: 'hsl(200, 95%, 0%)', // --accent
        content1: 'hsl(0, 0%, 90%)', // --bg-light
        content2: 'hsl(0, 0%, 85%)', // same as bg
        content3: 'hsl(0, 0%, 80%)', // --bg-dark
        primary: {
          DEFAULT: 'hsl(200, 100%, 50%)',
          foreground: 'black',
        },
        success: { DEFAULT: 'hsl(120, 60%, 60%)', foreground: 'black' },
        danger: {
          DEFAULT: 'hsl(0, 70%, 50%)',
          foreground: 'white',
        },
        warning: {
          DEFAULT: 'hsl(30, 70%, 50%)',
          foreground: 'white',
        },
      },
    },

    dark: {
      layout: {
        radius: {
          small: '6px',
          medium: '10px',
          large: '16px',
        },
        borderWidth: {
          small: '1px',
          medium: '2px',
        },
        boxShadow: {
          small:
            '0px 2px 2px hsla(0, 0%, 0%, 0.07), 0px 4px 4px hsla(0, 0%, 0%, 0.15)',
          medium:
            '0px 4px 8px hsla(0, 0%, 0%, 0.08), 0px 8px 16px hsla(0, 0%, 0%, 0.12)',
        },
      },
      colors: {
        background: 'hsl(0, 0%, 0%)',
        foreground: 'hsl(0, 0%, 95%)',
        divider: 'hsl(0, 0%, 30%)',
        focus: 'hsl(200, 95%, 10%)',
        content1: 'hsl(0, 0%, 10%)',
        content2: 'hsl(0, 0%, 5%)',
        content3: 'hsl(0, 0%, 0%)',
        primary: {
          DEFAULT: 'hsl(212, 100%, 47%)',
          foreground: 'white',
        },
        success: { DEFAULT: 'hsl(120, 60%, 60%)', foreground: 'white' },
        danger: {
          DEFAULT: 'hsl(0, 60%, 60%)',
          foreground: 'black',
        },
        warning: {
          DEFAULT: 'hsl(60, 60%, 60%)',
          foreground: 'black',
        },
      },
    },
  },
});
