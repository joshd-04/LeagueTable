'use client';
import GlobalContextProvider from '@/context/GlobalContextProvider';
import { NotificationContextProvider } from '@/context/NotificationContextProvider';
import TanstackQueryContextProvider from '@/context/TanstackQueryContextProvider';
import { User } from '@/util/definitions';
import { HeroUIProvider } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export default function Provider({
  initialUser,
  initialError,
  children,
}: {
  initialUser: User | null | undefined;
  initialError: string;
  children: ReactNode;
}) {
  const router = useRouter();

  return (
    <NextThemesProvider attribute="class" defaultTheme="system">
      <HeroUIProvider navigate={router.push}>
        <TanstackQueryContextProvider>
          <GlobalContextProvider
            initialUser={initialUser}
            initialError={initialError}
          >
            <NotificationContextProvider>
              {children}
            </NotificationContextProvider>
          </GlobalContextProvider>
        </TanstackQueryContextProvider>
      </HeroUIProvider>
    </NextThemesProvider>
  );
}
