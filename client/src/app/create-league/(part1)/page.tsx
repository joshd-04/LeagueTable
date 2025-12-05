import { cookies } from 'next/headers';
import ClientPage from './clientPage';
import { redirect } from 'next/navigation';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';

export default async function Page() {
  const cookieStore = await cookies();
  const response = await fetchAPI(`${API_URL}/me`, {
    method: 'GET',
    headers: {
      Cookie: cookieStore.toString(), // pass request cookies
    },
    cache: 'no-store', // optional: prevent caching
  });

  if (response.status !== 'success') {
    return redirect('/login?callbackUrl=/create-league');
  }
  return <ClientPage />;
}
