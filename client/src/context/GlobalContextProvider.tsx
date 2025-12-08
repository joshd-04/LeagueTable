'use client';
import { createContext, useEffect, useState } from 'react';
import { User } from '@/util/definitions';
import { handleColorThemeToggle } from '@/util/helpers';

interface GlobalContextInterface {
  colorTheme: {
    colorTheme: 'light' | 'dark';
    setColorTheme: (colorTheme: 'light' | 'dark') => void;
  };
}

const defaultGlobalContext: GlobalContextInterface = {
  colorTheme: {
    colorTheme: 'dark',
    setColorTheme: () => {},
  },
};

export const GlobalContext =
  createContext<GlobalContextInterface>(defaultGlobalContext);

export default function GlobalContextProvider({
  children,
}: {
  initialUser: User | undefined | null;
  initialError: string;
  children: React.ReactNode;
}) {
  const [colorTheme, setColorTheme] = useState<'light' | 'dark'>('dark');

  // On mount, set the color theme to the user's sytem theme
  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     const systemThemeIsDark = window.matchMedia(
  //       '(prefers-color-scheme: dark)'
  //     ).matches;
  //     const systemTheme = systemThemeIsDark ? 'dark' : 'light';
  //     setColorTheme(systemTheme);
  //   }
  // }, []);

  // Change the CSS Property variables when color theme changes
  useEffect(() => {
    handleColorThemeToggle(colorTheme);
  }, [colorTheme]);

  const context: GlobalContextInterface = {
    colorTheme: {
      colorTheme,
      setColorTheme,
    },
  };

  return (
    <GlobalContext.Provider value={{ ...context }}>
      {children}
    </GlobalContext.Provider>
  );
}
