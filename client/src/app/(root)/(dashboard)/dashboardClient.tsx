'use client';
import Heading3 from '@/components/text/Heading3';

import { GlobalContext } from '@/context/GlobalContextProvider';
import React, {
  ReactNode,
  Suspense,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { LeagueInterface } from './dashboard';
import { User } from '@/util/definitions';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { useQuery } from '@tanstack/react-query';
import {
  addToast,
  Button,
  Card,
  CardBody,
  Chip,
  Link,
  Tab,
  Tabs,
} from '@heroui/react';
import LeagueCard from './(widgets)/LeagueCard';

interface LeaguesInterface {
  created: LeagueInterface[];
  favorites: LeagueInterface[];
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
    favorites: LeagueInterface[];
    following: LeagueInterface[];
  };
}) {
  const context = useContext(GlobalContext);
  const { user, setUser } = context.account;

  useEffect(() => {
    setUser(initialUser);
    if (initialError) {
      addToast({
        title: 'We ran into a problem',
        description: initialError,
        color: 'danger',
        shouldShowTimeoutProgress: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUser, initialError]);

  const [leagues, setLeagues] = useState<LeaguesInterface>(initialLeagues);
  const simplifiedLeagues = {
    created: leagues.created.map((l) => l._id),
    favorites: leagues.favorites.map((l) => l._id),
    following: leagues.following.map((l) => l._id),
  };

  useEffect(() => {
    console.log(leagues);
  }, [leagues]);

  const [selectedLeagueTab, setSelectedLeagueTab] =
    useState<string>('favorites');

  const currentHour = new Date().getHours();
  let welcomeMessage = 'Hey there';
  if (currentHour >= 0 && currentHour < 5) {
    welcomeMessage = 'Hey there';
  } else if (currentHour >= 5 && currentHour < 12) {
    welcomeMessage = 'Good Morning';
  } else if (currentHour >= 12 && currentHour < 17) {
    welcomeMessage = 'Good Afternoon';
  } else {
    welcomeMessage = 'Good evening';
  }

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
        favorites: associatedLeaguesData.data.favorites as LeagueInterface[],
        following: associatedLeaguesData.data.following as LeagueInterface[],
      });
    }
  }, [associatedLeaguesData]);

  const router = useRouter();

  useEffect(() => {
    setLeagues((prev) => ({
      created: prev.created,
      following: prev.following,
      favorites: prev.favorites.map((l) => ({ ...l, isFavorited: true })),
    }));
  }, [leagues.favorites.length]);

  function handleClick(leagueId: string) {
    router.push(`/leagues/${leagueId}`);
  }

  async function handleFavClick(
    leagueId: string,
    action: 'favorite' | 'unfavorite'
  ) {
    try {
      if (action === 'favorite') {
        const response = await fetchAPI(`${API_URL}/users/favorites`, {
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
                favorites: [...prev.favorites, league],
              };
            });
            addToast({
              color: 'success',
              title: 'Added to favorites',
              description: `${league?.name} added to favorites`,
              shouldShowTimeoutProgress: true,
              timeout: 4000,
            });
          }
        } else if (response.status === 'fail') {
          addToast({
            color: 'warning',
            title: 'Not added to favorites',
            description: response.data.message,
            shouldShowTimeoutProgress: true,
            timeout: 4000,
          });
        } else {
          addToast({
            color: 'danger',
            title: 'Something went wrong',
            description: response.message,
            shouldShowTimeoutProgress: true,
            timeout: 4000,
          });
        }
      } else {
        const response = await fetchAPI(`${API_URL}/users/favorites`, {
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
                favorites: prev.favorites.filter(
                  (league) => league._id !== leagueId
                ),
              };
            });
            addToast({
              color: 'success',
              title: 'Removed from favorites',
              description: `${league?.name} removed from favorites`,
              shouldShowTimeoutProgress: true,
              timeout: 4000,
            });
          }
        } else if (response.status === 'fail') {
          addToast({
            color: 'warning',
            title: 'Not removed from favorites',
            description: response.data.message,
            shouldShowTimeoutProgress: true,
            timeout: 4000,
          });
        } else {
          addToast({
            color: 'danger',
            title: 'Something went wrong',
            description: response.message,
            shouldShowTimeoutProgress: true,
            timeout: 4000,
          });
        }
      }
    } catch (error: unknown) {
      const e = error as Error;
      addToast({
        title: 'We ran into a problem',
        description: e.message || undefined,
        color: 'danger',
        shouldShowTimeoutProgress: true,
      });
    }
  }

  async function handleFollowClick(
    leagueId: string,
    action: 'follow' | 'unfollow'
  ) {
    try {
      if (action === 'follow') {
        const response = await fetchAPI(`${API_URL}/users/following`, {
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
                following: [...prev.following, league],
                favorites: prev.favorites,
              };
            });
            addToast({
              color: 'success',
              title: 'Added to following',
              description: `You are now following ${league?.name}`,
              shouldShowTimeoutProgress: true,
              timeout: 4000,
            });
          }
        } else if (response.status === 'fail') {
          addToast({
            color: 'warning',
            title: 'Not added to following',
            description: response.data.message,
            shouldShowTimeoutProgress: true,
            timeout: 4000,
          });
        } else {
          addToast({
            color: 'danger',
            title: 'Something went wrong',
            description: response.message,
            shouldShowTimeoutProgress: true,
            timeout: 4000,
          });
        }
      } else {
        const response = await fetchAPI(`${API_URL}/users/following`, {
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
                following: prev.following.filter(
                  (league) => league._id !== leagueId
                ),
                favorites: prev.favorites,
              };
            });
            addToast({
              color: 'success',
              title: 'Removed from following',
              description: `Unfollowed ${league?.name}`,
              shouldShowTimeoutProgress: true,
              timeout: 4000,
            });
          }
        } else if (response.status === 'fail') {
          addToast({
            color: 'warning',
            title: 'Not removed from following',
            description: response.data.message,
            shouldShowTimeoutProgress: true,
            timeout: 4000,
          });
        } else {
          addToast({
            color: 'danger',
            title: 'Something went wrong',
            description: response.message,
            shouldShowTimeoutProgress: true,
            timeout: 4000,
          });
        }
      }
    } catch (error: unknown) {
      const e = error as Error;
      addToast({
        title: 'We ran into a problem',
        description: e.message || undefined,
        color: 'danger',
        shouldShowTimeoutProgress: true,
      });
    }
  }

  return (
    <div className="w-full h-full flex flex-row justify-center items-baseline">
      <div className="max-w-[960px] w-[960px] flex flex-col gap-4 mt-6">
        <Heading3>
          {welcomeMessage}, {user?.username}
        </Heading3>
        <div>
          {associatedLeaguesIsLoading ? (
            <>
              <LeagueSectionSkeleton title="Favorite Leagues" />
              <LeagueSectionSkeleton title="Your Leagues" />
              <LeagueSectionSkeleton title="Bookmarked Leagues" />
            </>
          ) : (
            <>
              <Tabs
                radius="md"
                color="primary"
                variant="light"
                selectedKey={selectedLeagueTab}
                onSelectionChange={(key) => setSelectedLeagueTab(String(key))}
              >
                <Tab
                  key="favorites"
                  title={
                    <div className="flex items-center space-x-2">
                      <span>Favorites</span>
                      <Chip
                        variant="solid"
                        radius="full"
                        size="sm"
                        className={
                          selectedLeagueTab === 'favorites'
                            ? 'bg-foreground text-primary'
                            : ''
                        }
                      >
                        {leagues.favorites.length}
                      </Chip>
                    </div>
                  }
                >
                  <LeagueSection
                    simplifiedLeagues={simplifiedLeagues}
                    leaguesList={leagues.favorites}
                    leagueCategory="favorites"
                    handleClick={handleClick}
                    handleFavClick={handleFavClick}
                    handleFollowClick={handleFollowClick}
                    noLeaguesFoundContent={
                      <p className="text-base text-muted">
                        You haven&apos;t favorited any leagues yet
                      </p>
                    }
                  />
                </Tab>
                <Tab
                  key="yours"
                  title={
                    <div className="flex items-center space-x-2">
                      <span>Yours</span>
                      <Chip
                        variant="solid"
                        radius="full"
                        size="sm"
                        className={
                          selectedLeagueTab === 'yours'
                            ? 'bg-foreground text-primary'
                            : ''
                        }
                      >
                        {leagues.created.length}
                      </Chip>
                    </div>
                  }
                >
                  <LeagueSection
                    simplifiedLeagues={simplifiedLeagues}
                    leaguesList={leagues.created}
                    leagueCategory="created"
                    handleClick={handleClick}
                    handleFavClick={handleFavClick}
                    handleFollowClick={handleFollowClick}
                    noLeaguesFoundContent={
                      <div className="flex flex-col items-start gap-2">
                        <p className="text-base text-muted">
                          You haven&apos;t created any leagues yet
                        </p>
                        <Button
                          as={Link}
                          href="/create-league"
                          color="primary"
                          variant="shadow"
                          className="font-semibold text-sm"
                        >
                          <p>Create league</p>
                        </Button>
                      </div>
                    }
                  />
                </Tab>
                <Tab
                  key="following"
                  title={
                    <div className="flex items-center space-x-2">
                      <span>Following</span>
                      <Chip
                        variant="solid"
                        radius="full"
                        size="sm"
                        className={
                          selectedLeagueTab === 'following'
                            ? 'bg-foreground text-primary'
                            : ''
                        }
                      >
                        {leagues.following.length}
                      </Chip>
                    </div>
                  }
                >
                  <LeagueSection
                    simplifiedLeagues={simplifiedLeagues}
                    leaguesList={leagues.following}
                    leagueCategory="following"
                    handleClick={handleClick}
                    handleFavClick={handleFavClick}
                    handleFollowClick={handleFollowClick}
                    noLeaguesFoundContent={
                      <p className="text-base text-muted">
                        You aren&apos;t following any leagues yet
                      </p>
                    }
                  />
                </Tab>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function LeagueSectionSkeleton({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-base">{title}</p>
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
  leagueCategory,
  handleClick,
  handleFavClick,
  handleFollowClick,
  noLeaguesFoundContent,
}: {
  simplifiedLeagues: {
    created: string[];
    favorites: string[];
    following: string[];
  };
  leaguesList: LeagueInterface[];
  leagueCategory: 'favorites' | 'created' | 'following';
  handleClick: (leagueId: string) => void;
  handleFavClick: (leagueId: string, action: 'favorite' | 'unfavorite') => void;
  handleFollowClick: (leagueId: string, action: 'follow' | 'unfollow') => void;
  noLeaguesFoundContent: ReactNode;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* <div className="flex flex-row gap-2">
        <p className="text-base">{title}</p>
        <Chip variant="solid" radius="full" size="sm">
          {leaguesList.length}
        </Chip>
      </div> */}
      {leaguesList.length > 0 ? (
        leaguesList.map((league, i) => (
          <Suspense
            key={i}
            fallback={
              <div className="w-full h-[80px] bg-blue-500 rounded-[10px]"></div>
            }
          >
            <LeagueCard
              simplifiedLeagues={simplifiedLeagues}
              league={league}
              handleClick={handleClick}
              handleFavClick={handleFavClick}
              handleFollowClick={handleFollowClick}
              leagueCategory={leagueCategory}
            />
          </Suspense>
        ))
      ) : (
        <NoLeaguesFound>{noLeaguesFoundContent}</NoLeaguesFound>
      )}
    </div>
  );
}

function NoLeaguesFound({ children }: { children: React.ReactNode }) {
  return (
    <Card className="col-span-2 px-[12px] py-[8px]">
      <CardBody>{children}</CardBody>
    </Card>
  );
}
