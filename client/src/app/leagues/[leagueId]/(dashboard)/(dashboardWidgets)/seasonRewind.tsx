import ProChip from '@/components/chips/ProChip';
import { League } from '@/util/definitions';
import { shouldGrantAccessToFeature } from '@/util/helpers';
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Chip,
} from '@heroui/react';
import { Dispatch, SetStateAction } from 'react';
import { FaBackward } from 'react-icons/fa';
import { FaForward } from 'react-icons/fa6';

export default function SeasonRewind({
  league,
  seasonViewing,
  setSeasonViewing,
}: {
  league: League;
  seasonViewing: number;
  setSeasonViewing: Dispatch<SetStateAction<number>>;
}) {
  const isViewingCurrentSeason = league.currentSeason === seasonViewing;

  const shouldDisable = !shouldGrantAccessToFeature(
    'pro',
    league.leagueLevel,
    league.leagueOwner.accountType
  );

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
    <Card
      className="h-full w-full px-[10px] py-[6px]"
      fullWidth
      isDisabled={shouldDisable}
    >
      <CardHeader className="flex flex-col items-start">
        <div className="flex flex-row justify-between items-start w-full">
          <span className="flex flex-row gap-2 items-center">
            <ProChip />
            <p className="align-middle inline text-base">Season rewind</p>
          </span>
          {seasonViewing === league.currentSeason ? (
            <Chip color="default" variant="flat">
              <p className="text-xs">OFF</p>
            </Chip>
          ) : (
            <Chip color="primary" variant="solid">
              <p className="text-xs">ON</p>
            </Chip>
          )}
        </div>
        <p className="text-sm text-muted">
          View results, tables & stats from previous seasons
        </p>
      </CardHeader>
      <CardBody className="flex flex-col gap-2">
        <div
          className={`w-min border-2 rounded-xl ${
            isViewingCurrentSeason
              ? 'border-content3 bg-content3'
              : 'border-primary bg-primary'
          }`}
        >
          <p
            className={`text-sm text-center font-semibold ${
              seasonViewing > 0 ? '' : 'text-warning'
            }`}
          >
            {seasonViewing > 0
              ? `Season ${seasonViewing}`
              : 'League not started'}
          </p>
          <div className="bg-content1 rounded-xl">
            <ButtonGroup color="primary" variant="flat">
              <Button
                onPress={decrementSeason}
                isDisabled={shouldDisable || seasonViewing <= 1}
              >
                <FaBackward /> Back
              </Button>
              <Button
                onPress={resetSeason}
                isDisabled={
                  shouldDisable || seasonViewing === league.currentSeason
                }
              >
                Reset
              </Button>

              <Button
                onPress={incrementSeason}
                isDisabled={
                  shouldDisable || seasonViewing === league.currentSeason
                }
              >
                Next
                <FaForward />
              </Button>
            </ButtonGroup>
          </div>
        </div>
        {/* <div className="my-[20px] bg-[var(--bg-light)] w-fit rounded-[10px] grid grid-cols-[repeat(3,max-content)] grid-rows-1 place-items-center shadow-[var(--shadow)]">
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
        </div> */}
        <p className="text-sm">
          {isViewingCurrentSeason
            ? `You are viewing the current season`
            : `${league.name} is currently on season ${league.currentSeason}`}
        </p>
      </CardBody>
    </Card>
  );
}
