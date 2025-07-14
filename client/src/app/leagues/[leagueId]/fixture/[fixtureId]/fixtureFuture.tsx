'use client';
import Paragraph from '@/components/text/Paragraph';
import { Fixture, League } from '@/util/definitions';
import { useState } from 'react';
import Heading1 from '@/components/text/Heading1';
import Label from '@/components/text/Label';
import LinkButton from '@/components/text/LinkButton';
import FixtureToResult from '@/components/fixtureToResult/FixtureToResult';
import LeagueBanner from '@/components/leagueBanner/LeagueBanner';
import PreviewTable from './(widgets)/previewTable';

export default function FixtureFuture({
  league,
  fixture,
}: {
  league: League;
  fixture: Fixture;
}) {
  const [showFixtureToResult, setShowFixtureToResult] =
    useState<Fixture | null>(null);

  return (
    <div className="flex flex-col gap-[20px]">
      <LeagueBanner league={league}>
        <div className="absolute bottom-0 left-[50%] translate-x-[-50%]">
          <div
            className={`w-full ${
              fixture.neutralGround ? 'hidden' : 'flex'
            } flex-row justify-between mb-[-20px] `}
          >
            <Label style={{ fontWeight: 'normal' }}>Home</Label>
            <Label style={{ fontWeight: 'normal' }}>Away</Label>
          </div>
          <div className="flex flex-row justify-between gap-[20px]">
            <LinkButton
              color="var(--text)"
              bgHoverColor="transparent"
              borderlessButton={true}
              underlineEffect={true}
              shadowEffect={false}
              href={'/'}
              style={{ padding: 0 }}
            >
              <Heading1>{fixture.homeTeamDetails.name}</Heading1>
            </LinkButton>
            <Heading1> v </Heading1>
            <LinkButton
              color="var(--text)"
              bgHoverColor="transparent"
              borderlessButton={true}
              underlineEffect={true}
              shadowEffect={false}
              href={'/'}
              style={{ padding: 0 }}
            >
              <Heading1>{fixture.awayTeamDetails.name}</Heading1>
            </LinkButton>
          </div>
        </div>
      </LeagueBanner>
      <div className="flex flex-col gap-[20px] mx-[20px]">
        <div className="flex flex-row justify-center items-center gap-[50px]">
          <Paragraph>
            Season {fixture.season} Matchweek {fixture.matchweek}
          </Paragraph>
          <LinkButton
            color="var(--text)"
            bgHoverColor="var(--bg)"
            borderlessButton={true}
            underlineEffect={false}
            href={`/leagues/${league._id}`}
          >
            {league.name}
          </LinkButton>
          <Paragraph>Division {fixture.division}</Paragraph>
          {fixture.neutralGround && <Paragraph>Neutral Ground</Paragraph>}
        </div>
        <div className="w-full grid grid-cols-3 grid-rows-[repeat(3,min-content)] gap-[20px]">
          <div className="p-[20px]  h-full w-full  bg-[var(--bg)] rounded-[10px] border-1 border-[var(--border)] flex flex-col gap-2">
            <Paragraph style={{ color: 'var(--info)' }}>AI insights</Paragraph>
            <Label style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>
              AI Insights not available yet. Come back when matchweek{' '}
              {fixture.matchweek} starts!
            </Label>
          </div>
          <div className="p-[20px] h-full w-full col-span-1 bg-[var(--bg)] rounded-[10px] border-1 border-[var(--border)] flex flex-col gap-2">
            <Paragraph>Match preview</Paragraph>
            <PreviewTable fixture={fixture} />
          </div>
          <div className="p-[20px]  h-full w-full  bg-[var(--bg)] rounded-[10px] border-1 border-[var(--border)] flex flex-col gap-2">
            <Paragraph>Head-to-head record</Paragraph>
          </div>
        </div>
        {showFixtureToResult && (
          <FixtureToResult
            leagueType={league.leagueType}
            fixtureObj={fixture}
            setShowFixtureToResult={setShowFixtureToResult}
          />
        )}
      </div>
    </div>
  );
}
