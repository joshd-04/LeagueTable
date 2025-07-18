import Label from '@/components/text/Label';
import Paragraph from '@/components/text/Paragraph';
import { League } from '@/util/definitions';

export default function Upgrade({ league }: { league: League }) {
  let warningLevel: 'light' | 'moderate' | 'heavy' = 'light';
  if (league.currentSeason === league.maxSeasonCount) warningLevel = 'moderate';
  if (
    league.currentSeason === league.maxSeasonCount &&
    league.currentMatchweek === league.finalMatchweek &&
    league.fixtures.length === 0
  )
    warningLevel = 'heavy';

  const titleColor =
    warningLevel === 'light'
      ? 'var(--info)'
      : warningLevel === 'moderate'
      ? 'var(--warning)'
      : 'var(--danger)';

  const titleText =
    warningLevel === 'light'
      ? 'This is a free league'
      : warningLevel === 'moderate'
      ? 'This is the final season.'
      : 'This league is finished.';
  return (
    <div className="p-[20px] h-full w-full bg-[var(--bg)] rounded-[10px] border-1 border-[var(--border)] flex flex-col gap-2">
      <span>
        <Paragraph
          style={{
            color: titleColor,
            verticalAlign: 'middle',
            display: 'inline',
          }}
        >
          {titleText}
        </Paragraph>
        <Label>
          {warningLevel === 'light' ? '' : 'This is a free league.'} Upgrade to
          standard level to unlock:
        </Label>
        <ul className="list-disc pl-[20px] text-[var(--text-muted)]">
          <li>
            <Label>More seasons</Label>
          </li>
          <li>
            <Label>Custom league banner</Label>
          </li>
          <li>
            <Label>Custom league announcements</Label>
          </li>
          <li>
            <Label>Auto-generated news feed</Label>
          </li>
          <li>
            <Label>Season rewind</Label>
          </li>
        </ul>
      </span>
    </div>
  );
}
