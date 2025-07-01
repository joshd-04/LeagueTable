import Paragraph from '@/components/text/Paragraph';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { cookies } from 'next/headers';
import SetupIncomplete from './setupIncomplete';

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

  return <Paragraph>{params.leagueId}</Paragraph>;
}
