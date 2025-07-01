// this is the data fetcher.

import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { cookies } from 'next/headers';
import AddTables from './addTables';
import { redirect } from 'next/navigation';

// @ts-expect-error idk
export default async function Page({ params }) {
  const cookieStore = await cookies();
  if (!cookieStore.has('token')) return redirect('/login');
  const { leagueId }: { leagueId: string } = await params;
  const response = await fetchAPI(`${API_URL}/leagues/${leagueId}`, {
    method: 'GET',
    headers: {
      Cookie: cookieStore.toString(), // pass request cookies
    },
    cache: 'no-store', // optional: prevent caching
  });

  if (response.status === 'success') return redirect(`/leagues/${leagueId}`);

  if (response.statusCode === 403 && response.data.property === 'tables') {
    return (
      <AddTables
        divisionsCount={response.data.league.divisionsCount}
        leagueName={response.data.league.name}
        leagueId={leagueId}
      />
    );
  }

  return redirect('/login');
}
