import { cookies } from 'next/headers';
import ClientPage from './clientPage';
import { redirect } from 'next/navigation';

export default async function Page() {
  const cookieStore = await cookies();
  if (!cookieStore.has('token')) {
    return redirect('/login?callbackUrl=/create-league');
  }
  return <ClientPage />;
}
