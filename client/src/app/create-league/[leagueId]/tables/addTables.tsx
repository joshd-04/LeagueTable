'use client';
import AddTablesForm from '@/components/forms/AddTablesForm';
import { Card, CardBody } from '@heroui/react';
import { LuInfo } from 'react-icons/lu';

export default function AddTables({
  divisionsCount,
  leagueName,
  leagueId,
}: {
  divisionsCount: number;
  leagueName: string;
  leagueId: string;
}) {
  return (
    <div className="flex flex-row justify-center items-center">
      <div className="w-auto flex flex-col justify-center items-center p-[30px] transition-colors duration-250">
        {/* <Heading1>Division Setup</Heading1>
        <Subtitle style={{ marginTop: '-10px', color: 'var(--text-muted)' }}>
          {leagueName} - Part 2 of 3
        </Subtitle> */}
        <div className="grid grid-cols-3 grid-rows-1 w-[96vw] gap-[40px] pt-[40px]">
          <div></div>
          {/* <AddTablesFormOld divisionsCount={divisionsCount} leagueId={leagueId} /> */}
          <AddTablesForm
            leagueName={leagueName}
            divisionsCount={divisionsCount}
            leagueId={leagueId}
          />
          {divisionsCount > 1 ? <ExtraInfo /> : <div></div>}
        </div>
      </div>
    </div>
  );
}

function ExtraInfo() {
  return (
    <Card className="sticky top-20 self-start p-[20px] max-w-[80%] h-min w-fit  flex flex-col gap-2">
      <div className="absolute -bottom-28 -left-20 w-64 h-64 bg-primary rounded-full blur-xl opacity-30"></div>
      <div className="absolute top-0 -right-28 w-64 h-64 bg-secondary rounded-full blur-xl opacity-30"></div>
      <CardBody className="flex flex-col gap-4">
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
              Table names
            </p>
          </span>
          <p className="text-muted text-sm">
            Make sure the different table names are unique
          </p>
        </div>
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
              Promotion/relegation
            </p>
          </span>
          <p className="text-muted text-sm">
            Make sure the promotion and relegation numbers match between
            adjacent leagues.
            <br />
            This is managed for you automatically, you may need to double check
            your inputs.
            <br />
            You can&apos;t promote or relegate more than half of a division
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
