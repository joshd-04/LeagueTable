import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { League } from '@/util/definitions';
import { Spinner } from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import ResultRow from './resultRow';
import ViewingOldSeasonAlert from '@/components/alerts/viewingOldSeason';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ResultsListDTO, SingleResultDTO } from '@/util/dto/results';

export default function ResultsByMostRecent({
  league,
  handleClick,
  seasonViewing,
  setSeasonViewing,
  oldSeasonAlertVisible,
  setOldSeasonAlertVisible,
}: {
  league: League;
  handleClick: (id: string) => void;
  seasonViewing: number;
  setSeasonViewing: Dispatch<SetStateAction<number>>;
  oldSeasonAlertVisible: boolean;
  setOldSeasonAlertVisible: Dispatch<SetStateAction<boolean>>;
}) {
  const [results, setResults] = useState<SingleResultDTO[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (params.get('matchweek')) {
      params.delete('matchweek');

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const { data: resultsData, isLoading: resultsAreLoading } = useQuery({
    queryFn: () =>
      fetchAPI(
        `${API_URL}/leagues/${league._id}/results?season=${seasonViewing}`,
        {
          method: 'GET',
        },
      ),
    queryKey: ['resultsRecent', league._id, seasonViewing],
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (resultsAreLoading === false) {
      const resultsDataTyped: ResultsListDTO = resultsData.data;
      setResults(resultsDataTyped.results);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultsAreLoading]);

  const organisedResults: { matchweek: number; results: SingleResultDTO[] }[] =
    [];

  results.forEach((resultDTO) => {
    if (organisedResults.length === 0) {
      organisedResults.push({
        matchweek: resultDTO.result.matchweek,
        results: [resultDTO],
      });
    } else if (
      organisedResults.slice(-1)[0].matchweek === resultDTO.result.matchweek
    ) {
      organisedResults.slice(-1)[0].results.push(resultDTO);
    } else {
      organisedResults.push({
        matchweek: resultDTO.result.matchweek,
        results: [resultDTO],
      });
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
      <ViewingOldSeasonAlert
        seasonViewing={seasonViewing}
        setSeasonViewing={setSeasonViewing}
        oldSeasonAlertVisible={oldSeasonAlertVisible}
        setOldSeasonAlertVisible={setOldSeasonAlertVisible}
        league={league}
      />
      {organisedResults.map((data, i) => (
        <div key={i}>
          <p className="font-bold mb-[10px] place-self-center text-sm">
            Matchweek {data.matchweek}{' '}
            {+data.matchweek > league.currentMatchweek &&
              seasonViewing === league.currentSeason &&
              '(future)'}
          </p>
          <div className="flex flex-col gap-[10px]">
            {data.results.map((result, i) => (
              <ResultRow
                resultDTO={result}
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
