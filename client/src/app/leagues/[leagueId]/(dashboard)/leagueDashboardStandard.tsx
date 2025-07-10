'use client';
import PersonSVG from '@/assets/svg components/Person';
import Paragraph from '@/components/text/Paragraph';
import { GlobalContext } from '@/context/GlobalContextProvider';
import useAccount from '@/hooks/useAccount';
import {
  Fixture,
  League,
  Result,
  SeasonStats,
  SeasonSummaryStatsInterface,
  Team,
} from '@/util/definitions';
import { useContext, useState } from 'react';
import Announcement from './(dashboardWidgets)/announcement';
import LatestResults from './(dashboardWidgets)/latestResults';
import NextFixtures from './(dashboardWidgets)/nextFixtures';
import Controls from './(dashboardWidgets)/controls';
import SeasonSummaryStats from './(dashboardWidgets)/seasonSummaryStats';
import NewsFeed from './(dashboardWidgets)/newsFeed';
import SeasonRewind from './(dashboardWidgets)/seasonRewind';
import TableWidget from './(dashboardWidgets)/table';
import Stats from './(dashboardWidgets)/stats';
import Heading1 from '@/components/text/Heading1';
import FixtureToResult from '@/components/fixtureToResult/FixtureToResult';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import LeagueBanner from '@/components/leagueBanner/LeagueBanner';

interface widgetDataInterface {
  fixtures: Fixture[];
  results: Result[];
  seasonSummaryStats: SeasonSummaryStatsInterface;
  seasonStats: SeasonStats;
  teams: Team[];
}

// We need to check if user owns this league before it gets rendered. new api endpoint?
export default function LeagueDashboardStandard({
  league,
  widgetData,
}: {
  league: League;
  widgetData: widgetDataInterface;
}) {
  const context = useContext(GlobalContext);
  const { user } = context.account;
  const { isLoggedIn } = useAccount();
  const [divisionViewing] = useState(1);
  // The user can inspect element and change this value, so we need to render a completely different dashboard component for free and paid leagues
  // const [seasonViewing, setSeasonViewing] = useState(league.currentSeason);

  // Will store the string of the fixture to be turned into a result, otherwise null
  const [showFixtureToResult, setShowFixtureToResult] =
    useState<Fixture | null>(null);

  const [dashboardData, setDashboardData] = useState(widgetData);

  let userOwnsThisLeague = false;
  if (isLoggedIn && user !== undefined && user !== null) {
    if (user.id === league.leagueOwner._id) {
      userOwnsThisLeague = true;
    }
  }

  const teamsCount = league.tables.reduce((acc, cur) => {
    return acc + cur.numberOfTeams;
  }, 0);

  async function fetchLatestData() {
    const [fixtures, results, seasonSummaryStats, stats, teams] =
      await Promise.all([
        fetchAPI(`${API_URL}/leagues/${league._id}/fixtures?limit=3`, {
          method: 'GET',
        }),
        fetchAPI(`${API_URL}/leagues/${league._id}/results?limit=3`, {
          method: 'GET',
        }),
        fetchAPI(`${API_URL}/leagues/${league._id}/season-summary-stats`, {
          method: 'GET',
        }),
        fetchAPI(`${API_URL}/leagues/${league._id}/stats`, {
          method: 'GET',
        }),
        fetchAPI(`${API_URL}/leagues/${league._id}/teams?division=1`, {
          method: 'GET',
        }),
      ]);
    const newWidgetData = {
      fixtures: fixtures.data.fixtures as Fixture[],
      results: results.data.results as Result[],
      seasonSummaryStats: seasonSummaryStats.data
        .seasonSummaryStats as SeasonSummaryStatsInterface,
      seasonStats: stats.data.stats as SeasonStats,
      teams: teams.data.teams as Team[],
    };
    setDashboardData(newWidgetData);
  }

  return (
    <div className="flex flex-col gap-[20px]">
      <LeagueBanner league={league}>
        <Heading1
          style={{
            position: 'absolute',
            bottom: '0',
            left: '50%',
            translate: '-50%',
          }}
        >
          {league.name}
        </Heading1>
      </LeagueBanner>
      <div className="flex flex-col gap-[20px] mx-[20px]">
        <div className="flex flex-row justify-center items-center gap-[50px]">
          <Paragraph>
            <PersonSVG className="w-[24px] h-[24px] fill-[var(--text)] inline-block align-text-top" />
            {league.leagueOwner.username === user?.username
              ? 'You'
              : league.leagueOwner.username}
          </Paragraph>
          <Paragraph>
            {league.divisionsCount} division
            {league.divisionsCount === 1 ? '' : 's'}
          </Paragraph>
          <Paragraph>
            {teamsCount} team
            {teamsCount === 1 ? '' : 's'}
          </Paragraph>
          <Paragraph>
            Season {league.currentSeason} Matchweek {league.currentMatchweek}
          </Paragraph>
        </div>
        <div className="w-full grid grid-cols-4 grid-rows-[repeat(3,min-content)]  gap-[20px]">
          <Announcement />
          <LatestResults results={dashboardData.results} />
          <NextFixtures
            userOwnsThisLeague={userOwnsThisLeague}
            fixtures={dashboardData.fixtures}
            setShowFixtureToResult={setShowFixtureToResult}
          />

          {userOwnsThisLeague ? (
            <Controls league={league} fetchLatestData={fetchLatestData} />
          ) : (
            <SeasonSummaryStats stats={dashboardData.seasonSummaryStats} />
          )}
          <NewsFeed />
          <TableWidget teams={dashboardData.teams} />
          <Stats
            leagueType={league.leagueType}
            divisionViewing={divisionViewing}
            stats={dashboardData.seasonStats}
          />
          <SeasonRewind />
        </div>
      </div>
      {showFixtureToResult !== null && (
        <FixtureToResult
          leagueType={league.leagueType}
          fixtureObj={showFixtureToResult}
          setShowFixtureToResult={setShowFixtureToResult}
          fetchLatestData={fetchLatestData}
        />
      )}
    </div>
  );
}
