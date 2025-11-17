import { NextFunction, Request, Response } from 'express';
import League from '../../models/leagueModel';
import {
  IFixtureSchema,
  ILeagueSchema,
  ITeamsSchema,
  IUserSchema,
} from '../../util/definitions';
import { ErrorHandling } from '../../util/errorChecking';
import { findLeaguePosition, isTeam, sortTeams } from '../../util/helpers';
import User from '../../models/userModel';

export async function getAnnouncementController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const leagueId = req.params.id;

    let league: ILeagueSchema | null;

    // Check if league exists
    try {
      league = await League.findById(leagueId);
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

    if (league.leagueLevel === 'free') {
      return next(
        new ErrorHandling(403, {
          message: `Upgrade to standard level to unlock announcements.`,
        })
      );
    }

    let leagueOwner: IUserSchema | null;

    try {
      leagueOwner = await User.findById(league.leagueOwner, 'accountType -_id');
    } catch {
      return next(
        new ErrorHandling(404, {
          message: `League owner account not found.`,
        })
      );
    }

    if (!leagueOwner) {
      return next(
        new ErrorHandling(404, {
          message: `League owner account not found.`,
        })
      );
    }
    const { accountType } = leagueOwner;

    if (!['pro', 'pro+'].includes(accountType)) {
      res.status(200).json({
        status: 'success',
        data: {
          announcement: {
            text: '',
            date: null,
          },
        },
      });
      return;
    }

    const announcementText = league.announcement?.text || '';
    const announcementDate = league.announcement?.date || null;

    res.status(200).json({
      status: 'success',
      data: {
        announcement: {
          text: announcementText,
          date: announcementDate || null,
        },
      },
    });
  } catch (e: any) {
    console.error(e);
    return next(
      new ErrorHandling(
        500,
        undefined,
        `There was an error fetching the announcement ${e.message}`
      )
    );
  }
}
