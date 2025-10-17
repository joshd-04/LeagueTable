'use client';
import Button from '@/components/text/Button';
import Label from '@/components/text/Label';
import Paragraph from '@/components/text/Paragraph';
import { GlobalContext } from '@/context/GlobalContextProvider';
import { useNotifier } from '@/hooks/useNotifier';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { League } from '@/util/definitions';
import { useMutation } from '@tanstack/react-query';
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

export default function Controls({
  league,
  invalidateDashboardQueries,
  setSeasonViewing,
}: {
  league: League;
  invalidateDashboardQueries: () => void;
  setSeasonViewing?: Dispatch<SetStateAction<number>>;
}) {
  const [currentMatchweek, setCurrentMatchweek] = useState(
    league.currentMatchweek
  );
  const [matchweekButtonText, setMatchweekButtonText] = useState(
    `Start matchweek ${currentMatchweek + 1}`
  );
  const [seasonButtonText, setSeasonButtonText] = useState('Start next season');

  const { setError } = useContext(GlobalContext).errors;

  const currentMatchweekRef = useRef(league.currentMatchweek);
  useEffect(() => {
    currentMatchweekRef.current = league.currentMatchweek;
    setCurrentMatchweek(league.currentMatchweek);
    setMatchweekButtonText(`Start matchweek ${league.currentMatchweek + 1}`);
  }, [league.currentMatchweek]);

  const notiMatchweekSuccess = useNotifier({
    id: 'matchweek',
    type: 'success',
    // use the ref so the generator reads the latest value when fired
    title: () => `Matchweek ${currentMatchweekRef.current + 1} is underway!`,
    duration: 3000,
  });
  const notiMatchweekError = useNotifier({
    id: 'matchweek',
    type: 'error',
    title: 'Matchweek Error',
    description: () =>
      `There was a problem starting matchweek ${
        currentMatchweekRef.current + 1
      } :(`,
    duration: 3000,
  });

  function handleStartNextMatchweek() {
    return fetchAPI(`${API_URL}/leagues/${league._id}/start-next-matchweek`, {
      method: 'POST',
      credentials: 'include',
    });
  }

  const { mutateAsync: matchweekMutation } = useMutation({
    mutationFn: handleStartNextMatchweek,
    onSuccess: () => {
      invalidateDashboardQueries();
      notiMatchweekSuccess?.fire();
    },
    onError: (e) => {
      setMatchweekButtonText('Something went wrong');
      notiMatchweekError?.fire();
      setError(e.message);
      setTimeout(() => {
        setMatchweekButtonText(`Start matchweek ${currentMatchweek + 1}`);
      }, 3000);
    },
  });

  const notiSeasonSuccess = useNotifier({
    id: 'season',
    type: 'success',
    title: 'Next Season is underway',
    duration: 3000,
  });
  const notiSeasonError = useNotifier({
    id: 'season',
    type: 'error',
    title: 'Season Error',
    description: 'There was an error starting the next season :(',
    duration: 3000,
  });

  function handleStartNextSeason() {
    return fetchAPI(`${API_URL}/leagues/${league._id}/start-next-season`, {
      method: 'POST',
      credentials: 'include',
    });
  }

  const { mutateAsync: seasonMutation } = useMutation({
    mutationFn: handleStartNextSeason,

    onSuccess: () => {
      invalidateDashboardQueries();
      if (setSeasonViewing) {
        setSeasonViewing((prev) => prev + 1);
      }
      notiSeasonSuccess?.fire();
    },
    onError: (e) => {
      setSeasonButtonText('Something went wrong');
      notiSeasonError?.fire();
      setError(e.message);
      setTimeout(() => {
        setSeasonButtonText(`Start next season`);
      }, 3000);
    },
  });

  return (
    <div className="p-[20px]  h-full w-full bg-[var(--bg)] rounded-[10px] border-1 border-[var(--border)] flex flex-col gap-2">
      <span>
        <Paragraph
          style={{
            color: 'var(--text)',
            verticalAlign: 'middle',
            display: 'inline',
          }}
        >
          Controls
        </Paragraph>
      </span>
      <Button
        onClick={() => matchweekMutation()}
        color="var(--primary)"
        bgHoverColor="var(--accent)"
        disabled={
          league.currentMatchweek === league.finalMatchweek ||
          league.currentMatchweek === 0
        }
      >
        <Label style={{ fontWeight: 'bold', color: 'inherit' }}>
          {matchweekButtonText}
        </Label>
      </Button>

      <Button
        onClick={() => seasonMutation()}
        color="var(--primary)"
        bgHoverColor="var(--accent)"
        disabled={
          !(
            league.currentMatchweek === league.finalMatchweek &&
            league.fixtures.length === 0
          ) && !(league.currentSeason === 0 && league.currentMatchweek === 0)
        }
      >
        <Label style={{ fontWeight: 'bold', color: 'inherit' }}>
          {seasonButtonText}
        </Label>
      </Button>
    </div>
  );
}
