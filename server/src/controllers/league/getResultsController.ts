import { NextFunction, Request, Response } from 'express';
import League from '../../models/leagueModel';
import {
  IFixtureSchema,
  ILeagueSchema,
  IResultSchema,
} from '../../util/definitions';
import { ErrorHandling } from '../../util/errorChecking';

export async function getResultsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const leagueId = req.params.id;
    let league: ILeagueSchema | null;

    const sort = req.query.sort;

    // Check if league exists
    try {
      league = await League.findById(leagueId).populate({
        path: 'results',
        populate: [{ path: 'homeTeamDetails' }, { path: 'awayTeamDetails' }],
      });
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
    let allResults = league.results as unknown as IResultSchema[];
    if (sort === 'matchweek') {
      allResults.sort((a, b) => b.matchweek - a.matchweek);
    } else {
      // sort by date
      allResults.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }

    if (req.query.limit !== undefined && +req.query.limit > 0) {
      allResults = allResults.slice(0, +req.query.limit);
    }

    res.status(200).json({ status: 'success', data: { results: allResults } });
  } catch (e: any) {
    console.error(e);
    return next(
      new ErrorHandling(
        500,
        undefined,
        `There was an error fetching the results. ${e.message}`
      )
    );
  }
}
