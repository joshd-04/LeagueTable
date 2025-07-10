// this is the data fetcher.

import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AddTeams from './addTeams';

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

  if (response.statusCode === 403 && response.data.property === 'teams') {
    const divisions = response.data.league.tables.map(
      (table: { division: number; name: string; numberOfTeams: number }) => {
        return {
          divisionNumber: table.division,
          name: table.name,
          numberOfTeams: table.numberOfTeams,
        };
      }
    );
    return (
      <AddTeams
        divisions={divisions}
        leagueName={response.data.league.name}
        leagueId={leagueId}
      />
    );
  }

  return redirect('/');
}
