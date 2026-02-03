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
import { League } from '@/util/definitions';
import ordinal from 'ordinal';
import TeamFormLocked from '@/components/teamForm/TeamFormLocked';
import { doesUserOwnThisLeague, meetsMinimumTierLevel } from '@/util/helpers';
import useAccount from '@/hooks/useAccount';
import { SingleFixtureDTO } from '@/util/dto/fixtures';

interface TableStat {
  key: string;
  label: string;
  homeValue: (fixture: SingleFixtureDTO) => React.ReactNode;
  awayValue: (fixture: SingleFixtureDTO) => React.ReactNode;
}

export default function MatchPreview({
  league,
  fixtureDTO,
}: {
  league: League;
  fixtureDTO: SingleFixtureDTO;
}) {
  return (
    <Card className="h-full w-full px-[10px] ">
      <CardBody className="flex flex-col gap-2">
        {/* <p className="text-base">Match preview</p> */}
        <PreviewTable league={league} fixtureDTO={fixtureDTO} />
      </CardBody>
    </Card>
  );
}

function PreviewTable({
  league,
  fixtureDTO,
}: {
  league: League;
  fixtureDTO: SingleFixtureDTO;
}) {
  const homeGD =
    fixtureDTO.homeDetails.goalsFor - fixtureDTO.homeDetails.goalsAgainst;
  const awayGD =
    fixtureDTO.awayDetails.goalsFor - fixtureDTO.awayDetails.goalsAgainst;

  const { user, isLoggedIn } = useAccount();

  const userOwnsThisLeague = doesUserOwnThisLeague(league, user, isLoggedIn);

  const tableStats: TableStat[] = [
    {
      key: 'form',
      label: 'Form',
      homeValue: (f) => <TeamForm form={f.homeDetails.form} />,
      awayValue: (f) => <TeamForm form={f.awayDetails.form} />,
    },
    {
      key: 'position',
      label: 'Position',
      homeValue: (f) => ordinal(f.homeDetails.leaguePosition),
      awayValue: (f) => ordinal(f.awayDetails.leaguePosition),
    },
    {
      key: 'points',
      label: 'Points',
      homeValue: (f) => f.homeDetails.wins * 3 + f.homeDetails.draws,
      awayValue: (f) => f.awayDetails.wins * 3 + f.awayDetails.draws,
    },
    {
      key: 'wins',
      label: 'Wins',
      homeValue: (f) => f.homeDetails.wins,
      awayValue: (f) => f.awayDetails.wins,
    },
    {
      key: 'draws',
      label: 'Draws',
      homeValue: (f) => f.homeDetails.draws,
      awayValue: (f) => f.awayDetails.draws,
    },
    {
      key: 'losses',
      label: 'Losses',
      homeValue: (f) => f.homeDetails.losses,
      awayValue: (f) => f.awayDetails.losses,
    },
    {
      key: 'goalsScored',
      label: 'Goals scored',
      homeValue: (f) => f.homeDetails.goalsFor,
      awayValue: (f) => f.awayDetails.goalsFor,
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
    league.leagueOwner.accountType,
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
          {fixtureDTO.homeDetails.name}
        </TableColumn>
        <TableColumn className="text-center w-[140px]"> </TableColumn>
        <TableColumn className="text-left text-base">
          {fixtureDTO.awayDetails.name}
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
                      stat.homeValue(fixtureDTO)
                    ) : (
                      <TeamFormLocked userOwnsThisLeague={userOwnsThisLeague} />
                    )}
                  </TableCell>
                  <TableCell className="text-center ">{stat.label}</TableCell>
                  <TableCell className={`place-items-start text-left`}>
                    {shouldShowTeamForm ? (
                      stat.awayValue(fixtureDTO)
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
                    {stat.homeValue(fixtureDTO)}
                  </TableCell>
                  <TableCell className="text-center ">{stat.label}</TableCell>
                  <TableCell className={`place-items-start text-left`}>
                    {stat.awayValue(fixtureDTO)}
                  </TableCell>
                </TableRow>
              );
          }
        })}
      </TableBody>
    </Table>
  );
}
