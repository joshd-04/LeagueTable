import { Request, Response, NextFunction } from 'express';
import User from '../../models/userModel';
import { ErrorHandling } from '../../util/errorChecking';
import { Types } from 'mongoose';
import League from '../../models/leagueModel';

export async function favoriteLeagueController(
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
    // Check if league is currently favorited
    const currentlyFavorited = await User.exists({
      _id: userId,
      favoriteLeagues: leagueId,
    });
    if (currentlyFavorited) {
      next(
        new ErrorHandling(400, {
          message: 'This league is already favorited',
        })
      );
      return;
    }

    // Add league to favorites
    await User.findByIdAndUpdate(userId, {
      $push: { favoriteLeagues: leagueId },
    });
  } catch (e: any) {
    next(
      new ErrorHandling(
        500,
        undefined,
        'Error whilst adding to favorite leagues list'
      )
    );
    return;
  }
  res.status(200).json({
    status: 'success',
    data: { message: 'Sucessfully added league to favorites' },
  });
}
