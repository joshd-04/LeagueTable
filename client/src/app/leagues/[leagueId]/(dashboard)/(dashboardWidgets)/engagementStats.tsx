import ProChip from '@/components/chips/ProChip';
import { Card, CardBody } from '@heroui/react';

export default function EngagementStats() {
  return (
    <Card className="h-full w-full px-[10px] py-[6px]">
      <CardBody className="w-full flex flex-col gap-2">
        <span className="flex flex-row gap-2 items-center">
          <ProChip />
          <p className="align-middle inline text-base">Engagement stats</p>
        </span>
        <div className="overflow-y-auto max-h-[12rem] min-h-[12rem] flex flex-col gap-[20px]"></div>
      </CardBody>
    </Card>
  );
}
