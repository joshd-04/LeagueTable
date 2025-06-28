import { useEffect, useState } from 'react';

export default function useColorTheme(): 'light' | 'dark' {
  const [prefersDark, setPrefersDark] = useState(false);

  useEffect(() => {
    const systemThemeIsDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    setPrefersDark(systemThemeIsDark);
  }, []);

  return prefersDark ? 'dark' : 'light';
}
