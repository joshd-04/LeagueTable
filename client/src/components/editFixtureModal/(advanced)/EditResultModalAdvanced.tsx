import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

import { Result } from '@/util/definitions';

import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { useMutation } from '@tanstack/react-query';
import {
  addToast,
  Button,
  Checkbox,
  cn,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { FaTrashAlt } from 'react-icons/fa';
import { PiSoccerBallFill } from 'react-icons/pi';
import { GiRunningShoe } from 'react-icons/gi';

export default function EditResultModalAdvanced({
  resultObj,
  setSelectedResult,
  isModalOpen,
  onModalClose,
  invalidateDashboardQueries,
  onResolution,
}: {
  resultObj: Result;
  setSelectedResult: Dispatch<SetStateAction<Result | null>>;
  isModalOpen: boolean;
  onModalClose?: () => void;
  invalidateDashboardQueries?: () => void;
  onResolution?: (isSuccess: boolean) => void;
}) {
  const [matchStory, setMatchStory] = useState<GoalAdvanced[]>(
    resultObj.detailedOutcome || []
  );
  const [userRequestedNilNil, setUserRequestedNilNil] = useState(false);

  // If the user changes the goal count, reset the nilnil value
  useEffect(() => {
    setUserRequestedNilNil(false);
  }, [matchStory]);

  function calculateScore(index: number) {
    let homeGoals = 0;
    let awayGoals = 0;
    matchStory.forEach((goal, i) => {
      if (i > index) return;
      if (goal.team === 'home') homeGoals += 1;
      if (goal.team === 'away') awayGoals += 1;
    });
    return `${homeGoals}-${awayGoals}`;
  }

  function handleSubmit() {
    const basicOutcome = matchStory.map((goal) => goal.team);
    const x = {
      fixtureId: resultObj._id,
      basicOutcome: basicOutcome,
      detailedOutcome: matchStory,
    };

    return fetchAPI(`${API_URL}/result`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(x),
      credentials: 'include',
    });
  }
  const { mutateAsync: fixtureToResultAdvancedMutation, isPending } =
    useMutation({
      mutationFn: handleSubmit,
      onSuccess: (response) => {
        if (response.status === 'success') {
          if (invalidateDashboardQueries) invalidateDashboardQueries();

          if (onResolution) onResolution(true);
        } else if (response.status === 'fail') {
          const message = response.data.message;
          addToast({
            title: 'There was a problem',
            description: message,
            color: 'warning',
            shouldShowTimeoutProgress: true,
          });
          if (onResolution) onResolution(false);
        } else {
          addToast({
            title: 'Something went wrong',
            description: response.message,
            color: 'danger',
            shouldShowTimeoutProgress: true,
          });
        }
      },
      onError: (e) => {
        addToast({
          title: 'We ran into a problem',
          description: e.message,
          color: 'danger',
          shouldShowTimeoutProgress: true,
        });
      },
    });

  return (
    <Modal
      isOpen={isModalOpen}
      onOpenChange={(open) => {
        if (!open) {
          setSelectedResult(null);
          onModalClose?.();
        }
      }}
    >
      <ModalContent>
        {(onClose) => {
          async function handleSubmit() {
            const response = await fixtureToResultAdvancedMutation();
            if (response.status === 'success') {
              onClose();
              setSelectedResult(null);
              onModalClose?.();
            }
          }
          return (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl">
                    {resultObj.homeTeamDetails.name}{' '}
                    {matchStory.length === 0
                      ? 'vs'
                      : calculateScore(matchStory.length - 1)}{' '}
                    {resultObj.awayTeamDetails.name}
                  </h3>
                  <p className="text-sm text-muted font-normal">
                    Fixture into result
                  </p>
                </div>
              </ModalHeader>
              <ModalBody>
                <ResultFormAdvanced
                  result={resultObj}
                  matchStory={matchStory}
                  setMatchStory={setMatchStory}
                  calculateScore={calculateScore}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    onClose();
                    setSelectedResult(null);
                    onModalClose?.();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="font-semibold text-sm"
                  color="primary"
                  onPress={() => {
                    if (matchStory.length === 0 && !userRequestedNilNil) {
                      setUserRequestedNilNil(true);
                    } else {
                      handleSubmit();
                    }
                  }}
                  isLoading={isPending}
                >
                  {userRequestedNilNil ? 'Submit 0-0?' : 'Submit'}
                </Button>
              </ModalFooter>
            </>
          );
        }}
      </ModalContent>
    </Modal>
  );
}

interface GoalAdvanced {
  team: 'home' | 'away';
  scorer: string;
  assist?: string;
  isOwnGoal: boolean;
}

function ResultFormAdvanced({
  result,
  matchStory,
  setMatchStory,
  calculateScore,
}: {
  result: Result;
  matchStory: GoalAdvanced[];
  setMatchStory: Dispatch<SetStateAction<GoalAdvanced[]>>;
  calculateScore: (i: number) => string;
}) {
  const [goalScorer, setGoalScorer] = useState<string>('');
  const [assist, setAssist] = useState<string>('');
  const [goalScorerError, setGoalScorerError] = useState('');
  const [isOwnGoal, setIsOwnGoal] = useState(false);

  const [didJustAttemptToAddEvent, setDidJustAttemptToAddEvent] =
    useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  function addGoal(team: 'home' | 'away') {
    if (goalScorer.toString().trim().length === 0) {
      setGoalScorerError('Scorer is required');
      return false;
    }
    const assister = `${assist.trim()}`.length === 0 ? undefined : `${assist}`;
    setMatchStory((prev) => [
      ...prev,
      {
        team: team,
        scorer: `${goalScorer}`,
        assist: assister,
        isOwnGoal: isOwnGoal,
      },
    ]);
    setTimeout(() => {
      if (scrollContainerRef.current) {
        const lastChild = scrollContainerRef.current.lastElementChild;
        lastChild?.scrollIntoView({ behavior: 'smooth' }); // or 'auto'
      }
    }, 0);
    return true;
  }

  function removeGoal(index: number) {
    setMatchStory((prev) => {
      return prev.filter((_goal, i) => i !== index);
    });
    return true;
  }

  function resetInputs() {
    setGoalScorer('');
    setAssist('');
    setIsOwnGoal(false);
  }

  return (
    <>
      <div className="max-h-[300px] min-h-[300px] overflow-auto ">
        <div
          className="flex flex-col gap-[8px] p-[8px] text-sm"
          ref={scrollContainerRef}
        >
          {matchStory.length === 0 ? (
            <p className="place-self-center text-muted">No events</p>
          ) : (
            matchStory.map((goal, i) => (
              <GoalRow
                result={result}
                goal={goal}
                key={i}
                goalIndex={i}
                removeGoal={removeGoal}
                calculateScore={calculateScore}
              />
            ))
          )}
        </div>
      </div>
      <div className="flex flex-col justify-center items-center w-full gap-4">
        <div className="flex flex-col justify-center items-center w-full gap-2">
          <Input
            type="text"
            size="sm"
            radius="md"
            value={goalScorer}
            onValueChange={setGoalScorer}
            errorMessage={goalScorerError}
            isRequired
            fullWidth
            isInvalid={
              didJustAttemptToAddEvent && goalScorer.trim().length === 0
            }
            label="Goal scorer"
            onFocus={() => setDidJustAttemptToAddEvent(false)}
          />
          <div className="max-w-full overflow-clip w-full flex flex-row items-stretch gap-4">
            <Input
              type="text"
              size="sm"
              radius="md"
              className="min-w-0 flex-1"
              value={assist}
              onValueChange={setAssist}
              label="Assist"
            />
            <Checkbox
              aria-label={'Mark as own goal'}
              classNames={{
                base: cn(
                  'shrink-0 inline-flex min-w-max bg-content2 min-h-full my-0 mr-1',
                  'hover:bg-content3 items-center justify-start',
                  'cursor-pointer rounded-lg gap-2 px-4 border-2 border-transparent',
                  'data-[selected=true]:border-primary transition-colors duration-200'
                ),
                label: 'w-full text-sm',
              }}
              isSelected={isOwnGoal}
              onValueChange={setIsOwnGoal}
            >
              <div className="w-full flex justify-between gap-2">Own goal</div>
            </Checkbox>
          </div>
        </div>

        <div className="grid grid-rows-1 grid-cols-2 w-full gap-2">
          <Button
            color="primary"
            onPress={() => {
              const success = addGoal('home');
              if (success) {
                resetInputs();
              } else {
                setDidJustAttemptToAddEvent(true);
              }
            }}
            className="text-sm text-nowrap overflow-ellipsis whitespace-nowrap overflow-hidden"
          >
            Add {result.homeTeamDetails.name} goal
          </Button>
          <Button
            color="default"
            onPress={() => {
              const success = addGoal('away');
              if (success) {
                resetInputs();
              } else {
                setDidJustAttemptToAddEvent(true);
              }
            }}
            className="text-sm text-nowrap overflow-ellipsis whitespace-nowrap overflow-hidden"
          >
            Add {result.awayTeamDetails.name} goal
          </Button>
        </div>
      </div>
    </>
  );
}

function GoalRow({
  result,
  goal,
  goalIndex,
  removeGoal,
  calculateScore,
}: {
  result: Result;
  goal: GoalAdvanced;
  goalIndex: number;
  removeGoal: (i: number) => void;
  calculateScore: (i: number) => string;
}) {
  return (
    <div
      className={`w-full flex flex-row justify-between gap-4 items-center rounded-lg pl-4 ${
        goal.team === 'home' ? 'bg-content3' : 'bg-content2'
      }`}
    >
      <div
        className={`w-full my-2 ${
          goal.team === 'home' ? 'text-left' : 'text-right'
        } `}
      >
        <div>
          <p>
            {goal.team === 'home'
              ? result.homeTeamDetails.name
              : result.awayTeamDetails.name}{' '}
            ({calculateScore(goalIndex)})
          </p>
          <span
            className="flex flex-row gap-1 items-center"
            style={{
              placeSelf: goal.team === 'home' ? 'start' : 'end',
            }}
          >
            <PiSoccerBallFill
              className={`w-4 h-4 inline ${
                goal.isOwnGoal ? 'fill-danger' : 'fill-white'
              }`}
            />
            <p>
              {goal.scorer} {goal.isOwnGoal && '(OG)'}
            </p>
          </span>
          {goal.assist && (
            <span
              className="flex flex-row gap-1 items-center"
              style={{
                placeSelf: goal.team === 'home' ? 'start' : 'end',
              }}
            >
              <GiRunningShoe className="w-4 h-4 fill-white inline" />
              <p>{goal.assist}</p>
            </span>
          )}
        </div>
      </div>
      <Button
        color="danger"
        onPress={() => removeGoal(goalIndex)}
        className="text-sm place-self-center"
        variant="light"
        isIconOnly
      >
        <FaTrashAlt className="w-4 h-4 fill-danger" />
      </Button>
    </div>
  );
}
