import { cookies } from 'next/headers';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { User } from '@/util/definitions';
import { redirect } from 'next/navigation';
import PricingClient from './pricingClient';

export default async function Page() {
  const cookieStore = await cookies();
  const response = await fetchAPI(`${API_URL}/me`, {
    method: 'GET',
    headers: {
      Cookie: cookieStore.toString(), // pass request cookies
    },
    cache: 'no-store', // optional: prevent caching
  });

  let user: User | null;

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
  }

  const isLoggedIn = user !== undefined && user !== null;

  if (isLoggedIn) {
    // router push
    redirect('/');
  } else {
    return <PricingClient />;
  }
}
