'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

/**
 * NavigationSync handles auth revalidation on client-side navigations.
 *
 * This component:
 * 1. Detects ALL client-side navigation (forward, back, links)
 * 2. Invalidates the auth query to trigger a fresh /me check
 * 3. Handles browser back/forward cache restoration
 * 4. Runs on every route change automatically
 */
export default function NavigationSync() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip invalidation on first render (SSR → hydration)
    // The initial render already has server-fetched auth state
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // On every subsequent navigation, invalidate auth
    console.log('[NavigationSync] Route changed, invalidating auth');
    queryClient.invalidateQueries({ queryKey: ['account-fetch'] });
  }, [pathname, searchParams, queryClient]);

  // Handle browser back/forward button + BFCache restoration
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      // persisted = true means page loaded from BFCache
      if (event.persisted) {
        console.log(
          '[NavigationSync] BFCache restore detected, invalidating auth'
        );
        queryClient.invalidateQueries({ queryKey: ['account-fetch'] });
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, [queryClient]);

  // Handle window focus (optional: detect session expiry during idle)
  useEffect(() => {
    const handleFocus = () => {
      const data = queryClient.getQueryData(['account-fetch']);
      const state = queryClient.getQueryState(['account-fetch']);

      // Only refetch if data is stale or missing
      if (
        !data ||
        (state && Date.now() - state.dataUpdatedAt > 5 * 60 * 1000)
      ) {
        console.log('[NavigationSync] Window focused, revalidating stale auth');
        queryClient.invalidateQueries({ queryKey: ['account-fetch'] });
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [queryClient]);

  return null; // This component renders nothing
}
