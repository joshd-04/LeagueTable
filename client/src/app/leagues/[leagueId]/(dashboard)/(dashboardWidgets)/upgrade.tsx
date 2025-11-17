import { League } from '@/util/definitions';
import { Card, CardBody } from '@heroui/react';

export default function Upgrade({ league }: { league: League }) {
  let warningLevel: 'light' | 'moderate' | 'heavy' = 'light';
  if (league.currentSeason === league.maxSeasonLimit) warningLevel = 'moderate';
  if (
    league.currentSeason === league.maxSeasonLimit &&
    league.currentMatchweek === league.finalMatchweek &&
    league.fixtures.length === 0
  )
    warningLevel = 'heavy';

  const titleColor =
    warningLevel === 'light'
      ? 'secondary'
      : warningLevel === 'moderate'
      ? 'warning'
      : 'danger';

  const titleText =
    warningLevel === 'light'
      ? 'This is a free league'
      : warningLevel === 'moderate'
      ? 'This is the final season.'
      : 'This league is finished.';
  return (
    <Card className="p-[10px] h-full w-full">
      <CardBody className="flex flex-col gap-2">
        <p
          style={
            {
              // color: titleColor,
            }
          }
          className={`align-middle inline text-lg text-${titleColor}`}
        >
          {titleText}
        </p>
        <p className="text-sm">
          {warningLevel === 'light' ? '' : 'This is a free league.'} Upgrade to
          Pro to unlock:
        </p>
        <ul className="list-disc pl-[20px] text-muted text-sm">
          <li>
            <p>More seasons</p>
          </li>
          <li>
            <p>Custom league banner</p>
          </li>
          <li>
            <p>Custom league announcements</p>
          </li>
          <li>
            <p>Auto-generated news feed</p>
          </li>
          <li>
            <p>Season rewind</p>
          </li>
        </ul>
      </CardBody>
    </Card>
  );
}
