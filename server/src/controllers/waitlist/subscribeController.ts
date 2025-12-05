import { NextFunction, Request, Response } from 'express';
import { ErrorHandling } from '../../util/errorChecking';
import { isEmail } from 'validator';
import Waitlist from '../../models/waitlistModel';

export async function subscribeController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  /*  Args: email
      Returns: 
      
      Data flow:

      - 

  */
  try {
    const { email }: { email: string } = req.body;
    // Username should be given. Or email should be given. Not neither. Not both.
    if (email.length === 0 || !email) {
      next(
        new ErrorHandling(400, {
          email: 'Email is required in body.',
        })
      );
      return;
    }

    const isEmailFormat = isEmail(email);
    if (!isEmailFormat) {
      next(
        new ErrorHandling(400, {
          email: 'Invalid email provided.',
        })
      );
      return;
    }

    const subscription = await Waitlist.findOne({ email: email });

    // If subscription already exists and user already subscribed
    if (subscription !== null && subscription.status === 'subscribed') {
      next(new ErrorHandling(403, { email: 'Already subscribed' }));
      return;
    }

    // If user wants to re-subscribe
    else if (subscription !== null && subscription.status === 'unsubscribed') {
      const entry = await Waitlist.findOneAndUpdate(
        { email: email.toLowerCase() },
        { $set: { unsubscribedAt: null, updatedAt: new Date() } },
        { new: true }
      );
      res.status(200).json({
        status: 'success',
        data: { message: 'Welcome back' },
      });
    } else {
      // user wants to subscribe for first time
      const entry = await Waitlist.create({
        email: email,
        createdAt: new Date(),
        status: 'subscribed',
      });
      res.status(201).json({
        status: 'success',
        data: { message: 'Successfully signed up for waitlist' },
      });
    }
  } catch (e: any) {
    next(new ErrorHandling(500, undefined, e.message));
  }
}
