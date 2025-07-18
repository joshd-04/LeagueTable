'use client';
import { createContext, useEffect, useState } from 'react';
import { User } from '@/util/definitions';
import { handleColorThemeToggle } from '@/util/helpers';

interface GlobalContextInterface {
  account: {
    user: User | undefined | null;
    setUser: (user: User | null) => void;
  };
  colorTheme: {
    colorTheme: 'light' | 'dark';
    setColorTheme: (colorTheme: 'light' | 'dark') => void;
  };
  errors: {
    error: string;
    setError: (error: string) => void;
  };
}

const defaultGlobalContext: GlobalContextInterface = {
  account: {
    user: null,
    setUser: () => {},
  },
  colorTheme: {
    colorTheme: 'dark',
    setColorTheme: () => {},
  },
  errors: {
    error: '',
    setError: () => {},
  },
};

export const GlobalContext =
  createContext<GlobalContextInterface>(defaultGlobalContext);

export default function GlobalContextProvider({
  initialUser,
  initialError,
  children,
}: {
  initialUser: User | undefined | null;
  initialError: string;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | undefined | null>(initialUser);
  const [colorTheme, setColorTheme] = useState<'light' | 'dark'>('dark');
  const [error, setError] = useState(initialError);

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
    account: {
      user,
      setUser,
    },
    colorTheme: {
      colorTheme,
      setColorTheme,
    },
    errors: {
      error,
      setError,
    },
  };

  return (
    <GlobalContext.Provider value={{ ...context }}>
      {children}
    </GlobalContext.Provider>
  );
}
