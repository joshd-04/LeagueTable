import { cookies } from 'next/headers';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { redirect } from 'next/navigation';
import PricingClient from './pricingClient';

export default async function PricingPage() {
  const cookieStore = await cookies();
  const response = await fetchAPI(`${API_URL}/me`, {
    method: 'GET',
    headers: {
      Cookie: cookieStore.toString(), // pass request cookies
    },
    cache: 'no-store', // optional: prevent caching
  });

  if (response.status === 'success') {
    redirect('/');
  }

  return <PricingClient />;
}
