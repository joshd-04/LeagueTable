import { Request, Response, NextFunction } from 'express';
import User from '../../models/userModel';
import { ErrorHandling } from '../../util/errorChecking';
import { Types } from 'mongoose';
import League from '../../models/leagueModel';

export async function favouriteLeagueController(
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
    // Check if league is currently favourited
    const currentlyFavourited = await User.exists({
      _id: userId,
      favouriteLeagues: leagueId,
    });
    if (currentlyFavourited) {
      next(
        new ErrorHandling(400, {
          message: 'This league is already favourited',
        })
      );
      return;
    }

    // Add league to favourites
    await User.findByIdAndUpdate(userId, {
      $push: { favouriteLeagues: leagueId },
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
    data: { message: 'Sucessfully added league to favourites' },
  });
}
