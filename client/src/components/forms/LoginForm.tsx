'use client';
import { Button, Card, CardBody, Form, Input, Spacer } from '@heroui/react';
import { useContext, useState } from 'react';
import Label from '../text/Label';
import { useRouter } from 'next/navigation';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { useMutation } from '@tanstack/react-query';
import { GlobalContext } from '@/context/GlobalContextProvider';
import Paragraph from '../text/Paragraph';

export default function LoginForm({
  callbackUrl = '/',
}: {
  callbackUrl?: string;
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);

  const globalContext = useContext(GlobalContext);
  const setError = globalContext.errors.setError;

  const router = useRouter();

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
        setIsLoginSuccess(true);
        setTimeout(() => {
          router.push(callbackUrl);
        }, 300);
      } else if (result.status === 'fail') {
        setIsError(true);
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
    <Card className="w-[464px] place-self-center px-8 pt-6 pb-10  bg-linear-to-br from-content1 to-content2">
      <CardBody>
        <div>
          <Paragraph className="font-medium">Welcome Back</Paragraph>
          <Label className="opacity-80 dark:opacity-70">
            Log in to your account to continue
          </Label>
        </div>
        <Spacer y={4} />
        <Form onSubmit={handleSubmit}>
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
                <Label className="text-danger">
                  Please fill in this field.
                </Label>
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
            type="password"
            variant="bordered"
            isRequired
            isInvalid={isError}
            onFocus={() => setIsError(false)}
            errorMessage={
              <Label className="text-danger">
                {password.length === 0
                  ? 'Please fill in this field.'
                  : 'Invalid username or password.'}
              </Label>
            }
          />
          <Button
            type="submit"
            variant={isLoginSuccess ? 'flat' : 'solid'}
            color={isLoginSuccess ? 'success' : 'primary'}
            fullWidth
            className="font-semibold text-small"
            isDisabled={isError || isLoginSuccess}
            isLoading={isPending}
          >
            {isLoginSuccess ? 'Success' : 'Submit'}
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
}
