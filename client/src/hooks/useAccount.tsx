'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { User } from '@/util/definitions';

/**
 * Hook to access the current authenticated user.
 *
 * This uses TanStack Query's shared cache - all components calling
 * this hook share the SAME data and trigger only ONE network request.
 *
 * Returns:
 * - user: User object if logged in, null if logged out, undefined while loading
 * - isUserFetchLoading: true during initial fetch only
 * - isLoggedIn: true if user exists
 * - isSignedOut: true if definitely logged out (not loading)
 */
export default function useAccount() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['account-fetch'],
    queryFn: async () => {
      const response = await fetchAPI(`${API_URL}/me`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.status === 'success') {
        return {
          user: {
            id: response.data.user.id,
            username: response.data.user.username,
            email: response.data.user.email,
            accountType: response.data.user.accountType,
          } as User,
        };
      } else if (response.status === 'fail') {
        // Not logged in - this is NOT an error, it's a valid state
        return { user: null };
      } else {
        // Actual error
        throw new Error(response.message || 'Failed to fetch account');
      }
    },
    staleTime: 5 * 60 * 1000, // Consider fresh for 5 minutes
    retry: false, // Don't retry on 401/403
  });

  const user = isLoading ? undefined : data?.user ?? null;
  const isLoggedIn = user !== null && user !== undefined;
  const isSignedOut = !isLoading && user === null;

  return {
    user,
    isUserFetchLoading: isLoading,
    isLoggedIn,
    isSignedOut,
    error,
  };
}
