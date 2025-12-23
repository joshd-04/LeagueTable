import TruncatedText from '@/components/formattedText/truncatedText';
import TeamForm from '@/components/teamForm/TeamForm';
import { Fixture } from '@/util/definitions';
import { Card, CardBody } from '@heroui/react';

export default function FixtureRowFuture({ fixture }: { fixture: Fixture }) {
  const homePoints =
    fixture.homeTeamDetails.wins * 3 + fixture.homeTeamDetails.draws;
  const awayPoints =
    fixture.awayTeamDetails.wins * 3 + fixture.awayTeamDetails.draws;

  return (
    <Card className="opacity-60">
      <CardBody className="@container">
        <div className="flex items-center gap-4">
          {/* Home side - exactly 50% minus half the gap */}
          <div className="flex-1 min-w-0 flex items-center justify-end gap-3">
            {/* Form - disappears first */}
            <div className="@[800px]:block hidden flex-shrink-0">
              <TeamForm form={fixture.homeTeamDetails.form} />
            </div>

            {/* Points - disappears second */}
            <p className="@[500px]:block hidden flex-shrink-0 text-sm text-default-600 w-[4ch] text-right">
              {homePoints} pt{homePoints === 1 ? '' : 's'}
            </p>

            {/* Name - always visible, truncates */}
            <div className="min-w-0 flex-shrink flex-grow max-w-50 ">
              <TruncatedText
                content={fixture.homeTeamDetails.name}
                placement="top-end"
                textClassName="text-right whitespace-nowrap overflow-hidden text-ellipsis w-full text-lg"
              >
                {fixture.homeTeamDetails.name}
              </TruncatedText>
            </div>
          </div>

          {/* Center - never shrinks */}
          <p className="font-bold text-sm flex-shrink-0 flex-grow-0">vs</p>

          {/* Away side - exactly 50% minus half the gap */}
          <div className="flex-1 min-w-0 flex items-center justify-start gap-3">
            {/* Name - always visible, truncates */}
            <div className="min-w-0 flex-shrink flex-grow max-w-50 ">
              <TruncatedText
                content={fixture.awayTeamDetails.name}
                placement="top-start"
                textClassName="text-left whitespace-nowrap overflow-hidden text-ellipsis w-full text-lg"
              >
                {fixture.awayTeamDetails.name}
              </TruncatedText>
            </div>

            {/* Points - disappears second */}
            <p className="@[500px]:block hidden flex-shrink-0 text-sm text-default-600 w-[4ch]">
              {awayPoints} pt{awayPoints === 1 ? '' : 's'}
            </p>

            {/* Form - disappears first */}
            <div className="@[800px]:block hidden flex-shrink-0">
              <TeamForm form={fixture.awayTeamDetails.form} />
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

/*

function FixtureRowFuture({ fixture }: { fixture: Fixture }) {
  const homePoints =
    fixture.homeTeamDetails.wins * 3 + fixture.homeTeamDetails.draws;
  const awayPoints =
    fixture.awayTeamDetails.wins * 3 + fixture.awayTeamDetails.draws;
  return (
    <div className="bg-[var(--bg)] w-full border-1 border-[var(--border)] rounded-[10px] p-[10px] grid grid-rows-1 grid-cols-[1fr_auto_1fr] gap-[20px] items-baseline brightness-80">
      <div className="grid grid-rows-1 grid-cols-[1fr_6ch_160px] gap-[20px] items-baseline justify-items-end">
        <TeamForm form={fixture.homeTeamDetails.form} />
        <p className="text-base inline text-muted">
          {homePoints} pt{homePoints === 1 ? '' : 's'}
        </p>
        <Subtitle
          style={{
            textAlign: 'right',
            textWrap: 'nowrap',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            width: '100%',
          }}
          className=" text-muted"
        >
          {fixture.homeTeamDetails.name}
        </Subtitle>
      </div>
      <p className="font-bold text-center text-sm">vs</p>

      <div className="grid grid-rows-1 grid-cols-[160px_6ch_1fr] gap-[20px] items-baseline">
        <Subtitle
          style={{
            textWrap: 'nowrap',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
          className=" text-muted"
        >
          {fixture.awayTeamDetails.name}
        </Subtitle>
        <p className="inline text-base text-muted">
          {awayPoints} pt{awayPoints === 1 ? '' : 's'}
        </p>
        <TeamForm form={fixture.awayTeamDetails.form} />
      </div>
      <p>{fixture._id}</p>
    </div>
  );
}
*/
