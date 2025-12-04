'use client';
import { Chip, Tab, Tabs } from '@heroui/react';
import { useState } from 'react';
import PricingTable from './PricingTable';

export default function PricingComparison() {
  const yearlyDiscount = 30;

  const [view, setView] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div
      id="pricing"
      className="flex flex-col justify-center items-center gap-4 max-w-7xl py-4 text-center pt-10 "
    >
      {/* <div className="flex flex-col items-center">
        <span className="text-primary text-base font-semibold">Pricing</span>
        <h2 className="text-4xl font-semibold">Elevate your experience.</h2>
      </div>
      <p className="text-muted text-lg">
        Discover the ideal plan for you and your leagues&apos; audience.
      </p> */}
      <Tabs
        radius="full"
        selectedKey={view}
        onSelectionChange={(key) => setView(key as 'monthly' | 'yearly')}
      >
        <Tab key="monthly" title="Pay Monthly">
          <div className="px-6">
            <PricingTable timeframe={view} />
          </div>
        </Tab>
        <Tab
          key="yearly"
          title={
            <div className="flex flex-row gap-2 items-center">
              <p>Pay Yearly</p>
              <Chip size="md" color="primary">
                Save {yearlyDiscount}%
              </Chip>
            </div>
          }
        >
          {/* <PricingGrid /> */}
          <div className="px-6">
            <PricingTable timeframe={view} />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
