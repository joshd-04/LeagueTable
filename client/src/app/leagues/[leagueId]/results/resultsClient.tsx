'use client';
import { League } from '@/util/definitions';
import Heading1 from '@/components/text/Heading1';
import LeagueBanner from '@/components/leagueBanner/LeagueBanner';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';
import { Button, Link, Select, SelectItem } from '@heroui/react';
import ResultsByMatchweek from './widgets/resultsByMatchweek';
import ResultsByMostRecent from './widgets/resultsByMostRecent';

export default function ResultsClient({ league }: { league: League }) {
  const router = useRouter();
  const [sort, setSort] = useState<'matchweek' | 'most recent'>('matchweek');

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
      <DetailsRibbon league={league} sort={sort} setSort={setSort} />
      <div className="w-[50%] place-self-center">
        {sort === 'matchweek' ? (
          <ResultsByMatchweek league={league} handleClick={handleClick} />
        ) : (
          <ResultsByMostRecent league={league} handleClick={handleClick} />
        )}
      </div>
    </div>
  );
}

function DetailsRibbon({
  league,
  sort,
  setSort,
}: {
  league: League;
  sort: 'matchweek' | 'most recent';
  setSort: Dispatch<SetStateAction<'matchweek' | 'most recent'>>;
}) {
  const items = [
    { key: 'matchweek', label: 'Matchweek' },
    { key: 'most recent', label: 'Most recent' },
  ];

  return (
    <div className="flex flex-col gap-[20px] mx-[20px] items-center">
      <div className="grid grid-rows-1 grid-cols-3 place-items-center w-max">
        <p className="text-base justify-self-end">
          Season {league.currentSeason} Matchweek {league.currentMatchweek}
        </p>

        <Button as={Link} href={`/leagues/${league._id}`} variant="flat">
          {league.name}
        </Button>

        <div className="justify-self-start">
          <Select
            items={items}
            selectedKeys={[sort]}
            className="min-w-50"
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
    </div>
  );
}
