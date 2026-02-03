'use client';
import useAccount from '@/hooks/useAccount';
import { League } from '@/util/definitions';
import { useEffect, useState } from 'react';

import SeasonSummaryStats from './(dashboardWidgets)/seasonSummaryStats';
import Heading1 from '@/components/text/Heading1';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import LeagueBanner from '@/components/leagueBanner/LeagueBanner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import TableWidget from './(dashboardWidgets)/table';
import Announcement from './(dashboardWidgets)/announcement';
import Controls from './(dashboardWidgets)/controls';
import LatestResults from './(dashboardWidgets)/latestResults';
import NextFixtures from './(dashboardWidgets)/nextFixtures';
import SeasonRewind from './(dashboardWidgets)/seasonRewind';
import Stats from './(dashboardWidgets)/stats';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import LeagueDetailsRibbon from './(dashboardWidgets)/leagueDetailsRibbon';
import LeagueDashboardSkeleton from './(dashboardWidgets)/dashboardSkeleton';
import { useScrollbarMargin } from '@/hooks/useScrollbarMargin';
import {
  doesUserOwnThisLeague,
  meetsMinimumTierLevel,
  shouldGrantAccessToFeature,
} from '@/util/helpers';
import Upgrade from './(dashboardWidgets)/upgrade';
import ViewingOldSeasonAlert from '@/components/alerts/viewingOldSeason';
import EngagementStats from './(dashboardWidgets)/engagementStats';

interface featuresAvailable {
  announcement: boolean;
  seasonRewind: boolean;
  leaguePopularity: boolean;
  // newsFeed: boolean;
}

// We need to check if user owns this league before it gets rendered. new api endpoint?
export default function LeagueDashboard() {
  const { user, isLoggedIn } = useAccount();
  const [league, setLeague] = useState<League | undefined>(undefined);
  const [divisionViewing, setDivisionViewing] = useState(1);

  const [seasonViewing, setSeasonViewing] = useState(-1);
  const [oldSeasonAlertVisible, setOldSeasonAlertVisible] = useState(false);

  const { leagueId } = useParams();
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();

  const { data: leagueQueryData, isLoading: leagueQueryIsLoading } = useQuery({
    queryFn: () =>
      fetchAPI(`${API_URL}/leagues/${leagueId}`, {
        method: 'GET',
        credentials: 'include',
      }),
    queryKey: ['league', leagueId],
  });

  const { mutateAsync: addViewMutation } = useMutation({
    mutationFn: () =>
      fetchAPI(`${API_URL}/leagues/${leagueId}/view`, {
        method: 'POST',
        credentials: 'include',
      }),
    mutationKey: ['league-view', leagueId],
  });

  useEffect(() => {
    setTimeout(async () => {
      await addViewMutation();
    }, 3000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (leagueQueryData !== undefined && !leagueQueryIsLoading) {
      setLeague(leagueQueryData.data.league);
    }
  }, [leagueQueryData, leagueQueryIsLoading]);

  // This effect handles fetching the season value from the URL
  useEffect(() => {
    // This runs only on the first fetch
    if (!leagueQueryIsLoading && !!league) {
      const params = new URLSearchParams(searchParams.toString());

      const seasonParam = params.get('season');
      const seasonParamGiven = seasonParam !== null;
      const seasonParamIsNumber = !Number.isNaN(seasonParam);
      const seasonParamInValidRange =
        seasonParam &&
        +seasonParam >= 1 &&
        +seasonParam <= league.currentSeason;

      const allowSeasonRewind = shouldGrantAccessToFeature(
        'pro',
        league.leagueLevel,
        league.leagueOwner.accountType,
      );

      if (
        seasonParamGiven &&
        allowSeasonRewind &&
        seasonParamIsNumber &&
        seasonParamInValidRange
      ) {
        try {
          setSeasonViewing(Number(seasonParam));
          if (+seasonParam !== league.currentSeason) {
            setOldSeasonAlertVisible(true);
          }
        } catch {
          setSeasonViewing(league.currentSeason);
        }
      } else {
        setSeasonViewing(league.currentSeason);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [league, leagueQueryIsLoading]);

  // This effect handles setting query parameter 'season' e.g. ?season=2
  useEffect(() => {
    if (!league) return;

    // Handle Old Season Alert visibility
    if (seasonViewing === league.currentSeason) {
      setOldSeasonAlertVisible(false);
    }

    // Handle URL Search Param
    const params = new URLSearchParams(searchParams.toString());
    const allowSeasonRewind = shouldGrantAccessToFeature(
      'pro',
      league.leagueLevel,
      league.leagueOwner.accountType,
    );

    // If league doesn't have season rewind, clear the season param
    if (!allowSeasonRewind) {
      params.delete('season');
    } else if (seasonViewing !== league.currentSeason) {
      params.set('season', String(seasonViewing));
    } else {
      params.delete('season');
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seasonViewing]);

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

  const userOwnsThisLeague = doesUserOwnThisLeague(league, user, isLoggedIn);

  const features: featuresAvailable = {
    announcement: meetsMinimumTierLevel('pro', league.leagueLevel),
    seasonRewind: meetsMinimumTierLevel('pro', league.leagueLevel),
    leaguePopularity: meetsMinimumTierLevel('pro', league.leagueLevel),
    // newsFeed: meetsMinimumTierLevel('pro', league.leagueLevel),
  };

  return (
    <div className="flex flex-col gap-5">
      <ViewingOldSeasonAlert
        seasonViewing={seasonViewing}
        setSeasonViewing={setSeasonViewing}
        oldSeasonAlertVisible={oldSeasonAlertVisible}
        setOldSeasonAlertVisible={setOldSeasonAlertVisible}
        league={league}
      />
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
        className="flex flex-col gap-5 mx-5 mb-5"
        style={{ marginRight: `${mr}px` }}
      >
        <LeagueDetailsRibbon league={league} />
        <div className="w-full grid grid-cols-4 grid-rows-[repeat(3,min-content)] gap-5 ">
          {features.announcement ? (
            <Announcement
              league={league}
              userOwnsThisLeague={userOwnsThisLeague}
            />
          ) : (
            <Upgrade league={league} />
          )}
          <LatestResults
            league={league}
            seasonViewing={features.seasonRewind ? seasonViewing : undefined}
          />
          <NextFixtures
            league={league}
            userOwnsThisLeague={userOwnsThisLeague}
            seasonViewing={features.seasonRewind ? seasonViewing : undefined}
            invalidateDashboardQueries={invalidateDashboardQueries}
          />

          {userOwnsThisLeague && seasonViewing === league.currentSeason ? (
            <Controls
              league={league}
              invalidateDashboardQueries={invalidateDashboardQueries}
              setSeasonViewing={setSeasonViewing}
            />
          ) : (
            <SeasonSummaryStats
              league={league}
              seasonViewing={features.seasonRewind ? seasonViewing : undefined}
            />
          )}
          {/* {features.newsFeed ? <NewsFeed /> : <div></div>} */}
          {features.seasonRewind ? (
            <SeasonRewind
              league={league}
              seasonViewing={seasonViewing}
              setSeasonViewing={setSeasonViewing}
            />
          ) : (
            <div></div>
          )}
          <TableWidget
            key={league._id}
            league={league}
            seasonViewing={features.seasonRewind ? seasonViewing : undefined}
            divisionViewing={divisionViewing}
            setDivisionViewing={setDivisionViewing}
            userOwnsThisLeague={userOwnsThisLeague}
          />
          <Stats
            league={league}
            seasonViewing={features.seasonRewind ? seasonViewing : undefined}
            divisionViewing={divisionViewing}
          />
          {features.leaguePopularity ? (
            <EngagementStats league={league} />
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}
