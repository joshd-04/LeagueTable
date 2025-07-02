'use client';

import Button from '@/components/text/Button';
import LinkButton from '@/components/text/LinkButton';
import Paragraph from '@/components/text/Paragraph';
import Subtitle from '@/components/text/Subtitle';
import { GlobalContext } from '@/context/GlobalContextProvider';
import useAccount from '@/hooks/useAccount';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { useContext, useState } from 'react';

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
  const { isLoggedIn } = useAccount();
  const userOwnsThisLeague = user?.id === leagueOwner;

  const [addToFavText, setAddToFavText] = useState(
    'Add this league to favourites'
  );
  const [addToFavColor, setAddToFavColor] = useState('var(--text-muted)');

  const [addToBookmarksText, setAddToBookmarksText] = useState(
    'Bookmark this league'
  );
  const [addToBookmarksColor, setAddToBookmarksColor] =
    useState('var(--text-muted)');

  async function addToFavourites() {
    const response = await fetchAPI(`${API_URL}/users/favourites`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ leagueId: leagueId }),
    });
    if (response.status === 'success') {
      setAddToFavText('Added to favourites!');
      setAddToFavColor('var(--success)');
    } else if (response.status === 'fail') {
      setAddToFavText('Already added to favourites!');
      setAddToFavColor('var(--success)');
    } else {
      setAddToFavText('An error occured');
      setAddToFavColor('var(--danger)');
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
      setAddToBookmarksText('Added to bookmarks!');
      setAddToBookmarksColor('var(--success)');
    } else if (response.status === 'fail') {
      setAddToBookmarksText('Already added to bookmarks!');
      setAddToBookmarksColor('var(--success)');
    } else {
      setAddToBookmarksText('An error occured');
      setAddToBookmarksColor('var(--danger)');
    }
  }

  return (
    <div className="flex flex-col justify-center items-center w-full pt-[100px]">
      <div
        className={`w-[440px] bg-[var(--bg)]  rounded-[10px] border-1 border-solid border-[var(--border)] py-[10px] px-[20px]`}
      >
        {userOwnsThisLeague ? (
          <div className="flex flex-col justify-center">
            <Subtitle
              style={{
                color: 'var(--warning)',
              }}
            >
              Setup incomplete
            </Subtitle>
            <Paragraph
              style={{
                fontSize: '1rem',
                color: 'var(--text-muted)',
              }}
            >
              {leagueName}
            </Paragraph>

            <hr className="text-[var(--text-muted)] my-[0.75rem]" />

            <Paragraph
              style={{
                fontSize: '1rem',
                color: 'var(--text-muted)',
              }}
            >
              Remaining tasks:
            </Paragraph>
            {property === 'tables' ? (
              <>
                <ol>
                  <li>
                    <Paragraph
                      style={{
                        fontSize: '1rem',
                        color: 'var(--text)',
                      }}
                    >
                      1. Add divisions/tables to your league
                    </Paragraph>
                  </li>
                  <li>
                    <Paragraph
                      style={{
                        fontSize: '1rem',
                        color: 'var(--text-muted)',
                      }}
                    >
                      2. Add teams to the divisions/tables
                    </Paragraph>
                  </li>
                </ol>
                <LinkButton
                  href={`/create-league/${leagueId}/tables`}
                  color="var(--text-muted)"
                  bgHoverColor="var(--accent)"
                  style={{
                    width: '100%',
                    fontSize: '1rem',
                    marginTop: '0.5rem',
                  }}
                >
                  Add tables to league
                </LinkButton>
              </>
            ) : (
              <>
                <ol>
                  <li>
                    <Paragraph
                      style={{
                        fontSize: '1rem',
                        color: 'var(--text-muted)',
                        textDecoration: 'line-through',
                      }}
                    >
                      1. Add divisions/tables to your league
                    </Paragraph>
                  </li>
                  <li>
                    <Paragraph
                      style={{
                        fontSize: '1rem',
                        color: 'var(--text)',
                      }}
                    >
                      2. Add teams to the divisions/tables
                    </Paragraph>
                  </li>
                </ol>
                <LinkButton
                  href={`/create-league/${leagueId}/teams`}
                  color="var(--text-muted)"
                  bgHoverColor="var(--accent)"
                  style={{
                    width: '100%',
                    fontSize: '1rem',
                    marginTop: '0.5rem',
                  }}
                >
                  Add teams to league
                </LinkButton>
              </>
            )}
          </div>
        ) : (
          <>
            <Subtitle style={{ color: 'var(--info)' }}>
              Waiting for final touches
            </Subtitle>
            <Paragraph
              style={{
                fontSize: '1rem',
                color: 'var(--text-muted)',
              }}
            >
              <em>{leagueName} </em>
              still needs to be finished setting up by the league owner. Check
              back later.
            </Paragraph>
            {isLoggedIn && (
              <>
                <hr className="text-[var(--text-muted)] my-[1rem]" />
                <Paragraph
                  style={{
                    fontSize: '1rem',
                    color: 'var(--text-muted)',
                    marginTop: '-0.25rem',
                    marginBottom: '0.25rem',
                  }}
                >
                  In the meantime...
                </Paragraph>
                <div className="flex flex-col w-full gap-1">
                  <Button
                    color={addToFavColor}
                    bgHoverColor="var(--accent)"
                    style={{ width: '100%', fontSize: '1rem' }}
                    onClick={addToFavourites}
                  >
                    {addToFavText}
                  </Button>
                  <Button
                    color={addToBookmarksColor}
                    bgHoverColor="var(--accent)"
                    style={{ width: '100%', fontSize: '1rem' }}
                    onClick={addToBookmarks}
                  >
                    {addToBookmarksText}
                  </Button>
                </div>
              </>
            )}
          </>
        )}

        {/* <Button
        color="var(--danger)"
        bgHoverColor="var(--bg)"
        style={{ fontSize: '1rem', float: 'right' }}
        onClick={() => setError('')}
      >
      Dismiss
      </Button> */}
      </div>
    </div>
  );
}
