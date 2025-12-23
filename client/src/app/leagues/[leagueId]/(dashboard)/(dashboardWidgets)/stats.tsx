'use client';

import ProChip from '@/components/chips/ProChip';
import ProPlusChip from '@/components/chips/ProPlusChip';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { League, SeasonStats } from '@/util/definitions';
import {
  Card,
  CardBody,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

interface IStat {
  key: string;
  label: string;
  unit: string;
  accessLevel: 'free' | 'pro' | 'pro+';
}

export default function Stats({
  league,
  seasonViewing = league.currentSeason,
  divisionViewing,
}: {
  league: League;
  seasonViewing?: number;
  divisionViewing: number;
}) {
  const accountType = league.leagueOwner.accountType;

  const allPossibleStats: IStat[] = [
    {
      key: 'topScorers',
      label: 'Top scorers',
      unit: 'Goals',
      accessLevel: 'pro',
    },
    {
      key: 'mostAssists',
      label: 'Most assists',
      unit: 'Assists',
      accessLevel: 'pro',
    },
    {
      key: 'cleansheets',
      label: 'Cleansheets',
      unit: 'Cleansheets',
      accessLevel: 'free',
    },
  ];

  const [availableStats, setAvailableStats] = useState<IStat[]>([]);

  const [selectedStat, setSelectedStat] = useState<IStat | undefined>(
    league.leagueOwner.accountType === 'pro' &&
      league.leagueLevel === 'pro' &&
      league.leagueType === 'advanced'
      ? allPossibleStats.find((s) => s.key === 'topScorers')
      : allPossibleStats.find((s) => s.key === 'cleansheets')
  );

  const { data, isLoading } = useQuery({
    queryFn: () =>
      fetchAPI(
        `${API_URL}/leagues/${league._id}/stats?season=${seasonViewing}`,
        { method: 'GET' }
      ),
    queryKey: ['stats', league._id, seasonViewing],
  });

  const stats: SeasonStats | undefined = data?.data.stats;

  // Derive the selected keys ONLY from what's currently available
  const selectedKeys =
    selectedStat && availableStats.some((s) => s.key === selectedStat.key)
      ? new Set([selectedStat.key])
      : new Set<string>(); // empty set if not available yet

  useEffect(() => {
    if (!stats) {
      return;
    }
    const statNames = Object.keys(stats);

    const filteredStats = allPossibleStats.filter((stat) =>
      statNames.includes(stat.key)
    );

    setAvailableStats(filteredStats);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats]);

  return (
    <Card className="p-[10px] h-full w-full row-span-2">
      <CardBody className="flex flex-col gap-2">
        <Select
          className="max-w-xs"
          style={{ cursor: 'pointer' }}
          size="sm"
          items={availableStats}
          label="Select a stat"
          disallowEmptySelection
          selectionMode="single"
          selectedKeys={selectedKeys}
          onChange={(e) => {
            const stat = availableStats.find((s) => s.key === e.target.value);
            setSelectedStat(stat);
          }}
          disabledKeys={availableStats
            .filter((s) => {
              if (
                (accountType === 'pro' || accountType === 'free') &&
                s.accessLevel === 'pro+'
              )
                return true;
              if (accountType === 'free' && s.accessLevel === 'pro')
                return true;
              return false;
            })
            .map((s) => s.key)}
        >
          {availableStats.map((stat) => (
            <SelectItem
              key={stat.key}
              endContent={
                stat.accessLevel === 'pro+' ? (
                  <ProPlusChip />
                ) : stat.accessLevel === 'pro' ? (
                  <ProChip />
                ) : null
              }
            >
              {stat.label}
            </SelectItem>
          ))}
        </Select>
        {stats === undefined || selectedStat === undefined || isLoading ? (
          <TableRowSkeleton
            numRows={league.tables[divisionViewing - 1].numberOfTeams}
          />
        ) : (
          (selectedStat.key === 'topScorers' && (
            <StatsTablePlayerBased
              stat={selectedStat}
              data={
                stats.topScorers.find((x) => x.division === divisionViewing)
                  ?.data
              }
            />
          )) ||
          (selectedStat.key === 'mostAssists' && (
            <StatsTablePlayerBased
              stat={selectedStat}
              data={
                stats.mostAssists.find((x) => x.division === divisionViewing)
                  ?.data
              }
            />
          )) ||
          (selectedStat.key === 'cleansheets' && (
            <StatsTableTeamBased
              stat={selectedStat}
              data={
                stats.cleansheets.find((x) => x.division === divisionViewing)
                  ?.data
              }
            />
          ))
        )}
      </CardBody>
    </Card>
  );
}

function StatsTablePlayerBased({
  stat,
  data,
}: {
  stat: IStat;
  data:
    | { position: number; player: string; team: string; value: number }[]
    | undefined;
}) {
  return (
    <div className="max-h-[21rem] overflow-y-auto w-full">
      <Table
        aria-label="Example static collection table w-full"
        fullWidth
        classNames={{
          wrapper: `border-none shadow-none drop-shadow-none outline-none px-0`,
        }}
      >
        <TableHeader>
          <TableColumn>#</TableColumn>
          <TableColumn>Name</TableColumn>
          <TableColumn>Team</TableColumn>
          <TableColumn>{stat.unit}</TableColumn>
        </TableHeader>
        <TableBody
          items={data}
          emptyContent={
            <p className="italic text-muted text-sm">No data to display</p>
          }
        >
          {(item) => (
            <TableRow key={item.position}>
              <TableCell>{item.position}</TableCell>
              <TableCell>{item.player}</TableCell>
              <TableCell>{item.team}</TableCell>
              <TableCell>{item.value}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function StatsTableTeamBased({
  stat,
  data,
}: {
  stat: IStat;
  data: { position: number; team: string; value: number }[] | undefined;
}) {
  return (
    <div className="max-h-[21rem] overflow-y-auto">
      <Table
        aria-label="Example static collection table w-full"
        fullWidth
        classNames={{
          wrapper: `border-none shadow-none drop-shadow-none outline-none px-0`,
        }}
      >
        <TableHeader>
          <TableColumn>#</TableColumn>
          <TableColumn>Team</TableColumn>
          <TableColumn>{stat.unit}</TableColumn>
        </TableHeader>
        <TableBody
          items={data}
          emptyContent={
            <p className="italic text-muted text-sm">No data to display</p>
          }
        >
          {(item) => (
            <TableRow key={item.position}>
              <TableCell>{item.position}</TableCell>
              <TableCell>{item.team}</TableCell>
              <TableCell>{item.value}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function TableRowSkeleton({ numRows }: { numRows: number }) {
  return (
    <div className="flex flex-col gap-[2px]">
      {Array.from(Array(numRows).keys()).map((_x, i) => {
        return (
          <div
            key={i}
            className="w-full h-[30px] bg-[var(--bg-light)] animate-pulse rounded-[5px]"
          ></div>
        );
      })}
    </div>
  );
}
