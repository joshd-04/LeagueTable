import { NextFunction, Request, Response } from 'express';
import User from '../../models/userModel';
import { ErrorHandling } from '../../util/errorChecking';
import { IUserSchema } from '../../util/definitions';

export async function getMyAccountController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.body.userId;
    const user: IUserSchema | null = await User.findById(userId);

    if (!user) {
      next(new ErrorHandling(404, { message: "User doesn't exist" }));
      return;
    }
    res.status(200).json({
      status: 'success',
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        accountType: user.accountType,
      },
    });
  } catch (e: any) {
    next(new ErrorHandling(500, undefined, e.message));
  }
}
