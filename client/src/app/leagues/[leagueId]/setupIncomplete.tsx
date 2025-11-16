'use client';

import { GlobalContext } from '@/context/GlobalContextProvider';
import useAccount from '@/hooks/useAccount';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { bookmarkOrFavouriteOptionsAvailableWhenSetupIncomplete } from '@/util/featureToggle';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Link,
} from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';

export default function SetupIncomplete({
  leagueId,
  leagueName,
  leagueOwner,
  property,
}: {
  leagueId: string;
  leagueName: string;
  leagueOwner: string;
  property: 'teams' | 'tables';
}) {
  const { user } = useContext(GlobalContext).account;
  const userOwnsThisLeague = user?.id === leagueOwner;

  /*
  These are the different states:

  User owns the league:
  - but they need to add tables
  - or they need to add teams

  User does not own the league:
  - show bookmark/favourite buttons if logged in
  - do not show favourite buttons if not logged in

  */

  const { isLoggedIn } = useAccount();

  if (userOwnsThisLeague) {
    return (
      <CardWhenOwner
        leagueName={leagueName}
        leagueId={leagueId}
        property={property}
      />
    );
  } else {
    return bookmarkOrFavouriteOptionsAvailableWhenSetupIncomplete &&
      isLoggedIn ? (
      <CardWhenNotOwnerButtons leagueName={leagueName} leagueId={leagueId} />
    ) : (
      <CardWhenNotOwner leagueName={leagueName} />
    );
  }
}

function CardWhenOwner({
  leagueName,
  leagueId,
  property,
}: {
  leagueName: string;
  leagueId: string;
  property: 'tables' | 'teams';
}) {
  return (
    <Card className="overflow-none border-small border-divider relative w-[520px] bg-linear-to-br from-content1 to-content2 place-self-center mt-[100px] px-6 py-4">
      <div className="absolute -top-48 -left-20 w-64 h-64 bg-warning rounded-full blur-xl opacity-30"></div>
      <div className="absolute -bottom-12 -right-32 w-64 h-64 bg-secondary rounded-full blur-xl opacity-30"></div>
      <CardHeader>
        <div className="flex items-center gap-3">
          <p className="text-md font-medium">{leagueName}</p>
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col gap-2 ">
          <p className="text-lg font-medium text-warning">Setup incomplete</p>
          <p className="text-sm opacity-80 dark:opacity-70">
            Finish setting up your league before you can start using it.
          </p>
          <Checkbox isDisabled defaultSelected>
            Create league
          </Checkbox>
          <Checkbox
            isDisabled
            className={`${property === 'tables' ? 'opacity-100' : ''}`}
            defaultSelected={property === 'teams' ? true : false}
          >
            Add divisions
          </Checkbox>
          <Checkbox
            isDisabled
            className={`${property === 'teams' ? 'opacity-100' : ''}`}
            defaultSelected={false}
          >
            Add teams
          </Checkbox>
        </div>
      </CardBody>
      <CardFooter className="justify-end gap-2">
        <Button
          fullWidth
          className="border-small border-divider/50 bg-content1/10 "
          as={Link}
          href={`/create-league/${leagueId}/${
            property === 'tables' ? 'tables' : 'teams'
          }`}
          variant="light"
        >
          Add {property === 'tables' ? 'divisions' : 'teams'} to league
        </Button>
      </CardFooter>
    </Card>
  );
}

function CardWhenNotOwner({ leagueName }: { leagueName: string }) {
  return (
    <Card className="overflow-none border-small border-divider relative w-[520px] bg-linear-to-br from-content1 to-content2 place-self-center mt-[100px] px-6 py-4">
      <div className="absolute -top-48 -left-20 w-64 h-64 bg-primary rounded-full blur-xl opacity-30"></div>
      <div className="absolute -bottom-12 -right-32 w-64 h-64 bg-secondary rounded-full blur-xl opacity-30"></div>
      <CardHeader>
        <div className="flex items-center gap-3">
          <p className="text-lg font-medium">{leagueName}</p>
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col gap-2">
          <p className="text-lg font-medium text-primary">
            Waiting for final touches
          </p>
          <p className="text-sm opacity-80 dark:opacity-70">
            <em>{leagueName}</em> still needs to be finished setting up by the
            league owner. Check back later.
          </p>
        </div>
      </CardBody>
    </Card>
  );
}

function CardWhenNotOwnerButtons({
  leagueName,
  leagueId,
}: {
  leagueName: string;
  leagueId: string;
}) {
  async function addToFavourites() {
    const response = await fetchAPI(`${API_URL}/users/favourites`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ leagueId: leagueId }),
    });
    if (response.status === 'success') {
    } else if (response.status === 'fail') {
    } else {
    }
  }
  async function addToBookmarks() {
    const response = await fetchAPI(`${API_URL}/users/following`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ leagueId: leagueId }),
    });
    if (response.status === 'success') {
    } else if (response.status === 'fail') {
    } else {
    }
  }

  function handleBookmarkQuery() {
    fetchAPI(`${API_URL}/users/following`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ leagueId: leagueId }),
    });
  }

  const {} = useQuery({
    queryFn: handleBookmarkQuery,
    queryKey: ['addBookmark'],
  });

  return (
    <Card className="overflow-none border-small border-divider relative w-[520px] bg-linear-to-br from-content1 to-content2 place-self-center mt-[100px] px-6 py-4">
      <div className="absolute -top-48 -left-20 w-64 h-64 bg-primary rounded-full blur-xl opacity-30"></div>
      <div className="absolute -bottom-12 -right-32 w-64 h-64 bg-secondary rounded-full blur-xl opacity-30"></div>
      <CardHeader>
        <div className="flex items-center gap-3">
          <p className="text-lg font-medium">{leagueName}</p>
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col gap-2">
          <p className="text-lg font-medium text-primary">
            Waiting for final touches
          </p>
          <p className="text-sm opacity-80 dark:opacity-70">
            <em>{leagueName}</em> still needs to be finished setting up by the
            league owner. Check back later.
          </p>
        </div>
      </CardBody>
      <CardFooter className="flex flex-col items-start justify-start gap-2">
        <p className="text-sm opacity-80 dark:opacity-70">
          While you&apos;re waiting...
        </p>
        <Button
          fullWidth
          className="border-small border-divider/50 bg-content1/10"
          variant="light"
          onPress={addToBookmarks}
        >
          Bookmark this league
        </Button>
        <Button
          fullWidth
          className="border-small border-divider/50 bg-content1/10 "
          variant="light"
          onPress={addToFavourites}
        >
          Add to favourites
        </Button>
      </CardFooter>
    </Card>
  );
}
