import ArrowBackSVG from '@/assets/svg components/ArrowBack';
import ArrowForwardSVG from '@/assets/svg components/ArrowForward';
import Button from '@/components/text/Button';

import { League } from '@/util/definitions';
import { Dispatch, SetStateAction } from 'react';

export default function SeasonRewind({
  league,
  seasonViewing,
  setSeasonViewing,
}: {
  league: League;
  seasonViewing: number;
  setSeasonViewing: Dispatch<SetStateAction<number>>;
}) {
  function decrementSeason() {
    if (seasonViewing > 1) {
      setSeasonViewing((prev) => prev - 1);
    }
  }

  function incrementSeason() {
    if (seasonViewing < league.currentSeason) {
      setSeasonViewing((prev) => prev + 1);
    }
  }

  function resetSeason() {
    setSeasonViewing(league.currentSeason);
  }

  return (
    <div className="p-[20px] h-full w-full bg-[var(--bg)] rounded-[10px] border-1 border-[var(--border)] flex flex-col">
      <div className="flex flex-row justify-between items-start">
        <p className="align-middle inline text-base">Season rewind</p>
        {seasonViewing === league.currentSeason ? (
          <Button
            color="transparent"
            bgHoverColor="transparent"
            style={{
              padding: 0,
              textAlign: 'start',
            }}
            shadowEffect={false}
            borderlessButton={true}
            underlineEffect={false}
            onClick={() => {}}
            disabled
          >
            <p className="bg-divider h-min px-[8px] rounded-[10px] font-bold text-sm">
              OFF
            </p>
          </Button>
        ) : (
          <Button
            color="transparent"
            bgHoverColor="transparent"
            style={{
              padding: 0,
              textAlign: 'start',
            }}
            shadowEffect={false}
            borderlessButton={true}
            underlineEffect={false}
            onClick={() => resetSeason()}
          >
            <p className="text-black bg-success h-min px-[8px] rounded-[10px] font-bold text-sm">
              ON
            </p>
          </Button>
        )}
      </div>
      <p className="text-sm">
        View results, tables & stats from previous seasons
      </p>
      <div className="my-[20px] bg-[var(--bg-light)] w-fit rounded-[10px] grid grid-cols-[repeat(3,max-content)] grid-rows-1 place-items-center shadow-[var(--shadow)]">
        <Button
          color="transparent"
          bgHoverColor="var(--accent)"
          borderlessButton={true}
          underlineEffect={false}
          onClick={decrementSeason}
          disabled={seasonViewing === 1}
          shadowEffect={false}
        >
          <ArrowBackSVG
            className="w-[24px] h-[24px]"
            style={{
              fill: seasonViewing === 1 ? 'var(--border)' : 'var(--primary)',
            }}
          />
        </Button>
        <p
          style={{
            color:
              seasonViewing === league.currentSeason
                ? 'var(--text-muted)'
                : 'var(--text)',
          }}
          className="mx-[10px] px-[10px] rounded-[10px] text-base"
        >
          Season {seasonViewing}
        </p>
        <Button
          color="transparent"
          bgHoverColor="var(--accent)"
          borderlessButton={true}
          underlineEffect={false}
          onClick={incrementSeason}
          disabled={seasonViewing === league.currentSeason}
          shadowEffect={false}
        >
          <ArrowForwardSVG
            className="w-[24px] h-[24px]"
            style={{
              fill:
                seasonViewing === league.currentSeason
                  ? 'var(--border)'
                  : 'var(--primary)',
            }}
          />
        </Button>
      </div>
      <p className="text-sm">
        {league.currentSeason === seasonViewing
          ? `You are viewing the current season`
          : `${league.name} is currently on season ${league.currentSeason}`}
      </p>
    </div>
  );
}
