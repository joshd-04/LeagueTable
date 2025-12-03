import React from 'react';
import {
  Button,
  Chip,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
} from '@heroui/react';

interface FeatureRowProps {
  title: string;
  free: React.ReactNode;
  pro: React.ReactNode;
  team: React.ReactNode;
}

const CheckIcon = ({ forceWhite }: { forceWhite?: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`${forceWhite ? 'text-white' : 'text-primary'} mx-auto`}
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="m6 12l4.243 4.243l8.484-8.486"
    />
  </svg>
);

const CrossIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="mx-auto"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="m16 16l-4-4m0 0L8 8m4 4l4-4m-4 4l-4 4"
    />
  </svg>
);

const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="text-default-600"
    width="20"
    height="20"
    viewBox="0 0 24 24"
  >
    <g fill="none">
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity=".5"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
        d="M12 17v-6"
      />
      <circle
        cx="1"
        cy="1"
        r="1"
        fill="currentColor"
        transform="matrix(1 0 0 -1 11 9)"
      />
    </g>
  </svg>
);

const FeatureRow: React.FC<FeatureRowProps> = ({ title, free, pro, team }) => (
  <tr>
    <th className="text-medium text-default-700 py-4 font-normal" scope="row">
      <div className="flex items-center gap-1">
        <span>{title}</span>
        <InfoIcon />
      </div>
    </th>
    <td className="relative px-6 py-4 xl:px-8">{free}</td>
    <td className="relative px-6 py-4 xl:px-8 before:absolute before:h-full before:inset-0 before:-z-10 before:bg-primary">
      {pro}
    </td>
    <td className="relative px-6 py-4 xl:px-8 before:absolute before:h-full before:inset-0 before:-z-10 before:bg-content2 dark:before:bg-content1">
      {team}
    </td>
  </tr>
);

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <tr>
    <th
      className="text-large text-foreground pb-4 font-semibold pt-16"
      colSpan={1}
      scope="colgroup"
    >
      {title}
      <hr
        className="shrink-0 border-none w-full h-divider bg-default-600/10 absolute -inset-x-4 mt-2"
        role="separator"
      />
    </th>
    <td className="relative py-4" />
    <td className="relative py-4 before:absolute before:h-full before:inset-0 before:-z-10 before:bg-primary" />
    <td className="relative py-4 before:absolute before:h-full before:inset-0 before:-z-10 before:bg-content2 dark:before:bg-content1" />
  </tr>
);

interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  priceUnit?: string;
  features: string[];
  buttonText: string;
  buttonVariant?: 'flat' | 'solid';
  buttonColor?: 'default' | 'primary';
  isPopular?: boolean;
  cardClassName?: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  description,
  price,
  priceUnit,
  features,
  buttonText,
  buttonVariant = 'flat',
  buttonColor = 'default',
  isPopular = false,
  cardClassName = '',
}) => (
  <Card
    className={`relative p-3 ${cardClassName}`}
    shadow={isPopular ? 'lg' : 'none'}
  >
    {isPopular && (
      <Chip
        color="primary"
        variant="flat"
        className="absolute top-4 right-4 bg-primary/20 text-primary-600"
        classNames={{
          content: 'font-medium text-primary-500 dark:text-primary-600',
        }}
      >
        Most Popular
      </Chip>
    )}
    <CardHeader className="flex flex-col items-start gap-2 pb-6">
      <h2 className="text-large font-medium">{title}</h2>
      <p className="text-medium text-default-500">{description}</p>
    </CardHeader>
    <Divider />
    <CardBody className="gap-8">
      <p className="flex items-baseline gap-1 pt-2">
        <span className="from-foreground to-foreground-600 inline bg-linear-to-br bg-clip-text text-4xl leading-7 font-semibold tracking-tight text-transparent">
          {price}
        </span>
        {priceUnit && (
          <span className="text-small text-default-400 font-medium">
            {priceUnit}
          </span>
        )}
      </p>
      <ul className="flex flex-col gap-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <CheckIcon />
            <p className="text-default-500">{feature}</p>
          </li>
        ))}
      </ul>
    </CardBody>
    <CardFooter>
      <Button
        className="w-full"
        variant={buttonVariant}
        color={buttonColor}
        href="#"
      >
        {buttonText}
      </Button>
    </CardFooter>
  </Card>
);

const PricingTable: React.FC = () => {
  return (
    <>
      {/* Mobile Layout */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
        <PricingCard
          title="Free"
          description="For starters and hobbyists that want to try out."
          price="Free"
          features={[
            '10 users included',
            '2 GB of storage',
            'Help center access',
            'Email support',
          ]}
          buttonText="Continue with Free"
          buttonVariant="flat"
          buttonColor="default"
          cardClassName="border-medium! border-default-100 bg-transparent"
        />
        <PricingCard
          title="Pro"
          description="For small teams that have less that 10 members."
          price="$72"
          priceUnit="/per year"
          features={[
            '20 users included',
            '10 GB of storage',
            'Help center access',
            'Priority email support',
          ]}
          buttonText="Get started"
          buttonVariant="solid"
          buttonColor="primary"
          isPopular
          cardClassName="border-primary shadow-primary/20 border-2 shadow-2xl bg-content1"
        />
        <PricingCard
          title="Team"
          description="For large teams that have more than 10 members."
          price="$90"
          priceUnit="/per year"
          features={[
            '50 users included',
            '30 GB of storage',
            'Help center access',
            'Phone & email support',
          ]}
          buttonText="Contact us"
          buttonVariant="flat"
          buttonColor="default"
          cardClassName="border-medium! border-content3 bg-content2 dark:border-content2 dark:bg-content1"
        />
      </div>

      {/* Desktop Table Layout */}
      <div className="isolate hidden lg:block">
        <div className="relative">
          <table className="w-full table-fixed border-separate border-spacing-x-4 text-left">
            <caption className="sr-only">Pricing plan comparison</caption>
            <colgroup>
              <col className="w-1/4" />
              <col className="w-1/4" />
              <col className="w-1/4" />
              <col className="w-1/4" />
            </colgroup>
            <thead>
              <tr>
                <td />
                <th className="relative px-6 pt-6 xl:px-8 xl:pt-8" scope="col">
                  <div className="text-large text-foreground relative font-medium">
                    Free
                  </div>
                </th>
                <th
                  className="relative px-6 pt-6 xl:px-8 xl:pt-8 before:absolute before:h-full before:inset-0 before:-z-10 before:bg-primary before:rounded-t-medium"
                  scope="col"
                >
                  <Chip
                    color="primary"
                    variant="shadow"
                    classNames={{
                      base: 'absolute top-2 right-2 bg-primary-foreground shadow-large border-medium border-primary',
                      content: 'text-primary font-medium',
                    }}
                  >
                    Most Popular
                  </Chip>
                  <div className="text-large relative font-medium text-primary-foreground">
                    Pro
                  </div>
                </th>
                <th
                  className="relative px-6 pt-6 xl:px-8 xl:pt-8 before:absolute before:h-full before:inset-0 before:-z-10 before:bg-content2 dark:before:bg-content1 before:rounded-t-medium"
                  scope="col"
                >
                  <div className="text-large text-foreground relative font-medium">
                    Team
                  </div>
                </th>
              </tr>
              <tr>
                <th scope="row">
                  <span className="sr-only">Price</span>
                </th>
                <td className="relative px-6 pt-4 xl:px-8">
                  <div className="text-foreground flex items-baseline gap-1">
                    <span className="from-foreground to-foreground-600 inline bg-linear-to-br bg-clip-text text-4xl leading-8 font-semibold tracking-tight text-transparent">
                      Free
                    </span>
                    <span className="text-small! text-default-600 font-medium">
                      /per year
                    </span>
                  </div>
                  <Button
                    className="w-full mt-6"
                    variant="flat"
                    color="default"
                    href="#"
                  >
                    Continue with Free
                  </Button>
                </td>
                <td className="relative px-6 pt-4 xl:px-8 before:absolute before:h-full before:inset-0 before:-z-10 before:bg-primary">
                  <div className="text-foreground flex items-baseline gap-1">
                    <span className="from-foreground to-foreground-600 inline bg-linear-to-br bg-clip-text text-4xl leading-8 font-semibold tracking-tight text-primary-foreground">
                      $72
                    </span>
                    <span className="text-small! font-medium text-primary-foreground/50">
                      /per year
                    </span>
                  </div>
                  <Button
                    className="w-full mt-6 bg-primary-foreground text-primary shadow-default-500/50 font-medium shadow-xs"
                    href="#"
                  >
                    Get started
                  </Button>
                </td>
                <td className="relative px-6 pt-4 xl:px-8 before:absolute before:h-full before:inset-0 before:-z-10 before:bg-content2 dark:before:bg-content1">
                  <div className="text-foreground flex items-baseline gap-1">
                    <span className="from-foreground to-foreground-600 inline bg-linear-to-br bg-clip-text text-4xl leading-8 font-semibold tracking-tight text-transparent">
                      $90
                    </span>
                    <span className="text-small! text-default-600 font-medium">
                      /per user/per year
                    </span>
                  </div>
                  <Button
                    className="w-full mt-6"
                    variant="flat"
                    color="default"
                    href="#"
                  >
                    Contact us
                  </Button>
                </td>
              </tr>
            </thead>
            <tbody>
              {/* Content Section */}
              <SectionHeader title="Content" />

              <FeatureRow
                title="New apps & screens releases"
                free={
                  <div className="text-medium text-default-500 text-center">
                    Latest 4 apps
                  </div>
                }
                pro={
                  <>
                    <div className="text-primary-foreground">
                      <CheckIcon forceWhite />
                    </div>
                    <span className="sr-only">Included in Pro</span>
                  </>
                }
                team={
                  <>
                    <div className="text-primary">
                      <CheckIcon />
                    </div>
                    <span className="sr-only">Included in Team</span>
                  </>
                }
              />

              <FeatureRow
                title="Access to latest versions"
                free={
                  <>
                    <div className="text-default-400">
                      <CrossIcon />
                    </div>
                    <span className="sr-only">Not included in Free</span>
                  </>
                }
                pro={
                  <>
                    <div className="text-primary-foreground">
                      <CheckIcon forceWhite />
                    </div>
                    <span className="sr-only">Included in Pro</span>
                  </>
                }
                team={
                  <>
                    <div className="text-primary">
                      <CheckIcon />
                    </div>
                    <span className="sr-only">Included in Team</span>
                  </>
                }
              />

              <FeatureRow
                title="Access to previous versions"
                free={
                  <div className="text-medium text-default-500 text-center">
                    Limited to 3 rows
                  </div>
                }
                pro={
                  <div className="text-medium text-center text-primary-foreground/70">
                    Unlimited
                  </div>
                }
                team={
                  <div className="text-medium text-default-500 text-center">
                    Unlimited
                  </div>
                }
              />

              <FeatureRow
                title="Access to flows of apps"
                free={
                  <div className="text-medium text-default-500 text-center">
                    Limited to 3 rows
                  </div>
                }
                pro={
                  <div className="text-medium text-center text-primary-foreground/70">
                    Unlimited
                  </div>
                }
                team={
                  <div className="text-medium text-default-500 text-center">
                    Unlimited
                  </div>
                }
              />

              <FeatureRow
                title="Filter & search results"
                free={
                  <div className="text-medium text-default-500 text-center">
                    Limited to 3 rows
                  </div>
                }
                pro={
                  <div className="text-medium text-center text-primary-foreground/70">
                    Unlimited
                  </div>
                }
                team={
                  <div className="text-medium text-default-500 text-center">
                    Unlimited
                  </div>
                }
              />

              {/* Features Section */}
              <tr>
                <th
                  className="text-large text-foreground pt-12 pb-4 font-semibold"
                  colSpan={1}
                  scope="colgroup"
                >
                  Features
                  <hr
                    className="shrink-0 border-none w-full h-divider bg-default-600/10 absolute -inset-x-4 mt-2"
                    role="separator"
                  />
                </th>
                <td className="relative py-4" />
                <td className="relative py-4 before:absolute before:h-full before:inset-0 before:-z-10 before:bg-primary" />
                <td className="relative py-4 before:absolute before:h-full before:inset-0 before:-z-10 before:bg-content2 dark:before:bg-content1" />
              </tr>

              <FeatureRow
                title="Collections"
                free={
                  <div className="text-medium text-default-500 text-center">
                    Up to 3 collections
                  </div>
                }
                pro={
                  <div className="text-medium text-center text-primary-foreground/70">
                    Unlimited
                  </div>
                }
                team={
                  <div className="text-medium text-default-500 text-center">
                    Unlimited
                  </div>
                }
              />

              <FeatureRow
                title="Copy to clipboard"
                free={
                  <>
                    <div className="text-primary">
                      <CheckIcon />
                    </div>
                    <span className="sr-only">Included in Free</span>
                  </>
                }
                pro={
                  <>
                    <div className="text-primary-foreground">
                      <CheckIcon forceWhite />
                    </div>
                    <span className="sr-only">Included in Pro</span>
                  </>
                }
                team={
                  <>
                    <div className="text-primary">
                      <CheckIcon />
                    </div>
                    <span className="sr-only">Included in Team</span>
                  </>
                }
              />

              <FeatureRow
                title="Screen download"
                free={
                  <>
                    <div className="text-primary">
                      <CheckIcon />
                    </div>
                    <span className="sr-only">Included in Free</span>
                  </>
                }
                pro={
                  <>
                    <div className="text-primary-foreground">
                      <CheckIcon forceWhite />
                    </div>
                    <span className="sr-only">Included in Pro</span>
                  </>
                }
                team={
                  <>
                    <div className="text-primary">
                      <CheckIcon />
                    </div>
                    <span className="sr-only">Included in Team</span>
                  </>
                }
              />

              <FeatureRow
                title="Batch download"
                free={
                  <>
                    <div className="text-default-400">
                      <CrossIcon />
                    </div>
                    <span className="sr-only">Not included in Free</span>
                  </>
                }
                pro={
                  <>
                    <div className="text-primary-foreground">
                      <CheckIcon forceWhite />
                    </div>
                    <span className="sr-only">Included in Pro</span>
                  </>
                }
                team={
                  <>
                    <div className="text-primary">
                      <CheckIcon />
                    </div>
                    <span className="sr-only">Included in Team</span>
                  </>
                }
              />

              {/* Collaboration Section */}
              <tr>
                <th
                  className="text-large text-foreground pt-12 pb-4 font-semibold"
                  colSpan={1}
                  scope="colgroup"
                >
                  Collaboration
                  <hr
                    className="shrink-0 border-none w-full h-divider bg-default-600/10 absolute -inset-x-4 mt-2"
                    role="separator"
                  />
                </th>
                <td className="relative py-4" />
                <td className="relative py-4 before:absolute before:h-full before:inset-0 before:-z-10 before:bg-primary" />
                <td className="relative py-4 before:absolute before:h-full before:inset-0 before:-z-10 before:bg-content2 dark:before:bg-content1" />
              </tr>

              <FeatureRow
                title="Team members"
                free={
                  <div className="text-medium text-default-500 text-center">
                    Just you
                  </div>
                }
                pro={
                  <div className="text-medium text-center text-primary-foreground/70">
                    Just you
                  </div>
                }
                team={
                  <div className="text-medium text-default-500 text-center">
                    Unlimited
                  </div>
                }
              />

              <FeatureRow
                title="Team collections"
                free={
                  <>
                    <div className="text-default-400">
                      <CrossIcon />
                    </div>
                    <span className="sr-only">Not included in Free</span>
                  </>
                }
                pro={
                  <>
                    <div className="text-primary-foreground/50">
                      <CrossIcon />
                    </div>
                    <span className="sr-only">Not included in Pro</span>
                  </>
                }
                team={
                  <>
                    <div className="text-primary">
                      <CheckIcon />
                    </div>
                    <span className="sr-only">Included in Team</span>
                  </>
                }
              />

              <FeatureRow
                title="Team administration"
                free={
                  <>
                    <div className="text-default-400">
                      <CrossIcon />
                    </div>
                    <span className="sr-only">Not included in Free</span>
                  </>
                }
                pro={
                  <>
                    <div className="text-primary-foreground/50">
                      <CrossIcon />
                    </div>
                    <span className="sr-only">Not included in Pro</span>
                  </>
                }
                team={
                  <>
                    <div className="text-primary">
                      <CheckIcon />
                    </div>
                    <span className="sr-only">Included in Team</span>
                  </>
                }
              />

              <FeatureRow
                title="Flexible seat-based licensing"
                free={
                  <>
                    <div className="text-default-400">
                      <CrossIcon />
                    </div>
                    <span className="sr-only">Not included in Free</span>
                  </>
                }
                pro={
                  <>
                    <div className="text-primary-foreground/50">
                      <CrossIcon />
                    </div>
                    <span className="sr-only">Not included in Pro</span>
                  </>
                }
                team={
                  <>
                    <div className="text-primary">
                      <CheckIcon />
                    </div>
                    <span className="sr-only">Included in Team</span>
                  </>
                }
              />

              {/* Security & Access Section */}
              <tr>
                <th
                  className="text-large text-foreground pt-12 pb-4 font-semibold"
                  colSpan={1}
                  scope="colgroup"
                >
                  Security & Access
                  <hr
                    className="shrink-0 border-none w-full h-divider bg-default-600/10 absolute -inset-x-4 mt-2"
                    role="separator"
                  />
                </th>
                <td className="relative py-4" />
                <td className="relative py-4 before:absolute before:h-full before:inset-0 before:-z-10 before:bg-primary" />
                <td className="relative py-4 before:absolute before:h-full before:inset-0 before:-z-10 before:bg-content2 dark:before:bg-content1" />
              </tr>

              <FeatureRow
                title="SAML Single Sign-On (SSO)"
                free={
                  <>
                    <div className="text-default-400">
                      <CrossIcon />
                    </div>
                    <span className="sr-only">Not included in Free</span>
                  </>
                }
                pro={
                  <>
                    <div className="text-primary-foreground/50">
                      <CrossIcon />
                    </div>
                    <span className="sr-only">Not included in Pro</span>
                  </>
                }
                team={
                  <>
                    <div className="text-primary">
                      <CheckIcon />
                    </div>
                    <span className="sr-only">Included in Team</span>
                  </>
                }
              />

              <FeatureRow
                title="SCIM user provisioning"
                free={
                  <>
                    <div className="text-default-400">
                      <CrossIcon />
                    </div>
                    <span className="sr-only">Not included in Free</span>
                  </>
                }
                pro={
                  <>
                    <div className="text-primary-foreground/50">
                      <CrossIcon />
                    </div>
                    <span className="sr-only">Not included in Pro</span>
                  </>
                }
                team={
                  <>
                    <div className="text-primary">
                      <CheckIcon />
                    </div>
                    <span className="sr-only">Included in Team</span>
                  </>
                }
              />

              {/* Billing Section */}
              <tr>
                <th
                  className="text-large text-foreground pt-12 pb-4 font-semibold"
                  colSpan={1}
                  scope="colgroup"
                >
                  Billing
                  <hr
                    className="shrink-0 border-none w-full h-divider bg-default-600/10 absolute -inset-x-4 mt-2"
                    role="separator"
                  />
                </th>
                <td className="relative py-4" />
                <td className="relative py-4 before:absolute before:h-full before:inset-0 before:-z-10 before:bg-primary" />
                <td className="relative py-4 before:absolute before:h-full before:inset-0 before:-z-10 before:bg-content2 dark:before:bg-content1" />
              </tr>

              <FeatureRow
                title="Flexible payment options"
                free={
                  <>
                    <div className="text-default-400">
                      <CrossIcon />
                    </div>
                    <span className="sr-only">Not included in Free</span>
                  </>
                }
                pro={
                  <>
                    <div className="text-primary-foreground/50">
                      <CrossIcon />
                    </div>
                    <span className="sr-only">Not included in Pro</span>
                  </>
                }
                team={
                  <>
                    <div className="text-primary">
                      <CheckIcon />
                    </div>
                    <span className="sr-only">Included in Team</span>
                  </>
                }
              />

              <FeatureRow
                title="Custom security assessment"
                free={
                  <>
                    <div className="text-default-400">
                      <CrossIcon />
                    </div>
                    <span className="sr-only">Not included in Free</span>
                  </>
                }
                pro={
                  <>
                    <div className="text-primary-foreground/50">
                      <CrossIcon />
                    </div>
                    <span className="sr-only">Not included in Pro</span>
                  </>
                }
                team={
                  <>
                    <div className="text-primary">
                      <CheckIcon />
                    </div>
                    <span className="sr-only">Included in Team</span>
                  </>
                }
              />

              <FeatureRow
                title="Custom agreement"
                free={
                  <>
                    <div className="text-default-400">
                      <CrossIcon />
                    </div>
                    <span className="sr-only">Not included in Free</span>
                  </>
                }
                pro={
                  <>
                    <div className="text-primary-foreground/50">
                      <CrossIcon />
                    </div>
                    <span className="sr-only">Not included in Pro</span>
                  </>
                }
                team={
                  <>
                    <div className="text-primary">
                      <CheckIcon />
                    </div>
                    <span className="sr-only">Included in Team</span>
                  </>
                }
              />

              {/* Support Section */}
              <tr>
                <th
                  className="text-large text-foreground pt-12 pb-4 font-semibold"
                  colSpan={1}
                  scope="colgroup"
                >
                  Support
                  <hr
                    className="shrink-0 border-none w-full h-divider bg-default-600/10 absolute -inset-x-4 mt-2"
                    role="separator"
                  />
                </th>
                <td className="relative py-4" />
                <td className="relative py-4 before:absolute before:h-full before:inset-0 before:-z-10 before:bg-primary" />
                <td className="relative py-4 before:absolute before:h-full before:inset-0 before:-z-10 before:bg-content2 dark:before:bg-content1" />
              </tr>

              <FeatureRow
                title="Help center"
                free={
                  <>
                    <div className="text-primary">
                      <CheckIcon />
                    </div>
                    <span className="sr-only">Included in Free</span>
                  </>
                }
                pro={
                  <>
                    <div className="text-primary-foreground">
                      <CheckIcon forceWhite />
                    </div>
                    <span className="sr-only">Included in Pro</span>
                  </>
                }
                team={
                  <>
                    <div className="text-primary">
                      <CheckIcon />
                    </div>
                    <span className="sr-only">Included in Team</span>
                  </>
                }
              />

              <tr>
                <th
                  className="text-medium text-default-700 py-4 font-normal"
                  scope="row"
                >
                  <div className="flex items-center gap-1">
                    <span>Email support</span>
                    <InfoIcon />
                  </div>
                </th>
                <td className="relative px-6 py-4 xl:px-8">
                  <div className="text-medium text-default-500 text-center">
                    Best effort basis
                  </div>
                </td>
                <td className="relative px-6 py-4 xl:px-8 before:absolute before:h-full before:inset-0 before:-z-10 before:bg-primary before:rounded-b-medium">
                  <div className="text-primary-foreground">
                    <CheckIcon forceWhite />
                  </div>
                  <span className="sr-only">Included in Pro</span>
                </td>
                <td className="relative px-6 py-4 xl:px-8 before:absolute before:h-full before:inset-0 before:-z-10 before:bg-content2 dark:before:bg-content1 before:rounded-b-medium">
                  <div className="text-primary">
                    <CheckIcon />
                  </div>
                  <span className="sr-only">Included in Team</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PricingTable;
