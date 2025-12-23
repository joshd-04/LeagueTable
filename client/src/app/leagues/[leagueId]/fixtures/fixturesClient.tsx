'use client';
import { Fixture, League } from '@/util/definitions';
import Heading1 from '@/components/text/Heading1';

import LeagueBanner from '@/components/leagueBanner/LeagueBanner';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import PaginationComponent from '@/components/pagination/Pagination';
import FixtureRowFuture from './widgets/fixtureRowFuture';
import FixtureRow from './widgets/fixtureRow';
import { Button, cn, Select, SelectItem, Spinner } from '@heroui/react';
import Link from 'next/link';

export default function FixturesClient({
  league,
  fixtures,
}: {
  league: League;
  fixtures: Fixture[];
}) {
  const router = useRouter();
  // 0 means all divsions, other numbers mean that specific division only
  const [divisionFilter, setDivisionFilter] = useState(0);
  // const [filteredFixtures, setFilteredFixtures]

  const [matchweekViewing, setMatchweekViewing] = useState(
    league.currentMatchweek
  );

  function handleClick(id: string) {
    router.push(`/leagues/${league._id}/fixture/${id}`);
  }

  const [displayedFixtures, setDisplayedFixtures] = useState(fixtures);

  let filteredFixtures: Fixture[] = [];

  if (divisionFilter === 0) {
    filteredFixtures = displayedFixtures;
  } else {
    filteredFixtures = displayedFixtures.filter(
      (fixture) => fixture.division === divisionFilter
    );
  }

  const { refetch: refetchFixtures, isFetching: isFetchingFixtures } = useQuery(
    {
      queryFn: () =>
        fetchAPI(
          `${API_URL}/leagues/${league._id}/fixtures?matchweek=${matchweekViewing}`,
          {
            method: 'GET',
          }
        ),
      queryKey: ['fixtures'],
      staleTime: 1000 * 60 * 1,
      gcTime: 1000 * 60 * 10,

      enabled: false,
    }
  );

  useEffect(() => {
    if (matchweekViewing < 1 || matchweekViewing > league.finalMatchweek)
      return;
    const fetchData = async () => {
      const { data } = await refetchFixtures();
      if (data.status === 'success') {
        setDisplayedFixtures(data.data.fixtures);
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchweekViewing]);

  return (
    <div className="flex flex-col gap-[20px] w-screen mb-20">
      <LeagueBanner leagueLevel={league.leagueLevel}>
        <div className="absolute bottom-0 left-[50%] translate-x-[-50%]">
          <Heading1>Fixtures</Heading1>
        </div>
      </LeagueBanner>
      <DetailsRibbon
        league={league}
        divisionFilter={divisionFilter}
        setDivisionFilter={setDivisionFilter}
      />

      <div className="w-[50%] place-self-center">
        <div className="flex flex-col gap-[20px]">
          <div>
            <p className="font-bold mb-[10px] place-self-center text-sm">
              Matchweek {matchweekViewing}{' '}
              {+matchweekViewing > league.currentMatchweek && '(future)'}
            </p>

            {isFetchingFixtures ? (
              <div className="flex flex-col justify-center items-center mb-4">
                <Spinner />
              </div>
            ) : (
              <div className="flex flex-col gap-[10px]">
                {filteredFixtures.map((fixture, i) =>
                  +matchweekViewing > league.currentMatchweek ? (
                    <FixtureRowFuture fixture={fixture} key={i} />
                  ) : (
                    <FixtureRow
                      league={league}
                      fixture={fixture}
                      key={i}
                      handleClick={handleClick}
                    />
                  )
                )}
              </div>
            )}
          </div>
        </div>

        <PaginationComponent
          page={matchweekViewing}
          setPage={setMatchweekViewing}
          lastPage={league.finalMatchweek}
        />
      </div>
    </div>
  );
}

function DetailsRibbon({
  league,
  divisionFilter,
  setDivisionFilter,
}: {
  league: League;
  divisionFilter: number;
  setDivisionFilter: Dispatch<SetStateAction<number>>;
}) {
  const items = [
    { key: '0', label: 'All fixtures' },
    ...league.tables
      .filter((t) => t.season === league.currentSeason)
      .map((t) => ({
        key: String(t.division),
        label: t.name,
      })),
  ];
  return (
    <div className="flex flex-col gap-[20px] mx-[20px] items-center">
      <div className="grid grid-rows-1 grid-cols-3 place-items-center w-max">
        <p className="text-base justify-self-end">
          Season {league.currentSeason} Matchweek {league.currentMatchweek}
        </p>
        {/* <LinkButton
          color="var(--text)"
          bgHoverColor="var(--bg)"
          borderlessButton={true}
          underlineEffect={false}
          href={`/leagues/${league._id}`}
        >
          {league.name}
        </LinkButton> */}
        <Button as={Link} href={`/leagues/${league._id}`} variant="flat">
          {league.name}
        </Button>
        <p className="text-base justify-self-start">
          {/* <select
            className="bg-[var(--bg)] hover:bg-[var(--bg-light)] p-2 rounded-[10px] outline-none cursor-pointer"
            value={divisionFilter}
            onChange={(e) => setDivisionFilter(+e.target.value)}
          >
            <option value={0}>All fixtures</option>
            {league.tables
              .filter((table) => table.season === league.currentSeason)
              .map((table, i) => (
                <option value={table.division} key={i}>
                  {table.name}
                </option>
              ))}
          </select> */}
          <Select
            items={items}
            selectedKeys={[String(divisionFilter)]}
            className="min-w-50"
            classNames={{ base: cn('w-full') }}
            onSelectionChange={(keys) => {
              const value = Number([...keys][0]);
              setDivisionFilter(value);
            }}
            disallowEmptySelection={true}
          >
            {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
          </Select>
        </p>
      </div>
    </div>
  );
}
