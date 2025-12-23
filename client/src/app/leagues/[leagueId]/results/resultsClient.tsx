'use client';
import { Result, League } from '@/util/definitions';
import Heading1 from '@/components/text/Heading1';
import LeagueBanner from '@/components/leagueBanner/LeagueBanner';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import PaginationComponent from '@/components/pagination/Pagination';
import { fetchAPI } from '@/util/api';
import { useQuery } from '@tanstack/react-query';
import { API_URL } from '@/util/config';
import {
  Button,
  Card,
  CardBody,
  Link,
  Select,
  SelectItem,
  Spinner,
} from '@heroui/react';
import TruncatedText from '@/components/formattedText/truncatedText';
import NoResults from './widgets/noResults';

export default function ResultsClient({
  league,
  results,
}: {
  league: League;
  results: Result[];
}) {
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
          <ResultsByMatchweek
            results={results}
            league={league}
            handleClick={handleClick}
          />
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

function ResultRow({
  result,
  league,
  handleClick,
}: {
  result: Result;
  league: League;
  handleClick: (id: string) => void;
}) {
  const homeGoals = result.basicOutcome.reduce(
    (acc, goal) => (goal === 'home' ? acc + 1 : acc),
    0
  );
  const awayGoals = result.basicOutcome.reduce(
    (acc, goal) => (goal === 'away' ? acc + 1 : acc),
    0
  );

  return (
    <Card
      isPressable
      onPress={() => handleClick(result._id)}
      as={Link}
      href={`/leagues/${league._id}/result/${result._id}`}
    >
      <CardBody className="@container">
        <div className="flex items-center gap-2">
          {/* Home side */}
          <div className="flex-1 min-w-0 flex items-center justify-end gap-2">
            {/* Name - always visible, truncates */}
            <div className="min-w-0 max-w-50 flex-shrink flex-grow">
              <TruncatedText
                content={result.homeTeamDetails.name}
                placement="top-end"
                textClassName="text-right whitespace-nowrap overflow-hidden text-ellipsis w-full text-lg"
              >
                {result.homeTeamDetails.name}
              </TruncatedText>
            </div>

            {/* Goals */}
            <p className="flex-shrink-0 text-lg font-medium w-[3ch] text-right">
              {homeGoals}
            </p>
          </div>

          {/* Center - never shrinks */}
          <p className="font-bold text-sm flex-shrink-0 flex-grow-0">-</p>

          {/* Away side */}
          <div className="flex-1 min-w-0 flex items-center justify-start gap-2">
            {/* Goals */}
            <p className="flex-shrink-0 text-lg font-medium w-[3ch]">
              {awayGoals}
            </p>

            {/* Name - always visible, truncates */}
            <div className="min-w-0 max-w-50 flex-shrink flex-grow">
              <TruncatedText
                content={result.awayTeamDetails.name}
                placement="top-start"
                textClassName="text-left whitespace-nowrap overflow-hidden text-ellipsis w-full text-lg"
              >
                {result.awayTeamDetails.name}
              </TruncatedText>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function ResultsByMostRecent({
  league,
  handleClick,
}: {
  league: League;
  handleClick: (id: string) => void;
}) {
  const [results, setResults] = useState<Result[]>([]);

  const { data: resultsData, isLoading: resultsAreLoading } = useQuery({
    queryFn: () =>
      fetchAPI(`${API_URL}/leagues/${league._id}/results`, {
        method: 'GET',
      }),
    queryKey: ['resultsRecent', league._id],
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (resultsAreLoading === false) {
      setResults(resultsData.data.results);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultsAreLoading]);

  const organisedResults: { matchweek: number; results: Result[] }[] = [];

  results.forEach((result) => {
    if (organisedResults.length === 0) {
      organisedResults.push({ matchweek: result.matchweek, results: [result] });
    } else if (organisedResults.slice(-1)[0].matchweek === result.matchweek) {
      organisedResults.slice(-1)[0].results.push(result);
    } else {
      organisedResults.push({ matchweek: result.matchweek, results: [result] });
    }
  });

  if (resultsAreLoading) {
    return (
      <div className="flex flex-col gap-[20px]">
        <div className="flex flex-col justify-center items-center mb-4">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[20px]">
      {organisedResults.map((data, i) => (
        <div key={i}>
          <p className="font-bold mb-[10px] place-self-center text-sm">
            Matchweek {data.matchweek}{' '}
            {+data.matchweek > league.currentMatchweek && '(future)'}
          </p>
          <div className="flex flex-col gap-[10px]">
            {data.results.map((result, i) => (
              <ResultRow
                result={result}
                league={league}
                key={i}
                handleClick={handleClick}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ResultsByMatchweek({
  league,
  results,
  handleClick,
}: {
  league: League;
  results: Result[];
  handleClick: (id: string) => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const matchweek = Number(searchParams.get('matchweek')) ?? null;

  const specifiedPage =
    matchweek >= 1 && matchweek <= league.finalMatchweek ? matchweek : null;

  const [displayedResults, setDisplayedResults] = useState([]);
  const [matchweekViewing, setMatchweekViewing] = useState(
    specifiedPage || league.currentMatchweek
  );

  const { refetch: refetchResults, isFetching: isFetchingResults } = useQuery({
    queryFn: () =>
      fetchAPI(
        `${API_URL}/leagues/${league._id}/results?matchweek=${matchweekViewing}`,
        {
          method: 'GET',
        }
      ),
    queryKey: ['resultsMatchweek', league._id, matchweekViewing],
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 10,
    enabled: false,
  });

  useEffect(() => {
    if (matchweekViewing < 1 || matchweekViewing > league.currentMatchweek)
      return;
    const fetchData = async () => {
      const { data } = await refetchResults();
      console.log(data);
      if (data.status === 'success') {
        setDisplayedResults(data.data.results);
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    };

    fetchData();

    const params = new URLSearchParams(searchParams.toString());
    params.set('matchweek', String(matchweekViewing));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchweekViewing]);

  return (
    <div className="flex flex-col gap-[20px]">
      <div>
        <p className="text-sm font-bold mb-[10px] place-self-center">
          Matchweek {matchweekViewing}{' '}
          {+matchweekViewing > league.currentMatchweek && '(future)'}
        </p>

        {isFetchingResults ? (
          <div className="flex flex-col justify-center items-center mb-4">
            <Spinner />
          </div>
        ) : (
          <div className="flex flex-col gap-[10px]">
            {displayedResults.length > 0 ? (
              displayedResults.map((result, i) => (
                <ResultRow
                  result={result}
                  league={league}
                  key={i}
                  handleClick={handleClick}
                />
              ))
            ) : (
              <NoResults league={league} matchweek={+matchweekViewing} />
            )}
          </div>
        )}

        <PaginationComponent
          page={matchweekViewing}
          setPage={setMatchweekViewing}
          lastPage={league.currentMatchweek}
        />
      </div>
    </div>
  );
}
