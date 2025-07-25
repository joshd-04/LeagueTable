import type { Metadata } from 'next';
import { Instrument_Sans, Inter, Roboto } from 'next/font/google';
import './globals.css';
import { NavBar } from '@/components/navbar/NavBar';
import GlobalContextProvider from '@/context/GlobalContextProvider';
import ErrorMessage from '@/components/errorMessage/ErrorMessage';
import Footer from '@/components/footer/Footer';
import { cookies } from 'next/headers';
import { API_URL, WEBSITE_NAME } from '@/util/config';
import { fetchAPI } from '@/util/api';
import { User } from '@/util/definitions';
import TanstackQueryContextProvider from '@/context/TanstackQueryContextProvider';
import { NotificationContextProvider } from '@/context/NotificationContextProvider';

const instrumentSans = Instrument_Sans({
  variable: '--font-instrument-sans',
  subsets: ['latin'],
});
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});
const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
});

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const response = await fetchAPI(`${API_URL}/me`, {
    method: 'GET',
    headers: {
      Cookie: cookieStore.toString(), // pass request cookies
    },
    cache: 'no-store', // optional: prevent caching
  });

  if (response.status === 'success') {
    return {
      title: `Home • ${WEBSITE_NAME}`,
      description: `Your home page where you can view your leagues and create new ones.`,
    };
  } else {
    return {
      title: `${WEBSITE_NAME}`,
      description: `A simple to use, modern and sleek League/Table/Championship management website. Create & share your league with friends for free - ${WEBSITE_NAME}`,
    };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const response = await fetchAPI(`${API_URL}/me`, {
    method: 'GET',
    headers: {
      Cookie: cookieStore.toString(), // pass request cookies
    },
    cache: 'no-store', // optional: prevent caching
  });
  let user: User | null | undefined = undefined;
  let error: string = '';
  if (response.status === 'success') {
    user = {
      id: response.data._id,
      username: response.data.username,
      email: response.data.email,
      accountType: response.data.accountType,
    };
  } else if (response.status === 'fail') {
    user = null;
  } else {
    user = null;
    error = response.message;
  }

  return (
    <html lang="en">
      <body
        className={`${instrumentSans.variable} ${inter.variable} ${roboto.variable} antialiased w-[100vw] relative transition-colors duration-250 overflow-x-clip overflow-y-auto`}
      >
        <TanstackQueryContextProvider>
          <GlobalContextProvider initialUser={user} initialError={error}>
            <NotificationContextProvider>
              <NavBar />
              {children}
              <Footer />
              <ErrorMessage />
            </NotificationContextProvider>
          </GlobalContextProvider>
        </TanstackQueryContextProvider>
      </body>
    </html>
  );
}
