// app/leagues/[leagueId]/page.tsx
import { fetchAPI } from '@/util/api';
import { API_URL, WEBSITE_NAME } from '@/util/config';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import SetupIncomplete from '../setupIncomplete';
import LeagueDashboardFree from './leagueDashboardFree';
import LeagueDashboardStandard from './leagueDashboardStandard';
import { League } from '@/util/definitions';
import { Metadata } from 'next';

// Helper to reduce duplication
async function fetchLeagueAndUser(leagueId: string) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const [leagueRes, userRes] = await Promise.allSettled([
    fetchAPI(`${API_URL}/leagues/${leagueId}`, {
      method: 'GET',
      headers: { Cookie: cookieHeader },
      cache: 'no-store',
    }),
    fetchAPI(`${API_URL}/me`, {
      method: 'GET',
      headers: { Cookie: cookieHeader },
      cache: 'no-store',
    }),
  ]);

  return { leagueRes, userRes, cookieHeader };
}

// ──────────────────────────────────────────────────
// generateMetadata – now safe from crashes
// ──────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { leagueId: string };
}): Promise<Metadata> {
  const { leagueId } = await params;

  try {
    const { leagueRes, userRes } = await fetchLeagueAndUser(leagueId);

    // If league fetch failed entirely → 404
    if (leagueRes.status === 'rejected') {
      return { title: 'League Not Found' };
    }

    const leagueResponse = leagueRes.value;

    // API returned 404 or similar
    if (
      leagueResponse.status === 'error' ||
      leagueResponse.statusCode === 404
    ) {
      return { title: 'League Not Found' };
    }

    const league: League = leagueResponse.data.league;

    // Handle 403 (setup incomplete)
    if (leagueResponse.statusCode === 403) {
      return {
        title: `Setup incomplete • ${league.name} • ${WEBSITE_NAME}`,
      };
    }

    // Default public view
    let title = `${league.name} • ${WEBSITE_NAME}`;
    let description = `View fixtures, results, tables & more for ${league.name} created by ${league.leagueOwner.username}`;

    // If user is logged in, personalize
    if (userRes.status === 'fulfilled' && userRes.value.status === 'success') {
      const user = userRes.value.data;
      if (user._id === league.leagueOwner._id) {
        title = `${league.name} • Dashboard • ${WEBSITE_NAME}`;
        description = `Manage your league ${league.name} — fixtures, results, tables and more.`;
      }
    }

    return { title, description };
  } catch {
    // Any unexpected crash → let error.tsx handle it
    return { title: 'Something went wrong' };
  }
}

// ──────────────────────────────────────────────────
// Main page – now 100% safe
// ──────────────────────────────────────────────────
export default async function Page({
  params,
}: {
  params: { leagueId: string };
}) {
  const { leagueId } = await params;

  let leagueResponse;
  try {
    const cookieStore = await cookies();
    leagueResponse = await fetchAPI(`${API_URL}/leagues/${leagueId}`, {
      method: 'GET',
      headers: { Cookie: cookieStore.toString() },
      cache: 'no-store',
    });
  } catch (error) {
    // Network down, timeout, DNS, etc. → trigger error.tsx
    throw error; // This is CRUCIAL — re-throw so error boundary catches it
  }

  // 404 → trigger your nice not-found.tsx
  if (
    !leagueResponse ||
    leagueResponse.status === 'error' ||
    leagueResponse.statusCode === 404
  ) {
    notFound();
  }

  // 403 → setup incomplete page
  if (leagueResponse.statusCode === 403) {
    return (
      <SetupIncomplete
        leagueId={leagueId}
        leagueName={leagueResponse.data.league.name}
        leagueOwner={leagueResponse.data.league.leagueOwner}
        property={leagueResponse.data.property}
      />
    );
  }

  // Auth failed or not logged in → redirect to home (public view)
  if (leagueResponse.status !== 'success') {
    redirect('/');
  }

  const league: League = leagueResponse.data.league;

  // Render correct dashboard
  if (league.leagueLevel === 'pro' || league.leagueLevel === 'pro+') {
    return <LeagueDashboardStandard />;
  }

  return <LeagueDashboardFree />;
}
