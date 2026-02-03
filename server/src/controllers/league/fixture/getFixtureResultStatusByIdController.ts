import { NextFunction, Request, Response } from 'express';
import League from '../../../models/leagueModel';
import {
  IFixtureSchema,
  ILeagueSchema,
  IResultSchema,
} from '../../../util/definitions';
import { ErrorHandling } from '../../../util/errorChecking';

export async function getFixtureResultStatusByIdController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const leagueId = req.params.leagueId;
    const matchId = req.params.matchId;

    let league: ILeagueSchema | null;

    // Check if league exists
    try {
      league = await League.findById(leagueId)
        .populate({ path: 'tables.teams' })
        .populate({
          path: 'fixtures',
        })
        .populate({
          path: 'results',
        });
    } catch {
      return next(
        new ErrorHandling(404, {
          message: `League with ID '${leagueId}' not found`,
        }),
      );
    }

    if (!league) {
      return next(
        new ErrorHandling(404, {
          message: `League with ID '${leagueId}' not found`,
        }),
      );
    }
    const allFixtures = league.fixtures as unknown as IFixtureSchema[];
    const fixture = allFixtures.find((f) => f.id === matchId);

    const allResults = league.results as unknown as IResultSchema[];
    const result = allResults.find((f) => f.id === matchId);

    let outcome: 'result' | 'fixture' | null = null;

    if (fixture !== undefined) {
      outcome = 'fixture';
    } else if (result !== undefined) {
      outcome = 'result';
    }
    if ((fixture === undefined && result === undefined) || outcome === null) {
      return next(
        new ErrorHandling(404, {
          message: `Fixture or result with ID '${matchId}' not found`,
        }),
      );
    }

    res.status(200).json({
      status: 'success',
      data: {
        isFixture: outcome === 'fixture',
        isResult: outcome === 'result',
      },
    });
  } catch (e: any) {
    console.error(e);
    return next(
      new ErrorHandling(
        500,
        undefined,
        `There was an error fetching the fixture. ${e.message}`,
      ),
    );
  }
}
