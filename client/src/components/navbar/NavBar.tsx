'use client';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
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

export default function NavBar() {
  type dropdownButtons = 'features' | 'use cases';
  const [buttonHovering, setButtonHovering] = useState<dropdownButtons | null>(
    null
  );

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
      <NavbarContent className="hidden sm:flex gap-10 " justify="center">
        <Dropdown isOpen={buttonHovering === 'features'} showArrow>
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
        <Dropdown isOpen={buttonHovering === 'use cases'} showArrow>
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
