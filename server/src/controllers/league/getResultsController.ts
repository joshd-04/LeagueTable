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
    /* 
      query parameters:
      - limit: number (controls the number of results to return) [default: returns all results]
      - sort: 'matchweek' | anything else  [default: sorts by date of result (most recent first)]
      
      - season: [not implemented yet]
    */
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
    // only keep the results for this season. remove previous season results
    allResults = allResults.filter(
      (result) => result.season === league.currentSeason
    );

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
