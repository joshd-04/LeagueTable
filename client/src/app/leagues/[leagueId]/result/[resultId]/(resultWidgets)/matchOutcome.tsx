import EditResultModal from '@/components/editFixtureModal/EditResultModal';
import useAccount from '@/hooks/useAccount';
import { League } from '@/util/definitions';
import { SingleResultDTO } from '@/util/dto/results';
import { doesUserOwnThisLeague } from '@/util/helpers';
import { addToast, Button, Card, CardBody, useDisclosure } from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { title } from 'process';
import { useState } from 'react';
import { PiSoccerBallFill } from 'react-icons/pi';

export default function MatchOutcome({
  league,
  resultDTO,
}: {
  league: League;
  resultDTO: SingleResultDTO;
}) {
  const [r, setR] = useState<SingleResultDTO | null>(resultDTO);
  const {
    isOpen: isEditResultModalOpen,
    onOpen: onEditResultModalOpen,
    onClose: onEditResultModalClose,
  } = useDisclosure();
  const { isLoggedIn, user } = useAccount();
  const userOwnsThisLeague = doesUserOwnThisLeague(league, user, isLoggedIn);
  const router = useRouter();

  function calculateScore(index: number) {
    let homeGoals = 0;
    let awayGoals = 0;
    resultDTO.result.basicOutcome.forEach((goal, i) => {
      if (i > index) return;
      if (goal === 'home') homeGoals += 1;
      if (goal === 'away') awayGoals += 1;
    });
    return `${homeGoals}-${awayGoals}`;
  }

  function onEditResolution(isSuccess: boolean) {
    if (isSuccess) {
      router.refresh();
      addToast({
        title: 'Success!',
        description: 'Result has been edited',
        color: 'success',
        shouldShowTimeoutProgress: true,
        timeout: 3000,
      });
    }
    setR(null);
  }

  return (
    <>
      <Card className="h-full w-full px-[10px] py-[6px]">
        <CardBody className="flex flex-col gap-2">
          <div className="flex flex-row justify-between">
            <p className="text-base">Match outcome</p>
            {userOwnsThisLeague && (
              <Button
                variant="flat"
                size="sm"
                color="secondary"
                onPress={() => {
                  onEditResultModalOpen();
                }}
              >
                Edit
              </Button>
            )}
          </div>
          <div
            className="max-h-[24rem] overflow-y-auto flex flex-col items-center  gap-2 "
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'hsl(var(--heroui-foreground)/0.5) transparent',
            }}
          >
            <p className="text-sm">Match start. 0-0</p>
            {resultDTO.result.detailedOutcome !== undefined &&
            resultDTO.result.detailedOutcome.length !== 0
              ? resultDTO.result.detailedOutcome.map((goal, i) => {
                  const score = calculateScore(i);
                  return (
                    <MatchOutcomeRowAdvanced
                      goal={goal}
                      homeDetails={resultDTO.homeDetails}
                      awayDetails={resultDTO.awayDetails}
                      score={score}
                      key={i}
                    />
                  );
                })
              : resultDTO.result.basicOutcome.map((goal, i) => {
                  const score = calculateScore(i);
                  return (
                    <MatchOutcomeRowBasic
                      goal={goal}
                      homeDetails={resultDTO.homeDetails}
                      awayDetails={resultDTO.awayDetails}
                      score={score}
                      key={i}
                    />
                  );
                })}
            <p className="text-sm">
              Full time:{' '}
              {calculateScore(resultDTO.result.basicOutcome.length - 1)}
            </p>
          </div>
        </CardBody>
      </Card>
      <EditResultModal
        league={league}
        resultObj={r}
        setSelectedResult={setR}
        isModalOpen={isEditResultModalOpen}
        onModalClose={onEditResultModalClose}
        // invalidateDashboardQueries={}
        onResolution={onEditResolution}
      />
    </>
  );
}

function MatchOutcomeRowBasic({
  goal,
  homeDetails,
  awayDetails,
  score,
}: {
  goal: 'home' | 'away';

  homeDetails: {
    division: number;
    form: string;
    leaguePosition: number;
    matchesPlayed: number;
    name: string;
    points: number;
    teamId: string;
  };
  awayDetails: {
    division: number;
    form: string;
    leaguePosition: number;
    matchesPlayed: number;
    name: string;
    points: number;
    teamId: string;
  };
  score: string;
}) {
  const [homeGoals, awayGoals] = score.split('-');
  return (
    <div
      className={`grid grid-cols-[1fr_max-content_1fr] px-4 py-2 rounded-[10px] w-full ${
        goal === 'home' ? 'bg-content3/80' : 'bg-content2'
      }`}
    >
      {goal === 'home' ? (
        <div className="flex flex-col justify-center text-sm">
          <p>Goal: {homeDetails.name}</p>
        </div>
      ) : (
        <div></div>
      )}
      <div className="place-self-center text-base">
        {goal === 'home' ? (
          <p className="text-foreground">
            <span className="font-bold">{homeGoals}</span>
            {' - '}
            {awayGoals}
          </p>
        ) : (
          <p className="text-foreground">
            {homeGoals}
            {' - '}
            <span className="font-bold">{awayGoals}</span>
          </p>
        )}
      </div>
      {goal === 'away' ? (
        <div className="flex flex-col justify-center items-end text-sm">
          <p>Goal: {awayDetails.name}</p>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

function MatchOutcomeRowAdvanced({
  goal,
  homeDetails,
  awayDetails,
  score,
}: {
  goal: {
    scorer: string;
    assist: string | undefined;
    team: 'home' | 'away';
    isOwnGoal: boolean;
    _id: string;
  };
  homeDetails: {
    division: number;
    form: string;
    leaguePosition: number;
    matchesPlayed: number;
    name: string;
    points: number;
    teamId: string;
  };
  awayDetails: {
    division: number;
    form: string;
    leaguePosition: number;
    matchesPlayed: number;
    name: string;
    points: number;
    teamId: string;
  };
  score: string;
}) {
  const [homeGoals, awayGoals] = score.split('-');
  return (
    <div className="grid grid-cols-[1fr_max-content_1fr] bg-content2 px-4 py-2 rounded-[10px] w-full">
      {goal.team === 'home' ? (
        <div className="place-self-start flex flex-col items-start text-sm">
          <p>Goal: {homeDetails.name}</p>
          <span className="flex flex-row gap-1 items-center">
            <PiSoccerBallFill
              className={`w-4 h-4 inline ${
                goal.isOwnGoal ? 'fill-danger' : 'fill-white'
              }`}
            />
            <p>
              {goal.scorer} {goal.isOwnGoal && '(OG)'}
            </p>
          </span>
          {goal.assist && <p>👟 {goal.assist}</p>}
        </div>
      ) : (
        <div></div>
      )}
      <div className="place-self-center text-base">
        {goal.team === 'home' ? (
          <p className="text-foreground">
            <span className="font-bold">{homeGoals}</span>
            {' - '}
            {awayGoals}
          </p>
        ) : (
          <p className="text-foreground">
            {homeGoals}
            {' - '}
            <span className="font-bold">{awayGoals}</span>
          </p>
        )}
      </div>
      {goal.team === 'away' ? (
        <div className="place-self-end flex flex-col items-end text-sm">
          <p>Goal: {awayDetails.name}</p>
          <span className="flex flex-row gap-1 items-center">
            <PiSoccerBallFill
              className={`w-4 h-4 inline ${
                goal.isOwnGoal ? 'fill-danger' : 'fill-white'
              }`}
            />
            <p>
              {goal.scorer} {goal.isOwnGoal && '(OG)'}
            </p>
          </span>
          {goal.assist && <p>👟 {goal.assist}</p>}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
