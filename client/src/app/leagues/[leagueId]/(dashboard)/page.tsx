import { fetchAPI } from '@/util/api';
import { API_URL, WEBSITE_NAME } from '@/util/config';
import { cookies } from 'next/headers';
import SetupIncomplete from '../setupIncomplete';
import LeagueDashboardFree from './leagueDashboardFree';
import LeagueDashboardStandard from './leagueDashboardStandard';

import { League } from '@/util/definitions';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { [key: string]: string };
}): Promise<Metadata> {
  const { leagueId } = await params;
  const cookieStore = await cookies();

  const [league, user] = await Promise.all([
    fetchAPI(`${API_URL}/leagues/${leagueId}`, {
      method: 'GET',
      headers: {
        Cookie: cookieStore.toString(), // pass request cookies
      },
      cache: 'no-store', // optional: prevent caching
    }),
    fetchAPI(`${API_URL}/me`, {
      method: 'GET',
      headers: {
        Cookie: cookieStore.toString(), // pass request cookies
      },
      cache: 'no-store', // optional: prevent caching
    }),
  ]);

  if (league.status === 'error') {
    return {
      title: 'League Not Found',
    };
  }
  const leagueObj = league.data.league as League;
  if (league.statusCode === 403) {
    return {
      title: `Setup incomplete • ${leagueObj.name} • ${WEBSITE_NAME}`,
    };
  }

  if (user.status !== 'success') {
    return {
      title: `${leagueObj.name} • ${WEBSITE_NAME}`,
      description: `View fixtures, results, tables & more for ${leagueObj.name} created by ${leagueObj.leagueOwner.username}`,
    };
  }

  const userId = user.data._id;
  const leagueOwnerId = leagueObj.leagueOwner._id;

  const userOwnsThisLeague = userId === leagueOwnerId;

  if (userOwnsThisLeague) {
    return {
      title: `${leagueObj.name} • Dashboard • ${WEBSITE_NAME}`,
      description: `View and manage fixtures, results, tables & more for ${leagueObj.name}.`,
    };
  }
  return {
    title: `${leagueObj.name} • ${WEBSITE_NAME}`,
    description: `View fixtures, results, tables & more for ${leagueObj.name} created by ${leagueObj.leagueOwner.username}`,
  };
}

// This is the league fetcher
// @ts-expect-error idk
export default async function Page({ params }) {
  const cookieStore = await cookies();
  const { leagueId } = await params;

  const response = await fetchAPI(`${API_URL}/leagues/${leagueId}`, {
    method: 'GET',
    headers: {
      Cookie: cookieStore.toString(), // pass request cookies
    },
    cache: 'no-store', // optional: prevent caching
  });

  if (response.statusCode === 403) {
    return (
      <SetupIncomplete
        leagueId={leagueId}
        leagueName={response.data.league.name}
        leagueOwner={response.data.league.leagueOwner}
        property={response.data.property} // the missing property causing the request to fail
      />
    );
  }

  if (response.status === 'success') {
    const league: League = response.data.league;

    if (league.leagueLevel === 'standard') {
      // paid features

      return <LeagueDashboardStandard initialLeague={league} />;
    } else {
      // free

      return <LeagueDashboardFree initialLeague={league} />;
    }
  } else {
    return redirect('/');
  }
}
