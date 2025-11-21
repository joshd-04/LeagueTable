'use client';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { API_URL } from '@/util/config';
import { useRouter } from 'next/navigation';
import { fetchAPI } from '@/util/api';
import useAccount from '@/hooks/useAccount';
import { useMutation } from '@tanstack/react-query';
import {
  addToast,
  Button,
  Card,
  CardBody,
  Divider,
  Form,
  Input,
  NumberInput,
  Spacer,
} from '@heroui/react';

interface DivisionInputsInterface {
  tableName: string;
  numberOfTeams: number | undefined;
  numberOfTeamsToBePromoted: number | undefined;
  numberOfTeamsToBeRelegated: number | undefined;
}

interface DivisionInputErrorsInterface {
  tableName: string;
  numberOfTeams: string;
  numberOfTeamsToBePromoted: string;
  numberOfTeamsToBeRelegated: string;
}

export default function AddTablesForm({
  leagueName,
  divisionsCount,
  leagueId,
}: {
  leagueName: string;
  divisionsCount: number;
  leagueId: string;
}) {
  // Values
  const emptyInputs: DivisionInputsInterface[] = [];

  const emptyErrors: DivisionInputErrorsInterface[] = [];
  for (let i = 0; i < divisionsCount; i++) {
    emptyInputs.push({
      tableName: '',
      numberOfTeams: undefined,
      numberOfTeamsToBePromoted: i === 0 ? 0 : undefined,
      numberOfTeamsToBeRelegated: i === divisionsCount - 1 ? 0 : undefined,
    });
    emptyErrors.push({
      tableName: '',
      numberOfTeams: '',
      numberOfTeamsToBePromoted: '',
      numberOfTeamsToBeRelegated: '',
    });
  }
  const [divisionInputs, setDivisionInputs] =
    useState<DivisionInputsInterface[]>(emptyInputs);

  const [divisionErrors, setDivisionErrors] =
    useState<DivisionInputErrorsInterface[]>(emptyErrors);

  const [isFormSuccess, setIsFormSuccess] = useState(false);

  const failMessageRef = useRef('');

  const router = useRouter();

  const { isLoggedIn } = useAccount();

  useEffect(() => {
    if (!isLoggedIn) router.replace('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSendRequest() {
    return fetchAPI(`${API_URL}/leagues/${leagueId}/tables`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tables: divisionInputs.map((x, i) => {
          return { ...x, division: i + 1, name: x.tableName };
        }),
      }),
      credentials: 'include',
    });
  }

  const { mutateAsync: handleRequestMutation, isPending } = useMutation({
    mutationFn: handleSendRequest,
    onSuccess: (result) => {
      if (result.status === 'success') {
        setIsFormSuccess(true);
        setTimeout(() => {
          router.push(`/leagues/${leagueId}`);
        }, 300);
      } else if (result.status === 'fail') {
        failMessageRef.current = result.data.message;
        addToast({
          title: 'There was a problem',
          description: "We couldn't add tables to your league",
          color: 'warning',
          shouldShowTimeoutProgress: true,
        });
      } else {
        addToast({
          title: 'We ran into a problem',
          description: 'Something went wrong on our end',
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // fyi default browser validation shouldve ensured the inputs are given and valid
    e.preventDefault();

    try {
      handleRequestMutation();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Card className="w-[464px] place-self-center px-8 pt-6 pb-10  bg-linear-to-br from-content2 to-content1 ">
      <CardBody>
        <div>
          <h1 className="font-medium text-lg">Division Setup: {leagueName}</h1>
          <p className="opacity-80 dark:opacity-70 text-sm">Part 2 of 3</p>
        </div>
        <Spacer y={4} />
        <Form onSubmit={handleSubmit}>
          {Array(divisionsCount)
            .fill('')
            .map((str, i) => {
              return (
                <div className="flex flex-col gap-2 w-full" key={i + 1}>
                  <p className="text-base">Division {i + 1}</p>
                  <FormSection
                    divisionInputs={divisionInputs}
                    setDivisionInputs={setDivisionInputs}
                    divisionErrors={divisionErrors}
                    setDivisionErrors={setDivisionErrors}
                    divisionIndex={i}
                    divisionsCount={divisionsCount}
                  />
                  {i !== divisionsCount - 1 && <Divider className="my-4" />}
                </div>
              );
            })}
          <Spacer y={2} />
          <Button
            type="submit"
            variant={isFormSuccess ? 'flat' : 'solid'}
            color={isFormSuccess ? 'success' : 'primary'}
            fullWidth
            className="font-semibold text-sm"
            isDisabled={isFormSuccess}
            isLoading={isPending}
          >
            {isFormSuccess ? 'Success' : 'Submit'}
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
}

interface FormSectionProps {
  divisionInputs: DivisionInputsInterface[];
  setDivisionInputs: Dispatch<SetStateAction<DivisionInputsInterface[]>>;
  divisionErrors: DivisionInputErrorsInterface[];
  setDivisionErrors: Dispatch<SetStateAction<DivisionInputErrorsInterface[]>>;

  divisionIndex: number;
  divisionsCount: number;
}

function FormSection({
  divisionInputs,
  setDivisionInputs,
  divisionErrors,
  setDivisionErrors,
  divisionIndex,
  divisionsCount,
}: FormSectionProps) {
  return (
    <>
      <Input
        value={divisionInputs[divisionIndex].tableName}
        onChange={(e) => {
          setDivisionErrors((prev) => {
            const newOne = [...prev];
            newOne[divisionIndex].tableName = '';
            return newOne;
          });
          setDivisionInputs((prev) => {
            const newOne = [...prev];
            newOne[divisionIndex].tableName = e.target.value;
            return newOne;
          });
        }}
        size="md"
        radius="md"
        name="tableName"
        label="Table name"
        labelPlacement="inside"
        type="text"
        variant="bordered"
        fullWidth
        isRequired
        validate={(value) => {
          // This validation will check for table name conflicts
          const conflictedDivisionIndexes: number[] = [];
          const tableNames = divisionInputs.map(
            (divisionInput) => divisionInput.tableName
          );

          tableNames.forEach((name, i) => {
            if (value === name && name.length > 0 && i !== divisionIndex) {
              conflictedDivisionIndexes.push(i);
            }
          });

          if (conflictedDivisionIndexes.length > 0) {
            return 'Table name already in use';
          }
        }}
        // errorMessage={divisionErrors[divisionIndex].tableName}
      />

      <NumberInput
        value={divisionInputs[divisionIndex].numberOfTeams}
        onChange={(e) => {
          setDivisionErrors((prev) => {
            const newOne = [...prev];
            newOne[divisionIndex].numberOfTeams = '';
            return newOne;
          });
          setDivisionInputs((prev) => {
            const newOne = [...prev];
            newOne[divisionIndex].numberOfTeams = +e;
            return newOne;
          });
        }}
        size="md"
        radius="md"
        name="numberOfTeams"
        label="Number of teams"
        labelPlacement="inside"
        type="number"
        step={1}
        minValue={2}
        maxValue={24}
        isWheelDisabled
        variant="bordered"
        fullWidth
        isRequired
        errorMessage={divisionErrors[divisionIndex].numberOfTeams}
      />

      {divisionIndex !== 0 && (
        <NumberInput
          value={divisionInputs[divisionIndex].numberOfTeamsToBePromoted}
          onChange={(e) => {
            setDivisionErrors((prev) => {
              const newOne = [...prev];
              newOne[divisionIndex].numberOfTeamsToBePromoted = '';
              return newOne;
            });
            setDivisionInputs((prev) => {
              const newOne = [...prev];
              // Change the current division number
              newOne[divisionIndex].numberOfTeamsToBePromoted = +e;

              // Change the above division's relegated number
              newOne[divisionIndex - 1].numberOfTeamsToBeRelegated = +e;

              return newOne;
            });
          }}
          size="md"
          radius="md"
          name="numberOfTeamsToBePromoted"
          label="Number of teams to be promoted"
          labelPlacement="inside"
          type="number"
          step={1}
          minValue={0}
          maxValue={Math.floor(
            Number(divisionInputs[divisionIndex].numberOfTeams) / 2
          )}
          isWheelDisabled
          isDisabled={divisionInputs[divisionIndex].numberOfTeams === undefined}
          variant="bordered"
          fullWidth
          isRequired
          errorMessage={divisionErrors[divisionIndex].numberOfTeamsToBePromoted}
        />
      )}

      {divisionIndex !== divisionsCount - 1 && (
        <NumberInput
          value={divisionInputs[divisionIndex].numberOfTeamsToBeRelegated}
          onChange={(e) => {
            setDivisionErrors((prev) => {
              const newOne = [...prev];
              newOne[divisionIndex].numberOfTeamsToBeRelegated = '';
              return newOne;
            });
            setDivisionInputs((prev) => {
              const newOne = [...prev];
              // Change current divisions number
              newOne[divisionIndex].numberOfTeamsToBeRelegated = +e;

              // Change the above division's relegated number
              newOne[divisionIndex + 1].numberOfTeamsToBePromoted = +e;
              return newOne;
            });
          }}
          size="md"
          radius="md"
          name="numberOfTeamsToBeRelegated"
          label="Number of teams to be relegated"
          labelPlacement="inside"
          type="number"
          step={1}
          minValue={0}
          maxValue={Math.floor(
            Number(divisionInputs[divisionIndex].numberOfTeams) / 2
          )}
          isWheelDisabled
          isDisabled={divisionInputs[divisionIndex].numberOfTeams === undefined}
          variant="bordered"
          fullWidth
          isRequired
          errorMessage={
            divisionErrors[divisionIndex].numberOfTeamsToBeRelegated
          }
        />
      )}
    </>
  );
}
