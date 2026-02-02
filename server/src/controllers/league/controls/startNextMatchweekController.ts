import { NextFunction, Request, Response } from 'express';
import League from '../../../models/leagueModel';
import {
  AccountTypeInterface,
  IFixtureSchema,
  ILeagueSchema,
  IUserSchema,
} from '../../../util/definitions';
import { ErrorHandling } from '../../../util/errorChecking';
import { meetsMinimumTierLevel } from '../../../util/helpers';

export async function startNextMatchweek(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.session.user?._id;
    // Make sure the user owns the specified league
    const leagueId = req.params.id;
    let league: ILeagueSchema | null;

    try {
      // league = await League.findById(leagueId).populate({
      //   path: 'fixtures',
      //   populate: [{ path: 'homeTeamDetails' }, { path: 'awayTeamDetails' }],
      //   path: 'leagueOwner',
      // });
      league = await League.findById(leagueId).populate([
        {
          path: 'fixtures',
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

    if (userId !== league.leagueOwner._id.toString()) {
      return next(
        new ErrorHandling(403, {
          message: `You are not permitted to make edits to this league`,
        })
      );
    }

    // Based on the league type (basic/advanced), restrict access if the owner doesnt have correct account level
    const leagueOwner = league.leagueOwner as unknown as IUserSchema;

    let requiredLevel: AccountTypeInterface = 'pro+';
    switch (league.leagueType) {
      case 'basic':
        requiredLevel = 'free';
        break;
      case 'advanced':
        requiredLevel = 'pro';
        break;
      default:
        requiredLevel = 'pro+';
        break;
    }
    const isValid = meetsMinimumTierLevel(
      requiredLevel,
      leagueOwner.accountType
    );
    if (!isValid) {
      switch (requiredLevel) {
        case 'free':
          return next(
            new ErrorHandling(403, {
              message: `You can manage this league with a free account. If you are seeing this error, something went wrong.`,
            })
          );
        case 'pro':
          return next(
            new ErrorHandling(403, {
              message: `Pro required to manage this league. Renew your subscription to continue.`,
            })
          );
        case 'pro+':
          return next(
            new ErrorHandling(403, {
              message: `Pro+ required to manage this league. Renew your subscription to continue.`,
            })
          );
        default:
          return next(
            new ErrorHandling(403, {
              message: `We could not verify your account subscription tier.`,
            })
          );
      }
    }

    if (league.currentMatchweek >= league.finalMatchweek) {
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
