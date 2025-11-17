'use client';

import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { League } from '@/util/definitions';
import { addToast, Button, Card, CardBody } from '@heroui/react';
import { useMutation } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

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
  const [seasonButtonText] = useState('Start next season');

  const currentMatchweekRef = useRef(league.currentMatchweek);
  useEffect(() => {
    currentMatchweekRef.current = league.currentMatchweek;
    setCurrentMatchweek(league.currentMatchweek);
    setMatchweekButtonText(`Start matchweek ${league.currentMatchweek + 1}`);
  }, [league.currentMatchweek]);

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
      addToast({
        title: 'Success!',
        description: `Matchweek ${currentMatchweek + 1} is underway`,
        shouldShowTimeoutProgress: true,
        color: 'success',
      });
    },
    onError: () => {
      addToast({
        title: 'Something went wrong',
        description: `We could not start matchweek ${currentMatchweek + 1}`,
        shouldShowTimeoutProgress: true,
        color: 'danger',
      });
    },
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
      addToast({
        title: 'Success!',
        description: `The next season is underway`,
        shouldShowTimeoutProgress: true,
        color: 'success',
      });
    },
    onError: () => {
      addToast({
        title: 'Something went wrong',
        description: `We could not start the next season`,
        shouldShowTimeoutProgress: true,
        color: 'danger',
      });
    },
  });

  const isNextMatchweekButtonDisabled =
    league.currentMatchweek === league.finalMatchweek ||
    league.currentMatchweek === 0;

  const isNextSznButtonDisabled =
    !(
      league.currentMatchweek === league.finalMatchweek &&
      league.fixtures.length === 0
    ) && !(league.currentSeason === 0 && league.currentMatchweek === 0);

  return (
    <Card className="px-[10px] py-[6px] h-full w-full">
      <CardBody className=" flex flex-col gap-2">
        <p className="text-base">Controls</p>

        <Button
          onPress={() => matchweekMutation()}
          color="primary"
          variant={isNextMatchweekButtonDisabled ? 'ghost' : 'shadow'}
          isDisabled={isNextMatchweekButtonDisabled}
          className="font-semibold text-sm h-full min-h-12"
        >
          {matchweekButtonText}
        </Button>

        <Button
          onPress={() => seasonMutation()}
          color="primary"
          variant={isNextSznButtonDisabled ? 'ghost' : 'shadow'}
          isDisabled={isNextSznButtonDisabled}
          className="font-semibold text-sm h-full min-h-12"
        >
          {seasonButtonText}
        </Button>
      </CardBody>
    </Card>
  );
}
