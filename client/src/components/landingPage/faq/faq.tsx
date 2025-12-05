'use client';

import { Accordion, AccordionItem, cn } from '@heroui/react';
import { useState } from 'react';
import type { Selection } from '@heroui/react';
import { IoAddOutline } from 'react-icons/io5';

interface IQNA {
  question: string;
  answer: string;
}

export default function FAQ() {
  const faqData: IQNA[] = [
    {
      question: 'Is LeagueX free to use?',
      answer:
        'Yes. You can create leagues, manage teams, track fixtures, and share public league pages on the free plan. Premium features are optional and only needed if you want advanced analytics or customisation.',
    },
    {
      question: 'Do I need technical skills to run a league?',
      answer:
        'No. You simply enter results and LeagueX automatically updates tables, standings, and stats. Everything is designed to be simple, fast, and error-free.',
    },
    {
      question: 'Can I share my league with others?',
      answer:
        'Yes. Every league gets its own public URL so friends, team owners, or your community can view live updates without screenshots or manual updates.',
    },
    {
      question: 'What if I enter a score incorrectly?',
      answer:
        'You can edit or delete fixtures or results at any time. LeagueX recalculates standings instantly, so mistakes never break your league.',
    },
    {
      question: 'Is my data safe and private?',
      answer:
        'All data is stored securely with encrypted connections. Only you can modify and manage your league, no one else.',
    },
    {
      question: 'How does pricing work?',
      answer:
        'LeagueX offers a free plan for essential league management and optional paid tiers for advanced features. You only upgrade if you want premium tools - no hidden fees or forced upgrades.',
    },
    {
      question: 'What types of leagues can I create?',
      answer:
        'Any type - sports, esports, or custom tournaments. LeagueX is fully sport-agnostic and supports any scoring or ranking format.',
    },
    {
      question: 'Does LeagueX work on mobile?',
      answer:
        'Yes. The entire platform is fully responsive, so users can check standings and results on phones, tablets, or desktops.',
    },
    {
      question: 'Can I customize the look of my league?',
      answer:
        'Yes. You can personalize colors, banners, and branding to match your team, club, organisation, or community identity.',
    },
    {
      question: 'How accurate are the tables and standings?',
      answer:
        "LeagueX uses a reliable scoring engine that automatically applies your league's rules and tiebreakers, ensuring consistent and accurate results every time.",
    },
  ];
  return (
    <div
      className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 lg:flex-row lg:items-start lg:gap-12 px-8 pt-36 pb-16"
      id="faq"
    >
      <div className="px-2 text-3xl leading-7">
        {/* <span className="inline-block lg:hidden">FAQs</span> */}
        <h2 className="from-foreground-800 to-foreground-500 dark:to-foreground-200 inline-block bg-linear-to-br bg-clip-text pt-4 text-5xl font-semibold tracking-tight text-transparent text-start sm:text-center lg:text-start">
          Frequently
          <br />
          asked
          <br />
          questions
        </h2>
      </div>
      <FAQComponent faq={faqData} />
    </div>
  );
}

function FAQComponent({ faq }: { faq: IQNA[] }) {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

  return (
    <Accordion
      selectionMode="multiple"
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
      hideIndicator
      itemClasses={{ title: cn('font-medium text-lg '), content: cn('pb-6') }}
    >
      {faq.map((element, i) => {
        const key = String(i + 1);
        const isSelected =
          selectedKeys instanceof Set ? selectedKeys.has(key) : false;
        return (
          <AccordionItem
            HeadingComponent="p"
            key={key}
            value={key}
            aria-label={element.question}
            title={element.question}
            classNames={{ trigger: cn('cursor-pointer') }}
            startContent={
              <IoAddOutline
                className={`h-7 w-7 p-0 text-default-400 transition-transform duration-200`}
                style={{
                  rotate: isSelected ? '45deg' : '0deg',
                }}
              />
            }
          >
            <p className="text-default-500">{element.answer}</p>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
