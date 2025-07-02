import LandingPage from './(landingPage)/landingPage';
import Dashboard from './(dashboard)/dashboard';
import { cookies } from 'next/headers';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { User } from '@/util/definitions';

export default async function Home() {
  const cookieStore = await cookies();
  const response = await fetchAPI(`${API_URL}/me`, {
    method: 'GET',
    headers: {
      Cookie: cookieStore.toString(), // pass request cookies
    },
    cache: 'no-store', // optional: prevent caching
  });
  let user: User | null;
  let error: string = '';
  if (response.status === 'success') {
    user = {
      id: response.data._id,
      username: response.data.username,
      email: response.data.email,
      accountType: response.data.accountType,
    };
  } else if (response.status === 'fail') {
    user = null;
  } else {
    user = null;
    error = response.message;
  }

  const isLoggedIn = user !== undefined && user !== null;

  if (isLoggedIn === false) {
    return <LandingPage />;
  } else return <Dashboard initialUser={user} initialError={error} />;
}
