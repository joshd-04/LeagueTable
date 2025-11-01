'use client';
import { Button, Card, CardBody, Form, Input } from '@heroui/react';
import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { useMutation } from '@tanstack/react-query';
import { GlobalContext } from '@/context/GlobalContextProvider';
import { User } from '@/util/definitions';

export default function RegistrationForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const [isError, setIsError] = useState(false);
  const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);

  const [serverErrors, setServerErrors] = useState<{ [key: string]: string }>(
    {}
  );

  const globalContext = useContext(GlobalContext);
  const setUser = globalContext.account.setUser;
  const setError = globalContext.errors.setError;

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
        setIsRegisterSuccess(true);
        const user: User = {
          id: result.data.userId,
          username: result.data.username,
          email: result.data.email,
          accountType: result.data.accountType,
        };
        setUser(user);
        setTimeout(() => {
          router.push('/');
        }, 300);
      } else if (result.status === 'fail') {
        if (result.statusCode === 400) {
          setIsError(true);
          const errors: { [key: string]: string } = result.data.errors;
          setServerErrors(errors);
        }
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

    // p.s password hashing will be done on server side.
    try {
      handleRequestMutation();
    } catch (e) {
      console.error(e);
    }
  }

  function passwordValidationFn(value: string) {
    const errors = [];
    if (value.length < 8) {
      errors.push('Password must be atleast 8 characters');
    }
    if ((value.match(/[a-z]/g) || []).length < 1) {
      errors.push('Password must include at least 1 lower case letter');
    }
    if ((value.match(/[A-Z]/g) || []).length < 1) {
      errors.push('Password must include at least 1 upper case letter');
    }
    if ((value.match(/[^a-z0-9]/gi) || []).length < 1) {
      errors.push('Password must include at least 1 symbol.');
    }
    setPasswordErrors(errors);
  }

  return (
    <Card className="w-[400px] mt-[40px]">
      <CardBody>
        <Form onSubmit={handleSubmit} validationErrors={serverErrors}>
          <Input
            value={username}
            onChange={(e) => {
              const newVal = e.target.value.trim();
              setUsername(newVal);
            }}
            size="md"
            radius="md"
            name="username"
            label="Username"
            labelPlacement="inside"
            type="text"
            variant="bordered"
            isRequired
            onFocus={() => setIsError(false)}
            description={
              <span className="opacity-80 dark:opacity-70">
                Visible to others
              </span>
            }
          />
          <Input
            value={email}
            onValueChange={setEmail}
            size="md"
            radius="md"
            name="email"
            label="Email"
            labelPlacement="inside"
            type="email"
            variant="bordered"
            isRequired
            onFocus={() => setIsError(false)}
            description={
              <span className="opacity-80 dark:opacity-70">
                Only you can see this. We&apos;ll never share your email with
                anyone.
              </span>
            }
          />
          <Input
            value={password}
            onValueChange={setPassword}
            onChange={(e) => {
              passwordValidationFn(e.target.value);
            }}
            size="md"
            radius="md"
            name="password"
            label="Password"
            labelPlacement="inside"
            type="password"
            variant="bordered"
            isRequired
            onFocus={() => setIsError(false)}
            // validate={passwordValidationFn}
            isInvalid={passwordErrors.length > 0}
            errorMessage={() => (
              <ul>
                {passwordErrors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            )}
          />
          <Input
            value={passwordConfirmation}
            onValueChange={setPasswordConfirmation}
            size="md"
            radius="md"
            name="password confirmation"
            label="Password confirmation"
            labelPlacement="inside"
            type="password"
            variant="bordered"
            isRequired
            onFocus={() => setIsError(false)}
            isInvalid={passwordConfirmation !== password}
            errorMessage={'Passwords do not match.'}
          />
          <Button
            type="submit"
            variant={isRegisterSuccess ? 'flat' : 'shadow'}
            color={isRegisterSuccess ? 'success' : 'primary'}
            fullWidth
            className="font-semibold text-small"
            isDisabled={isError || isRegisterSuccess}
            isLoading={isPending}
          >
            {isRegisterSuccess ? 'Success' : 'Submit'}
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
}
