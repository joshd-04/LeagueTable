'use client';
import Paragraph from '@/components/text/Paragraph';
import { Result, League } from '@/util/definitions';
import Heading1 from '@/components/text/Heading1';
import Label from '@/components/text/Label';
import LinkButton from '@/components/text/LinkButton';
import LeagueBanner from '@/components/leagueBanner/LeagueBanner';
import Subtitle from '@/components/text/Subtitle';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Pagination from '@/components/pagination/Pagination';
import { fetchAPI } from '@/util/api';
import { useQuery } from '@tanstack/react-query';
import { API_URL } from '@/util/config';

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
    <div className="flex flex-col gap-[20px]">
      <LeagueBanner league={league}>
        <div className="absolute bottom-0 left-[50%] translate-x-[-50%]">
          <Heading1>Results</Heading1>
        </div>
      </LeagueBanner>
      <div className="flex flex-col gap-[20px] mx-[20px]">
        <div className="grid  grid-rows-1 grid-cols-[1fr_auto_1fr] place-items-center gap-12">
          <Paragraph style={{ justifySelf: 'end' }}>
            Season {league.currentSeason} Matchweek {league.currentMatchweek}
          </Paragraph>
          <LinkButton
            color="var(--text)"
            bgHoverColor="var(--bg)"
            borderlessButton={true}
            underlineEffect={false}
            href={`/leagues/${league._id}`}
          >
            {league.name}
          </LinkButton>
          <Paragraph style={{ justifySelf: 'start' }}>
            <select
              className="bg-[var(--bg)] hover:bg-[var(--bg-light)] p-2 rounded-[10px] outline-none cursor-pointer"
              value={sort}
              onChange={(e) => {
                if (
                  !['matchweek', 'most recent'].some(
                    (x) => e.target.value === x
                  )
                ) {
                  return;
                }

                setSort(e.target.value as 'matchweek' | 'most recent');
              }}
            >
              <option value="matchweek">Matchweek</option>
              <option value="most recent">Most recent</option>
            </select>
          </Paragraph>
        </div>
      </div>
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

function ResultRow({
  result,
  handleClick,
}: {
  result: Result;
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
    <motion.div
      className="bg-[var(--bg)] w-full border-1 border-[var(--border)] rounded-[10px] p-[10px] grid grid-rows-1 grid-cols-[1fr_auto_1fr] gap-[6px] items-center hover:bg-[var(--bg-light)] hover:cursor-pointer hover:border-transparent"
      whileTap={{ scale: 0.98 }}
      onClick={() => handleClick(result._id)}
    >
      <div className="grid grid-rows-1 grid-cols-[1fr_3ch] gap-[20px] items-baseline justify-items-end">
        <Subtitle>{result.homeTeamDetails.name}</Subtitle>
        <Subtitle>{homeGoals}</Subtitle>
      </div>
      <Label
        style={{
          fontWeight: 'bold',
          textAlign: 'center',
          alignItems: 'baseline',
          verticalAlign: 'middle',
        }}
      >
        -
      </Label>

      <div className="grid grid-rows-1 grid-cols-[3ch_1fr] gap-[20px] items-baseline">
        <Subtitle>{awayGoals}</Subtitle>
        <Subtitle>{result.awayTeamDetails.name}</Subtitle>
      </div>
    </motion.div>
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
    queryKey: ['resultsRecent'],
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (resultsAreLoading === false) {
      setResults(resultsData.data.results);
      console.log(resultsData.data.results);
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
        <div>
          <Label
            style={{
              fontWeight: 'bold',
              marginBottom: '10px',
              placeSelf: 'center',
            }}
          >
            Results loading...
          </Label>
          <div className="flex flex-col gap-[10px]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[20px]">
      {organisedResults.map((data, i) => (
        <div key={i}>
          <Label
            style={{
              fontWeight: 'bold',
              marginBottom: '10px',
              placeSelf: 'center',
            }}
          >
            Matchweek {data.matchweek}{' '}
            {+data.matchweek > league.currentMatchweek && '(future)'}
          </Label>
          <div className="flex flex-col gap-[10px]">
            {data.results.map((result, i) => (
              <ResultRow result={result} key={i} handleClick={handleClick} />
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
  const [displayedResults, setDisplayedResults] = useState(results);

  const [matchweekViewing, setMatchweekViewing] = useState(
    league.currentMatchweek
  );

  const { refetch: refetchResults } = useQuery({
    queryFn: () =>
      fetchAPI(
        `${API_URL}/leagues/${league._id}/results?matchweek=${matchweekViewing}`,
        {
          method: 'GET',
        }
      ),
    queryKey: ['resultsMatchweek'],
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 10,

    enabled: false,
  });

  useEffect(() => {
    if (matchweekViewing < 1 || matchweekViewing > league.currentMatchweek)
      return;
    const fetchData = async () => {
      const { data } = await refetchResults();
      if (data.status === 'success') {
        setDisplayedResults(data.data.results);
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
    <div className="flex flex-col gap-[20px]">
      <div>
        <Label
          style={{
            fontWeight: 'bold',
            marginBottom: '10px',
            placeSelf: 'center',
          }}
        >
          Matchweek {matchweekViewing}{' '}
          {+matchweekViewing > league.currentMatchweek && '(future)'}
        </Label>

        <div className="flex flex-col gap-[10px]">
          {displayedResults.map((result, i) => (
            <ResultRow result={result} key={i} handleClick={handleClick} />
          ))}
        </div>
        <Pagination
          page={matchweekViewing}
          setPage={setMatchweekViewing}
          lastPage={league.currentMatchweek}
        />
      </div>
    </div>
  );
}
