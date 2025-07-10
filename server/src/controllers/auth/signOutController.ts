import { NextFunction, Request, Response } from 'express';
import { ErrorHandling } from '../../util/errorChecking';

export function signOutController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    res
      .clearCookie('token', {
        path: '/',
        httpOnly: true,
        // secure: true, // true in production (HTTPS)
        sameSite: 'lax',
      })
      .status(200)
      .json({
        status: 'success',
        data: { message: 'Successfully signed out' },
      });
  } catch (e: any) {
    next(new ErrorHandling(500, undefined, e.message));
  }
}
