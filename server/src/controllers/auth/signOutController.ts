import { NextFunction, Request, Response } from 'express';
import { ErrorHandling } from '../../util/errorChecking';

export function signOutController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    req.session.destroy(() => {
      res.clearCookie('leaguex.sid');
      res.json({
        status: 'success',
        data: { message: 'Successfully signed out' },
      });
    });
  } catch (e: any) {
    next(new ErrorHandling(500, undefined, e.message));
  }
}
