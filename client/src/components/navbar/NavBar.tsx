'use client';
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Switch,
} from '@heroui/react';
import Logo from '../logo/logo';
import { usePathname } from 'next/navigation';
import { useContext, useEffect, useRef, useState } from 'react';
import { GlobalContext } from '@/context/GlobalContextProvider';
import useAccount from '@/hooks/useAccount';
import { useQuery } from '@tanstack/react-query';
import { API_URL } from '@/util/config';
import { fetchAPI } from '@/util/api';
import { useRouter } from 'next/navigation';
import DarkModeSVG from '@/assets/svg components/DarkMode';
import LightModeSVG from '@/assets/svg components/LightMode';
import { useTheme } from 'next-themes';

export default function NavBar() {
  const { user, setUser } = useContext(GlobalContext).account;
  const { isLoggedIn } = useAccount();
  const pathname = usePathname();

  const router = useRouter();
  const navRef = useRef<HTMLElement | null>(null);

  const { refetch: sendSignoutRequest } = useQuery({
    queryFn: () =>
      fetchAPI(`${API_URL}/signout`, {
        method: 'GET',
        credentials: 'include',
      }),

    queryKey: ['signout'],
    enabled: false,
  });

  async function handleSignOut() {
    await sendSignoutRequest();
    setUser(null);
    router.push('/login');
  }

  return (
    <Navbar ref={navRef}>
      <NavbarBrand>
        <Link href="/" className="text-inherit ">
          <Logo />
        </Link>
      </NavbarBrand>
      {pathname === '/' && !isLoggedIn && (
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link
              color="foreground"
              href="#"
              className="font-semibold text-medium"
            >
              Features
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link
              aria-current="page"
              href="#"
              className="font-semibold text-medium"
            >
              Use cases
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              color="foreground"
              href="#"
              className="font-semibold text-medium"
            >
              FAQ
            </Link>
          </NavbarItem>
        </NavbarContent>
      )}
      {!isLoggedIn ? (
        // Signed out
        <NavbarContent justify="end">
          <NavbarItem>
            <ThemeSwitch />
          </NavbarItem>
          <NavbarItem className="hidden lg:flex">
            <Button
              href="/login"
              as={Link}
              color="secondary"
              className="font-semibold text-small"
              variant="light"
            >
              Log In
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button
              as={Link}
              color="primary"
              href="/register"
              variant="shadow"
              className="font-semibold text-small"
            >
              Sign Up
            </Button>
          </NavbarItem>
        </NavbarContent>
      ) : (
        // Signed in

        <NavbarContent as="div" justify="end">
          {pathname === '/' && (
            <NavbarItem>
              <Button
                as={Link}
                href="/create-league"
                color="success"
                variant="ghost"
              >
                <p>Create league</p>
              </Button>
            </NavbarItem>
          )}
          <NavbarItem>
            <ThemeSwitch />
          </NavbarItem>
          <Dropdown
            placement="bottom-end"
            portalContainer={navRef.current ?? undefined}
            shouldBlockScroll={false}
          >
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="primary"
                name="Jason Hughes"
                size="sm"
                src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownSection showDivider>
                <DropdownItem
                  key="profile"
                  className="h-14 gap-2"
                  textValue="Profile"
                >
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">{user?.email}</p>
                </DropdownItem>
              </DropdownSection>
              <DropdownSection>
                <DropdownItem key="settings" textValue="Settings">
                  Settings
                </DropdownItem>

                <DropdownItem
                  key="logout"
                  color="danger"
                  textValue="Log Out"
                  onPress={handleSignOut}
                  className="text-danger"
                >
                  Log Out
                </DropdownItem>
              </DropdownSection>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      )}
    </Navbar>
  );
}

function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  // Avoid hydration mismatch between server & client
  useEffect(() => setIsMounted(true), []);
  if (!isMounted) {
    return null;
  }

  const isLight = resolvedTheme === 'light';
  return (
    <Switch
      isSelected={isLight}
      onValueChange={(isChecked) => setTheme(isChecked ? 'light' : 'dark')}
      color="success"
      endContent={
        <DarkModeSVG
          className="w-[16px] h-[16px] fill- inline"
          style={{ width: '16px', fill: 'lightgrey' }}
        />
      }
      size="md"
      startContent={
        <LightModeSVG
          className="w-[16px] h-[16px] fill-black inline"
          style={{ width: '16px' }}
        />
      }
    ></Switch>
  );
}
