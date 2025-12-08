import { cookies } from 'next/headers';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import ClientPageContent from './clientPageContent';

/**
 * Server Component - Handles routing decision ONLY.
 *
 * This does ONE /me check on initial page load to decide:
 * - Should we render the authenticated app?
 * - Or redirect/show landing page?
 *
 * After this, the CLIENT handles all auth state via TanStack Query.
 */
export default async function Home() {
  const cookieStore = await cookies();
  const response = await fetchAPI(`${API_URL}/me`, {
    method: 'GET',
    headers: {
      Cookie: cookieStore.toString(),
    },
    cache: 'no-store',
  });

  const isLoggedIn = response.status === 'success' && response.data.user?._id;

  // Pass initial auth state to client
  // Client will immediately sync this with TanStack Query
  return <ClientPageContent initialIsLoggedIn={isLoggedIn} />;
}
