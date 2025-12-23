import TruncatedText from '@/components/formattedText/truncatedText';
import { League, Result } from '@/util/definitions';
import { Card, CardBody } from '@heroui/react';
import Link from 'next/link';

export default function ResultRow({
  result,
  league,
  handleClick,
}: {
  result: Result;
  league: League;
  handleClick: (id: string) => void;
}) {
  const homeGoals = result.basicOutcome.reduce(
    (acc, goal) => (goal === 'home' ? acc + 1 : acc),
    0
  );
  const awayGoals = result.basicOutcome.reduce(
    (acc, goal) => (goal === 'away' ? acc + 1 : acc),
    0
  );

  return (
    <Card
      isPressable
      onPress={() => handleClick(result._id)}
      as={Link}
      href={`/leagues/${league._id}/result/${result._id}`}
    >
      <CardBody className="@container">
        <div className="flex items-center gap-2">
          {/* Home side */}
          <div className="flex-1 min-w-0 flex items-center justify-end gap-2">
            {/* Name - always visible, truncates */}
            <div className="min-w-0 max-w-50 flex-shrink flex-grow">
              <TruncatedText
                content={result.homeTeamDetails.name}
                placement="top-end"
                textClassName="text-right whitespace-nowrap overflow-hidden text-ellipsis w-full text-lg"
              >
                {result.homeTeamDetails.name}
              </TruncatedText>
            </div>

            {/* Goals */}
            <p className="flex-shrink-0 text-lg font-medium w-[3ch] text-right">
              {homeGoals}
            </p>
          </div>

          {/* Center - never shrinks */}
          <p className="font-bold text-sm flex-shrink-0 flex-grow-0">-</p>

          {/* Away side */}
          <div className="flex-1 min-w-0 flex items-center justify-start gap-2">
            {/* Goals */}
            <p className="flex-shrink-0 text-lg font-medium w-[3ch]">
              {awayGoals}
            </p>

            {/* Name - always visible, truncates */}
            <div className="min-w-0 max-w-50 flex-shrink flex-grow">
              <TruncatedText
                content={result.awayTeamDetails.name}
                placement="top-start"
                textClassName="text-left whitespace-nowrap overflow-hidden text-ellipsis w-full text-lg"
              >
                {result.awayTeamDetails.name}
              </TruncatedText>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
