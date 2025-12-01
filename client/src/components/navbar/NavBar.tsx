'use client';
import {
  Button,
  cn,
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

export default function NavBar() {
  return (
    <Navbar className="bg-transparent sticky w-full h-15">
      <NavbarBrand className="h-full py-[22px]">
        <Link
          href="/"
          className="text-inherit h-full flex flex-row gap-1 items-end"
        >
          <LogoFull className="fill-foreground h-full" />
          <p className="xl:text-red-500 lg:text-blue-500 md:text-green-500 sm:text-pink-500  before:content-['--'] sm:before:content-['sm'] md:before:content-['md'] lg:before:content-['lg'] xl:before:content-['xl']"></p>
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#" className="font-semibold text-base">
            Features
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link
            aria-current="page"
            href="#"
            className="font-semibold text-base"
          >
            Use cases
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#" className="font-semibold text-base">
            FAQ
          </Link>
        </NavbarItem>
      </NavbarContent>
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
        // <DarkModeSVG
        //   className="w-[16px] h-[16px] fill- inline"
        //   style={{ width: '16px', fill: 'lightgrey' }}
        // />
        <MdDarkMode className="fill-black h-4 w-4 inline" />
      }
      size="md"
      startContent={
        // <LightModeSVG
        //   className="w-[16px] h-[16px] fill-black inline"
        //   style={{ width: '16px' }}
        // />
        <MdLightMode className="fill-black h-4 w-4 inline" />
      }
    ></Switch>
  );
}
