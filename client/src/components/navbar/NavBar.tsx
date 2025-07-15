'use client';
import Button from '@/components/text/Button';
import LinkButton from '@/components/text/LinkButton';
import { GlobalContext } from '@/context/GlobalContextProvider';
import useAccount from '@/hooks/useAccount';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { usePathname, useRouter } from 'next/navigation';
import { CSSProperties, useContext, useState } from 'react';
import Logo from '../logo/logo';
import DarkModeSVG from '@/assets/svg components/DarkMode';
import LightModeSVG from '@/assets/svg components/LightMode';
import AccountCircleSVG from '@/assets/svg components/AccountCircle';

export function NavBar() {
  const pathname = usePathname();
  const { colorTheme, setColorTheme } = useContext(GlobalContext).colorTheme;
  const { user, setUser } = useContext(GlobalContext).account;
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const { isLoggedIn } = useAccount();

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

  let accountMenuButtonStyle: CSSProperties = {
    padding: '0 10px',
    zIndex: 20,
  };

  if (isAccountMenuOpen) {
    accountMenuButtonStyle = {
      ...accountMenuButtonStyle,
      backgroundColor: 'var(--accent)',
    };
  }

  const buttonsLoggedOut = (
    <>
      <LinkButton
        href="/login"
        color="var(--text)"
        bgHoverColor="var(--bg-light)"
      >
        Log in
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
      {!pathname.startsWith('/leagues/') && (
        // needs to be a button instead of linkbutton otherwise hydration error
        <Button
          onClick={() => {
            router.push('/create-league');
          }}
          color="var(--primary)"
          bgHoverColor="var(--accent)"
          borderlessButton={true}
          underlineEffect={false}
        >
          Create league
        </Button>
      )}
      <Button
        color="transparent"
        bgHoverColor="var(--bg)"
        borderlessButton={true}
        underlineEffect={false}
        style={accountMenuButtonStyle}
        onClick={() => setIsAccountMenuOpen((prev) => !prev)}
      >
        <span className="text-[var(--text)] flex flex-row gap-[10px]">
          {user?.username}{' '}
          <AccountCircleSVG className="w-[32px] h-[32px] fill-[var(--text)]" />
        </span>
      </Button>
      {isAccountMenuOpen && (
        <>
          <div className="absolute top-[4.5rem] right-[14rem] bg-[var(--bg)] rounded-[10px] z-20 shadow-[var(--shadow)]">
            <ul className="flex flex-col gap-1">
              <li>
                <Button
                  // onClick={handleSignOut}
                  color="var(--text)"
                  bgHoverColor="var(--bg-light)"
                  borderlessButton={true}
                  underlineEffect={false}
                  shadowEffect={false}
                  style={{ fontSize: '1rem' }}
                >
                  option 2
                </Button>
              </li>
              <li>
                <Button
                  onClick={() => {
                    setIsAccountMenuOpen(false);
                    handleSignOut();
                  }}
                  color="var(--danger)"
                  bgHoverColor="var(--bg-light)"
                  shadowEffect={false}
                  style={{ fontSize: '1rem' }}
                >
                  Sign out
                </Button>
              </li>
            </ul>
          </div>
          <div
            className="absolute top-0 left-0 w-[100vw] h-[100vh] z-10"
            onClick={() => setIsAccountMenuOpen(false)}
          ></div>
        </>
      )}
    </>
  );

  // if (user === undefined) {
  //   return <></>;
  // }

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
      {pathname === '/' && !isLoggedIn && (
        <div>
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
      )}
      {/* {pathname.startsWith('/leagues/') && (
        <div className="flex flex-col justify-center">
          <Subtitle>Florian Wirtz Universal</Subtitle>
        </div>
      )} */}
      <div className="flex gap-2">
        {isLoggedIn ? buttonsLoggedIn : buttonsLoggedOut}
        <Button
          onClick={toggleTheme}
          color="transparent"
          bgHoverColor="var(--bg)"
          borderlessButton={true}
          underlineEffect={false}
          style={{ padding: '0 10px' }}
        >
          {colorTheme === 'light' ? (
            <DarkModeSVG className="w-[32px] h-[32px] fill-[var(--text)]" />
          ) : (
            <LightModeSVG className="w-[32px] h-[32px] fill-[var(--text)]" />
          )}
        </Button>
      </div>
    </div>
  );
}
