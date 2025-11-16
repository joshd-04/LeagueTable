'use client';

import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { League, SeasonStats } from '@/util/definitions';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export default function Stats({
  league,
  seasonViewing = league.currentSeason,
  divisionViewing,
}: {
  league: League;
  seasonViewing?: number;
  divisionViewing: number;
}) {
  const [view, setView] = useState(
    league.leagueType === 'basic' ? 'cleansheets' : 'topScorers'
  );
  const { data, isLoading } = useQuery({
    queryFn: () =>
      fetchAPI(
        `${API_URL}/leagues/${league._id}/stats?season=${seasonViewing}`,
        { method: 'GET' }
      ),
    queryKey: ['stats', seasonViewing],
  });

  const stats: SeasonStats | undefined = data?.data.stats;

  return (
    <div className="p-[20px] h-full w-full row-span-2 bg-[var(--bg)] rounded-[10px] border-1 border-[var(--border)] flex flex-col gap-2">
      <p className="text-md">
        <select
          className="bg-[var(--bg-light)] p-2 rounded-[10px] outline-none cursor-pointer"
          value={view}
          onChange={(e) => setView(e.target.value)}
        >
          {league.leagueType === 'advanced' && (
            <option value="topScorers">Top scorers</option>
          )}
          {league.leagueType === 'advanced' && (
            <option value="mostAssists">Most assists</option>
          )}
          <option value="cleansheets">Cleansheets</option>
        </select>
      </p>
      {stats === undefined || isLoading ? (
        <TableRowSkeleton
          numRows={league.tables[divisionViewing - 1].numberOfTeams}
        />
      ) : (
        (view === 'topScorers' && (
          <StatsTablePlayerBased
            data={
              stats.topScorers.find((x) => x.division === divisionViewing)?.data
            }
          />
        )) ||
        (view === 'mostAssists' && (
          <StatsTablePlayerBased
            data={
              stats.mostAssists.find((x) => x.division === divisionViewing)
                ?.data
            }
          />
        )) ||
        (view === 'cleansheets' && (
          <StatsTableTeamBased
            data={
              stats.cleansheets.find((x) => x.division === divisionViewing)
                ?.data
            }
          />
        ))
      )}
    </div>
  );
}

function StatsTablePlayerBased({
  data,
}: {
  data:
    | { position: number; player: string; team: string; value: number }[]
    | undefined;
}) {
  return (
    <div className="max-h-[21rem] overflow-y-auto">
      <table className="text-[var(--text)] table table-fixed w-full font-[family-name:var(--font-instrument-sans)] bg-[var(--bg)] rounded-[10px] border-separate border-spacing-x-[2px]">
        <thead>
          <tr className="text-left">
            <th className="w-[2rem] sticky top-0 bg-[var(--bg)]"></th>
            <th className="w-[11rem] sticky top-0 bg-[var(--bg)]">
              <p className="text-md">Name</p>
            </th>
            <th className="w-[8rem] sticky top-0 bg-[var(--bg)]">
              <p className="text-md text-muted">Team</p>
            </th>
            <th className="sticky top-0 bg-[var(--bg)]">
              <p className="text-md">Value</p>
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((datapoint, i) => (
            <TableRowPlayerBased key={i} datapoint={datapoint} />
          ))}
        </tbody>
      </table>
      {(data?.length === 0 || !data) && (
        <p
          className="italic place-self-center text-sm"
          style={{
            placeSelf: 'center',
            fontStyle: 'italic',
          }}
        >
          No data yet
        </p>
      )}
    </div>
  );
}

function TableRowPlayerBased({
  datapoint,
}: {
  datapoint: { position: number; player: string; team: string; value: number };
}) {
  return (
    <tr>
      <td>
        <p className="text-md text-right pr-[10px]">{datapoint.position}.</p>
      </td>
      <td>
        <p className="text-md text-nowrap overflow-ellipsis whitespace-nowrap overflow-hidden">
          {datapoint.player}
        </p>
      </td>
      <td>
        <p className="text-md text-nowrap overflow-ellipsis whitespace-nowrap overflow-hidden text-muted">
          {datapoint.team}
        </p>
      </td>
      <td>
        <p className="text-right pr-[10px] text-md">{datapoint.value}</p>
      </td>
    </tr>
  );
}

function StatsTableTeamBased({
  data,
}: {
  data: { position: number; team: string; value: number }[] | undefined;
}) {
  return (
    <div className="max-h-[21rem] overflow-y-auto">
      <table className="text-[var(--text)] table table-fixed w-full font-[family-name:var(--font-instrument-sans)] bg-[var(--bg)] rounded-[10px] border-separate border-spacing-x-[2px]">
        <thead>
          <tr className="text-left">
            <th className="w-[2rem] sticky top-0 bg-[var(--bg)]"></th>
            <th className="w-[10rem] sticky top-0 bg-[var(--bg)]">
              <p className="text-md">Team</p>
            </th>
            <th className="sticky top-0 bg-[var(--bg)] w-[6rem]">
              <p className="text-md">Value</p>
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((x, i) => (
            <TableRowTeamBased key={i} datapoint={x} />
          ))}
        </tbody>
      </table>
      {(data?.length === 0 || !data) && (
        <p className="text-sm place-self-center italic">No data yet</p>
      )}
    </div>
  );
}

function TableRowTeamBased({
  datapoint,
}: {
  datapoint: { position: number; team: string; value: number };
}) {
  return (
    <tr>
      <td>
        <p className="text-right pr-[10px] text-md">{datapoint.position}.</p>
      </td>
      <td>
        <p className="text-md text-nowrap overflow-ellipsis whitespace-nowrap overflow-hidden">
          {datapoint.team}
        </p>
      </td>
      <td>
        <p className="text-md">{datapoint.value}</p>
      </td>
    </tr>
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
