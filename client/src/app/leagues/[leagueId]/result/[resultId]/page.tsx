import { cookies } from 'next/headers';
import ResultClient from './resultClient';
import { fetchAPI } from '@/util/api';
import { API_URL, WEBSITE_NAME } from '@/util/config';
import SetupIncomplete from '../../setupIncomplete';
import { redirect } from 'next/navigation';
import { League, Result } from '@/util/definitions';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { [key: string]: string };
}): Promise<Metadata> {
  const { leagueId, resultId } = params;

  const [result, league] = await Promise.all([
    fetchAPI(`${API_URL}/leagues/${leagueId}/results/${resultId}`, {
      method: 'GET',
    }),
    fetchAPI(`${API_URL}/leagues/${leagueId}`, {
      method: 'GET',
    }),
  ]);

  if (league.status !== 'success') {
    return {
      title: 'League Not Found',
    };
  }

  if (result.status !== 'success') {
    return {
      title: 'Result Not Found',
    };
  }

  const leagueObj: League = league.data.league;
  const resultObj: Result = result.data.result;
  const homeGoals = resultObj.basicOutcome.reduce(
    (acc, team) => (team === 'home' ? acc + 1 : acc),
    0
  );
  const awayGoals = resultObj.basicOutcome.reduce(
    (acc, team) => (team === 'away' ? acc + 1 : acc),
    0
  );
  const resultName = `${resultObj.homeTeamDetails.name} ${homeGoals}-${awayGoals} ${resultObj.awayTeamDetails.name}`;

  return {
    title: `${resultName} • ${leagueObj.name} • ${WEBSITE_NAME}`,
    description: `Match overview for ${resultName}`,
  };
}

// @ts-expect-error idk
export default async function Page({ params }) {
  const cookieStore = await cookies();
  const { leagueId, resultId } = await params;

  const [league, result] = await Promise.all([
    fetchAPI(`${API_URL}/leagues/${leagueId}`, {
      method: 'GET',
      headers: {
        Cookie: cookieStore.toString(), // pass request cookies
      },
      cache: 'no-store', // optional: prevent caching
    }),
    fetchAPI(`${API_URL}/leagues/${leagueId}/results/${resultId}`, {
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
  if (league.status !== 'success' || result.status !== 'success') {
    console.log(league);
    console.log(result);
    return redirect('/');
  }
  const l = league.data.league as League;
  return <ResultClient league={l} result={result.data.result} />;
}
