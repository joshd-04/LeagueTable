import { League } from '@/util/definitions';
import { Button, Card, CardBody, Link } from '@heroui/react';

export default function NoFixtures({
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
          <p className="text-lg">Oops, you&apos;re late!</p>
          <p className="text-sm text-default-600">
            All fixtures for this matchweek have been played.
          </p>
        </div>
        <Button
          as={Link}
          color="primary"
          href={`/leagues/${league._id}/results?matchweek=${matchweek}`}
        >
          View matchweek {matchweek} results
        </Button>
      </CardBody>
    </Card>
  );
}
