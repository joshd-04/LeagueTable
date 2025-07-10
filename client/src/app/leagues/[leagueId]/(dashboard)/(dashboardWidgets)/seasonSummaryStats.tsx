import Label from '@/components/text/Label';
import Paragraph from '@/components/text/Paragraph';
import { SeasonSummaryStatsInterface } from '@/util/definitions';

export default function SeasonSummaryStats({
  stats,
}: {
  stats: SeasonSummaryStatsInterface;
}) {
  return (
    <div className="p-[20px] h-full w-full bg-[var(--bg)] rounded-[10px] border-1 border-[var(--border)] flex flex-col gap-2">
      <span>
        <Paragraph
          style={{
            color: 'var(--text)',
            verticalAlign: 'middle',
            display: 'inline',
          }}
        >
          Season stats
        </Paragraph>
      </span>
      <div className="flex flex-row flex-wrap justify-baseline flex-grow gap-x-[20px]">
        <span>
          <Paragraph style={{ display: 'inline-block' }}>
            {stats.goalsScored}
          </Paragraph>{' '}
          <Label
            style={{
              color: 'var(--text-muted)',
              fontWeight: 'normal',
              display: 'inline-block',
            }}
          >
            Goal{stats.goalsScored === 1 ? '' : 's'} Scored
          </Label>
        </span>
        <span>
          <Paragraph style={{ display: 'inline-block' }}>
            {stats.cleansheets}
          </Paragraph>{' '}
          <Label
            style={{
              color: 'var(--text-muted)',
              fontWeight: 'normal',
              display: 'inline-block',
            }}
          >
            Cleansheet{stats.cleansheets === 1 ? '' : 's'}
          </Label>
        </span>
        {stats.hattricks !== undefined && (
          <span>
            <Paragraph style={{ display: 'inline-block' }}>
              {stats.hattricks}
            </Paragraph>{' '}
            <Label
              style={{
                color: 'var(--text-muted)',
                fontWeight: 'normal',
                display: 'inline-block',
              }}
            >
              Hattrick{stats.hattricks === 1 ? '' : 's'}
            </Label>
          </span>
        )}
        {stats.ownGoals !== undefined && (
          <span>
            <Paragraph style={{ display: 'inline-block' }}>
              {stats.ownGoals}
            </Paragraph>{' '}
            <Label
              style={{
                color: 'var(--text-muted)',
                fontWeight: 'normal',
                display: 'inline-block',
              }}
            >
              Own goal{stats.ownGoals === 1 ? '' : 's'}
            </Label>
          </span>
        )}
        {stats.soloGoals !== undefined && (
          <span>
            <Paragraph style={{ display: 'inline-block' }}>
              {stats.soloGoals}
            </Paragraph>{' '}
            <Label
              style={{
                color: 'var(--text-muted)',
                fontWeight: 'normal',
                display: 'inline-block',
              }}
            >
              Solo goal{stats.soloGoals === 1 ? '' : 's'}
            </Label>
          </span>
        )}
      </div>
    </div>
  );
}
