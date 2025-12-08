import { Card, CardBody, CardHeader, Chip, Tab, Tabs } from '@heroui/react';

export default function DashboardSkeleton() {
  return (
    <Tabs radius="md" color="primary" variant="light">
      <Tab
        key="favorites"
        title={
          <div className="flex items-center space-x-2">
            <span>Favorites</span>
            <Chip
              variant="solid"
              radius="full"
              size="sm"
              className={'bg-white text-primary'}
            >
              -
            </Chip>
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </Tab>
      <Tab
        key="yours"
        title={
          <div className="flex items-center space-x-2">
            <span>Yours</span>
            <Chip variant="solid" radius="full" size="sm">
              -
            </Chip>
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </Tab>
      <Tab
        key="following"
        title={
          <div className="flex items-center space-x-2">
            <span>Following</span>
            <Chip variant="solid" radius="full" size="sm">
              -
            </Chip>
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </Tab>
    </Tabs>
  );
}

function SkeletonCard() {
  return (
    <Card
      className={`px-[12px] py-[8px] hover:cursor-pointer bg-content1 animate-pulse`}
    >
      <CardHeader className="flex flex-col gap-2">
        <div className="flex flex-row justify-between items-start w-full">
          <div className="flex flex-col justify-baseline items-start">
            <div className="w-40 h-6 bg-content2 rounded-md mb-1"></div>
            <div className="flex flex-row gap-2">
              <Chip size="sm" variant="flat">
                <span className="flex flex-row items-center gap-1">
                  <div className="w-12   h-2 bg-content2 rounded-md"></div>
                </span>
              </Chip>
              <Chip size="sm" variant="flat" color={'default'}>
                <div className="w-10 h-2 bg-content2 rounded-md"></div>
              </Chip>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardBody className="flex flex-row justify-between items-end w-full transition-all duration-150">
        <div className="flex flex-col w-full justify-start items-start text-sm gap-1">
          <div className="w-40 h-4 bg-content2 rounded-md"></div>
          <div className="w-16 h-4 bg-content2 rounded-md"></div>
          <div className="w-14 h-4 bg-content2 rounded-md"></div>
        </div>
        <div className="flex flex-row gap-1">
          <div className="w-8 h-8 bg-content2 rounded-lg"></div>
          <div className="w-8 h-8 bg-content2 rounded-lg"></div>
        </div>
      </CardBody>
    </Card>
  );
}
