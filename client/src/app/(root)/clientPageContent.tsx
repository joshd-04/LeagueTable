'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAccount from '@/hooks/useAccount';
import LandingPage from './(landingPage)/landingPage';
import DashboardClient from './(dashboard)/dashboardClient';
/**
 * Client component that renders based on CURRENT auth state.
 *
 * This component:
 * 1. Uses the shared auth query from TanStack Query
 * 2. Shows loading state briefly if needed
 * 3. Renders correct UI based on actual auth state
 * 4. Handles redirects if auth state changes
 */
export default function ClientPageContent({
  initialIsLoggedIn,
}: {
  initialIsLoggedIn: boolean;
}) {
  const { isLoggedIn, isSignedOut, isUserFetchLoading } = useAccount();
  const router = useRouter();

  // Handle auth state changes (e.g., session expired)
  useEffect(() => {
    // If we started logged in but now we're signed out
    if (initialIsLoggedIn && isSignedOut) {
      console.log('[ClientPageContent] Session expired, user signed out');
      // Optionally redirect or show a message
      // router.push('/login');
    }

    // If we started logged out but now we're logged in
    if (!initialIsLoggedIn && isLoggedIn) {
      console.log('[ClientPageContent] User logged in');
      // Optionally refresh to get server-rendered authenticated page
      router.refresh();
    }
  }, [initialIsLoggedIn, isLoggedIn, isSignedOut, router]);

  // Show loading only on very first load if needed
  if (isUserFetchLoading && isLoggedIn === false && isSignedOut === false) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  // Render based on CURRENT auth state, not initial state
  if (isLoggedIn) {
    return <DashboardClient initialError="" />;
  } else {
    return <LandingPage />;
  }
}
