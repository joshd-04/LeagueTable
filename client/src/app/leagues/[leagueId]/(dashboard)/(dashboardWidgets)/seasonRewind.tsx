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

  function resetSeason() {
    setSeasonViewing(league.currentSeason);
  }

  return (
    <div className="p-[20px] h-full w-full bg-[var(--bg)] rounded-[10px] border-1 border-[var(--border)] flex flex-col">
      <div className="flex flex-row justify-between items-start">
        <Paragraph
          style={{
            color: 'var(--text)',
            verticalAlign: 'middle',
            display: 'inline',
          }}
        >
          Season rewind
        </Paragraph>
        {seasonViewing === league.currentSeason ? (
          <Label
            style={{
              backgroundColor: 'var(--border)',
              height: 'min-content',
              padding: '0 8px',
              borderRadius: '10px',
              fontWeight: 'bold',
            }}
          >
            OFF
          </Label>
        ) : (
          <Button
            color="transparent"
            bgHoverColor="transparent"
            style={{ padding: 0, textAlign: 'start' }}
            shadowEffect={false}
            borderlessButton={true}
            underlineEffect={false}
            onClick={() => resetSeason()}
          >
            <Label
              style={{
                backgroundColor: 'var(--success)',
                height: 'full',
                display: 'flex',
                flexGrow: '1',
                padding: '0 8px',
                borderRadius: '10px',
                color: 'black',
                margin: 0,
                marginBlock: 0,
              }}
            >
              ON
            </Label>
          </Button>
        )}
      </div>
      <Label>View results, tables & stats from previous seasons</Label>
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
        <Paragraph
          style={{
            margin: '0 10px',
            color:
              seasonViewing === league.currentSeason
                ? 'var(--text-muted)'
                : 'var(--text)',
            padding: '0 10px',
            borderRadius: '10px',
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
      <Label>
        {league.currentSeason === seasonViewing
          ? `You are viewing the current season`
          : `${league.name} is currently on season ${league.currentSeason}`}
      </Label>
    </div>
  );
}
