import { NextFunction, Request, Response } from 'express';
import League from '../../models/leagueModel';
import {
  IFixtureSchema,
  ILeagueSchema,
  ITeamsSchema,
} from '../../util/definitions';
import { ErrorHandling } from '../../util/errorChecking';
import { findLeaguePosition, isTeam, sortTeams } from '../../util/helpers';

export async function setAnnouncementController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const leagueId = req.params.id;
    console.log(leagueId);

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

    if (!league.leagueOwner._id.equals(req.body.userId)) {
      return next(
        new ErrorHandling(403, {
          message: `You cannot edit this league`,
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

    const announcementText = req.body.text;
    const announcementDate = Date.now();

    try {
      await League.findByIdAndUpdate(leagueId, {
        $set: {
          'announcement.text': announcementText,
          'announcement.date': announcementDate,
        },
      });
    } catch {
      return next(
        new ErrorHandling(500, undefined, 'Error whilst updating announcement.')
      );
    }

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
        `There was an error fetching the fixtures that are still to be played. ${e.message}`
      )
    );
  }
}
