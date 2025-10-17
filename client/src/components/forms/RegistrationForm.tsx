import InputField from '@/components/form/InputField';
import Button from '@/components/text/Button';
import { useContext, useState } from 'react';
import { API_URL } from '@/util/config';
import { GlobalContext } from '@/context/GlobalContextProvider';
import { User } from '@/util/definitions';
import { useRouter } from 'next/navigation';
import { fetchAPI } from '@/util/api';
import { useMutation } from '@tanstack/react-query';

export default function RegistrationForm() {
  // Values
  const [username, setUsername] = useState<string | number>('');
  const [email, setEmail] = useState<string | number>('');
  const [password, setPassword] = useState<string | number>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<
    string | number
  >('');

  // Errors
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordConfirmationError, setPasswordConfirmationError] =
    useState('');
  const [buttonText, setButtonText] = useState("Let's go!");

  const globalContext = useContext(GlobalContext);
  const setUser = globalContext.account.setUser;
  const setError = globalContext.errors.setError;

  const [buttonColor, setButtonColor] = useState('var(--primary)');
  const [buttonHoverColor, setButtonHoverColor] = useState('var(--accent)');
  const router = useRouter();

  function handleSendRequest() {
    return fetchAPI(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }),
      credentials: 'include',
    });
  }

  const { mutateAsync: handleRequestMutation, isPending } = useMutation({
    mutationFn: handleSendRequest,
    onSuccess: (result) => {
      if (result.status === 'success') {
        const user: User = {
          id: result.data.userId,
          username: result.data.username,
          email: result.data.email,
          accountType: result.data.accountType,
        };
        setUser(user);
        router.push('/');
      } else if (result.status === 'fail') {
        if (result.statusCode === 409) {
          const message = result.data.message as string;
          if (message.includes('email')) {
            setEmailError(message);
          } else if (message.includes('username')) {
            setUsernameError(message);
          }
        }

        setButtonText('There was a problem, try again');
        setButtonColor('var(--warning)');
        setButtonHoverColor('var(--bg-light)');

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
    if (!email) {
      setEmailError('this is required');
      errorsPresent = true;
    }
    if (!password) {
      setPasswordError('this is required');
      errorsPresent = true;
    }
    if (!passwordConfirmation) {
      setPasswordConfirmationError('this is required');
      errorsPresent = true;
    }

    if (password.toString().length < 8) {
      setPasswordError('needs to be atleast 8 characters');
      errorsPresent = true;
    }
    // Go through password and see if upper lower and number are present
    let containsUpper = false;
    let containsLower = false;
    let containsNumber = false;

    password
      .toString()
      .split('')
      .forEach((char) => {
        if (char === char.toLowerCase()) containsLower = true;
        if (char === char.toUpperCase()) containsUpper = true;
        if (!isNaN((char as unknown as number) - parseInt(char)))
          containsNumber = true;
      });
    if (!(containsLower && containsUpper && containsNumber)) {
      setPasswordError(
        'needs to have atleast 1 lowercase, 1 uppercase and 1 number'
      );
      errorsPresent = true;
    }

    if (password !== passwordConfirmation) {
      setPasswordConfirmationError('passwords do not match');
      errorsPresent = true;
    }

    if (errorsPresent) return;

    // p.s password hashing will be done on server side. much safer that way.
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
          labelCaption: 'visible to others',
          placeholder: 'Username',
        }}
      />
      <InputField
        type="email"
        value={email}
        setValue={setEmail}
        error={emailError}
        setError={setEmailError}
        options={{
          label: 'Email',
          placeholder: 'Email',
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
      <InputField
        type="password"
        value={passwordConfirmation}
        setValue={setPasswordConfirmation}
        error={passwordConfirmationError}
        setError={setPasswordConfirmationError}
        options={{
          label: 'Re-type password',
          placeholder: 'Re-type password',
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
