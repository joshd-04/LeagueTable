import { NextFunction, Request, Response } from 'express';
import League from '../../../models/leagueModel';
import {
  IFixtureSchema,
  ILeagueSchema,
  ITeamsSchema,
} from '../../../util/definitions';
import { ErrorHandling } from '../../../util/errorChecking';
import {
  calculateTeamDetails,
  findLeaguePosition,
} from '../../../util/helpers';

export async function getFixtureByIdController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const leagueId = req.params.leagueId;
    const fixtureId = req.params.fixtureId;

    let league: ILeagueSchema | null;

    // Check if league exists
    try {
      league = await League.findById(leagueId)
        .populate({ path: 'tables.teams' })
        .populate({
          path: 'fixtures',
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
    const fixture = allFixtures.find((f) => f._id.equals(fixtureId));

    if (fixture === undefined) {
      return next(
        new ErrorHandling(404, {
          message: `Fixture with ID '${fixtureId}' not found`,
        }),
      );
    }

    // let homeDetails = isTeam(fixture.homeTeamDetails)
    //   ? fixture.homeTeamDetails
    //   : null;
    // let awayDetails = isTeam(fixture.awayTeamDetails)
    //   ? fixture.awayTeamDetails
    //   : null;

    let homeDetails = await calculateTeamDetails(
      league,
      fixture.homeTeamId,
      fixture.season,
      fixture.matchweek,
    );
    let awayDetails = await calculateTeamDetails(
      league,
      fixture.awayTeamId,
      fixture.season,
      fixture.matchweek,
    );

    if (homeDetails === null || awayDetails === null) {
      return next(
        new ErrorHandling(
          500,
          undefined,
          'There was a serverside error checking if homedetails are ITeamsSchema in getfixturebyidcontroller',
        ),
      );
    }

    // homeDetails = {
    //   ...homeDetails,
    //   position: homeTeamPosition,
    // } as ITeamsSchema;
    // awayDetails = {
    //   ...awayDetails,
    //   position: awayTeamPosition,
    // } as ITeamsSchema;

    res.status(200).json({
      status: 'success',
      data: {
        fixture: fixture,
        homeDetails: homeDetails,
        awayDetails: awayDetails,
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
