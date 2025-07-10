import { Request, Response, NextFunction } from 'express';
import User from '../../models/userModel';
import { ErrorHandling } from '../../util/errorChecking';
import { Types } from 'mongoose';
import League from '../../models/leagueModel';

export async function followLeagueController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.body.userId;
  const { leagueId } = req.body;
  try {
    // Check if leagueId passed, is in valid format
    const validObjectId = Types.ObjectId.isValid(leagueId);
    if (!validObjectId) {
      next(
        new ErrorHandling(400, {
          message: 'Invalid ID provided',
        })
      );
      return;
    }
    // Make sure the league exists (objectids can be valid even if they dont exist)
    const league = await League.findById(leagueId);
    if (!league) {
      next(
        new ErrorHandling(404, {
          message: 'League with provided ID not found',
        })
      );
      return;
    }
    // Make sure the user does not own this league. Users cannot follow their own leagues

    if (league.leagueOwner.toString() === userId) {
      next(
        new ErrorHandling(403, {
          message: 'League owners cannot follow their own league',
        })
      );
      return;
    }

    // Check if league is currently followed
    const currentlyFollowing = await User.exists({
      _id: userId,
      followedLeagues: leagueId,
    });
    if (currentlyFollowing) {
      next(
        new ErrorHandling(400, {
          message: 'You already follow this league',
        })
      );
      return;
    }

    // Add league to following
    await User.findByIdAndUpdate(userId, {
      $push: { followedLeagues: leagueId },
    });
  } catch (e: any) {
    next(
      new ErrorHandling(
        500,
        undefined,
        'Error whilst adding to favourite leagues list'
      )
    );
    return;
  }
  res.status(200).json({
    status: 'success',
    data: { message: 'Sucessfully added league to following' },
  });
}
