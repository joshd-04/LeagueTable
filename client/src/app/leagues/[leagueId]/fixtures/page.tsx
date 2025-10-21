import { cookies } from 'next/headers';
import FixturesClient from './fixturesClient';
import { fetchAPI } from '@/util/api';
import { API_URL, WEBSITE_NAME } from '@/util/config';
import { redirect } from 'next/navigation';
import { Fixture, League } from '@/util/definitions';
import SetupIncomplete from '../setupIncomplete';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { [key: string]: string };
}): Promise<Metadata> {
  const cookieStore = await cookies();
  const { leagueId } = await params;

  const league = await fetchAPI(`${API_URL}/leagues/${leagueId}`, {
    method: 'GET',
    headers: {
      Cookie: cookieStore.toString(), // pass request cookies
    },
    cache: 'no-store', // optional: prevent caching
  });

  if (league.status !== 'success') {
    return {
      title: 'League Not Found',
    };
  }

  const leagueObj: League = league.data.league;

  return {
    title: `Fixtures • ${leagueObj.name} • ${WEBSITE_NAME}`,
    description: `View all upcoming fixtures in ${leagueObj.name}`,
  };
}

// @ts-expect-error idk
export default async function Page({ params }) {
  const cookieStore = await cookies();
  const { leagueId } = await params;

  const league = await fetchAPI(`${API_URL}/leagues/${leagueId}`, {
    method: 'GET',
    headers: {
      Cookie: cookieStore.toString(), // pass request cookies
    },
    cache: 'no-store', // optional: prevent caching
  });

  console.log(league.data.league.currentMatchweek);

  const fixtures = await fetchAPI(
    `${API_URL}/leagues/${leagueId}/fixtures?matchweek=${league.data.league.currentMatchweek}`,
    {
      method: 'GET',
    }
  );

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
