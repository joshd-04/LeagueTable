import InputField from '@/components/form/InputField';
import Button from '@/components/text/Button';
import { useContext, useState } from 'react';
import { API_URL } from '@/util/config';
import { GlobalContext } from '@/context/GlobalContextProvider';
import { useRouter } from 'next/navigation';
import { fetchAPI } from '@/util/api';
import { useMutation } from '@tanstack/react-query';
import { useNotifier } from '@/hooks/useNotifier';

export default function LoginForm({
  callbackUrl = '/',
}: {
  callbackUrl?: string;
}) {
  // Values
  const [username, setUsername] = useState<string | number>('');
  // const [email, setEmail] = useState<string | number>('');
  const [password, setPassword] = useState<string | number>('');

  // Errors
  const [usernameError, setUsernameError] = useState('');
  // const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [buttonText, setButtonText] = useState('Let me in!');

  const globalContext = useContext(GlobalContext);
  const setError = globalContext.errors.setError;

  const [buttonColor, setButtonColor] = useState('var(--primary)');
  const [buttonHoverColor, setButtonHoverColor] = useState('var(--accent)');
  const router = useRouter();

  const invalidCredentialsNotification = useNotifier({
    title: 'Invalid credentials',
    description: 'Make sure your username and password were entered correctly',
    id: 'invalid-login',
    type: 'error',
    duration: 5000,
  });

  function handleSendRequest() {
    return fetchAPI(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        email: null,
        password: password,
      }),
      credentials: 'include',
    });
  }

  const { mutateAsync: handleRequestMutation, isPending } = useMutation({
    mutationFn: handleSendRequest,
    onSuccess: (result) => {
      if (result.status === 'success') {
        setButtonText('Welcome!');
        setButtonColor('var(--success)');
        setButtonHoverColor('var(--bg-light)');
        setTimeout(() => {
          router.push(callbackUrl);
        }, 300);
      } else if (result.status === 'fail') {
        setButtonText('Invalid credentials');
        setButtonColor('var(--danger)');
        setButtonHoverColor('var(--bg-light)');
        invalidCredentialsNotification?.fire();

        setTimeout(() => {
          setButtonColor('var(--primary)');
          setButtonHoverColor('var(--accent)');
          setButtonText('Let me in!');
        }, 2000);
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
    let errorsPresent = false;

    if (!username) {
      setUsernameError('this is required');
      errorsPresent = true;
    }
    if (!password) {
      setPasswordError('this is required');
      errorsPresent = true;
    }

    if (errorsPresent) return;

    // p.s password hashing will be done on server side.
    try {
      handleRequestMutation();
    } catch (e) {
      console.error(e);
    }
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="p-[20px] mt-[40px] w-[620px] bg-[var(--bg)] rounded-[10px] border-1 border-[var(--border)] flex flex-col gap-2"
    >
      <InputField
        type="text"
        value={username}
        setValue={setUsername}
        error={usernameError}
        setError={setUsernameError}
        options={{
          label: 'Username',
          placeholder: 'Username',
        }}
      />
      <InputField
        type="password"
        value={password}
        setValue={setPassword}
        error={passwordError}
        setError={setPasswordError}
        options={{
          label: 'Password',
          placeholder: 'Password',
        }}
      />
      <Button
        type="submit"
        color={buttonColor}
        bgHoverColor={buttonHoverColor}
        style={{ width: '100%' }}
      >
        {isPending ? '...' : buttonText}
      </Button>
    </form>
  );
}
