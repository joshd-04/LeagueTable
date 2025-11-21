'use client';
import { GlobalContext } from '@/context/GlobalContextProvider';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { LeagueInterface } from '../dashboard';
import { Card, CardBody, CardHeader } from '@heroui/react';
import { IoPersonSharp, IoWarning } from 'react-icons/io5';
import ProChip from '@/components/chips/ProChip';
import ProPlusChip from '@/components/chips/ProPlusChip';
import {
  MdBookmark,
  MdBookmarkBorder,
  MdFavorite,
  MdFavoriteBorder,
} from 'react-icons/md';
import { motion } from 'motion/react';

interface LeagueCardProps {
  simplifiedLeagues: {
    created: string[];
    favorites: string[];
    following: string[];
  };
  league: LeagueInterface;
  handleClick: (leagueId: string) => void;
  handleFavClick: (leagueId: string, action: 'favorite' | 'unfavorite') => void;
  handleFollowClick: (leagueId: string, action: 'follow' | 'unfollow') => void;
  leagueCategory: 'favorites' | 'created' | 'following';
}

export default function LeagueCard({
  simplifiedLeagues,
  league,
  handleClick,
  handleFavClick,
  handleFollowClick,
  leagueCategory,
}: LeagueCardProps) {
  // const { colorTheme } = useContext(GlobalContext).colorTheme;
  const [isHoveringOuterPanel, setIsHoveringOuterPanel] = useState(false);

  const isFavorited = simplifiedLeagues.favorites.includes(league._id);
  const isFollowing = simplifiedLeagues.following.includes(league._id);

  const { user } = useContext(GlobalContext).account;

  return (
    <Card
      className={`px-[12px] py-[8px]  hover:cursor-pointer hover:bg-content2 ${
        !isHoveringOuterPanel ? 'data-[pressed=true]:scale-100' : ''
      }`}
      onMouseEnter={() => setIsHoveringOuterPanel(true)}
      onMouseLeave={() => setIsHoveringOuterPanel(false)}
      isPressable
      onPress={() => handleClick(league._id)}
      style={{
        background: isHoveringOuterPanel
          ? 'hsl(var(--heroui-content3)/1)'
          : 'hsl(var(--heroui-content1)/1)',
      }}
    >
      <CardHeader className="flex flex-col gap-2">
        <div className="flex flex-row justify-between items-center w-full">
          <div className="flex flex-col justify-baseline items-start">
            <h2 className="text-lg">{league.name}</h2>
            {leagueCategory === 'created' ? (
              <span className="text-sm">
                {league.actions && league.actions.length > 0 ? (
                  <span className="flex flex-row items-center gap-1">
                    <IoWarning className="w-5 h-5 text-warning" />

                    <p className="text-warning">Action required</p>
                  </span>
                ) : (
                  <span className="text-muted">
                    Season {league.currentSeason} matchweek{' '}
                    {league.currentMatchweek}
                  </span>
                )}
              </span>
            ) : (
              <span className="flex flex-row items-center gap-1">
                <IoPersonSharp className="w-4 h-4 text-muted" />
                <p className="text-muted text-sm">
                  {league.owner.name === user?.username
                    ? 'You'
                    : league.owner.name}
                </p>
              </span>
            )}
          </div>
          {league.leagueLevel === 'pro' && <ProChip />}
          {league.leagueLevel === 'pro+' && <ProPlusChip />}
        </div>
      </CardHeader>
      <CardBody className="flex flex-row justify-between items-end w-full transition-all duration-250">
        <div className="flex flex-col w-full justify-start items-start">
          {leagueCategory !== 'created' && (
            <p className=" text-sm">
              {league.actions && league.actions.length > 0 ? (
                <span className="text-warning">action required</span>
              ) : (
                <span className="text-muted">
                  Season {league.currentSeason} matchweek{' '}
                  {league.currentMatchweek}
                </span>
              )}
            </p>
          )}

          {!league.actions?.includes('tables') && (
            <p className="text-muted text-sm">
              {league.numDivisions} division
              {league.numDivisions > 1 ? 's' : ''}
            </p>
          )}
          {!league.actions?.includes('tables') &&
            !league.actions?.includes('teams') && (
              <p className="text-muted text-sm">{league.numTeams} teams</p>
            )}
        </div>
        <div className="flex flex-row">
          <FavoriteIcon
            leagueId={league._id}
            isFavorited={isFavorited}
            handleFavClick={handleFavClick}
            setIsHoveringOuterPanel={setIsHoveringOuterPanel}
          />
          {league.owner.name !== user?.username && (
            <FollowIcon
              leagueId={league._id}
              isFollowing={isFollowing}
              handleFollowClick={handleFollowClick}
              setIsHoveringOuterPanel={setIsHoveringOuterPanel}
            />
          )}
        </div>
      </CardBody>
    </Card>
  );
}

function FavoriteIcon({
  leagueId,
  isFavorited,
  handleFavClick,
  setIsHoveringOuterPanel,
}: {
  leagueId: string;
  isFavorited: boolean;
  handleFavClick: (leagueId: string, action: 'favorite' | 'unfavorite') => void;
  setIsHoveringOuterPanel: Dispatch<SetStateAction<boolean>>;
}) {
  const [isHoveringFav, setIsHoveringFav] = useState(false);

  return (
    <motion.span
      className="hover:bg-content3 p-2 rounded-xl w-max transition-all duration-250"
      onHoverStart={() => {
        setIsHoveringFav(true);
        setIsHoveringOuterPanel(false);
      }}
      onHoverEnd={() => {
        setIsHoveringFav(false);
        setIsHoveringOuterPanel(true);
      }}
      whileTap={{ scale: 0.96 }}
      onClick={(e) => {
        e.stopPropagation();
        const action = isFavorited ? 'unfavorite' : 'favorite';
        handleFavClick(leagueId, action);
      }}
    >
      {' '}
      {isFavorited ? (
        <MdFavorite className="w-6 h-6 text-[var(--favorite)] transition-none" />
      ) : (
        <MdFavoriteBorder
          className={`w-6 h-6 text-[var(--favorite)] transition-none  ${
            isHoveringFav
              ? 'text-[var(--favorite)]'
              : 'text-muted text-foreground'
          }`}
        />
      )}
    </motion.span>
  );
}

function FollowIcon({
  leagueId,
  isFollowing,
  handleFollowClick,
  setIsHoveringOuterPanel,
}: {
  leagueId: string;
  isFollowing: boolean;
  handleFollowClick: (leagueId: string, action: 'follow' | 'unfollow') => void;
  setIsHoveringOuterPanel: Dispatch<SetStateAction<boolean>>;
}) {
  const [isHoveringFollow, setIsHoveringFollow] = useState(false);

  return (
    <motion.span
      className="hover:bg-content3 p-2 rounded-xl w-max transition-all duration-250"
      onHoverStart={() => {
        setIsHoveringFollow(true);
        setIsHoveringOuterPanel(false);
      }}
      onHoverEnd={() => {
        setIsHoveringFollow(false);
        setIsHoveringOuterPanel(true);
      }}
      whileTap={{ scale: 0.96 }}
      onClick={(e) => {
        e.stopPropagation();
        const action = isFollowing ? 'unfollow' : 'follow';
        handleFollowClick(leagueId, action);
      }}
    >
      {isFollowing ? (
        <MdBookmark className="w-6 h-6 text-primary transition-none" />
      ) : (
        <MdBookmarkBorder
          className={`w-6 h-6 transition-none  ${
            isHoveringFollow ? 'text-primary' : 'text-muted text-foreground'
          }`}
        />
      )}
    </motion.span>
  );
}
