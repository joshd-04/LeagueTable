'use client';
import Button from '@/components/text/Button';
import LinkButton from '@/components/text/LinkButton';
import Subtitle from '@/components/text/Subtitle';
import { GlobalContext } from '@/context/GlobalContextProvider';
import useAccount from '@/hooks/useAccount';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { usePathname, useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';
import Logo from '../logo/logo';

export function NavBar() {
  const pathname = usePathname();
  const { isLoggedIn } = useAccount();
  useEffect(() => {
    console.log(isLoggedIn);
  }, [isLoggedIn]);

  const { colorTheme, setColorTheme } = useContext(GlobalContext).colorTheme;
  const { user, setUser } = useContext(GlobalContext).account;

  const router = useRouter();

  function toggleTheme() {
    if (colorTheme === 'dark') {
      setColorTheme('light');
    } else {
      setColorTheme('dark');
    }
  }

  async function handleSignOut() {
    await fetchAPI(`${API_URL}/signout`, {
      method: 'GET',
      credentials: 'include',
    });
    setUser(null);
    router.push('/');
  }

  const buttonsLoggedOut = (
    <>
      <LinkButton
        href="/login"
        color="var(--text)"
        bgHoverColor="var(--bg-light)"
      >
        Login
      </LinkButton>
      <LinkButton
        href="/register"
        color="var(--primary)"
        bgHoverColor="var(--accent)"
      >
        Sign up
      </LinkButton>
    </>
  );

  const buttonsLoggedIn = (
    <>
      <Button
        onClick={() => {
          router.push('/create-league');
        }}
        color="var(--text)"
        bgHoverColor="var(--bg)"
      >
        Create league
      </Button>
      <Button
        onClick={handleSignOut}
        color="var(--danger)"
        bgHoverColor="var(--bg)"
      >
        Sign out
      </Button>
    </>
  );

  if (user === undefined) {
    return <></>;
  }

  return (
    <div className="flex flex-row justify-between w-full px-[20px] xl:px-[163px] py-[20px] shadow-[var(--shadow)] border-b-2 border-b-[var(--border)]">
      <LinkButton
        href="/"
        color="black"
        borderlessButton={true}
        shadowEffect={false}
        bgHoverColor="transparent"
      >
        <Logo />
      </LinkButton>
      <div
        className={`${
          pathname === '/' && !isLoggedIn ? 'flex' : 'hidden'
        } gap-2`}
      >
        <Button
          onClick={() => {}}
          borderlessButton={true}
          shadowEffect={false}
          color="var(--text)"
          bgHoverColor="transparent"
        >
          Features
        </Button>
        <Button
          onClick={() => {}}
          borderlessButton={true}
          shadowEffect={false}
          color="var(--text)"
          bgHoverColor="transparent"
        >
          Use cases
        </Button>
        <Button
          onClick={() => {}}
          borderlessButton={true}
          shadowEffect={false}
          color="var(--text)"
          bgHoverColor="transparent"
        >
          FAQ
        </Button>
      </div>
      <div className="flex gap-2">
        {isLoggedIn ? buttonsLoggedIn : buttonsLoggedOut}
        <Button
          onClick={toggleTheme}
          color="#1C9DEA"
          bgHoverColor="var(--bg-light)"
        >
          Toggle
        </Button>
      </div>
    </div>
  );
}
