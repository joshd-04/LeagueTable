import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import DashboardClient from './dashboardClient';
import { cookies } from 'next/headers';
import { User } from '@/util/definitions';

export interface LeagueInterface {
  _id: string;
  name: string;
  currentSeason: number;
  currentMatchweek: number;
  numDivisions: number;
  numTeams: number;
  owner: { _id: string; name: string; accountType: 'free' | 'pro' };
}

export default async function Dashboard({
  initialUser,
  initialError,
}: {
  initialUser: User | null;
  initialError: string;
}) {
  const leagues: {
    created: LeagueInterface[];
    favourites: LeagueInterface[];
    following: LeagueInterface[];
  } = { created: [], favourites: [], following: [] };
  const cookieStore = await cookies();

  const associatedLeagues = await fetchAPI(`${API_URL}/leagues/associated`, {
    method: 'GET',
    headers: {
      Cookie: cookieStore.toString(), // pass request cookies
    },
    cache: 'no-store', // optional: prevent caching
  });

  leagues.created = associatedLeagues.data.created as LeagueInterface[];
  leagues.favourites = associatedLeagues.data.favourites as LeagueInterface[];
  leagues.following = associatedLeagues.data.following as LeagueInterface[];

  return (
    <DashboardClient
      initialUser={initialUser}
      initialError={initialError}
      initialLeagues={leagues}
    />
  );
}
