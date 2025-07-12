import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { cookies } from 'next/headers';
import SetupIncomplete from '../setupIncomplete';
import LeagueDashboardFree from './leagueDashboardFree';
import LeagueDashboardStandard from './leagueDashboardStandard';

import {
  Fixture,
  League,
  Result,
  SeasonStats,
  SeasonSummaryStatsInterface,
  Team,
} from '@/util/definitions';
import { redirect } from 'next/navigation';

// This is the league fetcher
// @ts-expect-error idk
export default async function Page({ params }) {
  const cookieStore = await cookies();
  const { leagueId } = await params;

  const response = await fetchAPI(`${API_URL}/leagues/${leagueId}`, {
    method: 'GET',
    headers: {
      Cookie: cookieStore.toString(), // pass request cookies
    },
    cache: 'no-store', // optional: prevent caching
  });

  if (response.statusCode === 403) {
    return (
      <SetupIncomplete
        leagueId={leagueId}
        leagueName={response.data.league.name}
        leagueOwner={response.data.league.leagueOwner}
        property={response.data.property} // the missing property causing the request to fail
      />
    );
  }

  if (response.status === 'success') {
    const league: League = response.data.league;

    if (league.leagueLevel === 'standard') {
      // paid features
      const [fixtures, results, seasonSummaryStats, stats, teams] =
        await Promise.all([
          fetchAPI(`${API_URL}/leagues/${leagueId}/fixtures?limit=3`, {
            method: 'GET',
          }),
          fetchAPI(`${API_URL}/leagues/${leagueId}/results?limit=3`, {
            method: 'GET',
          }),
          fetchAPI(`${API_URL}/leagues/${leagueId}/season-summary-stats`, {
            method: 'GET',
          }),
          fetchAPI(`${API_URL}/leagues/${leagueId}/stats`, {
            method: 'GET',
          }),
          fetchAPI(`${API_URL}/leagues/${leagueId}/teams?division=1`, {
            method: 'GET',
          }),
        ]);
      const widgetData = {
        league: league,
        fixtures: {
          totalFixtures: fixtures.data.totalFixtures,
          fixturesReturned: fixtures.data.fixturesReturned,
          fixtures: fixtures.data.fixtures as Fixture[],
        },
        results: results.data.results as Result[],
        seasonSummaryStats: seasonSummaryStats.data
          .seasonSummaryStats as SeasonSummaryStatsInterface,
        seasonStats: stats.data.stats as SeasonStats,
        teams: teams.data.teams as Team[],
      };

      return <LeagueDashboardStandard widgetData={widgetData} />;
    } else {
      // free
      const [fixtures, results, seasonSummaryStats, stats, teams] =
        await Promise.all([
          fetchAPI(`${API_URL}/leagues/${leagueId}/fixtures?limit=3`, {
            method: 'GET',
          }),
          fetchAPI(`${API_URL}/leagues/${leagueId}/results?limit=3`, {
            method: 'GET',
          }),
          fetchAPI(`${API_URL}/leagues/${leagueId}/season-summary-stats`, {
            method: 'GET',
          }),
          fetchAPI(`${API_URL}/leagues/${leagueId}/stats`, {
            method: 'GET',
          }),
          fetchAPI(`${API_URL}/leagues/${leagueId}/teams?division=1`, {
            method: 'GET',
          }),
        ]);
      const widgetData = {
        league: league,
        fixtures: {
          totalFixtures: fixtures.data.totalFixtures as number,
          fixturesReturned: fixtures.data.fixturesReturned as number,
          fixtures: fixtures.data.fixtures as Fixture[],
        },
        results: results.data.results as Result[],
        seasonSummaryStats: seasonSummaryStats.data
          .seasonSummaryStats as SeasonSummaryStatsInterface,
        seasonStats: stats.data.stats as SeasonStats,
        teams: teams.data.teams as Team[],
      };

      return <LeagueDashboardFree widgetData={widgetData} />;
    }
  } else {
    return redirect('/');
  }
}
