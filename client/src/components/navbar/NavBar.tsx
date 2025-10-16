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
import { useNotifier } from '@/hooks/useNotifier';

export function NavBar() {
  const pathname = usePathname();
  const { colorTheme, setColorTheme } = useContext(GlobalContext).colorTheme;
  const { user, setUser } = useContext(GlobalContext).account;
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const { isLoggedIn } = useAccount();

  const router = useRouter();

  function makeTime() {
    const date = new Date();
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }

  const notiButtons = useNotifier({
    id: 'btn',
    type: 'warning',
    title: 'This button is unavailable',
    description: makeTime,
    duration: 5000,
  });

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
        style={{ fontSize: '1rem', padding: '8px 20px' }}
        underlineEffect={false}
        borderlessButton={true}
      >
        Log in
      </LinkButton>
      <LinkButton
        href="/register"
        color="var(--primary)"
        bgHoverColor="var(--accent)"
        style={{ fontSize: '1rem', padding: '8px 20px', height: ' ' }}
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
        bgHoverColor="var(--bg-light)"
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
          <div className="absolute top-[3.5rem] right-[0] bg-[var(--bg)] rounded-[10px] z-20 shadow-[var(--shadow)] border-1 border-[var(--border)]">
            <ul className="flex flex-col justify-center items-stretch w-full gap-1">
              <li className="">
                <Button
                  // onClick={handleSignOut}
                  color="var(--text)"
                  bgHoverColor="var(--bg-light)"
                  borderlessButton={true}
                  underlineEffect={false}
                  shadowEffect={false}
                  style={{ fontSize: '1rem', width: '100%' }}
                >
                  option 2
                </Button>
              </li>
              <li>
                <Button
                  onClick={toggleTheme}
                  color="var(--text)"
                  bgHoverColor="var(--bg-light)"
                  borderlessButton={true}
                  underlineEffect={false}
                  shadowEffect={false}
                  style={{ fontSize: '1rem', width: '100%' }}
                >
                  {colorTheme === 'light' ? (
                    <span className="flex flex-row gap-2 items-center">
                      <DarkModeSVG className="w-[16px] h-[16px] fill-[var(--text)] inline" />
                      Dark mode
                    </span>
                  ) : (
                    <span className="flex flex-row gap-2 items-center">
                      <LightModeSVG className="w-[16px] h-[16px] fill-[var(--text)] inline" />
                      Light mode
                    </span>
                  )}
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
                  style={{ fontSize: '1rem', width: '100%' }}
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
    <div className="flex h-full relative flex-row justify-center items-center grow-1 max-w-full w-full px-[20px] xl:px-[163px] py-[20px] shadow-[var(--shadow)] bg-[var(--bg)]">
      <div className="flex h-full relative flex-row justify-between w-full items-stretch bg-[var(--bg)]">
        <LinkButton
          href="/"
          color="var(--text)"
          borderlessButton={true}
          shadowEffect={false}
          underlineEffect={true}
          bgHoverColor="transparent"
        >
          <Logo />
        </LinkButton>
        {pathname === '/' && !isLoggedIn && (
          <div>
            <Button
              onClick={() => {
                notiButtons?.fire();
              }}
              borderlessButton={true}
              shadowEffect={false}
              color="var(--text-muted)"
              bgHoverColor="transparent"
            >
              Features
            </Button>
            <Button
              onClick={() => {
                notiButtons?.fire();
              }}
              borderlessButton={true}
              shadowEffect={false}
              color="var(--text-muted)"
              bgHoverColor="transparent"
            >
              Use cases
            </Button>
            <Button
              onClick={() => {
                notiButtons?.fire();
              }}
              borderlessButton={true}
              shadowEffect={false}
              color="var(--text-muted)"
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
        <div className="flex flex-row gap-2 ">
          {isLoggedIn ? buttonsLoggedIn : buttonsLoggedOut}
          {/* <Button
            onClick={toggleTheme}
            color="transparent"
            bgHoverColor="var(--bg-light)"
            borderlessButton={true}
            underlineEffect={false}
            style={{ padding: '0 10px', height: '100%' }}
          >
            {colorTheme === 'light' ? (
              <DarkModeSVG className="w-[32px] h-[32px] fill-[var(--text)]" />
            ) : (
              <LightModeSVG className="w-[32px] h-[32px] fill-[var(--text)]" />
            )}
          </Button> */}
        </div>
      </div>
    </div>
  );
}
