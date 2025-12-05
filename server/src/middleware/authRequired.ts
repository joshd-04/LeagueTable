import { NextFunction, Request, Response } from 'express';
import { ErrorHandling } from '../util/errorChecking';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.user?._id) {
    next(
      new ErrorHandling(401, {
        message: 'Not authenticated. Please log in.',
      })
    );
    return;
  }
  next();
}
