import LeagueBanner from '@/components/leagueBanner/LeagueBanner';
import Heading1 from '@/components/text/Heading1';
import { Card, Spinner } from '@heroui/react';

export default function LeagueDashboardSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <LeagueBanner leagueLevel="free" displayNothing>
        <Heading1
          style={{
            position: 'absolute',
            bottom: '0',
            left: '50%',
            translate: '-50%',
          }}
          className="text-default-500"
        >
          Loading
        </Heading1>
      </LeagueBanner>
      <div className="flex flex-col gap-5 mx-[20px] animate-pulse">
        <div className="flex flex-row justify-center items-center gap-5">
          <div className="w-16 h-6 bg-content2 rounded-md"></div>
          <div className="w-14 h-6 bg-content2 rounded-md"></div>
          <div className="w-14 h-6 bg-content2 rounded-md"></div>
          <div className="w-30 h-6 bg-content2 rounded-md"></div>
        </div>

        <div className="w-full grid grid-cols-4 grid-rows-[repeat(3,min-content)] gap-5">
          <div className="h-[200px] w-full bg-content1 rounded-xl"></div>
          <div className="h-[200px] w-full bg-content1 rounded-xl"></div>
          <div className="h-[200px] w-full bg-content1 rounded-xl"></div>
          <div className="h-[200px] w-full bg-content1 rounded-xl"></div>
          <div className="h-[440px] w-full bg-content1 rounded-xl row-span-2"></div>
          <div className="h-[440px] w-full bg-content1 rounded-xl col-span-2 row-span-2"></div>
          <div className="h-[440px] w-full bg-content1 rounded-xl row-span-2"></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
}
