'use client';
import GlobalContextProvider from '@/context/GlobalContextProvider';
import TanstackQueryContextProvider from '@/context/TanstackQueryContextProvider';

import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export default function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // ✅ Wait until after hydration to render anything theme-dependent
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
    >
      <HeroUIProvider navigate={router.push}>
        <TanstackQueryContextProvider>
          <GlobalContextProvider>
            <ToastProvider />
            {children}
          </GlobalContextProvider>
        </TanstackQueryContextProvider>
      </HeroUIProvider>
    </NextThemesProvider>
  );
}
