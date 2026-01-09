import { NextFunction, Request, Response } from 'express';
import League from '../../models/leagueModel';
import {
  IFixtureSchema,
  ILeagueSchema,
  IResultSchema,
  IUserSchema,
} from '../../util/definitions';
import { ErrorHandling } from '../../util/errorChecking';
import { meetsMinimumTierLevel } from '../../util/helpers';

interface statsInterface {
  favoritesCount?: number;
  followersCount?: number;
  totalViews: number;
  viewsThisWeek?: number;
}

export async function getEngagementStats(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    /* 
      query parameters:
      
      - season: number (if not provided, just give the most recent season). if league is free level, then return error
    */
    const leagueId = req.params.id;
    let league: ILeagueSchema | null;

    // Check if league exists
    try {
      league = await League.findById(leagueId).populate([
        { path: 'leagueOwner' },
      ]);
    } catch {
      return next(
        new ErrorHandling(404, {
          message: `League with ID '${leagueId}' not found`,
        })
      );
    }

    if (!league) {
      return next(
        new ErrorHandling(404, {
          message: `League with ID '${leagueId}' not found`,
        })
      );
    }
    const accountType = (league.leagueOwner as unknown as IUserSchema)
      .accountType;
    console.log(accountType);

    let stats: statsInterface = {
      totalViews: league.engagement.totalViews,
    };
    if (meetsMinimumTierLevel('pro', accountType)) {
      stats = {
        totalViews: league.engagement.totalViews,
        viewsThisWeek: league.engagement.viewsThisWeek,
        favoritesCount: league.engagement.favoritesCount,
        followersCount: league.engagement.followersCount,
      };
    }

    res.status(200).json({
      status: 'success',
      data: { engagementStats: stats },
    });
  } catch (e: any) {
    console.error(e);
    return next(
      new ErrorHandling(
        500,
        undefined,
        `There was an error calculating the season summary statistics. ${e.message}`
      )
    );
  }
}
