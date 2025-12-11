import useAccount from '@/hooks/useAccount';
import { League } from '@/util/definitions';
import { IoPersonSharp } from 'react-icons/io5';

export default function LeagueDetailsRibbon({ league }: { league: League }) {
  const { user } = useAccount();
  const teamsCount = league.tables
    .filter((table) => table.season === league.currentSeason)
    .reduce((acc, cur) => {
      return acc + cur.numberOfTeams;
    }, 0);

  return (
    <div className="flex flex-row justify-center items-center gap-[50px] text-base">
      <span className="flex flex-row items-center gap-1">
        <IoPersonSharp className="w-5 h-5" />
        <p>
          {league.leagueOwner.username === user?.username
            ? 'You'
            : league.leagueOwner.username}
        </p>
      </span>
      <p>
        {league.divisionsCount} division
        {league.divisionsCount === 1 ? '' : 's'}
      </p>
      <p>
        {teamsCount} team
        {teamsCount === 1 ? '' : 's'}
      </p>
      <p>
        Season {league.currentSeason} Matchweek {league.currentMatchweek}
      </p>
    </div>
  );
}
