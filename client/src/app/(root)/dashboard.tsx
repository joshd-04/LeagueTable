import Heading3 from '@/components/text/Heading3';
import Label from '@/components/text/Label';
import Paragraph from '@/components/text/Paragraph';
import Subtitle from '@/components/text/Subtitle';
import { GlobalContext } from '@/context/GlobalContextProvider';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { Suspense, useContext, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';

interface LeagueInterface {
  _id: string;
  name: string;
  currentSeason: number;
  currentMatchweek: number;
  numDivisions: number;
  numTeams: number;
  owner: { _id: string; name: string; accountType: 'free' | 'pro' };
}

interface LeaguesStateSchema {
  created: LeagueInterface[];
  favourites: LeagueInterface[];
  following: LeagueInterface[];
}

export default function Dashboard() {
  const { setError } = useContext(GlobalContext).errors;
  const { user, setUser } = useContext(GlobalContext).account;
  const [leagues, setLeagues] = useState<LeaguesStateSchema>({
    created: [],
    favourites: [],
    following: [],
  });
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      if (user === null) return;

      const [userDetails, associatedLeagues] = await Promise.all([
        fetchAPI(`${API_URL}/me`, {
          method: 'GET',
          credentials: 'include',
        }),
        fetchAPI(`${API_URL}/leagues/associated`, {
          method: 'GET',
          credentials: 'include',
        }),
      ]);

      setUser({
        id: userDetails.data._id,
        username: userDetails.data.username,
        email: userDetails.data.email,
        accountType: userDetails.data.accountType,
      });
      setLeagues({
        created: associatedLeagues.data.created,
        favourites: associatedLeagues.data.favourites,
        following: associatedLeagues.data.following,
      });
      console.log(associatedLeagues);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClick(leagueId: string) {
    router.push(`/leagues/${leagueId}`);
  }

  return (
    <div className="w-full h-full flex flex-row justify-center items-baseline">
      <div className="max-w-[960px] w-[960px] flex flex-col gap-4">
        <Heading3>Welcome, {user?.username}</Heading3>
        <div className="flex flex-col gap-2">
          <Paragraph>Favourite Leagues ({leagues.favourites.length})</Paragraph>
          {leagues.favourites.map((league, i) => (
            <Suspense
              key={i}
              fallback={
                <div className="w-full h-[80px] bg-blue-500 rounded-[10px]"></div>
              }
            >
              <LeagueRow league={league} handleClick={handleClick} />
            </Suspense>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <Paragraph>Your Leagues ({leagues.created.length})</Paragraph>
          {leagues.created.map((league, i) => (
            <Suspense
              key={i}
              fallback={
                <div className="w-full h-[80px] bg-blue-500 rounded-[10px]"></div>
              }
            >
              <LeagueRow league={league} handleClick={handleClick} />
            </Suspense>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <Paragraph>Bookmarked Leagues ({leagues.following.length})</Paragraph>
          {leagues.following.map((league, i) => (
            <Suspense
              key={i}
              fallback={
                <div className="w-full h-[80px] bg-blue-500 rounded-[10px]"></div>
              }
            >
              <LeagueRow league={league} handleClick={handleClick} />
            </Suspense>
          ))}
        </div>
      </div>
    </div>
  );
}

interface LeagueRowProps {
  league: LeagueInterface;
  handleClick: (leagueId: string) => void;
}

function LeagueRow({ league, handleClick }: LeagueRowProps) {
  return (
    <motion.button
      className="w-full h-[80px] bg-[var(--bg)] rounded-[10px] flex flex-col justify-center items-start px-[20px] py-[10px] hover:bg-[var(--bg-light)] hover:cursor-pointer border-1 border-solid border-[var(--border)] hover:border-transparent"
      whileTap={{ scale: 0.98 }}
      onClick={() => handleClick(league._id)}
    >
      <Subtitle>{league.name}</Subtitle>
      <div className="flex flex-row w-full justify-start items-center gap-[40px]">
        <Label>{league.owner.name}</Label>
        <Label>
          Season {league.currentSeason} matchweek {league.currentMatchweek}
        </Label>
        <Label>
          {league.numDivisions} division{league.numDivisions > 1 ? 's' : ''}
        </Label>
        <Label>{league.numTeams} teams</Label>
      </div>
    </motion.button>
  );
}
