import { NextFunction, Request, Response } from 'express';
import League from '../../models/leagueModel';
import {
  IFixtureSchema,
  ILeagueSchema,
  IResultSchema,
} from '../../util/definitions';
import { ErrorHandling } from '../../util/errorChecking';

export async function getResultByIdController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const leagueId = req.params.leagueId;
    const resultId = req.params.resultId;

    let league: ILeagueSchema | null;

    // Check if league exists
    try {
      league = await League.findById(leagueId).populate({ path: 'results' });
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
    const allResults = league.results as unknown as IResultSchema[];
    const result = allResults.find((f) => f.id === resultId);

    if (result === undefined) {
      return next(
        new ErrorHandling(404, {
          message: `Result with ID '${resultId}' not found`,
        })
      );
    }

    res.status(200).json({ status: 'success', data: { result: result } });
  } catch (e: any) {
    console.error(e);
    return next(
      new ErrorHandling(
        500,
        undefined,
        `There was an error fetching the fixtures that are still to be played. ${e.message}`
      )
    );
  }
}
