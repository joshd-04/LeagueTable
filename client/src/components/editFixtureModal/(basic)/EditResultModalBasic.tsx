import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { useMutation } from '@tanstack/react-query';
import {
  addToast,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { FaTrashAlt } from 'react-icons/fa';
import { SingleResultDTO } from '@/util/dto/results';

export default function EditResultModalBasic({
  resultObj,
  setSelectedResult,
  isModalOpen,
  onModalClose,
  invalidateDashboardQueries,
  onResolution,
}: {
  resultObj: SingleResultDTO;
  setSelectedResult: Dispatch<SetStateAction<SingleResultDTO | null>>;
  isModalOpen: boolean;
  onModalClose?: () => void;
  invalidateDashboardQueries?: () => void;
  onResolution?: (isSuccess: boolean) => void;
}) {
  const [matchStory, setMatchStory] = useState<('home' | 'away')[]>(
    resultObj.result.basicOutcome || [],
  );

  const [userRequestedNilNil, setUserRequestedNilNil] = useState(false);

  // If the user changes the goal count, reset the nilnil value
  useEffect(() => {
    setUserRequestedNilNil(false);
  }, [matchStory]);

  function mutationFunction() {
    const basicOutcome = matchStory;
    const x = {
      fixtureId: resultObj.result._id,
      basicOutcome: basicOutcome,
    };
    return fetchAPI(`${API_URL}/result`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(x),
      credentials: 'include',
    });
  }

  const { mutateAsync: fixtureToResultBasicMutation, isPending } = useMutation({
    mutationFn: mutationFunction,
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

  function calculateScore(index: number) {
    let homeGoals = 0;
    let awayGoals = 0;
    matchStory.forEach((goal, i) => {
      if (i > index) return;
      if (goal === 'home') homeGoals += 1;
      if (goal === 'away') awayGoals += 1;
    });
    return `${homeGoals}-${awayGoals}`;
  }

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
            const response = await fixtureToResultBasicMutation();
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
                    {resultObj.homeDetails.name}{' '}
                    {matchStory.length === 0
                      ? 'vs'
                      : calculateScore(matchStory.length - 1)}{' '}
                    {resultObj.awayDetails.name}
                  </h3>
                  <p className="text-sm text-muted font-normal">
                    Fixture into result
                  </p>
                </div>
              </ModalHeader>
              <ModalBody>
                <ResultFormBasic
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

function ResultFormBasic({
  result,
  matchStory,
  setMatchStory,
  calculateScore,
}: {
  result: SingleResultDTO;
  matchStory: ('home' | 'away')[];
  setMatchStory: Dispatch<SetStateAction<('home' | 'away')[]>>;
  calculateScore: (i: number) => string;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  function addGoal(team: 'home' | 'away') {
    setMatchStory((prev) => [...prev, team]);
    setTimeout(() => {
      if (scrollContainerRef.current) {
        const lastChild = scrollContainerRef.current.lastElementChild;
        lastChild?.scrollIntoView({ behavior: 'smooth' }); // or 'auto'
      }
    }, 0);
  }

  function removeGoal(index: number) {
    setMatchStory((prev) => {
      return prev.filter((_goal, i) => i !== index);
    });
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
              <div
                key={i}
                className={`w-full flex flex-row justify-between gap-4 items-center rounded-lg pl-4 ${
                  goal === 'home' ? 'bg-content3' : 'bg-content2'
                }`}
              >
                <div
                  className={`w-full ${
                    goal === 'home' ? 'text-left' : 'text-right'
                  } `}
                >
                  <div>
                    <p>
                      {goal === 'home'
                        ? result.homeDetails.name
                        : result.awayDetails.name}{' '}
                      ({calculateScore(i)})
                    </p>
                  </div>
                </div>
                <Button
                  color="danger"
                  onPress={() => removeGoal(i)}
                  className="text-sm place-self-center "
                  variant="light"
                  isIconOnly
                >
                  <FaTrashAlt className="w-4 h-4 fill-danger" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="grid grid-rows-1 grid-cols-2 w-full gap-[20px]">
          <Button
            color="primary"
            onPress={() => addGoal('home')}
            className="text-sm text-nowrap overflow-ellipsis whitespace-nowrap overflow-hidden"
          >
            Add {result.homeDetails.name} goal
          </Button>
          <Button
            color="default"
            onPress={() => addGoal('away')}
            className="text-sm text-nowrap overflow-ellipsis whitespace-nowrap overflow-hidden"
          >
            Add {result.awayDetails.name} goal
          </Button>
        </div>
      </div>
    </>
  );
}
