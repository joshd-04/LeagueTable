import TeamForm from '@/components/teamForm/TeamForm';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { League, Team } from '@/util/definitions';
import {
  Card,
  CardBody,
  Select,
  SelectItem,
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

  const selectDivisionItems: { key: number; label: string }[] = league.tables
    .filter((table) => table.season === league.currentSeason)
    .map((table, i) => {
      return { key: i + 1, label: table.name };
    });

  return (
    <Card className="p-[20px] col-span-2 row-span-2 h-full w-full  flex flex-col gap-1">
      <CardBody className="flex flex-col gap-2">
        <div className="flex flex-row justify-between w-full items-center">
          <p className="align-middle inline text-xl">Table</p>
          <Select
            className="max-w-xs"
            style={{ cursor: 'pointer' }}
            size="sm"
            items={selectDivisionItems}
            label="Division"
            placeholder="Select a division"
            selectionMode="single"
            selectedKeys={new Set([divisionViewing.toString()])}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0];
              if (selectedKey === undefined) return;
              setDivisionViewing(Number(selectedKey));
            }}
          >
            {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
          </Select>
        </div>
        <TableComponent
          isFreeLeague={league.leagueLevel === 'free'}
          teams={teams}
          isLoading={isLoading}
          league={league}
          divisionViewing={divisionViewing}
          ref={scrollableRef}
        />
      </CardBody>
    </Card>
  );
}

function TableComponent({
  isFreeLeague,
  teams,
  league,
  divisionViewing,
  isLoading,
  ref,
}: {
  isFreeLeague: boolean;
  teams: Team[] | undefined;
  league: League;
  divisionViewing: number;
  isLoading: boolean;
  ref: RefObject<HTMLDivElement | null>;
}) {
  // CONFIG
  const isStriped = true;
  const isHeaderSticky = true;
  const showIndicator = true;
  const highlightBackground = true;

  const table = league.tables[divisionViewing - 1];

  const [rows, setRows] = useState<TableRow[]>([]);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'position',
    direction: 'descending',
  });

  const isSortedByPosition = sortDescriptor.column === 'position';

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

  const isSortingEnabled = !isFreeLeague;

  function handleSortChange(descriptor: SortDescriptor) {
    setSortDescriptor(descriptor);
    sortData(descriptor);
  }

  function sortData(descriptor: SortDescriptor) {
    const columnKey = descriptor.column as keyof TableRow;
    const direction = descriptor.direction;
    if (columnKey === 'form') {
      return;
    }
    setRows((prev) => {
      // Create a DEEP clone to avoid reference issues
      const cloned = prev.map((row) => ({ ...row }));

      // Stable sort: preserve original order on ties using index
      const withIndex = cloned.map((row, index) => ({ row, index }));

      withIndex.sort((a, b) => {
        const valA = a.row[columnKey];
        const valB = b.row[columnKey];

        if (valA == null || valB == null) return 0;

        let cmp = 0;
        if (typeof valA === 'number' && typeof valB === 'number') {
          cmp = valA - valB;
        } else if (typeof valA === 'string' && typeof valB === 'string') {
          cmp = valA.localeCompare(valB);
        }

        // Apply direction
        if (direction === 'descending') cmp = -cmp;

        // Stable: if equal, keep original order
        return cmp !== 0 ? cmp : a.index - b.index;
      });

      return withIndex.map((item) => item.row);
    });
  }

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
    <div className="relative h-[24rem]" ref={ref}>
      <Table
        isStriped={isStriped}
        radius="md"
        isHeaderSticky={isHeaderSticky}
        aria-label="The league table"
        className="h-[384px] max-h-[384px]"
        maxTableHeight={384}
        sortDescriptor={sortDescriptor}
        onSortChange={handleSortChange}
        classNames={{
          base: `bg-transparent shadow-none drop-shadow-none border-none`,
          wrapper: `border-none shadow-none drop-shadow-none outline-none px-0`,
          tr: `
      ${
        highlightBackground && isSortedByPosition
          ? `data-[zone=promotion]:bg-[var(--success)]/20
      data-[zone=relegation]:bg-[var(--danger)]/20
      data-[zone=none]:bg-transparent
      dark:data-[zone=promotion]:bg-[var(--success)]/20
      dark:data-[zone=relegation]:bg-[var(--danger)]/20`
          : ''
      }
      
      ${
        showIndicator && isSortedByPosition
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
            <TableColumn
              key={column.key}
              allowsSorting={
                isSortingEnabled && (column.key !== 'form' ? true : false)
              }
            >
              {column.label}
            </TableColumn>
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
