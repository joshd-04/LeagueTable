import TeamForm from '@/components/teamForm/TeamForm';
import Paragraph from '@/components/text/Paragraph';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { League, Team } from '@/util/definitions';
import { useQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';

export default function TableWidget({
  league,
  seasonViewing = league.currentSeason,
  divisionViewing,
  setDivisionViewing,
}: {
  league: League;
  seasonViewing?: number;
  divisionViewing: number;
  setDivisionViewing: Dispatch<SetStateAction<number>>;
}) {
  console.log(`szn ${seasonViewing}`);
  const { data, isLoading } = useQuery({
    queryFn: () =>
      fetchAPI(
        `${API_URL}/leagues/${league._id}/teams?division=${divisionViewing}&season=${seasonViewing}`,
        {
          method: 'GET',
        }
      ),
    queryKey: ['table', divisionViewing, seasonViewing],
  });

  const teams: Team[] | undefined = data?.data.teams;
  return (
    <div className="p-[20px] col-span-2 row-span-2 h-full w-full bg-[var(--bg)] rounded-[10px] border-1 border-[var(--border)] flex flex-col gap-1">
      <div className="flex flex-row gap-[10px] items-center">
        <Paragraph
          style={{
            color: 'var(--text)',
            verticalAlign: 'middle',
            display: 'inline',
          }}
        >
          Tables
        </Paragraph>
        <Paragraph>
          <select
            className="bg-[var(--bg-light)] p-2 rounded-[10px] outline-none"
            value={divisionViewing}
            onChange={(e) => setDivisionViewing(+e.target.value)}
          >
            {league.tables
              .filter((table) => table.season === league.currentSeason)
              .map((table, i) => (
                <option value={table.division} key={i}>
                  {table.name}
                </option>
              ))}
          </select>
        </Paragraph>
      </div>
      <Table
        teams={teams}
        isLoading={isLoading}
        league={league}
        divisionViewing={divisionViewing}
      />
    </div>
  );
}

function Table({
  teams,
  league,
  divisionViewing,
  isLoading,
}: {
  teams: Team[] | undefined;
  league: League;
  divisionViewing: number;
  isLoading: boolean;
}) {
  return (
    <div className="max-h-[24rem] overflow-y-auto">
      <table className="text-[var(--text)] table table-fixed w-full font-[family-name:var(--font-instrument-sans)] bg-[var(--bg)] rounded-[10px] border-separate border-spacing-x-[2px]">
        <thead>
          <tr className="text-left z-10">
            <th className="w-[4rem] sticky top-0 bg-[var(--bg)]"></th>
            <th className="w-[8rem] sticky top-0 bg-[var(--bg)]">
              <Paragraph>Team</Paragraph>
            </th>
            <th className="sticky top-0 bg-[var(--bg)]">
              <Paragraph>MP</Paragraph>
            </th>
            <th className="sticky top-0 bg-[var(--bg)]">
              <Paragraph>W</Paragraph>
            </th>
            <th className="sticky top-0 bg-[var(--bg)]">
              <Paragraph>D</Paragraph>
            </th>
            <th className="sticky top-0 bg-[var(--bg)]">
              <Paragraph>L</Paragraph>
            </th>
            <th className="sticky top-0 bg-[var(--bg)]">
              <Paragraph>GF</Paragraph>
            </th>
            <th className="sticky top-0 bg-[var(--bg)]">
              <Paragraph>GA</Paragraph>
            </th>
            <th className="sticky top-0 bg-[var(--bg)]">
              <Paragraph>GD</Paragraph>
            </th>
            <th className="sticky top-0 bg-[var(--bg)]">
              <Paragraph style={{ fontWeight: 'bold' }}>Pts</Paragraph>
            </th>
            <th className="w-[12rem] sticky top-0 bg-[var(--bg)] z-10">
              <Paragraph>Form</Paragraph>
            </th>
          </tr>
        </thead>
        <tbody>
          {teams !== undefined &&
            !isLoading &&
            teams.map((team, i) => <TableRow key={i} team={team} />)}
        </tbody>
      </table>
      {isLoading && (
        <TableRowSkeleton
          numRows={league.tables[divisionViewing - 1].numberOfTeams}
        />
      )}
    </div>
  );
}

function TableRow({ team }: { team: Team }) {
  const goalDifference = team.goalsFor - team.goalsAgainst;
  const points = 3 * team.wins + team.draws;

  return (
    <tr>
      <td className="">
        <Paragraph style={{ textAlign: 'right', paddingRight: '10px' }}>
          {team.position || '?'}.
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
          {team.name}{' '}
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
          {team.matchesPlayed}
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
          {team.wins}
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
          {team.draws}
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
          {team.losses}
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
          {team.goalsFor}
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
          {team.goalsAgainst}
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
          {goalDifference > 0 ? `+${goalDifference}` : goalDifference}
        </Paragraph>
      </td>
      <td>
        <Paragraph style={{ fontWeight: 'bold' }}>{points}</Paragraph>
      </td>
      <td>
        <TeamForm form={team.form} />
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
