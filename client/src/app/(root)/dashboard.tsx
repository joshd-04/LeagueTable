import Heading3 from '@/components/text/Heading3';
import Label from '@/components/text/Label';
import Paragraph from '@/components/text/Paragraph';
import Subtitle from '@/components/text/Subtitle';
import { GlobalContext } from '@/context/GlobalContextProvider';
import { API_URL } from '@/util/config';
import { Suspense, useContext, useEffect, useState } from 'react';

export default function Dashboard() {
  const { setError } = useContext(GlobalContext).errors;
  const { user } = useContext(GlobalContext).account;
  const [createdLeagues, setCreatedLeagues] = useState([]);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      const response = await fetch(`${API_URL}/leagues/associated`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.JWTToken}`,
        },
      });
      const data = await response.json();
      console.log(data.created);

      setCreatedLeagues(data.created ?? []);
    }
    fetchData();
  }, [user]);

  return (
    <div className="w-full h-full flex flex-row justify-center items-baseline">
      <div className="max-w-[960px] w-[960px] flex flex-col gap-4">
        <Heading3>Welcome, {user?.username}</Heading3>
        <div className="flex flex-col gap-2">
          <Paragraph>Favourite Leagues (2)</Paragraph>
          <div className="w-full h-[80px] bg-blue-500 rounded-[10px]"></div>
          <div className="w-full h-[80px] bg-blue-500 rounded-[10px]"></div>
          <div className="w-full h-[80px] bg-blue-500 rounded-[10px]"></div>
        </div>
        <div className="flex flex-col gap-2">
          <Paragraph>Your Leagues ({createdLeagues.length})</Paragraph>
          {createdLeagues.map((league, i) => (
            <Suspense
              key={i}
              fallback={
                <div className="w-full h-[80px] bg-blue-500 rounded-[10px]"></div>
              }
            >
              <LeagueRow league={league} />
            </Suspense>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <Paragraph>Bookmarked Leagues (2)</Paragraph>
          <div className="w-full h-[80px] bg-blue-500 rounded-[10px]"></div>
          <div className="w-full h-[80px] bg-blue-500 rounded-[10px]"></div>
        </div>
      </div>
    </div>
  );
}

// @ts-expect-error unexpected any
function LeagueRow({ league }) {
  const numberOfTeams = league.tables.reduce((acc, table) => {
    return acc + table.numberOfTeams;
  }, 0);
  return (
    <div className="w-full h-[80px] bg-[var(--bg)] rounded-[10px] flex flex-col px-[20px] py-[10px]">
      <Subtitle>{league.name}</Subtitle>
      <div className="flex flex-row w-full justify-start items-center gap-[40px]">
        <Label>You</Label>
        <Label>
          Season {league.currentSeason} Matchweek {league.currentMatchweek}
        </Label>
        <Label>
          {league.tables.length} Division{league.tables.length > 1 ? 's' : ''}
        </Label>
        <Label>{numberOfTeams} teams</Label>
      </div>
    </div>
  );
}
