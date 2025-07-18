import InputField from '@/components/form/InputField';
import Button from '@/components/text/Button';
import { useContext, useEffect, useState } from 'react';
import { API_URL } from '@/util/config';
import { GlobalContext } from '@/context/GlobalContextProvider';
import { useRouter } from 'next/navigation';
import { fetchAPI } from '@/util/api';
import Label from '../text/Label';
import { motion } from 'motion/react';
import useAccount from '@/hooks/useAccount';

export default function CreateLeagueForm() {
  // Values
  const [leagueName, setLeagueName] = useState<string | number>('');
  const [maxSeasonCount, setMaxSeasonCount] = useState<string | number>('');
  const [leagueType, setLeagueType] = useState<'basic' | 'advanced' | null>(
    null
  );
  const [divisionsCount, setDivisionsCount] = useState<string | number>('');

  // Errors
  const [leagueNameError, setLeagueNameError] = useState('');
  const [maxSeasonCountError, setMaxSeasonCountError] = useState('');
  const [leagueTypeError, setLeagueTypeError] = useState('');
  const [divisionsCountError, setDivisionsCountError] = useState('');

  const globalContext = useContext(GlobalContext);
  const setError = globalContext.errors.setError;

  const [buttonText, setButtonText] = useState('Next');
  const [buttonColor, setButtonColor] = useState('var(--primary)');
  const [buttonHoverColor, setButtonHoverColor] = useState('var(--accent)');

  const router = useRouter();

  const { isLoggedIn } = useAccount();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // fyi default browser validation shouldve ensured the inputs are given and valid
    e.preventDefault();
    let errorsPresent = false;

    if (!leagueName) {
      setLeagueNameError('this is required');
      errorsPresent = true;
    }
    if (!maxSeasonCount) {
      setMaxSeasonCountError('this is required');
      errorsPresent = true;
    }
    if (!leagueType) {
      setLeagueTypeError('this is required');
      errorsPresent = true;
    }
    if (!divisionsCount) {
      setDivisionsCountError('this is required');
      errorsPresent = true;
    }
    if (+maxSeasonCount <= 0) {
      setMaxSeasonCountError('must be greater than zero');
      errorsPresent = true;
    }
    if (+divisionsCount <= 0) {
      setDivisionsCountError('must be greater than zero');
      errorsPresent = true;
    }
    if (+maxSeasonCount <= 0) {
      setMaxSeasonCountError('must be greater than zero');
      errorsPresent = true;
    }
    if (!Number.isInteger(+maxSeasonCount)) {
      setMaxSeasonCountError('must be an integer');
      errorsPresent = true;
    }
    if (!Number.isInteger(+divisionsCount)) {
      setDivisionsCountError('must be an integer');
      errorsPresent = true;
    }

    if (errorsPresent) return;

    setButtonText('...');

    try {
      const response = await fetchAPI(`${API_URL}/leagues`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: leagueName,
          maxSeasonCount: maxSeasonCount,
          leagueType: leagueType,
          divisionsCount: divisionsCount,
        }),
        credentials: 'include',
      });
      setButtonText("Let's go");

      if (response.status === 'fail') {
        if (response.data.name) {
          setLeagueNameError(response.data.name);
        }
        if (response.data.maxSeasonCount) {
          setMaxSeasonCountError(response.data.maxSeasonCount);
        }
        if (response.data.leagueType) {
          setLeagueTypeError(response.data.leagueType);
        }
        if (response.data.divisionsCount) {
          setDivisionsCountError(response.data.divisionsCount);
        }
      } else if (response.status === 'error') {
        const message = response.data.message as string;
        setError(message);
      } else {
        // success
        // Do a nice welcome animation
        setButtonText('Success!');
        setButtonColor('var(--success)');
        setButtonHoverColor('var(--bg-light)');
        setTimeout(() => {
          router.push(`/leagues/${response.data.league._id}`);
        }, 300);
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-[20px]  w-full bg-[var(--bg)] rounded-[10px] border-1 border-[var(--border)] flex flex-col gap-2"
    >
      <InputField
        type="text"
        value={leagueName}
        setValue={setLeagueName}
        error={leagueNameError}
        setError={setLeagueNameError}
        options={{
          label: 'League Name',
          labelCaption: 'visible to others',
          placeholder: 'League Name',
        }}
      />
      <InputField
        type="number"
        value={maxSeasonCount}
        setValue={setMaxSeasonCount}
        error={maxSeasonCountError}
        setError={setMaxSeasonCountError}
        options={{
          label: 'Maximum Season Count',
          labelCaption: 'how long the league will run for',
          placeholder: 'Max season count',
        }}
      />
      <LeagueTypeSelection
        selection={leagueType}
        setSelection={setLeagueType}
        error={leagueTypeError}
        setError={setLeagueTypeError}
      />
      <InputField
        type="number"
        value={divisionsCount}
        setValue={setDivisionsCount}
        error={divisionsCountError}
        setError={setDivisionsCountError}
        options={{
          label: 'Number of Tables/Divisions',
          placeholder: 'Number of divisions',
        }}
      />
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

interface LeagueTypeSelectionProps {
  selection: 'basic' | 'advanced' | null;
  setSelection: (selection: 'basic' | 'advanced' | null) => void;
  error: string;
  setError: (error: string) => void;
}

function LeagueTypeSelection({
  selection,
  setSelection,
  error,
  setError,
}: LeagueTypeSelectionProps) {
  const [hoveringElement, setHoveringElement] = useState<
    'basic' | 'advanced' | null
  >(null);

  return (
    <div className="flex flex-col justify-baseline items-baseline w-full">
      <Label style={{ 
            fontWeight:'bold', }}>League Type</Label>

      <fieldset
        className="rounded-[10px] py-[8px] font-[family-name:var(--font-instrument-sans)] font-normal text-[1rem] md:text-[1.125rem] xl:text-[1.25rem] text-[var(--text)] placeholder:text-[var(--text-muted)] w-full grid grid-rows-1 grid-cols-2 gap-[10px] relative
          "
        onChange={() => {
          setSelection('basic');
        }}
      >
        <motion.label
          onHoverStart={() => setHoveringElement('basic')}
          onHoverEnd={() => setHoveringElement(null)}
          onClick={() => setSelection('basic')}
        >
          <input
            type="radio"
            name="choice"
            value="basic"
            required
            checked={selection === 'basic'}
            onChange={() => {
              setError('');
              setSelection('basic');
            }}
            className="sr-only"
          />
          <Button
            color="var(--text-muted)"
            bgHoverColor="var(--bg-light)"
            style={{
              width: '100% ',
              backgroundColor:
                selection === 'basic'
                  ? 'var(--accent)'
                  : hoveringElement === 'basic'
                  ? 'var(--bg-light)'
                  : 'transparent',
              borderColor: selection === 'basic' ? 'transparent' : undefined,
            }}
          >
            Basic
          </Button>
        </motion.label>

        <motion.label
          onHoverStart={() => setHoveringElement('advanced')}
          onHoverEnd={() => setHoveringElement(null)}
          onClick={() => setSelection('advanced')}
        >
          <input
            type="radio"
            name="choice"
            value="advanced"
            required
            checked={selection === 'advanced'}
            onChange={() => {
              setError('');
              setSelection('advanced');
            }}
            className="sr-only"
          />
          <Button
            color="var(--text-muted)"
            bgHoverColor="var(--bg-light)"
            style={{
              width: '100%',
              backgroundColor:
                selection === 'advanced'
                  ? 'var(--accent)'
                  : hoveringElement === 'advanced'
                  ? 'var(--bg-light)'
                  : 'transparent',
              borderColor: selection === 'advanced' ? 'transparent' : undefined,
            }}
          >
            Advanced
          </Button>
        </motion.label>
      </fieldset>
      <Label
        style={{
            fontWeight:'bold',
          color: 'var(--danger)',
          width: '100%',
          opacity: error ? undefined : '0',
        }}
      >
        Error<span className="font-normal"> - {error}</span>
      </Label>
    </div>
  );
}
