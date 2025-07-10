import { NextFunction, Request, Response } from 'express';
import {
  ILeagueSchema,
  IUserSchema,
} from '../../util/definitions';
import { ErrorHandling } from '../../util/errorChecking';
import User from '../../models/userModel';

export async function myAssociatedLeaguesFetcherController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  /* Args: none
    Returns: list of league ids and minimal league info
  */
  const userId: string = req.body.userId;
  // For now, there is no favouriting or bookmarking functionality.
  // So just return the user's created leagues

  try {
    const user = await User.findById(userId).populate([
      {
        path: 'leaguesCreated',
      },
      {
        path: 'favouriteLeagues',
        populate: { path: 'leagueOwner' },
      },
      {
        path: 'followedLeagues',
        populate: { path: 'leagueOwner' },
      },
    ]);

    if (!user) {
      return next(
        new ErrorHandling(404, {
          message: `User with ID '${userId}' not found`,
        })
      );
    }

    const createdLeagues: ILeagueSchema[] = user.leaguesCreated;
    const favouriteLeagues: ILeagueSchema[] = user.favouriteLeagues;
    const followedLeagues: ILeagueSchema[] = user.followedLeagues;

    const filteredCreatedLeagues = createdLeagues.map((league) => {
      const actions: string[] = [];
      if (!league.setup.tablesAdded) actions.push('tables');
      if (!league.setup.teamsAdded) actions.push('teams');
      if (league.setup.leagueFinished) actions.push('finished');
      return {
        _id: league._id,
        name: league.name,
        currentSeason: league.currentSeason,
        currentMatchweek: league.currentMatchweek,
        numDivisions: league.tables.length,
        numTeams: league.tables.reduce(
          (acc, table) => acc + table.numberOfTeams,
          0
        ),
        owner: {
          name: 'You',
          _id: user._id,
          accountType: user.accountType,
        },
        actions: actions,
      };
    });

    const filteredFavouriteLeagues = favouriteLeagues.map((league) => {
      // @ts-ignore
      const leagueOwner: IUserSchema = league.leagueOwner;
      return {
        _id: league._id,
        name: league.name,
        currentSeason: league.currentSeason,
        currentMatchweek: league.currentMatchweek,
        numDivisions: league.tables.length,
        numTeams: league.tables.reduce(
          (acc, table) => acc + table.numberOfTeams,
          0
        ),
        owner: {
          name: leagueOwner.username,
          _id: leagueOwner._id,
          accountType: leagueOwner.accountType,
        },
      };
    });
    const filteredFollowedLeagues = followedLeagues.map((league) => {
      // @ts-ignore
      const leagueOwner: IUserSchema = league.leagueOwner;
      return {
        _id: league._id,
        name: league.name,
        currentSeason: league.currentSeason,
        currentMatchweek: league.currentMatchweek,
        numDivisions: league.tables.length,
        numTeams: league.tables.reduce(
          (acc, table) => acc + table.numberOfTeams,
          0
        ),
        owner: {
          name: leagueOwner.username,
          _id: leagueOwner._id,
          accountType: leagueOwner.accountType,
        },
      };
    });

    res.status(200).json({
      status: 'success',
      data: {
        created: filteredCreatedLeagues,
        favourites: filteredFavouriteLeagues,
        following: filteredFollowedLeagues,
      },
    });
  } catch (e: any) {
    next(new ErrorHandling(500, undefined, `Unexpected error ${e.message}`));
  }
}
