'use client';
import LogoSmall from '@/assets/svg components/LogoSmall';
import { Card, CardBody, CardHeader, Divider } from '@heroui/react';
import { BiMath } from 'react-icons/bi';
import { FaBackwardFast, FaLink } from 'react-icons/fa6';

export default function SmallBenefits() {
  return (
    <Card className="mx-16 pt-6 pb-8 border-1 border-divider bg-default-50/60">
      <CardHeader className="flex flex-row justify-center items-center mb-2">
        <div className="flex flex-row justify-center relative h-6 items-center space-x-4  ">
          <LogoSmall className="fill-default-500 h-5 " />
          <Divider className="w-[2px]" orientation="vertical" />
          <p className="text-lg text-default-600 font-medium">
            Save valuable time
          </p>
        </div>
      </CardHeader>
      <CardBody className="flex flex-col items-center justify-center gap-4  lg:max-w-[min(6xl,100vw)] rounded-2xl  ">
        <div className="grid grid-rows-3 grid-cols-1 lg:grid-cols-3 lg:grid-rows-1 gap-2 sm:gap-8 max-w-[min(var(--container-5xl),80vw)] lg:text-center px-0 sm:px-2 lg:px-4 ">
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 sm:gap-4 items-center px-4">
            <div className="bg-primary p-3 rounded-full">
              <FaLink className="fill-white  h-6 w-6 lg:h-10 lg:w-10" />
            </div>
            <div className="text-center sm:text-start flex flex-col items-center sm:items-start lg:items-center lg:text-center w-full">
              <p className="text-lg sm:text-xl lg:text-xl font-semibold ">
                Viewers explore your league directly
              </p>
              <p className="text-sm sm:text-base text-muted">
                using a link to see your league. No need to send screenshots or
                manual updates to your audience.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 sm:gap-4 items-center px-4">
            <div className="bg-primary p-3 rounded-full">
              <BiMath className="fill-white h-6 w-6 lg:h-10 lg:w-10" />
            </div>
            <div className="text-center sm:text-start flex flex-col items-center sm:items-start lg:items-center lg:text-center w-full">
              <p className="text-lg sm:text-xl lg:text-xl font-semibold">
                Skip the calculations, we&apos;ll do it for you
              </p>
              <p className="text-sm sm:text-base text-muted">
                automatically every time you upload a result or want to view a
                stat.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 sm:gap-4 items-center px-4">
            <div className="bg-primary p-4 rounded-full">
              <FaBackwardFast className="fill-white h-4 w-4 lg:h-8 lg:w-8" />
            </div>
            <div className="text-center sm:text-start flex flex-col items-center sm:items-start lg:items-center lg:text-center w-full">
              <p className="text-lg sm:text-xl lg:text-xl font-semibold">
                Stop the endless scrolling to find forgotten details
              </p>
              <p className="text-sm sm:text-base text-muted">
                by rewinding into the past and explore data from previous
                seasons.
              </p>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
