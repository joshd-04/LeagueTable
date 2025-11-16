import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { League, SeasonSummaryStatsInterface } from '@/util/definitions';
import { Card, CardBody } from '@heroui/react';
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
    <Card className="h-full w-full px-[10px]">
      <CardBody className="flex flex-col gap-2">
        <span>
          <p className="text-base/[40px] align-middle inline">Season stats</p>
        </span>
        {stats === undefined || isLoading ? (
          <SeasonSummarySkeleton />
        ) : (
          <StatsLabels stats={stats} />
        )}
      </CardBody>
    </Card>
  );
}

function StatsLabels({ stats }: { stats: SeasonSummaryStatsInterface }) {
  return (
    <div className="flex flex-row flex-wrap justify-baseline flex-grow gap-x-[20px]">
      <span>
        <p className="inline-block text-base">{stats.goalsScored}</p>{' '}
        <p className="inline-block text-sm ">
          Goal{stats.goalsScored === 1 ? '' : 's'} Scored
        </p>
      </span>
      <span>
        <p className="inline-block text-base">{stats.cleansheets}</p>{' '}
        <p className="inline-block text-sm">
          Cleansheet{stats.cleansheets === 1 ? '' : 's'}
        </p>
      </span>
      {stats.hattricks !== undefined && (
        <span>
          <p className="inline-block text-base">{stats.hattricks}</p>{' '}
          <p className="inline-block text-sm">
            Hattrick{stats.hattricks === 1 ? '' : 's'}
          </p>
        </span>
      )}
      {stats.ownGoals !== undefined && (
        <span>
          <p className="inline-block text-base">{stats.ownGoals}</p>{' '}
          <p className="inline-block text-sm">
            Own goal{stats.ownGoals === 1 ? '' : 's'}
          </p>
        </span>
      )}
      {stats.soloGoals !== undefined && (
        <span>
          <p className="inline-block text-base">{stats.soloGoals}</p>{' '}
          <p className="inline-block text-sm">
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
