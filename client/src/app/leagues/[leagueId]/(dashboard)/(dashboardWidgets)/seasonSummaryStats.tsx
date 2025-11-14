import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { League, SeasonSummaryStatsInterface } from '@/util/definitions';
import { useQuery } from '@tanstack/react-query';

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

  return (
    <div className="p-[20px] h-full w-full bg-[var(--bg)] rounded-[10px] border-1 border-[var(--border)] flex flex-col gap-2">
      <span>
        <p className="text-medium align-middle inline">Season stats</p>
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
        <p className="inline-block text-medium">{stats.goalsScored}</p>{' '}
        <p className="inline-block text-small">
          Goal{stats.goalsScored === 1 ? '' : 's'} Scored
        </p>
      </span>
      <span>
        <p className="inline-block text-medium">{stats.cleansheets}</p>{' '}
        <p className="inline-block text-small">
          Cleansheet{stats.cleansheets === 1 ? '' : 's'}
        </p>
      </span>
      {stats.hattricks !== undefined && (
        <span>
          <p className="inline-block text-medium">{stats.hattricks}</p>{' '}
          <p className="inline-block text-small">
            Hattrick{stats.hattricks === 1 ? '' : 's'}
          </p>
        </span>
      )}
      {stats.ownGoals !== undefined && (
        <span>
          <p className="inline-block text-medium">{stats.ownGoals}</p>{' '}
          <p className="inline-block text-small">
            Own goal{stats.ownGoals === 1 ? '' : 's'}
          </p>
        </span>
      )}
      {stats.soloGoals !== undefined && (
        <span>
          <p className="inline-block text-medium">{stats.soloGoals}</p>{' '}
          <p className="inline-block text-small">
            Solo goal{stats.soloGoals === 1 ? '' : 's'}
          </p>
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
