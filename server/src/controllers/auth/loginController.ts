import { NextFunction, Request, Response } from 'express';
import User from '../../models/userModel';
import { ErrorHandling } from '../../util/errorChecking';
import bcrypt from 'bcrypt';

interface LoginReqBody {
  username: string | null;
  email: string | null;
  password: string;
  rememberMe?: boolean;
}

export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { username, email, password, rememberMe }: LoginReqBody = req.body;

    // Get user
    const user = username
      ? await User.findOne({ username })
      : await User.findOne({ email });

    if (!user) {
      next(new ErrorHandling(401, { message: 'Invalid credentials' }));
      return;
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      next(new ErrorHandling(401, { message: 'Invalid credentials' }));
      return;
    }

    // Create session
    req.session.user = {
      _id: user._id as string,
      username: user.username,
      email: user.email,
    };

    // Store timestamps for sliding + absolute expiration
    const now = Date.now();
    req.session.createdAt = now;
    req.session.lastActivity = now;

    req.session.absoluteSessionAgeLimit = rememberMe
      ? 60 * 24 * 60 * 60 * 1000 // 60 days
      : 8 * 60 * 60 * 1000; // 8 hours

    // Set cookie maxAge accordingly
    req.session.cookie.maxAge = rememberMe
      ? 60 * 24 * 60 * 60 * 1000 // 60 days
      : 8 * 60 * 60 * 1000; // 8 hours

    req.session.save();

    res.json({
      status: 'success',
      data: { message: 'Successfully logged in!' },
    });
  } catch (e: any) {
    next(new ErrorHandling(500, undefined, e.message));
  }
}
