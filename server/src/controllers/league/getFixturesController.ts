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
    /* 
      query parameters:
      - limit: number (controls the number of results to return) [default: returns all results]
      - all: boolean (if true, all fixtures in the season will be returned, otherwise just the fixtures to that matchweek) [default: false]
      - reverse: boolean (if true, the highest matchweek games are returned first, otherwise md1 returned first then md2 etc) [default: false]
      - season: [not implemented yet]
    */
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
    let fixtures = league.fixtures as unknown as IFixtureSchema[];
    if (Boolean(req.query.reverse) === true) {
      fixtures.reverse();
    }

    if (Boolean(req.query.all) === true) {
      // do nothing
    } else {
      // If user does not specify they want all fixtures, then just return the fixtures up until the current matchweek
      fixtures = fixtures.filter((fixture) => {
        return fixture.matchweek <= league.currentMatchweek;
      });
    }

    const totalFixtures = fixtures.length;
    if (req.query.limit !== undefined && +req.query.limit > 0) {
      fixtures = fixtures.slice(0, +req.query.limit);
    }

    res.status(200).json({
      status: 'success',
      data: {
        totalFixtures: totalFixtures,
        fixturesReturned: req.query.limit ? +req.query.limit : totalFixtures,
        fixtures: fixtures,
      },
    });
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
