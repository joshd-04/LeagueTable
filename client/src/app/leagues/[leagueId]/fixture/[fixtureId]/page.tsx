import { cookies } from 'next/headers';
import FixtureClient from './fixtureClient';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import SetupIncomplete from '../../setupIncomplete';
import { redirect } from 'next/navigation';
import { League } from '@/util/definitions';

// @ts-expect-error idk
export default async function Page({ params }) {
  const cookieStore = await cookies();
  const { leagueId, fixtureId } = await params;

  const [league, fixture] = await Promise.all([
    fetchAPI(`${API_URL}/leagues/${leagueId}`, {
      method: 'GET',
      headers: {
        Cookie: cookieStore.toString(), // pass request cookies
      },
      cache: 'no-store', // optional: prevent caching
    }),
    fetchAPI(`${API_URL}/leagues/${leagueId}/fixtures/${fixtureId}`, {
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
  if (league.status !== 'success' || fixture.status !== 'success') {
    return redirect('/');
  }
  const l = league.data.league as League;
  return <FixtureClient league={l} fixture={fixture.data.fixture} />;
}
