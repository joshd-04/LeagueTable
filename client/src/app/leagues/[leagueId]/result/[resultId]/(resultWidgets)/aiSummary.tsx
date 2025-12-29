<div className="p-[20px] h-full w-full bg-[var(--bg)] rounded-[10px] border-1 border-[var(--border)] flex flex-col gap-2"></div>;
import { Result, League } from '@/util/definitions';
import { shouldGrantAccessToFeature } from '@/util/helpers';
import { Card, CardBody } from '@heroui/react';

export default function AiSummary({
  league,
  result,
}: {
  league: League;
  result: Result;
}) {
  const showInsights = shouldGrantAccessToFeature(
    'pro+',
    league.leagueLevel,
    league.leagueOwner.accountType
  );

  return (
    <Card className="h-full w-full  px-[10px] py-[6px]">
      <CardBody className="flex flex-col gap-2 text-sm">
        <p className="text-base">AI summary</p>
        {!showInsights ? (
          <p>AI summaries are not available for this league</p>
        ) : (
          <p>
            [AI summary for {result.homeTeamDetails.name} vs{' '}
            {result.awayTeamDetails.name} go here]
          </p>
        )}
      </CardBody>
    </Card>
  );
}
