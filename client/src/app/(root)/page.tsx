'use client';
import LandingPage from './landingPage';
import useAccount from '../../hooks/useAccount';
import Dashboard from './dashboard';
import AutoSignIn from '@/components/autoSignIn/AutoSignIn';

export default function Home() {
  const { isLoggedIn, performAutoSignIn } = useAccount();

  if (performAutoSignIn) return <AutoSignIn />;
  if (isLoggedIn === false) {
    return <LandingPage />;
  } else return <Dashboard />;
}
