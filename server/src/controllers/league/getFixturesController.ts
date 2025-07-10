import { NextFunction, Request, Response } from 'express';
import League from '../../models/leagueModel';
import { IFixtureSchema, ILeagueSchema } from '../../util/definitions';
import { ErrorHandling } from '../../util/errorChecking';

export async function getFixturesController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const leagueId = req.params.id;
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
    let allFixtures = league.fixtures as unknown as IFixtureSchema[];
    allFixtures.reverse();

    let fixturesStillToBePlayed = allFixtures.filter((fixture) => {
      return fixture.matchweek <= league.currentMatchweek;
    });

    if (req.query.limit !== undefined && +req.query.limit > 0) {
      fixturesStillToBePlayed = fixturesStillToBePlayed.slice(
        0,
        +req.query.limit
      );
    }

    res
      .status(200)
      .json({ status: 'success', data: { fixtures: fixturesStillToBePlayed } });
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
