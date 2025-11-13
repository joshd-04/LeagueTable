'use client';
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { API_URL } from '@/util/config';
import { GlobalContext } from '@/context/GlobalContextProvider';
import { useRouter } from 'next/navigation';
import { fetchAPI } from '@/util/api';
import useAccount from '@/hooks/useAccount';
import { useMutation } from '@tanstack/react-query';
import { useNotifier } from '@/hooks/useNotifier';
import { Button, Card, CardBody, Form, Input, Spacer } from '@heroui/react';
import Paragraph from '../text/Paragraph';
import Label from '../text/Label';

export default function AddTablesForm({
  leagueName,
  divisions,
  leagueId,
}: {
  leagueName: string;
  divisions: { divisionNumber: number; name: string; numberOfTeams: number }[];
  leagueId: string;
}) {
  // Values
  // A 2d array, where each inner array is a league, the string are the team names
  const emptyInputs: { name: string }[][] = [];

  const emptyErrors: { name: string }[][] = [];
  divisions.forEach((division) => {
    const arr1 = Array(division.numberOfTeams).fill('');
    const arr = arr1.map(() => {
      return {
        name: '',
      };
    });
    emptyInputs.push(arr);

    const err1 = Array(division.numberOfTeams).fill('');
    const err = err1.map(() => {
      return {
        name: '',
      };
    });
    emptyErrors.push(err);
  });

  const [teamInputs, setTeamInputs] =
    useState<{ name: string }[][]>(emptyInputs);

  const globalContext = useContext(GlobalContext);
  const setError = globalContext.errors.setError;

  const [isError, setIsError] = useState(false);
  const [isFormSuccess, setIsFormSuccess] = useState(false);

  const failMessageRef = useRef('');

  const router = useRouter();

  const { isLoggedIn } = useAccount();

  useEffect(() => {
    if (!isLoggedIn) router.replace('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const errorNotification = useNotifier({
    title: 'There was a problem!',
    description: () => failMessageRef.current,
    duration: 5000,
    id: 'tables-creation-error',
    type: 'error',
  });

  function handleSendRequest() {
    const teamNames: string[] = [];
    teamInputs.forEach((division) => {
      division.forEach((team) => {
        teamNames.push(team.name);
      });
    });
    return fetchAPI(`${API_URL}/leagues/${leagueId}/teams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        teams: teamNames,
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
        errorNotification?.fire();
        setIsError(true);
      } else {
        setError(result.message);
      }
    },
    onError: (e) => {
      setError(e.message);
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
    <Card className="w-[464px] place-self-center px-8 pt-6 pb-10  bg-linear-to-br from-content1 to-content2 ">
      <CardBody>
        <div>
          <Paragraph className="font-medium">
            Team Setup: {leagueName}
          </Paragraph>
          <Label className="opacity-80 dark:opacity-70">Part 3 of 3</Label>
        </div>
        <Spacer y={4} />
        <Form onSubmit={handleSubmit}>
          {divisions.map((division, i) => {
            return (
              <div className="flex flex-col gap-2 w-full" key={i + 1}>
                <p className="text-medium">
                  Division {division.divisionNumber} - {division.name}
                </p>
                <FormSection
                  teamInputs={teamInputs}
                  setTeamInputs={setTeamInputs}
                  division={division}
                />
                {/* {i !== divisionsCount - 1 && <Divider className="my-4" />} */}
              </div>
            );
          })}
          <Spacer y={2} />
          <Button
            type="submit"
            variant={isFormSuccess ? 'flat' : 'solid'}
            color={isFormSuccess ? 'success' : 'primary'}
            fullWidth
            className="font-semibold text-small"
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
  teamInputs: { name: string }[][];
  setTeamInputs: Dispatch<SetStateAction<{ name: string }[][]>>;

  division: {
    divisionNumber: number;
    name: string;
    numberOfTeams: number;
  };
}

function FormSection({
  teamInputs,
  setTeamInputs,
  division,
}: FormSectionProps) {
  return (
    <div className="flex flex-col gap-2">
      {Array(division.numberOfTeams)
        .fill('')
        .map((_str, i) => {
          return (
            <Input
              value={teamInputs[division.divisionNumber - 1][i].name}
              onChange={(e) => {
                setTeamInputs((prev) => {
                  const newOne = [...prev];
                  newOne[division.divisionNumber - 1][i].name = e.target.value;

                  return newOne;
                });
              }}
              key={i}
              size="md"
              radius="md"
              name={`teamInput${i + 1}`}
              label={`Team ${i + 1}`}
              labelPlacement="inside"
              type="text"
              variant="bordered"
              fullWidth
              isRequired
              validate={(value) => {
                // Get list of team names, excluding this one
                const teamNames: string[] = [];
                const divisionIndex = division.divisionNumber - 1;

                teamInputs.map((division, j) => {
                  const filteredTeamNames = division
                    .filter((team, k) => j !== divisionIndex || k !== i)
                    .map((team) => team.name);

                  console.log(filteredTeamNames);

                  teamNames.push(...filteredTeamNames);
                }); // Check if this team name is in that list

                if (teamNames.includes(value)) {
                  // If so, there is a clash
                  return 'This team name is already in use';
                }
              }}
            />
          );
        })}
    </div>
  );
}
