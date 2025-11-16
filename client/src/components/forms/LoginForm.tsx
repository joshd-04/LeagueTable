'use client';
import {
  addToast,
  Button,
  Card,
  CardBody,
  Checkbox,
  Form,
  Input,
  Link,
  Spacer,
  Tooltip,
} from '@heroui/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { useMutation } from '@tanstack/react-query';
import { LuEye, LuEyeOff } from 'react-icons/lu';

export default function LoginForm({
  callbackUrl = '/',
}: {
  callbackUrl?: string;
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);

  const router = useRouter();

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

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
    onSuccess: (response) => {
      if (response.status === 'success') {
        setIsLoginSuccess(true);
        setTimeout(() => {
          router.push(callbackUrl);
        }, 300);
      } else if (response.status === 'fail') {
        setIsError(true);
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

    if (!username || !password) {
      setIsError(true);
      return;
    }

    // p.s password hashing will be done on server side.
    try {
      handleRequestMutation();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Card className="w-[464px] place-self-center px-8 pt-6 pb-10  bg-linear-to-br from-content2 to-content1">
      <CardBody>
        <div>
          <h1 className="font-medium text-lg">Welcome Back</h1>
          <p className="opacity-80 dark:opacity-70 text-sm">
            Log in to your account to continue
          </p>
        </div>
        <Spacer y={4} />
        <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              isInvalid={isError}
              onFocus={() => setIsError(false)}
              errorMessage={
                username.length === 0 && (
                  <p className="text-danger text-sm">
                    Please fill in this field.
                  </p>
                )
              }
            />
            <Input
              value={password}
              onValueChange={setPassword}
              size="md"
              radius="md"
              name="password"
              label="Password"
              labelPlacement="inside"
              type={isVisible ? 'text' : 'password'}
              variant="bordered"
              isRequired
              isInvalid={isError}
              onFocus={() => setIsError(false)}
              errorMessage={
                <p className="text-danger text-sm">
                  {password.length === 0
                    ? 'Please fill in this field.'
                    : 'Invalid username or password.'}
                </p>
              }
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
          </div>
          <Checkbox className="text-sm">
            <p className="text-sm">Remember me (does nothing)</p>
          </Checkbox>
          <Button
            type="submit"
            variant={isLoginSuccess ? 'flat' : 'solid'}
            color={isLoginSuccess ? 'success' : 'primary'}
            fullWidth
            className="font-semibold text-sm"
            isDisabled={isError || isLoginSuccess}
            isLoading={isPending}
          >
            {isLoginSuccess ? 'Success' : 'Submit'}
          </Button>
          <Link
            href="/register"
            className="text-sm font-medium cursor-pointer place-self-center"
          >
            Need to create an account? Sign up
          </Link>
        </Form>
      </CardBody>
    </Card>
  );
}
