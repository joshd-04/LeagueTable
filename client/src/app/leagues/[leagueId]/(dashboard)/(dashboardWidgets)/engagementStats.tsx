import ProChip from '@/components/chips/ProChip';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { League } from '@/util/definitions';
import { meetsMinimumTierLevel } from '@/util/helpers';
import {
  Card,
  CardBody,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { FaLock } from 'react-icons/fa';

interface IEngagement {
  followersCount: number;
  favoritesCount: number;
  totalViews: number;
  viewsThisWeek: number;
}

export default function EngagementStats({ league }: { league: League }) {
  const [stats, setStats] = useState<IEngagement | undefined>(undefined);
  const prettyData = [
    { key: 'totalViews', label: 'Total views', value: stats?.totalViews },
    {
      key: 'viewsThisWeek',
      label: 'Views this week',
      value: stats?.viewsThisWeek,
    },
    { key: 'favorites', label: 'Favorites', value: stats?.favoritesCount },
    { key: 'followers', label: 'Followers', value: stats?.followersCount },
  ];

  const { data: engagementQuery, isLoading } = useQuery({
    queryFn: () =>
      fetchAPI(`${API_URL}/leagues/${league._id}/engagement-stats`, {
        method: 'GET',
      }),
    queryKey: ['engagement-stats', league._id],
    refetchOnMount: true,
  });

  useEffect(() => {
    if (!isLoading && engagementQuery.data?.engagementStats) {
      console.log(engagementQuery.data.engagementStats);
      setStats(engagementQuery.data.engagementStats);
    }
  }, [engagementQuery, isLoading]);
  const shouldDisable = !meetsMinimumTierLevel(
    'pro',
    league.leagueOwner.accountType
  );

  return (
    <Card
      className="h-full w-full px-[10px] py-[6px]"
      isDisabled={shouldDisable}
    >
      <CardBody className="w-full flex flex-col gap-2">
        <span className="flex flex-row gap-2 items-center">
          <ProChip />
          <p className="align-middle inline text-base">Engagement stats</p>
        </span>
        {stats ? (
          <StatTable data={prettyData} shouldDisable={shouldDisable} />
        ) : (
          <Spinner />
        )}
      </CardBody>
    </Card>
  );
}

function StatTable({
  data,
  shouldDisable,
}: {
  data: {
    key: string;
    label: string;
    value: number | undefined;
  }[];

  shouldDisable: boolean;
}) {
  return (
    <div className="max-h-[21rem] overflow-y-auto w-full">
      <Table
        aria-label="Example static collection table w-full"
        fullWidth
        classNames={{
          wrapper: `bg-transparent border-none shadow-none drop-shadow-none outline-none px-0`,
        }}
        // hideHeader
      >
        <TableHeader>
          <TableColumn>Stat</TableColumn>
          <TableColumn>Value</TableColumn>
        </TableHeader>
        <TableBody
          items={data}
          emptyContent={
            <p className="italic text-muted text-sm">No data to display</p>
          }
        >
          {(item) => (
            <TableRow key={item.key}>
              <TableCell>{item.label}</TableCell>
              <TableCell>
                {item.key !== 'totalViews' && shouldDisable ? (
                  <FaLock className="fill-foreground w-3 h-3" />
                ) : (
                  item.value
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
