import TruncatedText from '@/components/formattedText/truncatedText';
import { League } from '@/util/definitions';
import { SingleResultDTO } from '@/util/dto/results';
import { Card, CardBody } from '@heroui/react';
import Link from 'next/link';

export default function ResultRow({
  resultDTO,
  league,
  handleClick,
}: {
  resultDTO: SingleResultDTO;
  league: League;
  handleClick: (id: string) => void;
}) {
  const homeGoals = resultDTO.result.basicOutcome.reduce(
    (acc, goal) => (goal === 'home' ? acc + 1 : acc),
    0,
  );
  const awayGoals = resultDTO.result.basicOutcome.reduce(
    (acc, goal) => (goal === 'away' ? acc + 1 : acc),
    0,
  );

  return (
    <Card
      isPressable
      onPress={() => handleClick(resultDTO.result._id)}
      as={Link}
      href={`/leagues/${league._id}/result/${resultDTO.result._id}`}
    >
      <CardBody className="@container">
        <div className="flex items-center gap-2">
          {/* Home side */}
          <div className="flex-1 min-w-0 flex items-center justify-end gap-2">
            {/* Name - always visible, truncates */}
            <div className="min-w-0 max-w-50 flex-shrink flex-grow">
              <TruncatedText
                content={resultDTO.homeDetails.name}
                placement="top-end"
                textClassName="text-right whitespace-nowrap overflow-hidden text-ellipsis w-full text-lg"
              >
                {resultDTO.homeDetails.name}
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
                content={resultDTO.awayDetails.name}
                placement="top-start"
                textClassName="text-left whitespace-nowrap overflow-hidden text-ellipsis w-full text-lg"
              >
                {resultDTO.awayDetails.name}
              </TruncatedText>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
