import ProChip from '@/components/chips/ProChip';
import TeamForm from '@/components/teamForm/TeamForm';
import TeamFormLocked from '@/components/teamForm/TeamFormLocked';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { League, Team } from '@/util/definitions';
import { shouldGrantAccessToFeature } from '@/util/helpers';
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
  Tooltip,
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
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import { RxQuestionMarkCircled } from 'react-icons/rx';

export default function TableWidget({
  league,
  seasonViewing = league.currentSeason,
  divisionViewing,
  setDivisionViewing,
  userOwnsThisLeague,
}: {
  league: League;
  seasonViewing?: number;
  divisionViewing: number;
  setDivisionViewing: Dispatch<SetStateAction<number>>;
  userOwnsThisLeague: boolean;
}) {
  const { data, isLoading } = useQuery({
    queryFn: () =>
      fetchAPI(
        `${API_URL}/leagues/${league._id}/teams?division=${divisionViewing}&season=${seasonViewing}`,
        {
          method: 'GET',
        }
      ),
    queryKey: ['table', league._id, divisionViewing, seasonViewing],
  });
  const teams: Team[] | undefined = data?.data.teams;

  const [displayAsProLeague, setDisplayAsProLeague] = useState(
    shouldGrantAccessToFeature(
      'pro',
      league.leagueLevel,
      league.leagueOwner.accountType
    )
  );

  useEffect(() => {
    setDisplayAsProLeague(
      shouldGrantAccessToFeature(
        'pro',
        league.leagueLevel,
        league.leagueOwner.accountType
      )
    );
  }, [league]);

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
    <Card className="p-[10px] col-span-2 row-span-2 h-full w-full  flex flex-col gap-1">
      <CardBody className="flex flex-col gap-2">
        <div className="flex flex-row justify-between w-full items-center">
          <span className="flex flex-row gap-2 items-center">
            {displayAsProLeague && <ProChip />}
            <div className="flex flex-row gap-1 items-start">
              <p className="align-middle inline text-xl">Table</p>
              {displayAsProLeague && (
                <Tooltip
                  content={<TableFeaturesTooltipContent />}
                  className="bg-content2"
                >
                  <RxQuestionMarkCircled className="w-4 h-4 text-muted cursor-pointer" />
                </Tooltip>
              )}
              {['pro', 'pro+'].includes(league.leagueLevel) &&
                !['pro', 'pro+'].includes(league.leagueOwner.accountType) && (
                  <Tooltip
                    content={<TableFeaturesRestrictedTooltipContent />}
                    className="bg-content2"
                  >
                    <AiOutlineExclamationCircle className="w-4 h-4 text-warning cursor-pointer" />
                  </Tooltip>
                )}
            </div>
          </span>
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
          key={league._id}
          displayAsProLeague={displayAsProLeague}
          teams={teams}
          isLoading={isLoading}
          league={league}
          divisionViewing={divisionViewing}
          userOwnsThisLeague={userOwnsThisLeague}
          ref={scrollableRef}
        />
      </CardBody>
    </Card>
  );
}

function TableComponent({
  displayAsProLeague,
  teams,
  league,
  divisionViewing,
  isLoading,
  userOwnsThisLeague,
  ref,
}: {
  displayAsProLeague: boolean;
  teams: Team[] | undefined;
  league: League;
  divisionViewing: number;
  isLoading: boolean;
  userOwnsThisLeague: boolean;
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

  useEffect(() => {
    setSortDescriptor({ column: 'position', direction: 'descending' });
  }, [divisionViewing]);

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
        case 'points':
          return <p className="font-bold">{cellValue}</p>;
        case 'form':
          if (cellValue) {
            if (displayAsProLeague)
              return <TeamForm form={cellValue.toString()} />;
            else
              return <TeamFormLocked userOwnsThisLeague={userOwnsThisLeague} />;
          } else return cellValue;
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
  ];

  // If its supposed to have the team form, display it but display a locked symbol if the league owner is no longer pro
  if (['pro', 'pro+'].includes(league.leagueLevel)) {
    columns.push({ key: 'form', label: 'Form' });
  }

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
          wrapper: `bg-transparent border-none shadow-none drop-shadow-none outline-none px-0`,
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
                displayAsProLeague && (column.key !== 'form' ? true : false)
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

function TableFeaturesTooltipContent() {
  return (
    <div className="p-[6px] py-[10px] flex flex-col gap-2">
      <div className="flex flex-row gap-2 items-center">
        <ProChip />
        <p className="text-base">Table Features</p>
      </div>
      <div className="flex flex-col gap-1 text-muted">
        <p className="text-xs">This table has extra features, such as:</p>
        <ul className="text-xs list-disc pl-4">
          <li>Custom sorting</li>
          <li>Recent Form</li>
        </ul>
      </div>
    </div>
  );
}

function TableFeaturesRestrictedTooltipContent() {
  return (
    <div className="p-[6px] py-[10px] flex flex-col gap-2">
      <div className="flex flex-row gap-2 items-center">
        <AiOutlineExclamationCircle className="w-6 h-6 text-warning" />
        <p className="text-base text-warning">Table Features Restricted</p>
      </div>
      <div className="flex flex-col gap-1 text-muted">
        <p className="text-xs">
          This table no longer has its extra features, such as:
        </p>
        <ul className="text-xs list-disc pl-4">
          <li>Custom sorting</li>
          <li>Recent Form</li>
        </ul>
      </div>
    </div>
  );
}
