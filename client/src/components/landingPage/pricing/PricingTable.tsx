import React from 'react';
import {
  Button,
  Chip,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Tooltip,
} from '@heroui/react';
import { calculatePrice } from '@/util/helpers';
import { FaCheck } from 'react-icons/fa6';
import { RxCross1 } from 'react-icons/rx';

// Types
type CellContentType = 'check' | 'cross' | 'text';

interface CellContent {
  type: CellContentType;
  text?: string;
  className?: string;
}

interface Feature {
  title: string;
  description?: string;
  isImplemented?: boolean;
  free: CellContent;
  pro: CellContent;
  proplus: CellContent;
}

interface Category {
  title: string;
  features: Feature[];
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  priceUnit?: string;
  mobileFeatures: { text: string; isNegative?: boolean }[];
  buttonText: string;
  buttonVariant?: 'flat' | 'solid' | 'shadow';
  buttonColor?: 'default' | 'primary';
  isPopular?: boolean;
  mobileCardClassName?: string;
  desktopColumnClassName?: string;
  desktopHeaderClassName?: string;
}

interface PricingData {
  plans: PricingPlan[];
  categories: Category[];
}

// Helper function to create cell content
export const createCellContent = {
  check: (className?: string): CellContent => ({ type: 'check', className }),
  cross: (className?: string): CellContent => ({ type: 'cross', className }),
  text: (text: string, className?: string): CellContent => ({
    type: 'text',
    text,
    className,
  }),
};

// Default pricing data
const defaultPricingData: PricingData = {
  plans: [
    {
      id: 'free',
      name: 'Free',
      description: 'For starters and hobbyists that want to try out.',
      monthlyPrice: 0,
      mobileFeatures: [
        { text: 'Unlimited leagues' },
        { text: 'Public shareable leagues' },
        { text: 'Promotion and relegation' },
        { text: 'Upto 2 seasons per league', isNegative: true },
      ],
      buttonText: 'Continue with Free',
      buttonVariant: 'flat',
      buttonColor: 'default',
      mobileCardClassName: 'border-medium! border-default-100 bg-transparent',
      desktopColumnClassName: '',
      desktopHeaderClassName: 'relative px-6 pt-6 xl:px-8 xl:pt-8',
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For users who want longer leagues and more control.',
      monthlyPrice: 3,
      priceUnit: '/per year',
      mobileFeatures: [
        { text: 'Unlimited seasons' },
        { text: 'Goal scorers, assists & more stats' },
        { text: 'League announcements' },
        { text: 'Season rewind' },
      ],
      buttonText: 'Get started',
      buttonVariant: 'shadow',
      buttonColor: 'primary',
      isPopular: true,
      mobileCardClassName:
        'border-primary shadow-primary/20 border-2 shadow-2xl bg-content1',
      desktopColumnClassName:
        'before:absolute before:h-full before:inset-0 before:-z-10 before:bg-primary',
      desktopHeaderClassName:
        'relative px-6 pt-6 xl:px-8 xl:pt-8 before:absolute before:h-full before:inset-0 before:-z-10 before:bg-primary before:rounded-t-medium',
    },
    // {
    //   id: 'proplus',
    //   name: 'Pro+',
    //   description:
    //     'For organisers who want premium polish and zero limitations.',
    //   monthlyPrice: 5,
    //   priceUnit: '/per year',
    //   mobileFeatures: [
    //     { text: 'Team pages' },
    //     { text: 'Graphs & data visuals' },
    //     { text: 'Fixture categories & notifications' },
    //     { text: 'Data PNG download' },
    //   ],
    //   buttonText: 'Contact us',
    //   buttonVariant: 'flat',
    //   buttonColor: 'default',
    //   mobileCardClassName:
    //     'border-medium! border-content3 bg-content2 dark:border-content2 dark:bg-content1',
    //   desktopColumnClassName:
    //     'before:absolute before:h-full before:inset-0 before:-z-10 before:bg-content2 dark:before:bg-content1',
    //   desktopHeaderClassName:
    //     'relative px-6 pt-6 xl:px-8 xl:pt-8 before:absolute before:h-full before:inset-0 before:-z-10 before:bg-content2 dark:before:bg-content1 before:rounded-t-medium',
    // },
  ],
  categories: [
    {
      title: 'League Management',
      features: [
        {
          title: 'Number of leagues',
          isImplemented: true,
          description:
            'The maximum number of leagues a single account can create.',
          free: createCellContent.text(
            'Unlimited',
            'text-medium text-default-600 dark:text-default-500 text-center'
          ),
          pro: createCellContent.text(
            'Unlimited',
            'text-medium text-center text-primary-foreground/70'
          ),
          proplus: createCellContent.text(
            'Unlimited',
            'text-medium text-default-600 dark:text-default-500 text-center'
          ),
        },
        {
          title: 'Seasons per league',
          isImplemented: true,
          description: 'The maximum number of seasons any league can run for',
          free: createCellContent.text(
            '2 seasons',
            'text-medium text-default-500 text-center'
          ),
          pro: createCellContent.text(
            'Unlimited',
            'text-medium text-center text-primary-foreground/70'
          ),
          proplus: createCellContent.text(
            'Unlimited',
            'text-medium text-default-500 text-center'
          ),
        },
        {
          title: 'Divisions per league',
          isImplemented: true,
          description: 'The maximum number of divisions any league can have.',
          free: createCellContent.text(
            'Up to 5',
            'text-medium text-default-500 text-center'
          ),
          pro: createCellContent.text(
            'Up to 5',
            'text-medium text-center text-primary-foreground/70'
          ),
          proplus: createCellContent.text(
            'Up to 5',
            'text-medium text-default-500 text-center'
          ),
        },
        {
          title: 'Teams per division',
          isImplemented: true,
          description: 'The maximum number of teams any division can have',
          free: createCellContent.text(
            'Up to 24',
            'text-medium text-default-500 text-center'
          ),
          pro: createCellContent.text(
            'Up to 24',
            'text-medium text-center text-primary-foreground/70'
          ),
          proplus: createCellContent.text(
            'Up to 24',
            'text-medium text-default-500 text-center'
          ),
        },
        {
          title: 'Custom promotion & relegation',
          isImplemented: true,
          description:
            'Choose how many teams should be promoted and relegated from each league every season',
          free: createCellContent.check('text-primary'),
          pro: createCellContent.check('text-primary-foreground'),
          proplus: createCellContent.check('text-primary'),
        },
        {
          title: 'Basic leagues',
          isImplemented: true,
          description: 'Faster leagues for a streamlined experience',
          free: createCellContent.check('text-primary'),
          pro: createCellContent.check('text-primary-foreground'),
          proplus: createCellContent.check('text-primary'),
        },
        {
          title: 'Advanced leagues',
          isImplemented: true,
          description: 'Detailed leagues with scorer & assist stats',
          free: createCellContent.cross('text-default-400'),
          pro: createCellContent.check('text-primary-foreground'),
          proplus: createCellContent.check('text-primary'),
        },
        // {
        //   title: 'Team pages',
        //   description:
        //     'Dedicated dashboards for each team displaying stats, achievements, records & more.',
        //   free: createCellContent.cross('text-default-400'),
        //   pro: createCellContent.cross('text-primary-foreground/50'),
        //   proplus: createCellContent.check('text-primary'),
        // },
      ],
    },
    {
      title: 'Sharing',
      features: [
        {
          title: 'Public league page',
          isImplemented: true,
          description:
            "Easily share your league with others by sending the league's URL.",
          free: createCellContent.check('text-primary'),
          pro: createCellContent.check('text-primary-foreground'),
          proplus: createCellContent.check('text-primary'),
        },
        {
          title: 'Follower & visitor analytics',
          description: 'See how many people like, follow or visit your league',
          free: createCellContent.cross('text-default-400'),
          pro: createCellContent.check('text-primary-foreground'),
          proplus: createCellContent.check('text-primary'),
        },
        {
          title: 'Announcements',
          isImplemented: true,
          description: 'Broadcast messages to league viewers',
          free: createCellContent.cross('text-default-400'),
          pro: createCellContent.check('text-primary-foreground'),
          proplus: createCellContent.check('text-primary'),
        },
        // {
        //   title: 'Big-match tags',
        //   description:
        //     'Mark specific fixtures as big games to build excitement',
        //   free: createCellContent.cross('text-default-400'),
        //   pro: createCellContent.check('text-primary-foreground'),
        //   proplus: createCellContent.check('text-primary'),
        // },
        // {
        //   title: 'Notifications',
        //   description:
        //     'Automatically send in-app notifications to league followers before and after big events',
        //   free: createCellContent.cross('text-default-400'),
        //   pro: createCellContent.cross('text-primary-foreground/50'),
        //   proplus: createCellContent.check('text-primary'),
        // },
      ],
    },
    {
      title: 'Fixtures & Results',
      features: [
        {
          title: 'Enter match result',
          isImplemented: true,
          description:
            'Show league viewers how matches unfolded by inputting goals in the order they were scored',
          free: createCellContent.check('text-primary'),
          pro: createCellContent.check('text-primary-foreground'),
          proplus: createCellContent.check('text-primary'),
        },
        {
          title: 'Edit/correct results',
          free: createCellContent.check('text-primary'),
          pro: createCellContent.check('text-primary-foreground'),
          proplus: createCellContent.check('text-primary'),
        },
        {
          title: 'Head-to-head record',
          isImplemented: true,
          description: 'Easily see the previous results of two teams',
          free: createCellContent.cross('text-default-400'),
          pro: createCellContent.check('text-primary-foreground'),
          proplus: createCellContent.check('text-primary'),
        },
        {
          title: 'Scorers & assists tracking',
          isImplemented: true,
          description: 'Add goal scorers and assists in every result',
          free: createCellContent.cross('text-default-400'),
          pro: createCellContent.check('text-primary-foreground'),
          proplus: createCellContent.check('text-primary'),
        },
        // {
        //   title: 'Match summary',
        //   description:
        //     'Manually add match summaries for league viewers to read and understand how the match panned out',
        //   free: createCellContent.cross('text-default-400'),
        //   pro: createCellContent.check('text-primary-foreground'),
        //   proplus: createCellContent.check('text-primary'),
        // },
        // {
        //   title: 'AI fixture preview',
        //   description:
        //     'View AI generated fixture previews based off previous meetings. Available from season 2 onwards.',
        //   free: createCellContent.cross('text-default-400'),
        //   pro: createCellContent.cross('text-primary-foreground/50'),
        //   proplus: createCellContent.check('text-primary'),
        // },
      ],
    },
    {
      title: 'Stats',
      features: [
        {
          title: 'Cleansheets',
          isImplemented: true,
          free: createCellContent.check('text-primary'),
          pro: createCellContent.check('text-primary-foreground'),
          proplus: createCellContent.check('text-primary'),
        },
        {
          title: 'Season rewind',
          isImplemented: true,
          description:
            'Rewind through previous seasons and explore historic stats, results and more.',
          free: createCellContent.cross('text-default-400'),
          pro: createCellContent.check('text-primary-foreground'),
          proplus: createCellContent.check('text-primary'),
        },
        {
          title: 'Top scorers & assists',
          isImplemented: true,
          description: 'Top scorers & most assists stat',
          free: createCellContent.cross('text-default-400'),
          pro: createCellContent.check('text-primary-foreground'),
          proplus: createCellContent.check('text-primary'),
        },
        {
          title: 'Sort tables',
          isImplemented: true,
          description: 'Re-organise data in tables to quickly find information',
          free: createCellContent.cross('text-default-400'),
          pro: createCellContent.check('text-primary-foreground'),
          proplus: createCellContent.check('text-primary'),
        },
        {
          title: 'Team form',
          isImplemented: true,
          description: 'Visual indicator showing every teams last 5 results',
          free: createCellContent.cross('text-default-400'),
          pro: createCellContent.check('text-primary-foreground'),
          proplus: createCellContent.check('text-primary'),
        },
        {
          title: 'Home/away stats',
          isImplemented: true,
          description: 'Tables showing home and away data',
          free: createCellContent.cross('text-default-400'),
          pro: createCellContent.text(
            'Coming soon',
            'text-medium text-center text-primary-foreground/70'
          ),
          proplus: createCellContent.check('text-primary'),
        },
        // {
        //   title: 'Deeper insights',
        //   description:
        //     'More in-depth analytics such as streaks, momentum and trends',
        //   free: createCellContent.cross('text-default-400'),
        //   pro: createCellContent.cross('text-primary-foreground/50'),
        //   proplus: createCellContent.check('text-primary'),
        // },
      ],
    },
    {
      title: 'Customization',
      features: [
        {
          title: 'Promotion/relegation indicators',
          description:
            'Change the style of indicators that show teams in the promotion / relegation zone',
          free: createCellContent.check('text-primary'),
          pro: createCellContent.check('text-primary-foreground'),
          proplus: createCellContent.check('text-primary'),
        },
        {
          title: 'Banner/cover image',
          description:
            'Upload custom league banners that appear at the top of every league page',
          free: createCellContent.text(
            'Choose from presets',
            'text-medium text-default-500 text-center'
          ),
          pro: createCellContent.check('text-primary-foreground'),
          proplus: createCellContent.check('text-primary'),
        },
        {
          title: 'Custom color theme',
          description: 'Change the accent color across the league',
          free: createCellContent.cross('text-default-400'),
          pro: createCellContent.check('text-primary-foreground'),
          proplus: createCellContent.check('text-primary'),
        },
        // {
        //   title: 'Team colors',
        //   description: 'Give colors to represent each team',
        //   free: createCellContent.cross('text-default-400'),
        //   pro: createCellContent.cross('text-primary-foreground/50'),
        //   proplus: createCellContent.check('text-primary'),
        // },
        // {
        //   title: 'Custom logo',
        //   description:
        //     'Replace the LeagueX logo in the top left corner with your own logo',
        //   free: createCellContent.cross('text-default-400'),
        //   pro: createCellContent.cross('text-primary-foreground/50'),
        //   proplus: createCellContent.check('text-primary'),
        // },
      ],
    },
  ],
};

// Icon Components
const CheckIcon = ({ className = '' }: { className?: string }) => (
  // <svg
  //   xmlns="http://www.w3.org/2000/svg"
  //   className={` ${className}`}
  //   width="24"
  //   height="24"
  //   viewBox="0 0 24 24"
  // >
  //   <path
  //     fill="none"
  //     stroke="currentColor"
  //     strokeLinecap="round"
  //     strokeLinejoin="round"
  //     strokeWidth="2"
  //     d="m6 12l4.243 4.243l8.484-8.486"
  //   />
  // </svg>
  <FaCheck className={`h-6 w-4 ${className}`} />
);

const CrossIcon = ({ className = '' }: { className?: string }) => (
  // <svg
  //   xmlns="http://www.w3.org/2000/svg"
  //   className={` ${className}`}
  //   width="24"
  //   height="24"
  //   viewBox="0 0 24 24"
  // >
  //   <path
  //     fill="none"
  //     stroke="currentColor"
  //     strokeLinecap="round"
  //     strokeLinejoin="round"
  //     strokeWidth="2"
  //     d="m16 16l-4-4m0 0L8 8m4 4l4-4m-4 4l-4 4"
  //   />
  // </svg>
  <RxCross1 className={`stroke-1 h-6 w-4 ${className}`} />
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

// Cell Content Renderer
const CellContentRenderer: React.FC<{
  content: CellContent;
  planId: string;
}> = ({ content, planId }) => {
  const getPlanName = () => {
    const names: { [key: string]: string } = {
      free: 'Free',
      pro: 'Pro',
      team: 'Team',
    };
    return names[planId] || planId;
  };

  switch (content.type) {
    case 'check':
      return (
        <>
          <div className={content.className}>
            <CheckIcon className="place-self-center" />
          </div>
          <span className="sr-only">Included in {getPlanName()}</span>
        </>
      );
    case 'cross':
      return (
        <>
          <div className={content.className}>
            <CrossIcon className="place-self-center" />
          </div>
          <span className="sr-only">Not included in {getPlanName()}</span>
        </>
      );
    case 'text':
      return <div className={content.className}>{content.text}</div>;
    default:
      return null;
  }
};

// Mobile Pricing Card
interface PricingCardProps {
  plan: PricingPlan;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan }) => (
  <Card
    className={`relative p-3 ${plan.mobileCardClassName}`}
    shadow={plan.isPopular ? 'lg' : 'none'}
  >
    {plan.isPopular && (
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
    <CardHeader className="flex flex-col items-start justify-start gap-2 pb-6">
      <h2 className="text-large font-medium">{plan.name}</h2>
      <p className="text-medium text-default-500 text-start">
        {plan.description}
      </p>
    </CardHeader>
    <Divider />
    <CardBody className="gap-8">
      <p className="flex items-baseline gap-1 pt-2">
        <span className="from-foreground to-foreground-600 inline bg-linear-to-br bg-clip-text text-4xl leading-7 font-semibold tracking-tight text-transparent">
          {plan.monthlyPrice === 0 ? 'Free' : `$${plan.monthlyPrice}`}
        </span>
        {plan.priceUnit && (
          <span className="text-small text-default-400 font-medium">
            {plan.priceUnit}
          </span>
        )}
      </p>
      <ul className="flex flex-col gap-2">
        {plan.mobileFeatures.map((feature, index) => (
          <li key={index} className="flex flex-row gap-2">
            {feature.isNegative ? (
              <CrossIcon className="text-default-400" />
            ) : (
              <CheckIcon className="text-primary" />
            )}
            <p className="text-default-500">{feature.text}</p>
          </li>
        ))}
      </ul>
    </CardBody>
    <CardFooter>
      <Button
        className="w-full"
        variant={plan.buttonVariant}
        color={plan.buttonColor}
        href="#"
      >
        {plan.buttonText}
      </Button>
    </CardFooter>
  </Card>
);

// Desktop Feature Row
interface FeatureRowProps {
  feature: Feature;
  plans: PricingPlan[];
  isLastInCategory?: boolean;
}

const FeatureRow: React.FC<FeatureRowProps> = ({
  feature,
  plans,
  isLastInCategory,
}) => (
  <tr>
    <th className="text-medium text-default-700 py-4 font-normal" scope="row">
      <div
        className={`flex items-center gap-1 ${
          feature.isImplemented ? 'text-success' : ''
        }`}
      >
        {feature.isImplemented && <CheckIcon className="text-success" />}
        <span>{feature.title}</span>
        {feature.description && (
          <Tooltip
            content={feature.description}
            isDisabled={!feature.description}
            className="max-w-xs"
          >
            <div>
              <InfoIcon />
            </div>
          </Tooltip>
        )}
      </div>
    </th>
    {plans.map((plan) => {
      const content = feature[plan.id as keyof Feature] as CellContent;
      const baseClassName = 'relative px-6 py-4 xl:px-8';
      const columnClassName = plan.desktopColumnClassName;
      const roundedClass =
        isLastInCategory && plan.id === 'pro'
          ? 'before:rounded-b-medium'
          : isLastInCategory && plan.id === 'proplus'
          ? 'before:rounded-b-medium'
          : '';

      return (
        <td
          key={plan.id}
          className={`${baseClassName} ${columnClassName} ${roundedClass}`}
        >
          <CellContentRenderer content={content} planId={plan.id} />
        </td>
      );
    })}
  </tr>
);

// Desktop Section Header
interface SectionHeaderProps {
  title: string;
  plans: PricingPlan[];
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, plans }) => (
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
    {plans.map((plan) => (
      <td
        key={plan.id}
        className={`relative py-4 ${plan.desktopColumnClassName}`}
      />
    ))}
  </tr>
);

// Main Component
interface PricingTableProps {
  data?: PricingData;
  timeframe: 'monthly' | 'yearly';
}

const PricingTable: React.FC<PricingTableProps> = ({
  data = defaultPricingData,
  timeframe,
}) => {
  const { plans, categories } = data;

  return (
    <>
      {/* Mobile Layout */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
        {plans.map((plan) => (
          <PricingCard key={plan.id} plan={plan} />
        ))}
      </div>

      {/* Desktop Table Layout */}
      <div className="isolate hidden lg:block">
        <div className="relative">
          <table className="w-full table-fixed border-separate border-spacing-x-4 text-left">
            <caption className="sr-only">Pricing plan comparison</caption>
            <colgroup>
              <col className="w-1/4" />
              {plans.map((plan) => (
                <col key={plan.id} className="w-1/4" />
              ))}
            </colgroup>
            <thead>
              <tr>
                <td />
                {plans.map((plan) => (
                  <th
                    key={plan.id}
                    className={plan.desktopHeaderClassName}
                    scope="col"
                  >
                    {plan.isPopular && (
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
                    )}
                    <div
                      className={`text-large relative font-medium ${
                        plan.id === 'pro'
                          ? 'text-primary-foreground'
                          : 'text-foreground'
                      }`}
                    >
                      {plan.name}
                    </div>
                  </th>
                ))}
              </tr>
              <tr>
                <th scope="row">
                  <span className="sr-only">Price</span>
                </th>
                {plans.map((plan) => {
                  const calculatedPrice = calculatePrice(
                    plan.monthlyPrice,
                    timeframe
                  );
                  return (
                    <td
                      key={plan.id}
                      className={`relative px-6 pt-4 xl:px-8 ${plan.desktopColumnClassName}`}
                    >
                      <div className="text-foreground flex items-baseline gap-1">
                        <span
                          className={`from-foreground to-foreground-600 inline bg-linear-to-br bg-clip-text text-4xl leading-8 font-semibold tracking-tight ${
                            plan.id === 'pro'
                              ? 'text-primary-foreground'
                              : 'text-transparent'
                          }`}
                        >
                          {calculatedPrice === 0
                            ? 'Free'
                            : `$${calculatedPrice}`}
                        </span>
                        {calculatedPrice !== 0 && (
                          <span
                            className={`text-small! font-medium ${
                              plan.id === 'pro'
                                ? 'text-primary-foreground/50'
                                : 'text-default-600'
                            }`}
                          >
                            {timeframe === 'monthly'
                              ? '/per month'
                              : '/per year'}
                          </span>
                        )}
                      </div>
                      <Button
                        className={`w-full mt-6 ${
                          plan.id === 'pro'
                            ? 'bg-primary-foreground text-primary font-medium shadow-white/30'
                            : ''
                        }`}
                        variant={plan.buttonVariant}
                        color={plan.buttonColor}
                        href="#"
                      >
                        {plan.buttonText}
                      </Button>
                    </td>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {categories.map((category, categoryIndex) => (
                <React.Fragment key={categoryIndex}>
                  <SectionHeader title={category.title} plans={plans} />
                  {category.features.map((feature, featureIndex) => (
                    <FeatureRow
                      key={featureIndex}
                      feature={feature}
                      plans={plans}
                      isLastInCategory={
                        featureIndex === category.features.length - 1 &&
                        categoryIndex === categories.length - 1
                      }
                    />
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PricingTable;
export type { PricingData, PricingPlan, Category, Feature, CellContent };
