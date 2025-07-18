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

interface DivisionInputsInterface {
  tableName: string;
  numberOfTeams: string | number;
  numberOfTeamsToBePromoted: string | number;
  numberOfTeamsToBeRelegated: string | number;
}

interface DivisionInputErrorsInterface {
  tableName: string;
  numberOfTeams: string;
  numberOfTeamsToBePromoted: string;
  numberOfTeamsToBeRelegated: string;
}

export default function AddTablesForm({
  divisionsCount,
  leagueId,
}: {
  divisionsCount: number;
  leagueId: string;
}) {
  // Values
  const emptyInputs: DivisionInputsInterface[] = [];

  const emptyErrors: DivisionInputErrorsInterface[] = [];
  for (let i = 0; i < divisionsCount; i++) {
    emptyInputs.push({
      tableName: '',
      numberOfTeams: '',
      numberOfTeamsToBePromoted: '',
      numberOfTeamsToBeRelegated: '',
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

  const globalContext = useContext(GlobalContext);
  const setError = globalContext.errors.setError;

  const [buttonText, setButtonText] = useState('Next');
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

    const freshErrors = [...emptyErrors];

    divisionInputs.forEach((divisionInput, i) => {
      if (divisionInput.tableName.length === 0) {
        freshErrors[i].tableName = 'this is required';
      }
      if (+divisionInput.numberOfTeams <= 0) {
        freshErrors[i].numberOfTeams = 'this is required';
      }
      if (+divisionInput.numberOfTeams > 24) {
        freshErrors[i].numberOfTeams = 'too many teams (max. 24)';
      }
      if (divisionInput.numberOfTeamsToBeRelegated.toString().length === 0) {
        divisionInput.numberOfTeamsToBeRelegated = 0;
      }
      if (divisionInput.numberOfTeamsToBePromoted.toString().length === 0) {
        divisionInput.numberOfTeamsToBePromoted = 0;
      }
      if (+divisionInput.numberOfTeamsToBeRelegated < 0) {
        freshErrors[i].numberOfTeamsToBeRelegated = 'must be a positive number';
      }
      if (+divisionInput.numberOfTeamsToBePromoted < 0) {
        freshErrors[i].numberOfTeamsToBePromoted = 'must be a positive number';
      }
      if (!Number.isInteger(+divisionInput.numberOfTeams)) {
        freshErrors[i].numberOfTeams = 'must be an integer';
      }
      if (!Number.isInteger(+divisionInput.numberOfTeamsToBePromoted)) {
        freshErrors[i].numberOfTeamsToBePromoted = 'must be an integer';
      }
      if (!Number.isInteger(+divisionInput.numberOfTeamsToBeRelegated)) {
        freshErrors[i].numberOfTeamsToBeRelegated = 'must be an integer';
      }
    });

    // Ensure each division name is unique
    const uniqueCount = new Set(
      divisionInputs.map((divisionInput) => divisionInput.tableName)
    ).size;
    if (uniqueCount !== divisionInputs.length) {
      setError('Table names must be unique');
      return;
    }

    setDivisionErrors(freshErrors);

    // true means there are errors
    const x = freshErrors.map((freshErrorSet) => {
      if (
        freshErrorSet.tableName !== '' ||
        freshErrorSet.numberOfTeams !== '' ||
        freshErrorSet.numberOfTeamsToBePromoted !== '' ||
        freshErrorSet.numberOfTeamsToBeRelegated !== ''
      )
        return true;
      return false;
    });
    const errorsPresent = x.some((b) => b === true);

    if (errorsPresent) return;

    setButtonText('...');

    try {
      const response = await fetchAPI(`${API_URL}/leagues/${leagueId}/tables`, {
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

      if (response.status === 'fail') {
        setError(response.data.message);
        setButtonText('Next');
      } else if (response.status === 'error') {
        const message = response.message as string;
        setError(message);
        setButtonText('Next');
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
      {Array(divisionsCount)
        .fill('')
        .map((str, i) => {
          return (
            <div className="flex flex-col gap-2" key={i + 1}>
              <Subtitle>Division {i + 1}</Subtitle>
              <FormSection
                divisionInputs={divisionInputs}
                setDivisionInputs={setDivisionInputs}
                divisionErrors={divisionErrors}
                setDivisionErrors={setDivisionErrors}
                divisionIndex={i}
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
  divisionInputs: DivisionInputsInterface[];
  setDivisionInputs: Dispatch<SetStateAction<DivisionInputsInterface[]>>;
  divisionErrors: DivisionInputErrorsInterface[];
  setDivisionErrors: Dispatch<SetStateAction<DivisionInputErrorsInterface[]>>;

  divisionIndex: number;
}

function FormSection({
  divisionInputs,
  setDivisionInputs,
  divisionErrors,
  setDivisionErrors,
  divisionIndex,
}: FormSectionProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col justify-baseline items-baseline w-full">
        <Label style={{ fontWeight: 'bold' }}>Table name</Label>
        <input
          type="text"
          required
          className="bg-[var(--bg-light)] rounded-[10px] px-[16px] py-[8px] font-[family-name:var(--font-instrument-sans)] font-normal text-[1rem] md:text-[1.125rem] xl:text-[1.25rem] text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none border-black/50 border-2 w-full 
              "
          placeholder="Table name"
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
        />
        <Label
          style={{
            color: 'var(--danger)',
            fontWeight: 'bold',
            width: '100%',
            opacity: divisionErrors[divisionIndex].tableName ? undefined : '0',
          }}
        >
          Error
          <span className="font-normal">
            {' '}
            - {divisionErrors[divisionIndex].tableName}
          </span>
        </Label>
      </div>
      <div className="flex flex-col justify-baseline items-baseline w-full">
        <Label
          style={{
            fontWeight: 'bold',
          }}
        >
          Number of teams
        </Label>
        <input
          type="number"
          step={1}
          required
          className="bg-[var(--bg-light)] rounded-[10px] px-[16px] py-[8px] font-[family-name:var(--font-instrument-sans)] font-normal text-[1rem] md:text-[1.125rem] xl:text-[1.25rem] text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none border-black/50 border-2 w-full 
              "
          placeholder="Number of teams"
          value={divisionInputs[divisionIndex].numberOfTeams}
          onChange={(e) => {
            setDivisionErrors((prev) => {
              const newOne = [...prev];
              newOne[divisionIndex].numberOfTeams = '';
              return newOne;
            });
            setDivisionInputs((prev) => {
              const newOne = [...prev];
              newOne[divisionIndex].numberOfTeams = +e.target.value;
              return newOne;
            });
          }}
        />
        <Label
          style={{
            color: 'var(--danger)',
            fontWeight: 'bold',
            width: '100%',
            opacity: divisionErrors[divisionIndex].numberOfTeams
              ? undefined
              : '0',
          }}
        >
          Error
          <span className="font-normal">
            {' '}
            - {divisionErrors[divisionIndex].numberOfTeams}
          </span>
        </Label>
      </div>
      <div className="flex flex-col justify-baseline items-baseline w-full">
        <Label
          style={{
            fontWeight: 'bold',
          }}
        >
          Number of teams to be promoted
        </Label>
        <input
          type="number"
          step={1}
          className="bg-[var(--bg-light)] rounded-[10px] px-[16px] py-[8px] font-[family-name:var(--font-instrument-sans)] font-normal text-[1rem] md:text-[1.125rem] xl:text-[1.25rem] text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none border-black/50 border-2 w-full 
              "
          placeholder="Default: 0"
          value={divisionInputs[divisionIndex].numberOfTeamsToBePromoted}
          onChange={(e) => {
            setDivisionErrors((prev) => {
              const newOne = [...prev];
              newOne[divisionIndex].numberOfTeamsToBePromoted = '';
              return newOne;
            });
            setDivisionInputs((prev) => {
              const newOne = [...prev];
              newOne[divisionIndex].numberOfTeamsToBePromoted = +e.target.value;
              return newOne;
            });
          }}
        />
        <Label
          style={{
            fontWeight: 'bold',
            color: 'var(--danger)',
            width: '100%',
            opacity: divisionErrors[divisionIndex].numberOfTeamsToBePromoted
              ? undefined
              : '0',
          }}
        >
          Error
          <span className="font-normal">
            {' '}
            - {divisionErrors[divisionIndex].numberOfTeamsToBePromoted}
          </span>
        </Label>
      </div>
      <div className="flex flex-col justify-baseline items-baseline w-full">
        <Label
          style={{
            fontWeight: 'bold',
          }}
        >
          Number of teams to be relegated
        </Label>
        <input
          type="number"
          step={1}
          className="bg-[var(--bg-light)] rounded-[10px] px-[16px] py-[8px] font-[family-name:var(--font-instrument-sans)] font-normal text-[1rem] md:text-[1.125rem] xl:text-[1.25rem] text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none border-black/50 border-2 w-full 
              "
          placeholder="Default: 0"
          value={divisionInputs[divisionIndex].numberOfTeamsToBeRelegated}
          onChange={(e) => {
            setDivisionErrors((prev) => {
              const newOne = [...prev];
              newOne[divisionIndex].numberOfTeamsToBeRelegated = '';
              return newOne;
            });
            setDivisionInputs((prev) => {
              const newOne = [...prev];
              newOne[divisionIndex].numberOfTeamsToBeRelegated =
                +e.target.value;
              return newOne;
            });
          }}
        />
        <Label
          style={{
            color: 'var(--danger)',
            fontWeight: 'bold',
            width: '100%',
            opacity: divisionErrors[divisionIndex].numberOfTeamsToBeRelegated
              ? undefined
              : '0',
          }}
        >
          Error
          <span className="font-normal">
            {' '}
            - {divisionErrors[divisionIndex].numberOfTeamsToBeRelegated}
          </span>
        </Label>
      </div>
    </div>
  );
}
