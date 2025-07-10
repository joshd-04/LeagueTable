import { NextFunction, Request, Response } from 'express';
import League from '../../models/leagueModel';
import { ErrorHandling } from '../../util/errorChecking';

// Check if teams or tables have been added or not. if not, then set a flag so the client knows.
export async function leagueFetcherController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const leagueId = req.params.id;
    if (leagueId.length === 0) {
      return next(
        new ErrorHandling(400, { message: `League ID must be provided` })
      );
    }
    let league;
    try {
      // Make sure the league has tables
      try {
        league = await League.findById(leagueId);
      } catch (error) {
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
      if (!league.setup.tablesAdded) {
        return next(
          new ErrorHandling(403, {
            league: league.toObject(),
            message: 'You must add tables to this league first.',
            property: 'tables',
          })
        );
      }
      if (!league.setup.teamsAdded) {
        return next(
          new ErrorHandling(403, {
            league: league.toObject(),
            message: 'You must add teams to this league first.',
            property: 'teams',
          })
        );
      }
      league = await League.findById(leagueId).populate([
        { path: 'tables.teams' },
        { path: 'leagueOwner' },
        {
          path: 'fixtures',
          populate: [{ path: 'homeTeamDetails' }, { path: 'awayTeamDetails' }],
        },
      ]);
    } catch (error) {
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

    res.status(200).json({
      status: 'success',
      data: {
        league: league.toObject(),
      },
    });
  } catch (e: any) {
    next(new ErrorHandling(500, undefined, `Unexpected error ${e.message}`));
  }
}
