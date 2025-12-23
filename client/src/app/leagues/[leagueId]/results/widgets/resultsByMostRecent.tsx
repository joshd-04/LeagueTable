import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { League, Result } from '@/util/definitions';
import { Spinner } from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import ResultRow from './resultRow';

export default function ResultsByMostRecent({
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
