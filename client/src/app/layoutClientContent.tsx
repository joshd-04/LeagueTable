'use client';

import Footer from '@/components/footer/Footer';
import LoadingPage from '@/components/loadingPage/LoadingPage';
import NavBar from '@/components/navbar/NavBar';
import useAccount from '@/hooks/useAccount';

export default function LayoutClientContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isUserFetchLoading } = useAccount();

  return (
    <>
      <div className="min-h-[100vh]  ">
        <NavBar />
        {isUserFetchLoading ? <LoadingPage /> : children}
      </div>
      <Footer />
    </>
  );
}
