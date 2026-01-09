import { Request, Response, NextFunction } from 'express';
import User from '../../models/userModel';
import { ErrorHandling } from '../../util/errorChecking';
import { Types } from 'mongoose';
import League from '../../models/leagueModel';

export async function unfollowLeagueController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.session.user?._id;
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

    // Check if league is currently followed
    const currentlyFollowing = await User.exists({
      _id: userId,
      followedLeagues: leagueId,
    });
    if (!currentlyFollowing) {
      next(
        new ErrorHandling(404, {
          message: 'You are not following this league',
        })
      );
      return;
    }

    await User.findByIdAndUpdate(userId, {
      $pull: { followedLeagues: leagueId },
    });

    // Decrement league followers count
    await League.findByIdAndUpdate(leagueId, [
      {
        $set: {
          'engagement.followersCount': {
            $max: [{ $subtract: ['$engagement.followersCount', 1] }, 0],
          },
        },
      },
    ]);
  } catch (e: any) {
    next(
      new ErrorHandling(
        500,
        undefined,
        `Error whilst removing league from following list ${e.message}`
      )
    );
    return;
  }
  res.status(200).json({
    status: 'success',
    data: { message: 'You have successfully unfollowed this league.' },
  });
}
