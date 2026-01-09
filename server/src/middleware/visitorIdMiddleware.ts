import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';

export function visitorIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const existing = req.cookies?.visitor_id;

  if (!existing) {
    const visitorId = randomUUID();

    res.cookie('visitor_id', visitorId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'PRODUCTION',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    req.visitorId = visitorId;
  } else {
    req.visitorId = existing;
  }

  next();
}
