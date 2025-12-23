import { Card, CardBody } from '@heroui/react';

export default function FixtureRowSkeleton() {
  return (
    <Card>
      <CardBody className="@container">
        <div className="flex items-center gap-4 animate-pulse">
          {/* Home side */}
          <div className="flex-1 min-w-0 flex items-center justify-end gap-3">
            {/* Form skeleton */}
            <div className="@[800px]:block hidden flex-shrink-0">
              <div className="h-6 w-40 bg-default-200 rounded" />
            </div>

            {/* Points skeleton */}
            <div className="@[500px]:block hidden flex-shrink-0 w-[4ch]">
              <div className="h-4 w-full bg-default-200 rounded" />
            </div>

            {/* Name skeleton */}
            <div className="min-w-0 flex-shrink flex-grow max-w-50">
              <div className="h-6 bg-default-200 rounded w-full max-w-[160px] ml-auto" />
            </div>
          </div>

          {/* Center */}
          <div className="flex-shrink-0 flex-grow-0">
            <div className="h-4 w-6 bg-default-200 rounded" />
          </div>

          {/* Away side */}
          <div className="flex-1 min-w-0 flex items-center justify-start gap-3">
            {/* Name skeleton */}
            <div className="min-w-0 flex-shrink flex-grow max-w-50">
              <div className="h-6 bg-default-200 rounded w-full max-w-[160px]" />
            </div>

            {/* Points skeleton */}
            <div className="@[500px]:block hidden flex-shrink-0 w-[4ch]">
              <div className="h-4 w-full bg-default-200 rounded" />
            </div>

            {/* Form skeleton */}
            <div className="@[800px]:block hidden flex-shrink-0">
              <div className="h-6 w-40 bg-default-200 rounded" />
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
