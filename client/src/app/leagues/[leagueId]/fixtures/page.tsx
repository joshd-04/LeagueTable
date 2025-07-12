import { cookies } from 'next/headers';
import FixturesClient from './fixturesClient';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { redirect } from 'next/navigation';
import { Fixture, League } from '@/util/definitions';
import SetupIncomplete from '../setupIncomplete';

// @ts-expect-error idk
export default async function Page({ params }) {
  const cookieStore = await cookies();
  const { leagueId } = await params;

  const [league, fixtures] = await Promise.all([
    fetchAPI(`${API_URL}/leagues/${leagueId}`, {
      method: 'GET',
      headers: {
        Cookie: cookieStore.toString(), // pass request cookies
      },
      cache: 'no-store', // optional: prevent caching
    }),
    fetchAPI(`${API_URL}/leagues/${leagueId}/fixtures?all=true`, {
      method: 'GET',
    }),
  ]);

  if (league.statusCode === 403) {
    return (
      <SetupIncomplete
        leagueId={leagueId}
        leagueName={league.data.league.name}
        leagueOwner={league.data.league.leagueOwner}
        property={league.data.property} // the missing property causing the request to fail
      />
    );
  }
  if (league.status !== 'success' || fixtures.status !== 'success') {
    return redirect('/');
  }
  const l = league.data.league as League;
  const f = fixtures.data.fixtures as Fixture[];
  return <FixturesClient league={l} fixtures={f} />;
}
