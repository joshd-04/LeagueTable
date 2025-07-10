import { NextFunction, Request, Response } from 'express';
import League from '../../models/leagueModel';
import { IFixtureSchema, ILeagueSchema } from '../../util/definitions';
import { ErrorHandling } from '../../util/errorChecking';

export async function startNextMatchweek(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId: string = req.body.userId;
    // Make sure the user owns the specified league
    const leagueId = req.params.id;
    let league: ILeagueSchema | null;

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

    if (userId !== league.leagueOwner.toString()) {
      return next(
        new ErrorHandling(403, {
          message: `You are not permitted to make edits to this league`,
        })
      );
    }

    const maximumMatchweek =
      league.tables.reduce(
        (prev, table) => Math.max(table.numberOfTeams, prev),
        0
      ) *
        2 -
      2;

    if (league.currentMatchweek >= maximumMatchweek) {
      return next(
        new ErrorHandling(403, {
          message: `The season is over. Start a new one to continue.`,
        })
      );
    }

    if (league.currentSeason === 0) {
      return next(
        new ErrorHandling(403, {
          message: `The season has not started, start the season before continuing.`,
        })
      );
    }

    league.currentMatchweek += 1;

    const allFixtures = league.fixtures as unknown as IFixtureSchema[];

    const fixturesNowLeft = allFixtures.filter(
      (fixture) => fixture.matchweek <= league.currentMatchweek
    );

    await League.findByIdAndUpdate(leagueId, {
      currentMatchweek: league.currentMatchweek,
    });

    res
      .status(200)
      .json({ status: 'success', data: { fixtures: fixturesNowLeft } });
  } catch (e: any) {
    console.error(e);
    return next(
      new ErrorHandling(
        500,
        undefined,
        `There was an error starting the next matchweek. ${e.message}`
      )
    );
  }
}
