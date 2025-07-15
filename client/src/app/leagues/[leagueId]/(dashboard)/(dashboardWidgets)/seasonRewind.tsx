import ArrowBackSVG from '@/assets/svg components/ArrowBack';
import ArrowForwardSVG from '@/assets/svg components/ArrowForward';
import Button from '@/components/text/Button';
import Label from '@/components/text/Label';
import Paragraph from '@/components/text/Paragraph';
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

  return (
    <div className="p-[20px] h-full w-full bg-[var(--bg)] rounded-[10px] border-1 border-[var(--border)] flex flex-col">
      <div className="flex flex-row justify-between ">
        <Paragraph
          style={{
            color: 'var(--text)',
            verticalAlign: 'middle',
            display: 'inline',
          }}
        >
          Season rewind
        </Paragraph>
        <Label
          style={{
            backgroundColor:
              seasonViewing === league.currentSeason
                ? 'var(--border)'
                : 'var(--success)',
            height: 'min-content',
            padding: '0 8px',
            borderRadius: '10px',
            color:
              seasonViewing === league.currentSeason
                ? 'var(--text-muted)'
                : 'var(--text)',
          }}
        >
          {seasonViewing === league.currentSeason ? 'OFF' : 'active'}
        </Label>
      </div>
      <Label style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>
        View results, tables & stats from previous seasons
      </Label>
      <div className="mt-[20px] bg-[var(--bg-light)] w-fit rounded-[10px] grid grid-cols-[repeat(3,max-content)] grid-rows-1 place-items-center">
        <Button
          color="transparent"
          bgHoverColor="var(--accent)"
          borderlessButton={true}
          underlineEffect={false}
          onClick={decrementSeason}
          disabled={seasonViewing === 1}
        >
          <ArrowBackSVG
            className="w-[24px] h-[24px]"
            style={{
              fill: seasonViewing === 1 ? 'var(--border)' : 'var(--primary)',
            }}
          />
        </Button>
        <Paragraph
          style={{
            margin: '0 20px',
            color:
              seasonViewing === league.currentSeason
                ? 'var(--text-muted)'
                : 'var(--text)',
          }}
        >
          Season {seasonViewing}
        </Paragraph>
        <Button
          color="transparent"
          bgHoverColor="var(--accent)"
          borderlessButton={true}
          underlineEffect={false}
          onClick={incrementSeason}
          disabled={seasonViewing === league.currentSeason}
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
    </div>
  );
}
