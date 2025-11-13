import TeamForm from '@/components/teamForm/TeamForm';
import Paragraph from '@/components/text/Paragraph';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { League, Team } from '@/util/definitions';
import {
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

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

  const scrollableRef = useRef<HTMLDivElement>(null);

  const handleScrollToTop = () => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollTo({
        top: 0,
        behavior: 'smooth', // optional: smooth scroll
      });
    }
  };

  useEffect(() => {
    handleScrollToTop();
  }, [divisionViewing]);

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
            className="bg-[var(--bg-light)] p-2 rounded-[10px] outline-none cursor-pointer"
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
      <TableComponent
        teams={teams}
        isLoading={isLoading}
        league={league}
        divisionViewing={divisionViewing}
        ref={scrollableRef}
      />
    </div>
  );
}

function TableComponent({
  teams,
  league,
  divisionViewing,
  isLoading,
  ref,
}: {
  teams: Team[] | undefined;
  league: League;
  divisionViewing: number;
  isLoading: boolean;
  ref: RefObject<HTMLDivElement | null>;
}) {
  const table = league.tables[divisionViewing - 1];

  const [rows, setRows] = useState<TableRow[]>([]);

  // CONFIG
  const isStriped = true;
  const isHeaderSticky = true;
  const showIndicator = true;
  const highlightBackground = true;

  interface TableColumn {
    key: string;
    label: string;
  }

  interface TableRow {
    key: number;
    position?: number;
    team: string;
    matchesPlayed: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
    form: string;
  }

  const renderCell = useCallback(
    (user: TableRow, columnKey: keyof TableRow) => {
      const cellValue = user[columnKey];
      switch (columnKey) {
        case 'form':
          if (cellValue) return <TeamForm form={cellValue.toString()} />;
          else return cellValue;
        default:
          return cellValue;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [teams]
  );

  const columns: TableColumn[] = [
    { key: 'position', label: '#' },
    { key: 'team', label: 'Team' },
    { key: 'matchesPlayed', label: 'MP' },
    { key: 'wins', label: 'W' },
    { key: 'draws', label: 'D' },
    { key: 'losses', label: 'L' },
    { key: 'goalsFor', label: 'GF' },
    { key: 'goalsAgainst', label: 'GA' },
    { key: 'goalDifference', label: 'GD' },
    { key: 'points', label: 'Pts' },
    { key: 'form', label: 'Form' },
  ];

  useEffect(() => {
    console.log('Teams have changed. Setting teams.');
    if (teams === undefined) {
      return;
    }

    const rowsData = teams?.map((team, i) => {
      const goalDifference = team.goalsFor - team.goalsAgainst;
      const points = 3 * team.wins + team.draws;
      return {
        key: i,
        position: team.position,
        team: team.name,
        matchesPlayed: team.matchesPlayed,
        wins: team.wins,
        draws: team.draws,
        losses: team.losses,
        goalsFor: team.goalsFor,
        goalsAgainst: team.goalsAgainst,
        goalDifference: goalDifference,
        points: points,
        form: team.form,
      };
    });
    setRows(rowsData);
  }, [teams]);

  function getZone(
    position: number | undefined,
    table: {
      numberOfTeamsToBePromoted: number;
      numberOfTeamsToBeRelegated: number;
      numberOfTeams: number;
    }
  ): 'promotion' | 'relegation' | 'none' {
    if (!position) return 'none';

    const inPromotion = table.numberOfTeamsToBePromoted >= position;
    const inRelegation =
      table.numberOfTeamsToBeRelegated - 1 >= table.numberOfTeams - position;

    if (inPromotion) return 'promotion';
    if (inRelegation) return 'relegation';
    return 'none';
  }

  return (
    <div className="relative h-[24rem] " ref={ref}>
      <Table
        isStriped={isStriped}
        radius="md"
        isHeaderSticky={isHeaderSticky}
        aria-label="The league table"
        className="h-[384px] max-h-[384px]"
        maxTableHeight={384}
        classNames={{
          tr: `
      ${
        highlightBackground
          ? `data-[zone=promotion]:bg-[var(--success)]/20
      data-[zone=relegation]:bg-[var(--danger)]/20
      data-[zone=none]:bg-transparent
      dark:data-[zone=promotion]:bg-[var(--success)]/20
      dark:data-[zone=relegation]:bg-[var(--danger)]/20`
          : ''
      }
      
      ${
        showIndicator
          ? `data-[zone=promotion]:border-l-4 data-[zone=promotion]:border-l-[var(--success)]
      data-[zone=relegation]:border-l-4 data-[zone=relegation]:border-l-[var(--danger)]
      data-[zone=none]:border-l-0`
          : ''
      }
    `
            .replace(/\s+/g, ' ')
            .trim(),
        }}
      >
        <TableHeader columns={columns} className="sticky top-0">
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={rows} emptyContent={'No rows to display.'}>
          {(item) => {
            const zone = getZone(item.position, table);
            return (
              <TableRow key={item.key} data-zone={zone}>
                {(columnKey) => (
                  <TableCell>
                    {renderCell(item, columnKey as keyof TableRow)}
                  </TableCell>
                )}
              </TableRow>
            );
          }}
        </TableBody>
      </Table>
      {isLoading && (
        <TableRowSkeleton
          numRows={league.tables[divisionViewing - 1].numberOfTeams}
        />
      )}
    </div>
  );
}

function TableRowComponent({
  team,
  table,
}: {
  team: Team;
  table: {
    division: number;
    name: string;
    numberOfTeams: number;
    numberOfTeamsToBePromoted: number;
    numberOfTeamsToBeRelegated: number;
    season: number;
    teams: Team[];
  };
}) {
  // config
  const showIndicator = true;
  const highlightBackground = true;

  const goalDifference = team.goalsFor - team.goalsAgainst;
  const points = 3 * team.wins + team.draws;

  if (team.position === undefined) {
    return <tr></tr>;
  }

  const inPromotionZone = table.numberOfTeamsToBePromoted >= team.position;
  const inRelegationZone =
    table.numberOfTeamsToBeRelegated - 1 >= table.numberOfTeams - team.position;

  let indicatorColor = undefined;
  if (showIndicator) {
    if (inPromotionZone) indicatorColor = 'var(--success)';
    if (inRelegationZone) indicatorColor = 'var(--danger)';
  }

  let highlightColor = undefined;
  if (highlightBackground) {
    if (inPromotionZone) highlightColor = 'bg-[var(--success)]/20';
    if (inRelegationZone) highlightColor = 'bg-[var(--danger)]/20';
  }

  return (
    <tr className={`${highlightColor}`}>
      <td className="h-full">
        <div className="w-full h-full flex flex-row justify-between items-stretch ">
          <div
            className="min-h-full my-[4px] w-[5px] rounded-[10px]"
            style={{ backgroundColor: indicatorColor }}
          ></div>
          <Paragraph
            style={{
              textAlign: 'right',
              paddingRight: '10px',
            }}
          >
            {team.position}.
          </Paragraph>
        </div>
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
