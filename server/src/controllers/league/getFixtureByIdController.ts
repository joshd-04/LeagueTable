import { NextFunction, Request, Response } from 'express';
import League from '../../models/leagueModel';
import { IFixtureSchema, ILeagueSchema } from '../../util/definitions';
import { ErrorHandling } from '../../util/errorChecking';

export async function getFixtureByIdController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const leagueId = req.params.leagueId;
    const fixtureId = req.params.fixtureId;

    let league: ILeagueSchema | null;

    // Check if league exists
    try {
      league = await League.findById(leagueId).populate({
        path: 'fixtures',
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
    const allFixtures = league.fixtures as unknown as IFixtureSchema[];
    const fixture = allFixtures.find((f) => f.id === fixtureId);

    if (fixture === undefined) {
      return next(
        new ErrorHandling(404, {
          message: `Fixture with ID '${fixtureId}' not found`,
        })
      );
    }

    res.status(200).json({ status: 'success', data: { fixture: fixture } });
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
