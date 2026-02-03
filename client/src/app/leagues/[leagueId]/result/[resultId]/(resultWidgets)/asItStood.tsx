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
import { SingleResultDTO } from '@/util/dto/results';

interface TableStat {
  key: string;
  label: string;
  homeValue: (result: SingleResultDTO) => React.ReactNode;
  awayValue: (result: SingleResultDTO) => React.ReactNode;
}

export default function AsItStood({
  league,
  resultDTO,
}: {
  league: League;
  resultDTO: SingleResultDTO;
}) {
  return (
    <Card className="h-full w-full px-[10px] py-[6px]">
      <CardBody className="flex flex-col gap-2">
        <p className="text-base">Before the action started</p>
        <PreviewTable league={league} resultDTO={resultDTO} />
      </CardBody>
    </Card>
  );
}

function PreviewTable({
  league,
  resultDTO,
}: {
  league: League;
  resultDTO: SingleResultDTO;
}) {
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
      key: 'matchesPlayed',
      label: 'Matches Played',
      homeValue: (f) => f.homeDetails.matchesPlayed,
      awayValue: (f) => f.awayDetails.matchesPlayed,
    },
    {
      key: 'points',
      label: 'Points',
      homeValue: (f) => f.homeDetails.points,
      awayValue: (f) => f.awayDetails.points,
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
          {resultDTO.homeDetails.name}
        </TableColumn>
        <TableColumn className="text-center w-[140px]"> </TableColumn>
        <TableColumn className="text-left text-base">
          {resultDTO.awayDetails.name}
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
                      stat.homeValue(resultDTO)
                    ) : (
                      <TeamFormLocked userOwnsThisLeague={userOwnsThisLeague} />
                    )}
                  </TableCell>
                  <TableCell className="text-center ">{stat.label}</TableCell>
                  <TableCell className={`place-items-start text-left`}>
                    {shouldShowTeamForm ? (
                      stat.awayValue(resultDTO)
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
                    {stat.homeValue(resultDTO)}
                  </TableCell>
                  <TableCell className="text-center ">{stat.label}</TableCell>
                  <TableCell className={`place-items-start text-left`}>
                    {stat.awayValue(resultDTO)}
                  </TableCell>
                </TableRow>
              );
          }
        })}
      </TableBody>
    </Table>
  );
}
