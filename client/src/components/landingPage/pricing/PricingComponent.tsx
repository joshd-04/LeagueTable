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
    text: string;
  };
}

export default function PricingComponent() {
  const yearlyDiscount = 30;
  const pricingData: PricingTierInterface[] = [
    {
      tierName: 'Free',
      tierCaption: 'For starters and hobbyists that want to try out.',
      tierPriceMonthly: 0,
      features: [
        { text: 'Unlimited leagues' },
        { text: 'Public shareable leagues' },
        { text: 'Promotion and relegation' },
        { text: 'Upto 2 seasons per league', isNegative: true },
      ],
      callToAction: { buttonText: 'Continue with Free' },
    },
    {
      tierName: 'Pro',
      tierCaption: 'For users who want longer leagues and more control.',
      tierPriceMonthly: 3,
      features: [
        { text: 'Unlimited seasons' },
        { text: 'Goal scorers, assists & more stats' },
        { text: 'League announcements' },
        { text: 'Season rewind' },
      ],
      callToAction: { buttonText: 'Get started' },
      featured: {
        color: 'hsl(var(--heroui-primary) / 1)',
        text: 'Most Popular',
      },
    },
    {
      tierName: 'Pro+',
      tierCaption: 'For those who want a premium experience',
      tierPriceMonthly: 5,
      features: [
        { text: 'Team pages' },
        { text: 'Graphs & data visuals' },
        { text: 'Fixture categories & notifications' },
        { text: 'Data PNG download' },
      ],
      callToAction: { buttonText: 'Coming soon' },
    },
  ];

  const [view, setView] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="flex flex-col justify-center items-center gap-4 max-w-4xl p-4 text-center">
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
          <PricingGrid
            yearlyDiscount={yearlyDiscount}
            view={view}
            pricingData={pricingData}
          />
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
          <PricingGrid
            yearlyDiscount={yearlyDiscount}
            view={view}
            pricingData={pricingData}
          />
        </Tab>
      </Tabs>
    </div>
  );
}

function PricingGrid({
  view,
  yearlyDiscount,
  pricingData,
}: {
  view: 'monthly' | 'yearly';
  yearlyDiscount: number;
  pricingData: PricingTierInterface[];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {pricingData.map((p, i) => (
        <PricingTile
          yearlyDiscount={yearlyDiscount}
          view={view}
          pricingTier={p}
          key={i}
        />
      ))}
    </div>
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
      style={{ backgroundColor: pricingTier.featured?.color || 'transparent' }}
    >
      {pricingTier.featured && (
        <div className="max-w-fit min-w-min inline-flex items-center justify-between box-border whitespace-nowrap px-1 h-7 text-small rounded-full text-primary-foreground absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-foreground shadow-large border-medium border-primary">
          <span className="flex-1 px-2 font-medium text-primary">
            {pricingTier.featured?.text}
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
                      pricingTier.featured ? 'text-white' : 'text-default'
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
