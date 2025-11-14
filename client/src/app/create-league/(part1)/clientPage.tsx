'use client';
import InfoSVG from '@/assets/svg components/Info';
import CreateLeagueForm from '@/components/forms/CreateLeagueForm';
import Label from '@/components/text/Label';
import Paragraph from '@/components/text/Paragraph';
import useAccount from '@/hooks/useAccount';
import { Card, CardBody } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

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
    <Card className="p-[20px] max-w-[80%] h-min w-fit flex flex-col gap-2">
      <div className="absolute -bottom-28 -left-20 w-64 h-64 bg-primary rounded-full blur-xl opacity-30"></div>
      <div className="absolute top-0 -right-28 w-64 h-64 bg-secondary rounded-full blur-xl opacity-30"></div>
      <CardBody>
        <div className="flex flex-col gap-2">
          <span>
            <InfoSVG className="w-[32px] h-[32px] fill-[var(--info)] inline align-middle  " />{' '}
            <Paragraph
              style={{
                color: 'var(--info)',
                verticalAlign: 'middle',
                display: 'inline',
              }}
            >
              League type
            </Paragraph>
          </span>
          <Label className="opacity-80 dark:opacity-70">
            Basic leagues are simplified for a more streamlined experience.
            Advanced leagues contain more features & stats. <br /> Currently
            advanced leagues offer:
          </Label>
          <ul className="list-disc pl-[20px] opacity-80 dark:opacity-70">
            <li className="">
              <Label>Goal scorers</Label>
            </li>
            <li className="">
              <Label>Assist makers</Label>
            </li>
          </ul>
        </div>
      </CardBody>
    </Card>
  );
}
