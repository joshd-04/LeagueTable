'use client';
import Heading3 from '@/components/text/Heading3';
import Label from '@/components/text/Label';
import Paragraph from '@/components/text/Paragraph';
import Subtitle from '@/components/text/Subtitle';
import { GlobalContext } from '@/context/GlobalContextProvider';
import React, { Suspense, useContext, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { LeagueInterface } from './dashboard';
import { User } from '@/util/definitions';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import FavouriteSVG from '@/assets/svg components/Favourite';
import FavouritedSVG from '@/assets/svg components/Favourited';
import { useQuery } from '@tanstack/react-query';

interface LeaguesInterface {
  created: LeagueInterface[];
  favourites: LeagueInterface[];
  following: LeagueInterface[];
}

export default function DashboardClient({
  initialUser,
  initialError,
  initialLeagues,
}: {
  initialUser: User | null;
  initialError: string;
  initialLeagues: {
    created: LeagueInterface[];
    favourites: LeagueInterface[];
    following: LeagueInterface[];
  };
}) {
  const context = useContext(GlobalContext);
  const { user, setUser } = context.account;
  const { setError } = context.errors;

  useEffect(() => {
    setUser(initialUser);
    setError(initialError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUser, initialError]);

  const [leagues, setLeagues] = useState<LeaguesInterface>(initialLeagues);
  const simplifiedLeagues = {
    created: leagues.created.map((l) => l._id),
    favourites: leagues.favourites.map((l) => l._id),
    following: leagues.following.map((l) => l._id),
  };

  const { data: associatedLeaguesData, isLoading: associatedLeaguesIsLoading } =
    useQuery({
      queryFn: () =>
        fetchAPI(`${API_URL}/leagues/associated`, {
          method: 'GET',
          credentials: 'include',
        }),
      queryKey: ['associatedHomePage'],
    });

  useEffect(() => {
    if (associatedLeaguesData !== undefined) {
      setLeagues({
        created: associatedLeaguesData.data.created as LeagueInterface[],
        favourites: associatedLeaguesData.data.favourites as LeagueInterface[],
        following: associatedLeaguesData.data.following as LeagueInterface[],
      });
    }
  }, [associatedLeaguesData]);

  const router = useRouter();

  useEffect(() => {
    setLeagues((prev) => ({
      created: prev.created,
      following: prev.following,
      favourites: prev.favourites.map((l) => ({ ...l, isFavourited: true })),
    }));
  }, [leagues.favourites.length]);

  function handleClick(leagueId: string) {
    router.push(`/leagues/${leagueId}`);
  }

  async function handleFavClick(
    leagueId: string,
    action: 'favourite' | 'unfavourite'
  ) {
    try {
      if (action === 'favourite') {
        const response = await fetchAPI(`${API_URL}/users/favourites`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ leagueId: leagueId }),
        });
        if (response.status === 'success') {
          const league =
            leagues.created.find((league) => league._id === leagueId) ||
            leagues.following.find((league) => league._id === leagueId);
          if (league) {
            setLeagues((prev) => {
              return {
                created: prev.created,
                following: prev.following,
                favourites: [...prev.favourites, league],
              };
            });
          }
        }
      } else {
        const response = await fetchAPI(`${API_URL}/users/favourites`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ leagueId: leagueId }),
        });
        if (response.status === 'success') {
          const league =
            leagues.created.find((league) => league._id === leagueId) ||
            leagues.following.find((league) => league._id === leagueId);
          if (league) {
            setLeagues((prev) => {
              return {
                created: prev.created,
                following: prev.following,
                favourites: prev.favourites.filter(
                  (league) => league._id !== leagueId
                ),
              };
            });
          }
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
        setError(error.message);
      } else {
        console.error(error);
        setError('An unknown error occurred.');
      }
    }
  }

  return (
    <div className="w-full h-full flex flex-row justify-center items-baseline">
      <div className="max-w-[960px] w-[960px] flex flex-col gap-4 mt-6">
        <Heading3>Welcome, {user?.username}</Heading3>
        {associatedLeaguesIsLoading ? (
          <>
            <LeagueSectionSkeleton title="Favourite Leagues" />
            <LeagueSectionSkeleton title="Your Leagues" />
            <LeagueSectionSkeleton title="Bookmarked Leagues" />
          </>
        ) : (
          <>
            <LeagueSection
              simplifiedLeagues={simplifiedLeagues}
              title="Favourite Leagues"
              leaguesList={leagues.favourites}
              handleClick={handleClick}
              handleFavClick={handleFavClick}
            />
            <LeagueSection
              simplifiedLeagues={simplifiedLeagues}
              title="Your Leagues"
              leaguesList={leagues.created}
              handleClick={handleClick}
              handleFavClick={handleFavClick}
            />
            <LeagueSection
              simplifiedLeagues={simplifiedLeagues}
              title="Bookmarked Leagues"
              leaguesList={leagues.following}
              handleClick={handleClick}
              handleFavClick={handleFavClick}
            />
          </>
        )}
      </div>
    </div>
  );
}

function LeagueSectionSkeleton({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-2">
      <Paragraph>{title}</Paragraph>
      <div className=" animate-pulse">
        <NoLeaguesFound>
          <i>Loading...</i>
        </NoLeaguesFound>
      </div>
    </div>
  );
}

function LeagueSection({
  simplifiedLeagues,
  leaguesList,
  title,
  handleClick,
  handleFavClick,
}: {
  simplifiedLeagues: {
    created: string[];
    favourites: string[];
    following: string[];
  };
  leaguesList: LeagueInterface[];
  title: string;
  handleClick: (leagueId: string) => void;
  handleFavClick: (
    leagueId: string,
    action: 'favourite' | 'unfavourite'
  ) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Paragraph>
        {title} ({leaguesList.length})
      </Paragraph>
      {leaguesList.length > 0 ? (
        leaguesList.map((league, i) => (
          <Suspense
            key={i}
            fallback={
              <div className="w-full h-[80px] bg-blue-500 rounded-[10px]"></div>
            }
          >
            <LeagueRow
              simplifiedLeagues={simplifiedLeagues}
              league={league}
              handleClick={handleClick}
              handleFavClick={handleFavClick}
            />
          </Suspense>
        ))
      ) : (
        <NoLeaguesFound>No leagues were found</NoLeaguesFound>
      )}
    </div>
  );
}

interface LeagueRowProps {
  simplifiedLeagues: {
    created: string[];
    favourites: string[];
    following: string[];
  };
  league: LeagueInterface;
  handleClick: (leagueId: string) => void;
  handleFavClick: (
    leagueId: string,
    action: 'favourite' | 'unfavourite'
  ) => void;
}

function LeagueRow({
  simplifiedLeagues,
  league,
  handleClick,
  handleFavClick,
}: LeagueRowProps) {
  // const { colorTheme } = useContext(GlobalContext).colorTheme;
  const [isHoveringFav, setIsHoveringFav] = useState(false);
  const [isPressingFav, setIsPressingFav] = useState(false);

  const isFavourited = simplifiedLeagues.favourites.includes(league._id);
  // const isFollowing = simplifiedLeagues.following.includes(league._id);

  return (
    <motion.button
      className={`w-full h-[80px] bg-[var(--bg)] rounded-[10px] flex flex-row justify-baseline items-center px-[20px] py-[10px] gap-[20px] ${
        isHoveringFav ? '' : 'hover:bg-[var(--bg-light)]'
      } hover:cursor-pointer border-1 border-solid border-[var(--border)] hover:border-transparent`}
      whileTap={{ scale: isPressingFav ? 1 : 0.98 }}
      onClick={() => handleClick(league._id)}
    >
      <motion.span
        className="hover:bg-[var(--bg-light)] p-2 rounded-[10px]"
        onHoverStart={() => setIsHoveringFav(true)}
        onHoverEnd={() => setIsHoveringFav(false)}
        whileTap={{ scale: 0.96 }}
        onClick={(e) => {
          e.stopPropagation();
          const action = isFavourited ? 'unfavourite' : 'favourite';
          handleFavClick(league._id, action);
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          setIsPressingFav(true);
        }}
        onPointerUp={() => {
          setIsPressingFav(false);
        }}
      >
        {' '}
        {isFavourited ? (
          <FavouritedSVG className="w-[32px] h-[32px] fill-[var(--favourite)]" />
        ) : (
          <FavouriteSVG
            className={`w-[32px] h-[32px]`}
            style={{ fill: isHoveringFav ? 'var(--favourite)' : 'var(--text)' }}
          />
        )}
      </motion.span>
      <div className="flex flex-col justify-center items-start">
        <Subtitle>{league.name}</Subtitle>
        <div className="flex flex-row w-full justify-start items-center gap-[40px]">
          <Label style={{ fontWeight: 'bold' }}>{league.owner.name}</Label>
          <Label style={{ fontWeight: 'bold' }}>
            {league.actions?.length > 0 ? (
              <span className="text-[var(--warning)]">action required</span>
            ) : (
              `Season ${league.currentSeason} matchweek ${league.currentMatchweek}`
            )}
          </Label>
          <Label style={{ fontWeight: 'bold' }}>
            {league.numDivisions} division{league.numDivisions > 1 ? 's' : ''}
          </Label>
          <Label style={{ fontWeight: 'bold' }}>{league.numTeams} teams</Label>
        </div>
      </div>
    </motion.button>
  );
}

function NoLeaguesFound({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-[80px] bg-[var(--bg)] rounded-[10px] flex flex-col justify-center items-start px-[20px] py-[10px]  border-1 border-solid border-[var(--border)] ">
      <Paragraph style={{ color: 'var(--text-muted)' }}>{children}</Paragraph>
    </div>
  );
}
