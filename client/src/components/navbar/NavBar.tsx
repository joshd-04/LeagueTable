'use client';
import {
  addToast,
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
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import LogoFull from '@/assets/svg components/LogoFull';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { FaChevronDown } from 'react-icons/fa6';
import useAccount from '@/hooks/useAccount';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import ProChip from '../chips/ProChip';
import ProPlusChip from '../chips/ProPlusChip';

export default function NavBar() {
  type dropdownButtons = 'features' | 'use cases';
  const [buttonHovering, setButtonHovering] = useState<dropdownButtons | null>(
    null
  );
  const [clickedOpen, setClickedOpen] = useState<dropdownButtons | null>(null);

  // Determine which dropdown should be open
  const getIsOpen = (dropdown: dropdownButtons) => {
    return clickedOpen === dropdown || buttonHovering === dropdown;
  };

  // Handle click on dropdown trigger
  const handleDropdownClick = (dropdown: dropdownButtons) => {
    if (clickedOpen === dropdown) {
      setClickedOpen(null);
    } else {
      setClickedOpen(dropdown);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (clickedOpen) {
        setClickedOpen(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [clickedOpen]);

  // const { user, setUser } = useContext(GlobalContext).account;
  // const { isLoggedIn } = useAccount();

  const { user, isUserFetchLoading, isLoggedIn, isSignedOut } = useAccount();

  const pathname = usePathname();

  const router = useRouter();

  const { refetch: sendSignoutRequest } = useQuery({
    queryFn: () =>
      fetchAPI(`${API_URL}/signout`, {
        method: 'GET',
        credentials: 'include',
      }),

    queryKey: ['signout'],
    enabled: false,
  });

  const queryClient = useQueryClient();
  async function handleSignOut() {
    const response = await sendSignoutRequest();
    if (response.data.status === 'success') {
      queryClient.invalidateQueries({ queryKey: ['account-fetch'] });
      router.push('/login');
    }
  }

  return (
    // Max height due to loading page being 90vh
    <Navbar className={`bg-transparent sticky h-15 max-h-[10vh]`}>
      <NavbarBrand className="h-full py-[22px]">
        <Link
          href="/"
          className="text-inherit h-full flex flex-row gap-1 items-end"
        >
          <LogoFull className="fill-foreground h-full" />
          {user?.accountType === 'pro' && <ProChip />}
          {user?.accountType === 'pro+' && <ProPlusChip />}
          <p className="xl:text-red-500 lg:text-blue-500 md:text-green-500 sm:text-pink-500  before:content-['--'] sm:before:content-['sm'] md:before:content-['md'] lg:before:content-['lg'] xl:before:content-['xl']"></p>
        </Link>
      </NavbarBrand>
      {isSignedOut && pathname !== '/login' && (
        <NavbarContent className="hidden sm:flex gap-10 " justify="center">
          <Dropdown isOpen={getIsOpen('features')} showArrow>
            <NavbarItem>
              <DropdownTrigger>
                <Button
                  disableRipple
                  className="p-0 data-[hover=true]:bg-transparent font-medium text-base aria-expanded:scale-100"
                  endContent={<FaChevronDown className="-ml-1" />}
                  radius="sm"
                  variant="light"
                  onMouseEnter={() => setButtonHovering('features')}
                  onMouseLeave={() => setButtonHovering(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDropdownClick('features');
                  }}
                >
                  Features
                </Button>
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu
              aria-label="ACME features"
              onMouseEnter={() => setButtonHovering('features')}
              onMouseLeave={() => setButtonHovering(null)}
              itemClasses={{
                base: 'gap-4',
              }}
            >
              <DropdownItem
                key="autoscaling"
                description="ACME scales apps based on demand and load"
              >
                Autoscaling
              </DropdownItem>
              <DropdownItem
                key="usage_metrics"
                description="Real-time metrics to debug issues"
              >
                Usage Metrics
              </DropdownItem>
              <DropdownItem
                key="production_ready"
                description="ACME runs on ACME, join us at web scale"
              >
                Production Ready
              </DropdownItem>
              <DropdownItem
                key="99_uptime"
                description="High availability and uptime guarantees"
              >
                +99% Uptime
              </DropdownItem>
              <DropdownItem
                key="supreme_support"
                description="Support team ready to respond"
              >
                +Supreme Support
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <NavbarItem>
            <Link
              href="/pricing"
              className="font-medium text-base"
              color="foreground"
              underline="hover"
            >
              Pricing
            </Link>
          </NavbarItem>
          <Dropdown isOpen={getIsOpen('use cases')} showArrow>
            <NavbarItem>
              <DropdownTrigger>
                <Button
                  disableRipple
                  className="p-0 data-[hover=true]:bg-transparent font-medium text-base aria-expanded:scale-100"
                  endContent={<FaChevronDown className="-ml-1" />}
                  radius="sm"
                  variant="light"
                  onMouseEnter={() => setButtonHovering('use cases')}
                  onMouseLeave={() => setButtonHovering(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDropdownClick('use cases');
                  }}
                >
                  Use cases
                </Button>
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu
              aria-label="ACME features"
              onMouseEnter={() => setButtonHovering('use cases')}
              onMouseLeave={() => setButtonHovering(null)}
              itemClasses={{
                base: 'gap-4',
              }}
            >
              <DropdownItem
                key="autoscaling"
                description="ACME scales apps based on demand and load"
              >
                Autoscaling
              </DropdownItem>
              <DropdownItem
                key="usage_metrics"
                description="Real-time metrics to debug issues"
              >
                Usage Metrics
              </DropdownItem>
              <DropdownItem
                key="production_ready"
                description="ACME runs on ACME, join us at web scale"
              >
                Production Ready
              </DropdownItem>
              <DropdownItem
                key="99_uptime"
                description="High availability and uptime guarantees"
              >
                +99% Uptime
              </DropdownItem>
              <DropdownItem
                key="supreme_support"
                description="Support team ready to respond"
              >
                +Supreme Support
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      )}
      {isSignedOut ? (
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
              className="font-semibold text-sm"
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
              className="font-semibold text-sm"
            >
              Sign Up
            </Button>
          </NavbarItem>
        </NavbarContent>
      ) : (
        isLoggedIn && (
          // Signed in
          <NavbarContent as="div" justify="end">
            {pathname === '/' && (
              <NavbarItem>
                <Button
                  as={Link}
                  href="/create-league"
                  color="primary"
                  variant="shadow"
                  className="font-semibold text-sm"
                >
                  <p>Create league</p>
                </Button>
              </NavbarItem>
            )}
            <NavbarItem>
              <ThemeSwitch />
            </NavbarItem>
            <Dropdown placement="bottom-end" shouldBlockScroll={false}>
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform cursor-pointer"
                  color="primary"
                  name="Jason Hughes"
                  size="sm"
                  src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                />
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Profile Actions"
                variant="flat"
                disabledKeys={['currentaccounttype']}
              >
                <DropdownSection showDivider>
                  <DropdownItem
                    key="profile"
                    className="h-14 gap-2"
                    textValue="Profile"
                  >
                    <p className="font-semibold">Signed in as</p>
                    <p className="font-semibold">{user?.email}</p>
                  </DropdownItem>
                  <DropdownItem
                    key="currentaccounttype"
                    textValue="Account type"
                  >
                    Account type: {user?.accountType}
                  </DropdownItem>
                  <DropdownItem
                    key="upgradetopro"
                    textValue="Upgrade to pro"
                    onPress={() => {
                      addToast({
                        title: 'Functionality not added yet',
                        description:
                          'This button is for testing/debugging purposes.',
                      });
                    }}
                  >
                    Upgrade to PRO
                  </DropdownItem>
                </DropdownSection>
                <DropdownSection showDivider>
                  <DropdownItem key="reportbug" textValue="Report a bug">
                    Report a bug
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
        )
      )}
      {isUserFetchLoading && (
        <NavbarContent justify="end">
          <NavbarItem className="flex flex-row gap-1 animate-pulse">
            <div className="bg-content1 w-14 h-8 rounded-md"></div>
            <div className="bg-content1 w-18 h-8 rounded-md"></div>
            <div className="bg-content1 w-18 h-8 rounded-md"></div>
          </NavbarItem>
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
      endContent={<MdDarkMode className="fill-black h-4 w-4 inline" />}
      size="md"
      startContent={<MdLightMode className="fill-black h-4 w-4 inline" />}
    ></Switch>
  );
}
