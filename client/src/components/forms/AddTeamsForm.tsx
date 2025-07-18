'use client';
import Button from '@/components/text/Button';
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { API_URL } from '@/util/config';
import { GlobalContext } from '@/context/GlobalContextProvider';
import { useRouter } from 'next/navigation';
import { fetchAPI } from '@/util/api';
import Label from '../text/Label';
import useAccount from '@/hooks/useAccount';
import Subtitle from '../text/Subtitle';

export default function AddTeamsForm({
  divisions,
  leagueId,
}: {
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

  const [teamErrors, setTeamErrors] =
    useState<{ name: string }[][]>(emptyErrors);

  const globalContext = useContext(GlobalContext);
  const setError = globalContext.errors.setError;

  const [buttonText, setButtonText] = useState("Let's go!");
  const [buttonColor, setButtonColor] = useState('var(--primary)');
  const [buttonHoverColor, setButtonHoverColor] = useState('var(--accent)');

  const router = useRouter();

  const { isLoggedIn } = useAccount();

  useEffect(() => {
    if (!isLoggedIn) router.replace('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // fyi default browser validation shouldve ensured the inputs are given and valid
    e.preventDefault();

    // const freshErrors = [...emptyErrors];
    let errorsPresent = false;

    // Make sure team names are unique
    const teamNames: string[] = [];
    teamInputs.forEach((division) => {
      division.forEach((team) => {
        teamNames.push(team.name);
      });
    });
    if (new Set(teamNames).size !== teamNames.length) {
      setError('Team names must be unique across all divisions');
      errorsPresent = true;
    }

    // true means there are errors

    if (errorsPresent) return;

    setButtonText('...');

    try {
      const response = await fetchAPI(`${API_URL}/leagues/${leagueId}/teams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teams: teamNames,
        }),
        credentials: 'include',
      });

      if (response.status === 'fail') {
        setError(response.data.message);
      } else if (response.status === 'error') {
        const message = response.message as string;
        setError(message);
      } else {
        // success
        // Do a nice welcome animation
        setButtonText('Success!');
        setButtonColor('var(--success)');
        setButtonHoverColor('var(--bg-light)');

        setTimeout(() => {
          router.push(`/leagues/${leagueId}`);
        }, 300);
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-[20px] w-full bg-[var(--bg)] rounded-[10px] border-1 border-[var(--border)] flex flex-col gap-2"
    >
      {divisions.map((division, i) => {
        return (
          <div className="flex flex-col gap-2" key={i + 1}>
            <Subtitle>
              Division {division.divisionNumber}{' '}
              <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
                - {division.name}
              </span>
            </Subtitle>

            <FormSection
              teamInputs={teamInputs}
              setTeamInputs={setTeamInputs}
              teamErrors={teamErrors}
              setTeamErrors={setTeamErrors}
              division={division}
            />
          </div>
        );
      })}
      <Button
        type="submit"
        color={buttonColor}
        bgHoverColor={buttonHoverColor}
        onClick={() => {}}
        style={{ width: '100%' }}
      >
        {buttonText}
      </Button>
    </form>
  );
}

interface FormSectionProps {
  teamInputs: { name: string }[][];
  setTeamInputs: Dispatch<SetStateAction<{ name: string }[][]>>;
  teamErrors: { name: string }[][];
  setTeamErrors: Dispatch<SetStateAction<{ name: string }[][]>>;

  division: {
    divisionNumber: number;
    name: string;
    numberOfTeams: number;
  };
}

function FormSection({
  teamInputs,
  setTeamInputs,
  teamErrors,
  setTeamErrors,
  division,
}: FormSectionProps) {
  return (
    <div className="flex flex-col gap-2">
      {Array(division.numberOfTeams)
        .fill('')
        .map((_str, i) => {
          return (
            <div
              className="flex flex-col justify-baseline items-baseline w-full"
              key={i + 1}
            >
              <Label
                style={{
                  fontWeight: 'bold',
                }}
              >
                Team {i + 1} name
              </Label>
              <input
                type="text"
                required
                className="bg-[var(--bg-light)] rounded-[10px] px-[16px] py-[8px] font-[family-name:var(--font-instrument-sans)] font-normal text-[1rem] md:text-[1.125rem] xl:text-[1.25rem] text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none border-black/50 border-2 w-full 
              "
                placeholder="Team name"
                value={teamInputs[division.divisionNumber - 1][i].name}
                onChange={(e) => {
                  setTeamErrors((prev) => {
                    const newOne = [...prev];
                    newOne[division.divisionNumber - 1][i].name = '';
                    return newOne;
                  });
                  setTeamInputs((prev) => {
                    const newOne = [...prev];
                    newOne[division.divisionNumber - 1][i].name =
                      e.target.value;

                    return newOne;
                  });
                }}
              />
              <Label
                style={{
                  fontWeight: 'bold',
                  color: 'var(--danger)',
                  width: '100%',
                  opacity: teamErrors[division.divisionNumber - 1][i].name
                    ? undefined
                    : '0',
                }}
              >
                Error
                <span className="font-normal">
                  {' '}
                  - {teamErrors[division.divisionNumber - 1][i].name}
                </span>
              </Label>
            </div>
          );
        })}
    </div>
  );
}
