interface IFeature {
  category: string;
  title: string;
  descriptions: string[];
}

export default function FeatureBenefits() {
  const featureData: IFeature[] = [
    {
      category: 'Fixtures & results',
      title: 'Capture the story of every fixture',
      descriptions: [
        "Instead of typing just the scoreline, LeagueX's intuitive result uploading form makes it simple to add goals in the order they were scored",
        'Let your league followers have an insight into how matches panned out',
      ],
    },
    {
      category: 'Tables',
      title: 'View the data you want, how you like it',
      descriptions: [
        'Easily sort tables by clicking table headers by both ascending and descending.',
        'LeagueX provides various table formats for you to use and analyze teams.',
      ],
    },
    {
      category: 'Customization',
      title:
        'Make your league truly yours with custom banners, colors & settings',
      descriptions: [
        'Choose the level of detail you want in your league, go basic for a streamlined experience or go advanced for better engagement, stats and thrill.',
        'Represent your group, community or organisation with by customizing your leagues with custom banners, images, colors and more.',
        'Reward winning teams with more points, or punish losing teams with points deductions',
      ],
    },
    {
      category: 'Announcements & notifications',
      title:
        'Keep league followers informed with custom announcements and notifications',
      descriptions: [
        "Announce updates and messages to your league's followers.",
        "If you're following a league, you'll also recieve in-app notifications to keep updated with big events, such as rivalry results & league defining moments.",
      ],
    },
    {
      category: 'Sharing & exports',
      title: 'Let others enjoy your league with you',
      descriptions: [
        'Share the league link with others to let them explore the league, its history, fixtures and stats themselves',
        'Additionally you can download social media-ready formatted images to share various information',
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-36 my-36 w-full items-center justify-center">
      {featureData.map((feature, i) => (
        <FeatureBenefitSection
          feature={feature}
          key={i}
          reverse={i % 2 === 1}
        />
      ))}
    </div>
  );
}

function FeatureBenefitSection({
  feature,
  reverse,
}: {
  feature: IFeature;
  reverse: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-8 max-w-5xl w-5xl ">
      <div
        className="flex flex-col items-start gap-1"
        style={{ order: reverse ? 2 : 1 }}
      >
        <span className="text-primary text-base font-semibold">
          {feature.category}
        </span>
        <h2 className="text-3xl font-semibold">{feature.title}</h2>
        <div className="text-muted flex flex-col gap-2">
          {feature.descriptions.map((str, i) => (
            <p key={i}>{str}</p>
          ))}
        </div>
      </div>
      <div style={{ order: reverse ? 1 : 2 }}></div>
    </div>
  );
}
