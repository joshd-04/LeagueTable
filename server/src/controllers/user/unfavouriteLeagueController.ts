import { Request, Response, NextFunction } from 'express';
import User from '../../models/userModel';
import { ErrorHandling } from '../../util/errorChecking';
import { Types } from 'mongoose';

export async function unfavouriteLeagueController(
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

    // Check if league is currently favourited
    const currentlyFavourited = await User.exists({
      _id: userId,
      favouriteLeagues: leagueId,
    });
    if (!currentlyFavourited) {
      next(
        new ErrorHandling(404, {
          message: 'This league is not in your favourites list',
        })
      );
      return;
    }

    await User.findByIdAndUpdate(userId, {
      $pull: { favouriteLeagues: leagueId },
    });
  } catch (e: any) {
    next(
      new ErrorHandling(
        500,
        undefined,
        `Error whilst removing league from favourites list ${e.message}`
      )
    );
    return;
  }
  res.status(200).json({
    status: 'success',
    data: { message: 'Sucessfully removed league from favourites' },
  });
}
