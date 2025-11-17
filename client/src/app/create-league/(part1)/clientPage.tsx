'use client';
import CreateLeagueForm from '@/components/forms/CreateLeagueForm';
import useAccount from '@/hooks/useAccount';
import { Card, CardBody } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LuInfo } from 'react-icons/lu';

export default function ClientPage() {
  const { isLoggedIn } = useAccount();

  const router = useRouter();
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-row justify-center items-center">
      <div className=" w-auto flex flex-col justify-center items-center p-[30px] transition-colors duration-250">
        {/* <Heading1>Create A League</Heading1>
        <Subtitle
          style={{ marginTop: '-10px' }}
          className="opacity-80 dark:opacity-70"
        >
          League Setup - Part 1 of 3
        </Subtitle> */}
        <div className="grid grid-cols-3 grid-rows-1 w-[96vw] gap-[40px] pt-[40px]">
          <div></div>
          <CreateLeagueForm />
          <ExtraInfo />
        </div>
      </div>
    </div>
  );
}

function ExtraInfo() {
  return (
    <Card className="sticky top-20 p-[20px] max-w-[80%] h-min w-fit flex flex-col gap-2">
      <div className="absolute -bottom-28 -left-20 w-64 h-64 bg-primary rounded-full blur-xl opacity-30"></div>
      <div className="absolute top-0 -right-28 w-64 h-64 bg-secondary rounded-full blur-xl opacity-30"></div>
      <CardBody>
        <div className="flex flex-col gap-2">
          <span className="flex flex-row gap-2 items-center">
            <LuInfo className="w-[24px] h-[24px] inline align-middle" />
            <p
              style={{
                verticalAlign: 'middle',
                display: 'inline',
              }}
              className="text-lg"
            >
              League type
            </p>
          </span>
          <p className="opacity-80 dark:opacity-70 text-sm">
            Basic leagues are simplified for a more streamlined experience.
            Advanced leagues contain more features & stats. <br /> Currently
            advanced leagues offer:
          </p>
          <ul className="list-disc pl-[20px] opacity-80 dark:opacity-70 text-sm">
            <li className="">
              <p>Goal scorers</p>
            </li>
            <li className="">
              <p>Assist makers</p>
            </li>
          </ul>
        </div>
      </CardBody>
    </Card>
  );
}
