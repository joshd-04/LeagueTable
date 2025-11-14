'use client';
import {
  Button,
  Card,
  CardBody,
  cn,
  Divider,
  Form,
  Input,
  NumberInput,
  Radio,
  RadioGroup,
  Spacer,
} from '@heroui/react';
import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { useMutation } from '@tanstack/react-query';
import { GlobalContext } from '@/context/GlobalContextProvider';
import Paragraph from '../text/Paragraph';
import Label from '../text/Label';

export default function CreateLeagueForm() {
  const [leagueName, setLeagueName] = useState<string>('');
  const [divisionsCount, setDivisionsCount] = useState<number>(1);
  const [leagueType, setLeagueType] = useState<string | null>(null);

  const [isError, setIsError] = useState(false);
  const [isCreationSuccess, setIsCreationSuccess] = useState(false);

  const [serverErrors, setServerErrors] = useState<{ [key: string]: string }>(
    {}
  );

  const globalContext = useContext(GlobalContext);
  const setError = globalContext.errors.setError;

  const router = useRouter();

  function handleSendRequest() {
    return fetchAPI(`${API_URL}/leagues`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: leagueName,
        leagueType: leagueType,
        divisionsCount: divisionsCount,
      }),
      credentials: 'include',
    });
  }

  const { mutateAsync: handleRequestMutation, isPending } = useMutation({
    mutationFn: handleSendRequest,
    onSuccess: (response) => {
      if (response.status === 'success') {
        setIsCreationSuccess(true);
        setTimeout(() => {
          router.push(`/leagues/${response.data.league._id}`);
        }, 300);
      } else if (response.status === 'fail') {
        if (response.statusCode === 400) {
          setIsError(true);
          const errors: { [key: string]: string } = response.data.errors;
          setServerErrors(errors);
        }
      } else {
        setError(response.message);
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

  return (
    <Card className="w-[464px] place-self-center px-8 pt-6 pb-10 bg-linear-to-br from-content2 to-content1">
      <CardBody>
        <div>
          <Paragraph className="font-medium">Create a league</Paragraph>
          <Label className="opacity-80 dark:opacity-70">Part 1 of 3</Label>
        </div>
        <Spacer y={4} />
        <Form onSubmit={handleSubmit} validationErrors={serverErrors}>
          <Input
            value={leagueName}
            onValueChange={setLeagueName}
            size="md"
            radius="md"
            name="name"
            label="League Name"
            labelPlacement="inside"
            type="text"
            variant="bordered"
            isRequired
            fullWidth
            onFocus={() => setIsError(false)}
            description={
              <span className="opacity-80 dark:opacity-70">
                Visible to others
              </span>
            }
          />

          <NumberInput
            value={divisionsCount}
            onValueChange={setDivisionsCount}
            size="md"
            radius="md"
            name="divisionsCount"
            label="Number of tables/divisions"
            labelPlacement="inside"
            variant="bordered"
            isRequired
            fullWidth
            minValue={1}
            maxValue={5}
            isWheelDisabled
          />
          <Spacer y={1} />
          <Divider />
          <RadioGroup
            value={leagueType}
            onValueChange={setLeagueType}
            size="sm"
            name="leagueType"
            label={<span className="text-small">League Type</span>}
            description={
              <span className="opacity-80 dark:opacity-70">
                League type cannot be changed after creation.
              </span>
            }
            isRequired
          >
            <CustomRadio
              description={
                <span className="opacity-80 dark:opacity-70">
                  Simple, streamlined experience
                </span>
              }
              value="basic"
            >
              Basic
            </CustomRadio>
            <CustomRadio
              description={
                <span className="opacity-80 dark:opacity-70">
                  Includes goals & assists tracking
                </span>
              }
              value="advanced"
            >
              Advanced
            </CustomRadio>
          </RadioGroup>
          <Spacer y={1} />
          <Button
            type="submit"
            variant={isCreationSuccess ? 'flat' : 'solid'}
            color={isCreationSuccess ? 'success' : 'primary'}
            fullWidth
            className="font-semibold text-small"
            isDisabled={isError || isCreationSuccess}
            isLoading={isPending || isCreationSuccess}
          >
            {isCreationSuccess ? 'Success' : 'Submit'}
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
}

function CustomRadio({
  children,
  ...otherProps
}: React.ComponentProps<typeof Radio>) {
  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          'flex m-0 bg-content2 hover:bg-content3 items-center justify-between',
          'flex-row-reverse min-w-[376px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent',
          'data-[selected=true]:border-primary'
        ),
      }}
    >
      {children}
    </Radio>
  );
}
