import type { Metadata } from 'next';
import { Instrument_Sans, Inter, Roboto } from 'next/font/google';
import './globals.css';
import Footer from '@/components/footer/Footer';
import { WEBSITE_NAME } from '@/util/config';

import Providers from './providers';
import NavBar from '@/components/navbar/NavBar';

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

export const metadata: Metadata = {
  title: `${WEBSITE_NAME}`,
  description: `A simple to use, modern and sleek League/Table/Championship management website. Create & share your league with friends for free - ${WEBSITE_NAME}`,
  icons: {
    icon: { url: '/favicon.ico', sizes: 'any' }, // classic,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="scrollbar-gutter-stable"
    >
      <body
        className={`${instrumentSans.variable} ${inter.variable} ${roboto.variable} antialiased w-[100vw] relative  duration-250 overflow-x-clip overflow-y-auto`}
      >
        <Providers>
          <NavBar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
