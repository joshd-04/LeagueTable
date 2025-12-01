'use client';
import { Button } from '@heroui/react';

import FadeInImage from './fadeInImage';
import { FaArrowRight } from 'react-icons/fa';
import BrowserMockup from '@/components/heroMockup/BrowserMockup';
import LogoFull from '@/assets/svg components/LogoFull';
import LogoSmall from '@/assets/svg components/LogoSmall';
import { FaArrowDown } from 'react-icons/fa6';
import PricingComponent from '@/components/landingPage/pricing/PricingComponent';

export default function LandingPage() {
  return (
    <div className="bg-background relative flex h-full w-full flex-col items-center">
      <main className="container  flex flex-1 flex-col items-start justify-start mt-15 ">
        <section className="z-20 flex flex-col items-start justify-center gap-[18px] sm:gap-6  mx-8 md:mx-16 xl:mx-72">
          <Button
            className="border-default-100 bg-default-50 text-small text-default-500 h-9 overflow-hidden border-1 px-[18px] py-2 leading-5 font-normal"
            endContent={<FaArrowRight className="w-5" />}
            radius="full"
            variant="bordered"
          >
            New onboarding experience
          </Button>
          <div className=" text-[clamp(40px,10vw,44px)] leading-[1.2] font-bold tracking-tighter sm:text-[64px]">
            <div className="bg-hero-section-title bg-clip-text text-transparent">
              Create and share modern
              <br /> leagues effortlessly
            </div>
          </div>
          <p className="text-default-500  leading-7 font-normal sm:w-[466px] sm:text-[18px]">
            Modern design, easy controls, share with your audience, advanced
            stats tracking and more.
          </p>
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
            {/* <Button
              className="bg-default-foreground text-small text-background h-10 w-[163px] px-[16px] py-[10px] leading-5 font-medium"
              radius="full"
            >
              Get Started
            </Button> */}
            <Button
              className="text-sm h-10 w-[163px] px-[16px] py-[10px] leading-520 font-semibold"
              radius="full"
              color="primary"
              variant="shadow"
            >
              Join mailing list
            </Button>
            <Button
              className="border-default-100 text-small h-10 w-[163px] border-1 px-[16px] py-[10px] leading-5 font-medium"
              endContent={
                <span className=" pointer-events-none flex h-[22px] w-[22px] items-center justify-center rounded-full">
                  <FaArrowDown className=" w-4" />
                </span>
              }
              radius="full"
              variant="bordered"
              // color="secondary"
            >
              See features
            </Button>
          </div>
        </section>
        <div className="xl:ml-25 -mt-60 sm:-mt-50 lg:-mt-40 w-max z-15 relative pb-0 md:pb-16 lg:pb-48 xl:pb-64">
          <BrowserMockup src="/images/dashboard.png" />
        </div>
      </main>

      <div className="pointer-events-none absolute inset-0 top-[-70%] left-[-50%] z-10 scale-75 select-none sm:scale-75">
        <FadeInImage
          fill
          preload
          alt="Hero image"
          src="/images/bg-gradient.png"
        />
      </div>
    </div>
  );
}
