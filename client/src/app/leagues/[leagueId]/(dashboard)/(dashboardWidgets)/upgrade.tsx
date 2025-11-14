import { League } from '@/util/definitions';

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
        <p
          style={{
            color: titleColor,
          }}
          className="align-middle inline text-medium"
        >
          {titleText}
        </p>
        <p className="text-small">
          {warningLevel === 'light' ? '' : 'This is a free league.'} Upgrade to
          standard level to unlock:
        </p>
        <ul className="list-disc pl-[20px] text-[var(--text-muted)] text-small">
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
      </span>
    </div>
  );
}
