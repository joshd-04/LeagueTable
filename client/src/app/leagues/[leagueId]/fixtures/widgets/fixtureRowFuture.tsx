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
