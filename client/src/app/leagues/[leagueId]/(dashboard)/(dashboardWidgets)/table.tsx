import TeamForm from '@/components/teamForm/TeamForm';
import Paragraph from '@/components/text/Paragraph';
import { League, Team } from '@/util/definitions';
import { Dispatch, SetStateAction } from 'react';

export default function TableWidget({
  teams,
  league,
  divisionViewing,
  setDivisionViewing,
}: {
  teams: Team[];
  league: League;
  divisionViewing: number;
  setDivisionViewing: Dispatch<SetStateAction<number>>;
}) {
  console.log(teams);
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
      <Table teams={teams} />
    </div>
  );
}

function Table({ teams }: { teams: Team[] }) {
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
          {teams.map((team, i) => (
            <TableRow key={i} team={team} />
          ))}
        </tbody>
      </table>
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
