'use client';
import Label from '@/components/text/Label';
import Paragraph from '@/components/text/Paragraph';
import { SeasonStats } from '@/util/definitions';
import { useState } from 'react';

export default function Stats({
  leagueType,
  stats,
  divisionViewing,
}: {
  leagueType: 'basic' | 'advanced';
  stats: SeasonStats;
  divisionViewing: number;
}) {
  const [view, setView] = useState(
    leagueType === 'basic' ? 'cleansheets' : 'topScorers'
  );

  return (
    <div className="p-[20px] h-full w-full row-span-2 bg-[var(--bg)] rounded-[10px] border-1 border-[var(--border)] flex flex-col gap-2">
      <Paragraph>
        <select
          className="bg-[var(--bg-light)] p-2 rounded-[10px] outline-none"
          value={view}
          onChange={(e) => setView(e.target.value)}
        >
          {leagueType === 'advanced' && (
            <option value="topScorers">Top scorers</option>
          )}
          {leagueType === 'advanced' && (
            <option value="mostAssists">Most assists</option>
          )}
          <option value="cleansheets">Cleansheets</option>
        </select>
      </Paragraph>
      {view === 'topScorers' && (
        <StatsTablePlayerBased
          data={
            stats.topScorers.find((x) => x.division === divisionViewing)?.data
          }
        />
      )}
      {view === 'mostAssists' && (
        <StatsTablePlayerBased
          data={
            stats.mostAssists.find((x) => x.division === divisionViewing)?.data
          }
        />
      )}
      {view === 'cleansheets' && (
        <StatsTableTeamBased
          data={
            stats.cleansheets.find((x) => x.division === divisionViewing)?.data
          }
        />
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
              <Paragraph>Name</Paragraph>
            </th>
            <th className="w-[8rem] sticky top-0 bg-[var(--bg)]">
              <Paragraph style={{ color: 'var(--text-muted)' }}>Team</Paragraph>
            </th>
            <th className="sticky top-0 bg-[var(--bg)]">
              <Paragraph>Value</Paragraph>
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((datapoint, i) => (
            <TableRowPlayerBased key={i} datapoint={datapoint} />
          ))}
        </tbody>
      </table>
      {data?.length === 0 ||
        (!data && (
          <Label
            style={{
              placeSelf: 'center',
              color: 'var(--text-muted)',
              fontWeight: 'normal',
              fontStyle: 'italic',
            }}
          >
            No data yet
          </Label>
        ))}
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
        <Paragraph style={{ textAlign: 'right', paddingRight: '10px' }}>
          {datapoint.position}.
        </Paragraph>
      </td>
      <td>
        <Paragraph
          style={{
            textWrap: 'nowrap',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        >
          {datapoint.player}
        </Paragraph>
      </td>
      <td>
        <Paragraph
          style={{
            textWrap: 'nowrap',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            color: 'var(--text-muted)',
          }}
        >
          {datapoint.team}
        </Paragraph>
      </td>
      <td>
        <Paragraph style={{ textAlign: 'right', paddingRight: '10px' }}>
          {datapoint.value}
        </Paragraph>
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
              <Paragraph>Team</Paragraph>
            </th>
            <th className="sticky top-0 bg-[var(--bg)] w-[6rem]">
              <Paragraph>Value</Paragraph>
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((x, i) => (
            <TableRowTeamBased key={i} datapoint={x} />
          ))}
        </tbody>
      </table>
      {data?.length === 0 ||
        (!data && (
          <Label
            style={{
              placeSelf: 'center',
              color: 'var(--text-muted)',
              fontWeight: 'normal',
              fontStyle: 'italic',
            }}
          >
            No data yet
          </Label>
        ))}
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
        <Paragraph style={{ textAlign: 'right', paddingRight: '10px' }}>
          {datapoint.position}.
        </Paragraph>
      </td>
      <td>
        <Paragraph
          style={{
            textWrap: 'nowrap',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        >
          {datapoint.team}
        </Paragraph>
      </td>
      <td>
        <Paragraph>{datapoint.value}</Paragraph>
      </td>
    </tr>
  );
}
