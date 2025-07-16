import Label from '@/components/text/Label';
import Paragraph from '@/components/text/Paragraph';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { League, SeasonSummaryStatsInterface } from '@/util/definitions';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export default function SeasonSummaryStats({
  league,
  seasonViewing = league.currentSeason,
}: {
  league: League;
  seasonViewing?: number;
}) {
  const { data, isLoading } = useQuery({
    queryFn: () =>
      fetchAPI(
        `${API_URL}/leagues/${league._id}/season-summary-stats?season=${seasonViewing}`,
        {
          method: 'GET',
        }
      ),
    queryKey: ['seasonSummaryStats', seasonViewing],
  });
  const stats: SeasonSummaryStatsInterface | undefined =
    data?.data.seasonSummaryStats;

  useEffect(() => {
    console.log(data);
  }, [data]);

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
      {stats === undefined || isLoading ? (
        <SeasonSummarySkeleton />
      ) : (
        <StatsLabels stats={stats} />
      )}
    </div>
  );
}

function StatsLabels({ stats }: { stats: SeasonSummaryStatsInterface }) {
  return (
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
  );
}

function SeasonSummarySkeleton() {
  return (
    <div className="flex flex-row flex-wrap justify-baseline flex-grow gap-x-[20px]">
      <div className="w-[120px] h-[30px] bg-[var(--bg-light)] animate-pulse rounded-[10px]"></div>
      <div className="w-[120px] h-[30px] bg-[var(--bg-light)] animate-pulse rounded-[10px]"></div>
      <div className="w-[120px] h-[30px] bg-[var(--bg-light)] animate-pulse rounded-[10px]"></div>
      <div className="w-[120px] h-[30px] bg-[var(--bg-light)] animate-pulse rounded-[10px]"></div>
    </div>
  );
}
