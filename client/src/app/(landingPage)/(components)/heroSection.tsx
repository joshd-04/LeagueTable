'use client';
import {
  Button,
  Form,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/react';

import FadeInImage from './fadeInImage';
import { FaArrowRight } from 'react-icons/fa';
import BrowserMockup from '@/components/heroMockup/BrowserMockup';
import { FaArrowDown, FaCheck } from 'react-icons/fa6';
import { smoothScroll } from '@/util/helpers';
import { useState } from 'react';
import { isEmail } from 'validator';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { useMutation } from '@tanstack/react-query';

export default function HeroSection() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div
      id="hero"
      className="bg-background relative flex h-full w-full flex-col items-center"
    >
      <main className="container  flex flex-1 flex-col items-start justify-start mt-15 ">
        <section className="z-20 flex flex-col items-start justify-center gap-[18px] sm:gap-6  mx-8 md:mx-16 xl:mx-72">
          <Button
            className="border-default-100 bg-default-50 text-small text-default-500 h-9 overflow-hidden border-1 px-[18px] py-2 leading-5 font-normal"
            endContent={<FaArrowRight className="w-5" />}
            radius="full"
            variant="bordered"
          >
            New onboarding experience
          </Button>
          <div className=" text-[clamp(40px,10vw,44px)] leading-[1.2] font-bold tracking-tighter sm:text-[64px]">
            <div className="bg-gradient-title-light dark:bg-gradient-title bg-clip-text text-transparent">
              Create and share modern
              <br /> leagues effortlessly
            </div>
          </div>
          <p className="text-default-500  leading-7 font-normal sm:w-[466px] sm:text-[18px]">
            Modern design, easy controls, share with your audience, advanced
            stats tracking and more.
          </p>
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
            {/* <Button
              className="bg-default-foreground text-small text-background h-10 w-[163px] px-[16px] py-[10px] leading-5 font-medium"
              radius="full"
            >
              Get Started
            </Button> */}
            <Button
              className="text-sm h-10 w-[163px] px-[16px] py-[10px] leading-520 font-semibold"
              radius="full"
              color="primary"
              variant="shadow"
              onPress={onOpen}
            >
              Join waitlist
            </Button>
            <Button
              className="border-default-100 text-small h-10 w-[163px] border-1 px-[16px] py-[10px] leading-5 font-medium"
              endContent={
                <span className=" pointer-events-none flex h-[22px] w-[22px] items-center justify-center rounded-full">
                  <FaArrowDown className=" w-4" />
                </span>
              }
              radius="full"
              variant="bordered"
              // color="secondary"
              as={Link}
              href="#features"
              onClick={(e) => smoothScroll(e, 'features')}
            >
              See features
            </Button>
          </div>
        </section>
        <div className="xl:ml-25 -mt-60 sm:-mt-50 lg:-mt-40 w-max z-15 relative pb-0 md:pb-16 lg:pb-48 xl:pb-64">
          <BrowserMockup src="/images/dashboard.png" />
        </div>
      </main>

      <div className="pointer-events-none absolute inset-0 top-[-70%] left-[-50%] z-10 scale-75 select-none sm:scale-75">
        <FadeInImage
          fill
          preload
          alt="Hero image"
          src="/images/bg-gradient.png"
          className="invert dark:invert-0"
        />
      </div>
      <WaitlistModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
}

function WaitlistModal({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverErrors, setServerErrors] = useState<{ [key: string]: string }>(
    {}
  );

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () =>
      fetchAPI(`${API_URL}/waitlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
      }),
    onSuccess(response) {
      if (response.status === 'fail') {
        setServerErrors(response.data);
      }
    },
    mutationKey: ['waitlist'],
  });

  async function handleSubmit(onClose: () => void) {
    if (!email) return;
    // If user hasnt responded to server errors:
    if (Object.entries(serverErrors).length > 0) return;

    const response = await mutateAsync();

    if (response.status === 'success') {
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 3000);
    }
  }

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      setEmail('');
      setServerErrors({});
      setIsSuccess(false);
    }
    onOpenChange(isOpen);
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={handleOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2>Be one of the first to join LeagueX</h2>
              <p className="text-sm font-normal text-muted">
                Get notified when we launch
              </p>
            </ModalHeader>
            <ModalBody>
              <Form
                onSubmit={(e) => e.preventDefault()}
                validationErrors={serverErrors}
              >
                <Input
                  type="email"
                  name="email"
                  value={email}
                  onValueChange={setEmail}
                  labelPlacement="inside"
                  label="Email"
                  isRequired
                  size="sm"
                  errorMessage={(() => {
                    if (email.length === 0) {
                      return 'Please fill in this field.';
                    } else if (!isEmail(email)) {
                      return 'Please enter a valid email.';
                    } else if (serverErrors.email) {
                      return serverErrors.email;
                    }
                  })()}
                  onChange={() => setServerErrors({})}
                />
              </Form>
              <ul className="text-sm">
                <li className="flex flex-row gap-2 items-center justify-start">
                  <FaCheck
                    className={`h-6 w-4 ${
                      1 == 1 ? 'text-success' : 'text-primary'
                    }`}
                  />
                  We won&apos;t spam your emails
                </li>
                <li className="flex flex-row gap-2 items-center justify-start">
                  <FaCheck
                    className={`h-6 w-4 ${
                      1 == 1 ? 'text-success' : 'text-primary'
                    }`}
                  />
                  We&apos;ll never share your email
                </li>
                <li className="flex flex-row gap-2 items-center justify-start">
                  <FaCheck
                    className={`h-6 w-4 ${
                      1 == 1 ? 'text-success' : 'text-primary'
                    }`}
                  />
                  Unsubscribe at anytime
                </li>
              </ul>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button
                color={isSuccess ? 'success' : 'primary'}
                onPress={() => handleSubmit(onClose)}
                className="font-medium"
                variant="shadow"
                isLoading={isPending}
                isDisabled={isSuccess}
              >
                {isSuccess ? 'Success' : 'Join waitlist'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
