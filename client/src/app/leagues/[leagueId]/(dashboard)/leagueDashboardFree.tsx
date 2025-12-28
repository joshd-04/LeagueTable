'use client';
import useAccount from '@/hooks/useAccount';
import { League } from '@/util/definitions';
import { useEffect, useState } from 'react';
import Upgrade from './(dashboardWidgets)/upgrade';

import SeasonSummaryStats from './(dashboardWidgets)/seasonSummaryStats';
import Heading1 from '@/components/text/Heading1';

import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import LeagueBanner from '@/components/leagueBanner/LeagueBanner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import TableWidget from './(dashboardWidgets)/table';
import Controls from './(dashboardWidgets)/controls';
import LatestResults from './(dashboardWidgets)/latestResults';
import NextFixtures from './(dashboardWidgets)/nextFixtures';
import Stats from './(dashboardWidgets)/stats';
import { useParams } from 'next/navigation';
import LeagueDashboardSkeleton from './(dashboardWidgets)/dashboardSkeleton';
import LeagueDetailsRibbon from './(dashboardWidgets)/leagueDetailsRibbon';

// We need to check if user owns this league before it gets rendered. new api endpoint?
export default function LeagueDashboardFree() {
  const { user, isLoggedIn } = useAccount();
  const [league, setLeague] = useState<League | undefined>(undefined);
  const [divisionViewing, setDivisionViewing] = useState(1);

  const { leagueId } = useParams();
  const queryClient = useQueryClient();

  const { data: leagueQueryData, isLoading: leagueQueryIsLoading } = useQuery({
    queryFn: () =>
      fetchAPI(`${API_URL}/leagues/${leagueId}?x=67`, {
        method: 'GET',
        credentials: 'include',
      }),
    queryKey: ['league', leagueId],
  });

  useEffect(() => {
    console.log('MASON MOUNT');
  }, []);

  useEffect(() => {
    if (leagueQueryData !== undefined && !leagueQueryIsLoading) {
      setLeague(leagueQueryData.data.league);
    }
  }, [leagueQueryData, leagueQueryIsLoading]);

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
  if (leagueQueryIsLoading) {
    return <LeagueDashboardSkeleton />;
  }

  if (league === undefined) {
    return <div>League is undefined (x005)</div>;
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

      <div className="flex flex-col gap-5 mx-5 mb-5">
        <LeagueDetailsRibbon league={league} />
        <div className="w-full grid grid-cols-4 grid-rows-[repeat(3,min-content)]  gap-5">
          <Upgrade league={league} />
          <LatestResults league={league} />
          <NextFixtures
            league={league}
            userOwnsThisLeague={userOwnsThisLeague}
            invalidateDashboardQueries={invalidateDashboardQueries}
          />
          {userOwnsThisLeague ? (
            <Controls
              league={league}
              invalidateDashboardQueries={invalidateDashboardQueries}
            />
          ) : (
            <SeasonSummaryStats league={league} />
          )}
          {/* <NewsFeed /> */}
          <div></div>
          <TableWidget
            key={league._id}
            league={league}
            divisionViewing={divisionViewing}
            setDivisionViewing={setDivisionViewing}
            userOwnsThisLeague={userOwnsThisLeague}
          />
          <Stats league={league} divisionViewing={divisionViewing} />
          {/* <SeasonRewind /> */}
          <div></div>
        </div>
      </div>
    </div>
  );
}
