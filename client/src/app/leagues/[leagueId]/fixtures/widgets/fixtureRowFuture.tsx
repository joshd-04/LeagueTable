import TruncatedText from '@/components/formattedText/truncatedText';
import TeamForm from '@/components/teamForm/TeamForm';
import { League } from '@/util/definitions';
import { SingleFixtureDTO } from '@/util/dto/fixtures';
import { meetsMinimumTierLevel } from '@/util/helpers';
import { Card, CardBody } from '@heroui/react';

export default function FixtureRowFuture({
  league,
  fixtureDTO,
}: {
  league: League;
  fixtureDTO: SingleFixtureDTO;
}) {
  const homePoints =
    fixtureDTO.homeDetails.wins * 3 + fixtureDTO.homeDetails.draws;
  const awayPoints =
    fixtureDTO.awayDetails.wins * 3 + fixtureDTO.awayDetails.draws;
  const shouldShowTeamForm = meetsMinimumTierLevel(
    'pro',
    league.leagueOwner.accountType,
  );
  return (
    <Card className="opacity-60">
      <CardBody className="@container">
        <div className="flex items-center gap-4">
          {/* Home side - exactly 50% minus half the gap */}
          <div className="flex-1 min-w-0 flex items-center justify-end gap-3">
            {/* Form - disappears first */}
            {shouldShowTeamForm && (
              <div className="@[800px]:block hidden flex-shrink-0">
                <TeamForm form={fixtureDTO.homeDetails.form} />
              </div>
            )}

            {/* Points - disappears second */}
            <p className="@[500px]:block hidden flex-shrink-0 text-sm text-default-600 w-[4ch] text-right text-nowrap">
              {homePoints} pt{homePoints === 1 ? '' : 's'}
            </p>

            {/* Name - always visible, truncates */}
            <div className="min-w-0 flex-shrink flex-grow max-w-50 ">
              <TruncatedText
                content={fixtureDTO.homeDetails.name}
                placement="top-end"
                textClassName="text-right whitespace-nowrap overflow-hidden text-ellipsis w-full text-lg"
              >
                {fixtureDTO.homeDetails.name}
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
                content={fixtureDTO.awayDetails.name}
                placement="top-start"
                textClassName="text-left whitespace-nowrap overflow-hidden text-ellipsis w-full text-lg"
              >
                {fixtureDTO.awayDetails.name}
              </TruncatedText>
            </div>

            {/* Points - disappears second */}
            <p className="@[500px]:block hidden flex-shrink-0 text-sm text-default-600 w-[4ch] text-nowrap">
              {awayPoints} pt{awayPoints === 1 ? '' : 's'}
            </p>

            {/* Form - disappears first */}
            {shouldShowTeamForm && (
              <div className="@[800px]:block hidden flex-shrink-0">
                <TeamForm form={fixtureDTO.awayDetails.form} />
              </div>
            )}
          </div>
        </div>
      </CardBody>
      {fixtureDTO.fixture._id}
    </Card>
  );
}
