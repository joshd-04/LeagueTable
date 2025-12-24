'use client';
import useAccount from '@/hooks/useAccount';
import { League } from '@/util/definitions';
import { useEffect, useState } from 'react';

import SeasonSummaryStats from './(dashboardWidgets)/seasonSummaryStats';
import NewsFeed from './(dashboardWidgets)/newsFeed';
import Heading1 from '@/components/text/Heading1';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import LeagueBanner from '@/components/leagueBanner/LeagueBanner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import TableWidget from './(dashboardWidgets)/table';
import Announcement from './(dashboardWidgets)/announcement';
import Controls from './(dashboardWidgets)/controls';
import LatestResults from './(dashboardWidgets)/latestResults';
import NextFixtures from './(dashboardWidgets)/nextFixtures';
import SeasonRewind from './(dashboardWidgets)/seasonRewind';
import Stats from './(dashboardWidgets)/stats';
import { useParams } from 'next/navigation';
import LeagueDetailsRibbon from './(dashboardWidgets)/leagueDetailsRibbon';
import LeagueDashboardSkeleton from './(dashboardWidgets)/dashboardSkeleton';
import { useScrollbarMargin } from '@/hooks/useScrollbarMargin';

// We need to check if user owns this league before it gets rendered. new api endpoint?
export default function LeagueDashboardStandard() {
  const { user, isLoggedIn } = useAccount();
  const [league, setLeague] = useState<League | undefined>(undefined);
  const [divisionViewing, setDivisionViewing] = useState(1);
  const [seasonViewing, setSeasonViewing] = useState(-1);

  const { leagueId } = useParams();
  const queryClient = useQueryClient();

  const { data: leagueQueryData, isLoading: leagueQueryIsLoading } = useQuery({
    queryFn: () =>
      fetchAPI(`${API_URL}/leagues/${leagueId}`, {
        method: 'GET',
        credentials: 'include',
      }),
    queryKey: ['league', leagueId],
  });

  useEffect(() => {
    if (leagueQueryData !== undefined && !leagueQueryIsLoading) {
      setLeague(leagueQueryData.data.league);
    }
  }, [leagueQueryData, leagueQueryIsLoading]);

  useEffect(() => {
    // This runs only on the first fetch
    if (!leagueQueryIsLoading && !!league) {
      setSeasonViewing(league.currentSeason);
    }
  }, [league, leagueQueryIsLoading]);

  function invalidateDashboardQueries() {
    queryClient.invalidateQueries({ queryKey: ['league', leagueId] });
    queryClient.invalidateQueries({ queryKey: ['fixtures'] });
    queryClient.invalidateQueries({ queryKey: ['results'] });
    queryClient.invalidateQueries({ queryKey: ['stats'] });
    queryClient.invalidateQueries({
      queryKey: ['seasonSummaryStats'],
    });
    queryClient.invalidateQueries({ queryKey: ['table'] });
  }

  const mr = useScrollbarMargin(20);
  if (leagueQueryIsLoading) {
    return <LeagueDashboardSkeleton />;
  }

  if (league === undefined) {
    return <div>League is undefined (x001)</div>;
  }
  if (seasonViewing === -1) {
    return <div>Seasonviewing is minus one (x003)</div>;
  }

  let userOwnsThisLeague = false;
  if (isLoggedIn && user !== undefined && user !== null) {
    if (user.id === league.leagueOwner._id) {
      userOwnsThisLeague = true;
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <LeagueBanner leagueLevel={league.leagueLevel}>
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
      <div
        className="flex flex-col gap-5 mx-[20px] mb-5"
        style={{ marginRight: `${mr}px` }}
      >
        <LeagueDetailsRibbon league={league} />
        <div className="w-full grid grid-cols-4 grid-rows-[repeat(3,min-content)]  gap-5 ">
          <Announcement
            league={league}
            userOwnsThisLeague={userOwnsThisLeague}
          />
          <LatestResults league={league} seasonViewing={seasonViewing} />
          <NextFixtures
            league={league}
            userOwnsThisLeague={userOwnsThisLeague}
            seasonViewing={seasonViewing}
            invalidateDashboardQueries={invalidateDashboardQueries}
          />

          {userOwnsThisLeague && seasonViewing === league.currentSeason ? (
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
            key={league._id}
            league={league}
            seasonViewing={seasonViewing}
            divisionViewing={divisionViewing}
            setDivisionViewing={setDivisionViewing}
            userOwnsThisLeague={userOwnsThisLeague}
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
    </div>
  );
}
