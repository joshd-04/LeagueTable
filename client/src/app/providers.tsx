'use client';
import GlobalContextProvider from '@/context/GlobalContextProvider';
import { NotificationContextProvider } from '@/context/NotificationContextProvider';
import TanstackQueryContextProvider from '@/context/TanstackQueryContextProvider';
import { User } from '@/util/definitions';
import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export default function Providers({
  initialUser,
  initialError,
  children,
}: {
  initialUser: User | null | undefined;
  initialError: string;
  children: ReactNode;
}) {
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
          <GlobalContextProvider
            initialUser={initialUser}
            initialError={initialError}
          >
            <NotificationContextProvider>
              <ToastProvider />
              {children}
            </NotificationContextProvider>
          </GlobalContextProvider>
        </TanstackQueryContextProvider>
      </HeroUIProvider>
    </NextThemesProvider>
  );
}
