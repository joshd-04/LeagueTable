'use client';
import InfoSVG from '@/assets/svg components/Info';
import AddTeamsForm from '@/components/forms/AddTeamsForm';
import Label from '@/components/text/Label';
import Paragraph from '@/components/text/Paragraph';
import { Card, CardBody } from '@heroui/react';

export default function AddTeams({
  divisions,
  leagueName,
  leagueId,
}: {
  divisions: { divisionNumber: number; name: string; numberOfTeams: number }[];
  leagueName: string;
  leagueId: string;
}) {
  return (
    <div className="flex flex-row justify-center items-center">
      <div className="w-auto flex flex-col justify-center items-center p-[30px] transition-colors duration-250">
        {/* <Heading1>Teams Setup</Heading1>
        <Subtitle style={{ marginTop: '-10px', color: 'var(--text-muted)' }}>
          {leagueName} - Part 3 of 3
        </Subtitle> */}
        <div className="grid grid-cols-3 grid-rows-1 w-[96vw] gap-[40px] pt-[40px]">
          <div></div>
          {/* <AddTeamsFormOld divisions={divisions} leagueId={leagueId} /> */}
          <AddTeamsForm
            leagueName={leagueName}
            divisions={divisions}
            leagueId={leagueId}
          />
          <ExtraInfo />
        </div>
      </div>
    </div>
  );
}

function ExtraInfo() {
  return (
    <Card className="sticky top-20 self-start p-[20px] max-w-[80%] h-min w-fit  flex flex-col gap-2">
      <div className="absolute -bottom-28 -left-30 w-64 h-64 bg-primary rounded-full blur-xl opacity-30"></div>
      <div className="absolute top-0 -right-48 w-64 h-64 bg-secondary rounded-full blur-xl opacity-30"></div>
      <CardBody className="flex flex-col gap-4">
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
              Team names
            </Paragraph>
          </span>
          <Label className="opacity-80 dark:opacity-70">
            Make sure the different team names are unique
          </Label>
        </div>
      </CardBody>
    </Card>
  );
}
