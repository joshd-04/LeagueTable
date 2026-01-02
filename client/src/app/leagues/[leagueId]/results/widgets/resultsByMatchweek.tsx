import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { League } from '@/util/definitions';
import { Spinner } from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ResultRow from './resultRow';
import NoResults from './noResults';
import PaginationComponent from '@/components/pagination/Pagination';
import { shouldGrantAccessToFeature } from '@/util/helpers';

export default function ResultsByMatchweek({
  league,
  handleClick,
}: {
  league: League;
  handleClick: (id: string) => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const matchweek = Number(searchParams.get('matchweek')) ?? null;

  const [seasonViewing, setSeasonViewing] = useState(-1);
  const [oldSeasonAlertVisible, setOldSeasonAlertVisible] = useState(false);

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
    // This runs only on the first fetch
    if (!isFetchingResults && !!refetchResults) {
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedResults, isFetchingResults]);

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
