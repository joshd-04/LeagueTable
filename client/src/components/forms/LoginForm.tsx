import InputField from '@/components/form/InputField';
import Button from '@/components/text/Button';
import { useContext, useState } from 'react';
import { API_URL } from '@/util/config';
import { GlobalContext } from '@/context/GlobalContextProvider';
import { User } from '@/util/definitions';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
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
  const setUser = globalContext.account.setUser;
  const setError = globalContext.errors.setError;

  const [buttonColor, setButtonColor] = useState('var(--primary)');
  const [buttonHoverColor, setButtonHoverColor] = useState('var(--accent)');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // fyi default browser validation shouldve ensured the inputs are given and valid
    e.preventDefault();

    if (!username) {
      setUsernameError('this is required');
    }
    if (!password) {
      setPasswordError('this is required');
    }

    if (usernameError || passwordError) return;

    setButtonText('...');

    // p.s password hashing will be done on server side. much safer that way.
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          email: null,
          password: password,
        }),
      });

      const body = await response.json();
      setButtonText("Let's go");

      if (body.status === 'fail') {
        const message = body.data.message as string;
        setError(message);
      } else if (body.status === 'error') {
        const message = body.data.message as string;
        setError(message);
      } else {
        // success, when successfully logging in, the account info is returned from the api, without extra structure
        const user: User = {
          id: body.userId,
          username: body.username,
          email: body.email,
          accountType: body.accountType,
          JWTToken: body.token,
        };
        setUser(user);
        // Do a nice welcome animation
        setButtonText('Welcome!');
        setButtonColor('var(--success)');
        setButtonHoverColor('var(--bg-light)');
        setTimeout(() => {
          router.push('/');
        }, 300);
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
        onClick={() => {}}
        style={{ width: '100%' }}
      >
        {buttonText}
      </Button>
    </form>
  );
}
