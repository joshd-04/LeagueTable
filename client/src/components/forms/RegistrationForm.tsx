import InputField from '@/components/form/InputField';
import Button from '@/components/text/Button';
import { useContext, useState } from 'react';
import { API_URL } from '@/util/config';
import { GlobalContext } from '@/context/GlobalContextProvider';
import { User } from '@/util/definitions';
import { useRouter } from 'next/navigation';
import { fetchAPI } from '@/util/api';

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

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // fyi default browser validation shouldve ensured the inputs are given and valid
    e.preventDefault();

    if (!username) {
      setUsernameError('this is required');
    }
    if (!email) {
      setEmailError('this is required');
    }
    if (!password) {
      setPasswordError('this is required');
    }
    if (!passwordConfirmation) {
      setPasswordConfirmationError('this is required');
    }

    if (password.toString().length < 8) {
      setPasswordError('needs to be atleast 8 characters');
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
    }

    if (password !== passwordConfirmation) {
      setPasswordConfirmationError('passwords do not match');
    }

    if (
      usernameError ||
      emailError ||
      passwordError ||
      passwordConfirmationError
    )
      return;

    setButtonText('...');

    // p.s password hashing will be done on server side. much safer that way.
    try {
      const response = await fetchAPI(`${API_URL}/register`, {
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

      setButtonText("Let's go");

      if (response.status === 'fail') {
        if (response.statusCode === 409) {
          const message = response.data.message as string;
          if (message.includes('email')) {
            setEmailError(message);
          } else if (message.includes('username')) {
            setUsernameError(message);
          }
        }
      } else if (response.status === 'error') {
        const message = response.data.message as string;
        setError(message);
      } else {
        // success
        const user: User = {
          id: response.data.userId,
          username: response.data.username,
          email: response.data.email,
          accountType: response.data.accountType,
        };
        setUser(user);
        router.push('/');
      }
    } catch (err) {
      const e = await err;
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
        color="var(--primary)"
        bgHoverColor="var(--accent)"
        onClick={() => {}}
        style={{ width: '100%' }}
      >
        {buttonText}
      </Button>
    </form>
  );
}
