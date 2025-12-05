import { NextFunction, Request, Response } from 'express';

export default function sessionAbsoluteExpirationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (
    req.session &&
    req.session.createdAt &&
    req.session.absoluteSessionAgeLimit
  ) {
    const now = Date.now();
    if (now - req.session.createdAt > req.session.absoluteSessionAgeLimit) {
      // Absolute limit exceeded → destroy session
      req.session.destroy((err) => {
        if (err) return next(err);
        res.clearCookie('leaguex.sid');
        return res
          .status(440)
          .json({ message: 'Session expired (absolute limit)' });
      });
      return;
    }
  }
  next();
}
