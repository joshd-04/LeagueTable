'use client';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Tab,
  Tabs,
} from '@heroui/react';
import { useState } from 'react';
import { FaCheck } from 'react-icons/fa6';
import { RxCross1 } from 'react-icons/rx';
import PricingTable from './PricingTable';

interface PricingTierInterface {
  tierName: string;
  tierCaption: string;
  tierPriceMonthly: number;
  features: { text: string; isNegative?: boolean }[];
  callToAction: {
    buttonText: string;
  };
  featured?: {
    color: string;
    title: string;
    textColor: string;
  };
}

export default function PricingComparison() {
  const yearlyDiscount = 30;

  const [view, setView] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div
      id="pricing"
      className="flex flex-col justify-center items-center gap-4 max-w-7xl py-4 text-center pt-20 "
    >
      <div className="flex flex-col items-center">
        <span className="text-primary text-base font-semibold">Pricing</span>
        <h2 className="text-4xl font-semibold">Elevate your experience.</h2>
      </div>
      <p className="text-muted text-lg">
        Discover the ideal plan for you and your leagues&apos; audience.
      </p>
      <Tabs
        radius="full"
        selectedKey={view}
        onSelectionChange={(key) => setView(key as 'monthly' | 'yearly')}
      >
        <Tab key="monthly" title="Pay Monthly">
          <PricingTable />
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
          <PricingTable />
        </Tab>
      </Tabs>
    </div>
  );
}

function PricingGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"></div>
  );
}

function PricingTile({
  view,
  yearlyDiscount,
  pricingTier,
}: {
  view: 'monthly' | 'yearly';
  yearlyDiscount: number;
  pricingTier: PricingTierInterface;
}) {
  const price =
    view === 'monthly'
      ? pricingTier.tierPriceMonthly
      : Math.round(
          pricingTier.tierPriceMonthly * (1 - yearlyDiscount / 100) * 12
        );
  return (
    <Card
      className={`p-3 overflow-visible text-start ${
        pricingTier.featured
          ? 'shadow-2xl shadow-primary/30'
          : ' border-medium! border-default-100 lg:mt-12'
      }`}
      style={{
        backgroundColor: pricingTier.featured?.color || 'transparent',
        color: pricingTier.featured?.textColor || undefined,
      }}
    >
      {pricingTier.featured && (
        <div className="max-w-fit min-w-min inline-flex items-center justify-between box-border whitespace-nowrap px-1 h-7 text-small rounded-full text-primary-foreground absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-foreground shadow-large border-medium border-primary">
          <span className="flex-1 px-2 font-medium text-primary">
            {pricingTier.featured?.title}
          </span>
        </div>
      )}
      <CardHeader className="flex flex-col gap-1 items-start p-3 pb-6">
        <p className="text-xl font-medium">{pricingTier.tierName}</p>
        <p className="text-base text-muted">{pricingTier.tierCaption}</p>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="flex flex-col gap-8">
          <p className="flex items-baseline gap-1 pt-2">
            <span className="from-foreground to-foreground-600 inline bg-linear-to-br bg-clip-text text-4xl leading-7 font-semibold tracking-tight text-primary-foreground">
              {price === 0 ? 'Free' : `$${price}`}
            </span>
            {price > 0 && (
              <span className="text-sm font-medium text-primary-foreground/50">
                /per {view === 'monthly' ? 'month' : 'year'}
              </span>
            )}
          </p>
          <ul className="flex flex-col gap-2">
            {pricingTier.features.map((feature, i) => (
              <li
                className="grid grid-cols-[24px_auto] grid-rows-1 items-center"
                key={i}
              >
                {feature.isNegative ? (
                  <RxCross1
                    className={`stroke-1 h-6 w-4 ${
                      pricingTier.featured ? 'text-white' : 'text-default-400'
                    }`}
                  />
                ) : (
                  <FaCheck
                    className={`h-6 w-4 ${
                      pricingTier.featured ? 'text-white' : 'text-primary'
                    }`}
                  />
                )}
                <p className="text-muted text-wrap">{feature.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </CardBody>
      <CardFooter>
        <Button
          className={`${
            pricingTier.featured
              ? 'bg-white font-semibold shadow-white/30 '
              : 'bg-default/40'
          }`}
          style={{ color: pricingTier.featured?.color || undefined }}
          fullWidth
          variant={pricingTier.featured ? 'shadow' : 'solid'}
        >
          {pricingTier.callToAction.buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}
