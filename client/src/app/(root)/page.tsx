'use client';
import LandingPage from './landingPage';
import useAccount from '../../hooks/useAccount';
import Dashboard from './dashboard';

export default function Home() {
  const { isLoggedIn } = useAccount();
  if (isLoggedIn === false) {
    return <LandingPage />;
  } else return <Dashboard />;
}
