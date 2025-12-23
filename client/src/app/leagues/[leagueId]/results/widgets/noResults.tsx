import { League } from '@/util/definitions';
import { Button, Card, CardBody, Link } from '@heroui/react';

export default function NoResults({
  league,
  matchweek,
}: {
  league: League;
  matchweek: number;
}) {
  return (
    <Card>
      <CardBody className="flex items-center gap-4 text-center">
        <div>
          <p className="text-lg">Hey, early bird!</p>
          <p className="text-sm text-default-600">
            No matchweek {matchweek} games have been played yet.
          </p>
        </div>
        <Button
          as={Link}
          color="primary"
          href={`/leagues/${league._id}/fixtures?matchweek=${matchweek}`}
        >
          View matchweek {matchweek} fixtures
        </Button>
      </CardBody>
    </Card>
  );
}
