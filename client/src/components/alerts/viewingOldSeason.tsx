import { League } from '@/util/definitions';
import { Alert, Button, cn } from '@heroui/react';
import { Dispatch, SetStateAction } from 'react';
import AlertWrapper from './alertWrapper';

export default function ViewingOldSeasonAlert({
  seasonViewing,
  setSeasonViewing,
  oldSeasonAlertVisible,
  setOldSeasonAlertVisible,
  league,
}: {
  seasonViewing: number;
  setSeasonViewing: Dispatch<SetStateAction<number>>;
  oldSeasonAlertVisible: boolean;
  setOldSeasonAlertVisible: Dispatch<SetStateAction<boolean>>;
  league: League;
}) {
  return (
    <AlertWrapper>
      <Alert
        title={'Viewing a past season'}
        description={`You're viewing data from season ${seasonViewing}`}
        isClosable
        isVisible={oldSeasonAlertVisible}
        onVisibleChange={setOldSeasonAlertVisible}
        variant="faded"
        color="primary"
        endContent={
          <Button
            size="sm"
            color="primary"
            variant="flat"
            className="ml-10"
            onPress={() => {
              setSeasonViewing(league.currentSeason);
            }}
          >
            Go to current season
          </Button>
        }
        classNames={{
          base: cn(
            'opacity-100 bg-opacity-100 bg-primary-50 dark:bg-primary-50'
          ),
        }}
      />
    </AlertWrapper>
  );
}
