'use client';
import PersonSVG from '@/assets/svg components/Person';
import Paragraph from '@/components/text/Paragraph';
import { GlobalContext } from '@/context/GlobalContextProvider';
import useAccount from '@/hooks/useAccount';
import { Fixture, League } from '@/util/definitions';
import { useContext, useEffect, useState } from 'react';
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
import { useQuery, useQueryClient } from '@tanstack/react-query';

// We need to check if user owns this league before it gets rendered. new api endpoint?
export default function LeagueDashboardStandard({
  initialLeague,
}: {
  initialLeague: League;
}) {
  const context = useContext(GlobalContext);

  const { user } = context.account;
  const { isLoggedIn } = useAccount();
  const [divisionViewing, setDivisionViewing] = useState(1);
  const [league, setLeague] = useState(initialLeague);

  const { data: leagueQueryData, isLoading: leagueQueryIsLoading } = useQuery({
    queryFn: () =>
      fetchAPI(`${API_URL}/leagues/${league._id}`, {
        method: 'GET',
        credentials: 'include',
      }),
    queryKey: ['league'],
  });

  useEffect(() => {
    if (leagueQueryData !== undefined && !leagueQueryIsLoading) {
      console.log(leagueQueryData);
      setLeague(leagueQueryData.data.league);
    }
  }, [leagueQueryData, leagueQueryIsLoading]);

  // Will store the string of the fixture to be turned into a result, otherwise null
  const [showFixtureToResult, setShowFixtureToResult] =
    useState<Fixture | null>(null);

  const [seasonViewing, setSeasonViewing] = useState(league.currentSeason);

  let userOwnsThisLeague = false;
  if (isLoggedIn && user !== undefined && user !== null) {
    if (user.id === league.leagueOwner._id) {
      userOwnsThisLeague = true;
    }
  }

  const teamsCount = league.tables
    .filter((table) => table.season === league.currentSeason)
    .reduce((acc, cur) => {
      return acc + cur.numberOfTeams;
    }, 0);

  const queryClient = useQueryClient();
  function invalidateDashboardQueries() {
    queryClient.invalidateQueries({ queryKey: ['league'] });
    queryClient.invalidateQueries({ queryKey: ['fixtures'] });
    queryClient.invalidateQueries({ queryKey: ['results'] });
    queryClient.invalidateQueries({ queryKey: ['stats'] });
    queryClient.invalidateQueries({ queryKey: ['seasonSummaryStats'] });
    queryClient.invalidateQueries({ queryKey: ['table'] });
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
          <Announcement
            league={league}
            userOwnsThisLeague={userOwnsThisLeague}
          />
          <LatestResults league={league} seasonViewing={seasonViewing} />
          <NextFixtures
            league={league}
            userOwnsThisLeague={userOwnsThisLeague}
            seasonViewing={seasonViewing}
            setShowFixtureToResult={setShowFixtureToResult}
          />

          {userOwnsThisLeague ? (
            <Controls
              league={league}
              invalidateDashboardQueries={invalidateDashboardQueries}
              setSeasonViewing={setSeasonViewing}
            />
          ) : (
            <SeasonSummaryStats league={league} seasonViewing={seasonViewing} />
          )}
          <NewsFeed />
          <TableWidget
            league={league}
            seasonViewing={seasonViewing}
            divisionViewing={divisionViewing}
            setDivisionViewing={setDivisionViewing}
          />
          <Stats
            league={league}
            seasonViewing={seasonViewing}
            divisionViewing={divisionViewing}
          />
          <SeasonRewind
            league={league}
            seasonViewing={seasonViewing}
            setSeasonViewing={setSeasonViewing}
          />
        </div>
      </div>
      {showFixtureToResult !== null && (
        <FixtureToResult
          leagueType={league.leagueType}
          fixtureObj={showFixtureToResult}
          setShowFixtureToResult={setShowFixtureToResult}
          invalidateDashboardQueries={invalidateDashboardQueries}
        />
      )}
    </div>
  );
}
