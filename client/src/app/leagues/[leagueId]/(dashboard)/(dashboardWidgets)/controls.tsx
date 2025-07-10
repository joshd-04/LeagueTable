'use client';
import Button from '@/components/text/Button';
import Label from '@/components/text/Label';
import Paragraph from '@/components/text/Paragraph';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { League } from '@/util/definitions';
import { useState } from 'react';

export default function Controls({
  league,
  fetchLatestData,
}: {
  league: League;
  fetchLatestData: () => Promise<void>;
}) {
  const [matchweekButtonText, setMatchweekButtonText] = useState(
    `Start matchweek ${league.currentMatchweek + 1}`
  );
  const [seasonButtonText, setSeasonButtonText] = useState('Start next season');

  async function handleStartNextMatchweek() {
    const response = await fetchAPI(
      `${API_URL}/leagues/${league._id}/start-next-matchweek`,
      { method: 'GET', credentials: 'include' }
    );
    setMatchweekButtonText('...');
    if (response.status === 'success') {
      if (typeof window !== undefined) {
        await fetchLatestData();
        setMatchweekButtonText(
          `Start matchweek ${league.currentMatchweek + 1}`
        );
      }
    } else {
      setMatchweekButtonText('Something went wrong');
      setTimeout(() => {
        setMatchweekButtonText(
          `Start matchweek ${league.currentMatchweek + 1}`
        );
      }, 3000);
    }
  }
  async function handleStartNextSeason() {
    const response = await fetchAPI(
      `${API_URL}/leagues/${league._id}/start-next-season`,
      { method: 'GET', credentials: 'include' }
    );
    setSeasonButtonText('...');
    if (response.status === 'success') {
      if (typeof window !== undefined) {
        await fetchLatestData();
        setSeasonButtonText(`Start next season`);
      }
    } else {
      setSeasonButtonText('Something went wrong');
      setTimeout(() => {
        setSeasonButtonText(`Start next season`);
      }, 3000);
    }
  }
  return (
    <div className="p-[20px]  h-full w-full bg-[var(--bg)] rounded-[10px] border-1 border-[var(--border)] flex flex-col gap-2">
      <span>
        <Paragraph
          style={{
            color: 'var(--text)',
            verticalAlign: 'middle',
            display: 'inline',
          }}
        >
          Controls
        </Paragraph>
      </span>
      <Button
        onClick={handleStartNextMatchweek}
        color="var(--primary)"
        bgHoverColor="var(--accent)"
        disabled={
          league.currentMatchweek === league.finalMatchweek ||
          league.currentMatchweek === 0
        }
      >
        <Label style={{ fontWeight: 'bold', color: 'inherit' }}>
          {matchweekButtonText}
        </Label>
      </Button>

      <Button
        onClick={handleStartNextSeason}
        color="var(--primary)"
        bgHoverColor="var(--accent)"
        disabled={
          !(
            league.currentMatchweek === league.finalMatchweek &&
            league.fixtures.length === 0
          ) && !(league.currentSeason === 0 && league.currentMatchweek === 0)
        }
      >
        <Label style={{ fontWeight: 'bold', color: 'inherit' }}>
          {seasonButtonText}
        </Label>
      </Button>
    </div>
  );
}
