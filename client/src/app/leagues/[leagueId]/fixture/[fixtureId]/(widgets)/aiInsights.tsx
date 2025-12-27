import { Fixture, League } from '@/util/definitions';
import { shouldGrantAccessToFeature } from '@/util/helpers';
import { Card, CardBody } from '@heroui/react';

export default function AiInsights({
  league,
  fixture,
}: {
  league: League;
  fixture: Fixture;
}) {
  const isFutureFixture =
    fixture.matchweek > league.currentMatchweek &&
    fixture.season === league.currentSeason;

  const showInsights = shouldGrantAccessToFeature(
    'pro+',
    league.leagueLevel,
    league.leagueOwner.accountType
  );

  return (
    <Card className="h-full w-full  px-[10px] py-[6px]">
      <CardBody className="flex flex-col gap-2 text-sm">
        <p className="text-base">AI insights</p>
        {!showInsights ? (
          <p>AI insights are not available for this league</p>
        ) : isFutureFixture ? (
          <p>
            AI Insights not available yet. Come back when matchweek{' '}
            {fixture.matchweek} starts!
          </p>
        ) : (
          <p>[AI Insights go here]</p>
        )}
      </CardBody>
    </Card>
  );
}
