import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Card,
  CardBody,
} from '@heroui/react';
import TeamForm from '@/components/teamForm/TeamForm';
import { Fixture, League } from '@/util/definitions';
import ordinal from 'ordinal';
import TeamFormLocked from '@/components/teamForm/TeamFormLocked';
import { doesUserOwnThisLeague, meetsMinimumTierLevel } from '@/util/helpers';
import useAccount from '@/hooks/useAccount';

interface TableStat {
  key: string;
  label: string;
  homeValue: (fixture: Fixture) => React.ReactNode;
  awayValue: (fixture: Fixture) => React.ReactNode;
}

export default function MatchPreview({
  league,
  fixture,
}: {
  league: League;
  fixture: Fixture;
}) {
  return (
    <Card className="h-full w-full px-[10px] ">
      <CardBody className="flex flex-col gap-2">
        {/* <p className="text-base">Match preview</p> */}
        <PreviewTable league={league} fixture={fixture} />
      </CardBody>
    </Card>
  );
}

function PreviewTable({
  league,
  fixture,
}: {
  league: League;
  fixture: Fixture;
}) {
  const homeGD =
    fixture.homeTeamDetails.goalsFor - fixture.homeTeamDetails.goalsAgainst;
  const awayGD =
    fixture.awayTeamDetails.goalsFor - fixture.awayTeamDetails.goalsAgainst;

  const { user, isLoggedIn } = useAccount();

  const userOwnsThisLeague = doesUserOwnThisLeague(league, user, isLoggedIn);

  const tableStats: TableStat[] = [
    {
      key: 'form',
      label: 'Form',
      homeValue: (f) => <TeamForm form={f.homeTeamDetails.form} />,
      awayValue: (f) => <TeamForm form={f.awayTeamDetails.form} />,
    },
    {
      key: 'position',
      label: 'Position',
      homeValue: (f) => ordinal(f.homeTeamDetails.position),
      awayValue: (f) => ordinal(f.awayTeamDetails.position),
    },
    {
      key: 'points',
      label: 'Points',
      homeValue: (f) => f.homeTeamDetails.wins * 3 + f.homeTeamDetails.draws,
      awayValue: (f) => f.awayTeamDetails.wins * 3 + f.awayTeamDetails.draws,
    },
    {
      key: 'wins',
      label: 'Wins',
      homeValue: (f) => f.homeTeamDetails.wins,
      awayValue: (f) => f.awayTeamDetails.wins,
    },
    {
      key: 'draws',
      label: 'Draws',
      homeValue: (f) => f.homeTeamDetails.draws,
      awayValue: (f) => f.awayTeamDetails.draws,
    },
    {
      key: 'losses',
      label: 'Losses',
      homeValue: (f) => f.homeTeamDetails.losses,
      awayValue: (f) => f.awayTeamDetails.losses,
    },
    {
      key: 'goalsScored',
      label: 'Goals scored',
      homeValue: (f) => f.homeTeamDetails.goalsFor,
      awayValue: (f) => f.awayTeamDetails.goalsFor,
    },
    {
      key: 'goalDiff',
      label: 'Goal diff',
      homeValue: () => (homeGD > 0 ? `+${homeGD}` : homeGD),
      awayValue: () => (awayGD > 0 ? `+${awayGD}` : awayGD),
    },
  ];

  const shouldShowTeamForm = meetsMinimumTierLevel(
    'pro',
    league.leagueOwner.accountType
  );

  return (
    <Table
      isStriped
      hideHeader={false}
      aria-label="Match preview statistics"
      classNames={{
        base: 'max-h-[520px] overflow-auto bg-transparent shadow-none drop-shadow-none border-none',
        table: 'min-w-full',
        wrapper: `border-none shadow-none drop-shadow-none outline-none px-0 bg-transparent`,
      }}
    >
      <TableHeader>
        <TableColumn className="text-right text-base">
          {fixture.homeTeamDetails.name}
        </TableColumn>
        <TableColumn className="text-center w-[140px]"> </TableColumn>
        <TableColumn className="text-left text-base">
          {fixture.awayTeamDetails.name}
        </TableColumn>
      </TableHeader>
      <TableBody>
        {tableStats.map((stat) => {
          switch (stat.key) {
            case 'form':
              return (
                <TableRow key={stat.key}>
                  <TableCell className={`place-items-end text-right`}>
                    {shouldShowTeamForm ? (
                      stat.homeValue(fixture)
                    ) : (
                      <TeamFormLocked userOwnsThisLeague={userOwnsThisLeague} />
                    )}
                  </TableCell>
                  <TableCell className="text-center ">{stat.label}</TableCell>
                  <TableCell className={`place-items-start text-left`}>
                    {shouldShowTeamForm ? (
                      stat.awayValue(fixture)
                    ) : (
                      <TeamFormLocked userOwnsThisLeague={userOwnsThisLeague} />
                    )}
                  </TableCell>
                </TableRow>
              );
            default:
              return (
                <TableRow key={stat.key}>
                  <TableCell className={`place-items-end text-right`}>
                    {stat.homeValue(fixture)}
                  </TableCell>
                  <TableCell className="text-center ">{stat.label}</TableCell>
                  <TableCell className={`place-items-start text-left`}>
                    {stat.awayValue(fixture)}
                  </TableCell>
                </TableRow>
              );
          }
        })}
      </TableBody>
    </Table>
  );
}
