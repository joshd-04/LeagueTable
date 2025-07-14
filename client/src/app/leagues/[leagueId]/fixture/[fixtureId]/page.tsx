import { cookies } from 'next/headers';
import FixtureClient from './fixtureClient';
import { fetchAPI } from '@/util/api';
import { API_URL, WEBSITE_NAME } from '@/util/config';
import SetupIncomplete from '../../setupIncomplete';
import { redirect } from 'next/navigation';
import { Fixture, League } from '@/util/definitions';
import FixtureFuture from './fixtureFuture';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { [key: string]: string };
}): Promise<Metadata> {
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

  if (league.status !== 'success') {
    return {
      title: 'League Not Found',
    };
  }
  if (fixture.status !== 'success') {
    return {
      title: 'Fixture not found',
    };
  }

  const leagueObj: League = league.data.league;
  const fixtureObj: Fixture = fixture.data.fixture;

  return {
    title: `${fixtureObj.homeTeamDetails.name} v ${fixtureObj.awayTeamDetails.name} • ${leagueObj.name} • ${WEBSITE_NAME}`,
    description: `Fixture preview, stats and head to head record for ${fixtureObj.homeTeamDetails.name} v ${fixtureObj.awayTeamDetails.name}. (${leagueObj.name}, season ${fixtureObj.season} matchweek ${fixtureObj.matchweek})`,
  };
}

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
  const f = fixture.data.fixture as Fixture;
  const isFutureFixture =
    f.matchweek > l.currentMatchweek && f.season === l.currentSeason;
  if (isFutureFixture) {
    return <FixtureFuture league={l} fixture={fixture.data.fixture} />;
  }

  return <FixtureClient league={l} fixture={fixture.data.fixture} />;
}
