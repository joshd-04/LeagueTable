'use client';
import { League } from '@/util/definitions';
import Heading1 from '@/components/text/Heading1';
import LeagueBanner from '@/components/leagueBanner/LeagueBanner';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Button, Link, Select, SelectItem } from '@heroui/react';
import ResultsByMatchweek from './widgets/resultsByMatchweek';
import ResultsByMostRecent from './widgets/resultsByMostRecent';
import { shouldGrantAccessToFeature } from '@/util/helpers';

export default function ResultsClient({ league }: { league: League }) {
  const router = useRouter();
  const [sort, setSort] = useState<'matchweek' | 'most recent'>('matchweek');
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [seasonViewing, setSeasonViewing] = useState(-1);
  const [oldSeasonAlertVisible, setOldSeasonAlertVisible] = useState(false);

  // This effect handles fetching the season value from the URL
  useEffect(() => {
    // This runs only on the first fetch
    const params = new URLSearchParams(searchParams.toString());

    const seasonParam = params.get('season');
    const seasonParamGiven = seasonParam !== null;
    const seasonParamIsNumber = !Number.isNaN(seasonParam);
    const seasonParamInValidRange =
      seasonParam && +seasonParam >= 1 && +seasonParam <= league.currentSeason;

    const allowSeasonRewind = shouldGrantAccessToFeature(
      'pro',
      league.leagueLevel,
      league.leagueOwner.accountType
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      league.leagueOwner.accountType
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

  function handleClick(id: string) {
    router.push(`/leagues/${league._id}/result/${id}`);
  }

  return (
    <div className="flex flex-col gap-[20px] w-screen mb-20">
      <LeagueBanner leagueLevel={league.leagueLevel}>
        <div className="absolute bottom-0 left-[50%] translate-x-[-50%]">
          <Heading1>Results</Heading1>
        </div>
      </LeagueBanner>
      <DetailsRibbon
        league={league}
        sort={sort}
        setSort={setSort}
        seasonViewing={seasonViewing}
      />
      <div className="w-[50%] place-self-center">
        {sort === 'matchweek' ? (
          <ResultsByMatchweek league={league} handleClick={handleClick} />
        ) : (
          <ResultsByMostRecent
            league={league}
            handleClick={handleClick}
            seasonViewing={seasonViewing}
            setSeasonViewing={setSeasonViewing}
            oldSeasonAlertVisible={oldSeasonAlertVisible}
            setOldSeasonAlertVisible={setOldSeasonAlertVisible}
          />
        )}
      </div>
    </div>
  );
}

function DetailsRibbon({
  league,
  sort,
  setSort,
  seasonViewing,
}: {
  league: League;
  sort: 'matchweek' | 'most recent';
  setSort: Dispatch<SetStateAction<'matchweek' | 'most recent'>>;
  seasonViewing: number;
}) {
  const items = [
    { key: 'matchweek', label: 'Matchweek' },
    { key: 'most recent', label: 'Most recent' },
  ];

  useEffect(() => {
    const matchweekDisabled = seasonViewing !== league.currentSeason;
    if (matchweekDisabled && sort === 'matchweek') {
      setSort('most recent');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  return (
    <div className="flex flex-col gap-[20px] mx-[20px] items-center">
      <div className="grid grid-rows-1 grid-cols-3 place-items-center w-max">
        <p className="text-base justify-self-end">
          Season {league.currentSeason} Matchweek {league.currentMatchweek}
        </p>

        <Button as={Link} href={`/leagues/${league._id}`} variant="flat">
          {league.name}
        </Button>

        <Select
          items={items}
          selectedKeys={[sort]}
          disabledKeys={
            seasonViewing === league.currentSeason ? [] : ['matchweek']
          }
          className="min-w-50 justify-self-start"
          onSelectionChange={(keys) => {
            const value = [...keys][0] as 'matchweek' | 'most recent';
            setSort(value);
          }}
          disallowEmptySelection={true}
        >
          {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
        </Select>
      </div>
    </div>
  );
}
