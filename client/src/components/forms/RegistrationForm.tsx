'use client';
import {
  addToast,
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Form,
  Input,
  Link,
  Tooltip,
} from '@heroui/react';
import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { useMutation } from '@tanstack/react-query';
import { GlobalContext } from '@/context/GlobalContextProvider';
import { User } from '@/util/definitions';

import { LuEye, LuEyeOff } from 'react-icons/lu';

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

  const router = useRouter();

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const toggleConfirmationVisibility = () =>
    setIsConfirmationVisible(!isConfirmationVisible);

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
    onSuccess: (response) => {
      if (response.status === 'success') {
        setIsRegisterSuccess(true);
        const user: User = {
          id: response.data.userId,
          username: response.data.username,
          email: response.data.email,
          accountType: response.data.accountType,
        };
        setUser(user);
        setTimeout(() => {
          router.push('/');
        }, 300);
      } else if (response.status === 'fail') {
        if (response.statusCode === 400) {
          setIsError(true);
          const errors: { [key: string]: string } = response.data.errors;
          setServerErrors(errors);
        }
      } else {
        addToast({
          title: 'We ran into a problem',
          description: response.message,
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
    <Card className="w-[464px] place-self-center px-8 pt-6 pb-10  bg-linear-to-br from-content2 to-content1">
      <CardHeader>
        <div>
          <h1 className="font-medium text-lg">Welcome!</h1>
          <p className="opacity-80 dark:opacity-70 text-sm">
            Create an account to get started
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <Form
          onSubmit={handleSubmit}
          validationErrors={serverErrors}
          className="flex flex-col gap-4 overflow-hidden"
        >
          <div className="flex flex-col gap-2 w-full">
            <Input
              value={username}
              onValueChange={setUsername}
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
              type={isVisible ? 'text' : 'password'}
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
              endContent={
                <Tooltip
                  content={isVisible ? 'Hide password' : 'Show password'}
                  showArrow
                >
                  <button
                    aria-label="toggle password visibility"
                    className="focus:outline-solid outline-transparent cursor-pointer"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <LuEyeOff className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <LuEye className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                </Tooltip>
              }
            />
            <Input
              value={passwordConfirmation}
              onValueChange={setPasswordConfirmation}
              size="md"
              radius="md"
              name="password confirmation"
              label="Password confirmation"
              labelPlacement="inside"
              type={isConfirmationVisible ? 'text' : 'password'}
              variant="bordered"
              isRequired
              onFocus={() => setIsError(false)}
              isInvalid={passwordConfirmation !== password}
              errorMessage={'Passwords do not match.'}
              endContent={
                <Tooltip
                  content={
                    isConfirmationVisible ? 'Hide password' : 'Show password'
                  }
                  showArrow
                >
                  <button
                    aria-label="toggle password visibility"
                    className="focus:outline-solid outline-transparent cursor-pointer"
                    type="button"
                    onClick={toggleConfirmationVisibility}
                  >
                    {isConfirmationVisible ? (
                      <LuEyeOff className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <LuEye className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                </Tooltip>
              }
            />{' '}
          </div>
          <Checkbox isRequired>
            <p className="text-sm">
              I have read and agree with the Terms and Privacy Policy.
            </p>
          </Checkbox>
          <Button
            type="submit"
            variant={isRegisterSuccess ? 'flat' : 'shadow'}
            color={isRegisterSuccess ? 'success' : 'primary'}
            fullWidth
            className="font-semibold text-sm"
            isDisabled={isError || isRegisterSuccess}
            isLoading={isPending}
          >
            {isRegisterSuccess ? 'Success' : 'Submit'}
          </Button>
          <Link
            href="/register"
            className="text-sm font-medium cursor-pointer place-self-center"
          >
            Already have an account? Log in
          </Link>
        </Form>
      </CardBody>
    </Card>
  );
}
