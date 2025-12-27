import { NextFunction, Request, Response } from 'express';
import League from '../../models/leagueModel';
import {
  IFixtureSchema,
  ILeagueSchema,
  IResultSchema,
  ITeamsSchema,
  IUserSchema,
} from '../../util/definitions';
import { ErrorHandling } from '../../util/errorChecking';
import { meetsMinimumTierLevel, sortTeams } from '../../util/helpers';

interface statsInterface {
  goalsScored: number;
  cleansheets: number;
  ownGoals?: number;
  hattricks?: number;
  soloGoals?: number;
}

export async function getHeadToHeadController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const leagueId = req.params.id;
    let league: ILeagueSchema | null;
    const teamAName = req.params.teamA;
    const teamBName = req.params.teamB;

    // Check if league exists
    try {
      league = await League.findById(leagueId).populate([
        {
          path: 'results',
          populate: [{ path: 'homeTeamDetails' }, { path: 'awayTeamDetails' }],
        },
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
    if (!meetsMinimumTierLevel('pro', accountType)) {
      return next(
        new ErrorHandling(403, {
          message: `Upgrade to account to pro to unlock head-to-head history`,
        })
      );
    }

    // this endpoint assumes team names are unique
    const allResults = league.results as unknown as IResultSchema[];
    const lastFiveResults = allResults
      .filter((result) => {
        return (
          (result.homeTeamDetails.name === teamAName &&
            result.awayTeamDetails.name === teamBName) ||
          (result.homeTeamDetails.name === teamBName &&
            result.awayTeamDetails.name === teamAName)
        );
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    res
      .status(200)
      .json({ status: 'success', data: { lastFiveResults: lastFiveResults } });
  } catch (e: any) {
    console.error(e);
    return next(
      new ErrorHandling(
        500,
        undefined,
        `There was an error getting the head to head. ${e.message}`
      )
    );
  }
}
