import { NextFunction, Request, Response } from 'express';
import User from '../../models/userModel';
import { ErrorHandling } from '../../util/errorChecking';
import bcrypt from 'bcrypt';
import { generateJWTToken } from '../../util/helpers';

interface RegisterReqBody {
  email: string;
  username: string;
  password: string;
}

export async function registrationController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  /*  Args: email, username, password
    Returns: sanitized user object (username, email, accountType and leaguesCreated)

    Checks if username and email are unique, and creates a user record in the database
*/
  try {
    const { email, username, password }: RegisterReqBody = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const errors: { username?: string; email?: string; password?: string } = {};

    // Check if username & email are unique

    // Run 2 aggregate pipelines at once, one for username clashes and another for email clashes. $match will find users with matching usernames. $count will tally these into a usernameClashes field

    const clashes = await Promise.all([
      User.aggregate([
        { $match: { username: username } },
        { $count: 'usernameClashes' },
      ]),
      User.aggregate([
        { $match: { email: email } },
        { $count: 'emailClashes' },
      ]),
    ]);

    const usernameClashes = clashes[0][0]?.usernameClashes || 0;
    const emailClashes = clashes[1][0]?.emailClashes || 0;

    if (usernameClashes > 0) {
      errors.username = 'This username has already been taken.';
    }
    if (emailClashes > 0) {
      errors.email = 'Account with this email already exists.';
    }

    // Handle errors
    if (Object.keys(errors).length !== 0) {
      next(
        new ErrorHandling(400, {
          errors: { ...errors },
        })
      );
      return;
    }

    // Create the user
    const user = await User.create({
      username,
      passwordHash,
      email,
      accountType: 'free',
      leaguesCreated: [],
      favouriteLeagues: [],
      followedLeagues: [],
    });

    // Send success response and log user in

    const token = generateJWTToken({ userId: user._id }, next);
    res.cookie('token', token, {
      httpOnly: true,
      // secure: true, // true in production (HTTPS)
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(201).json({
      status: 'success',
      data: { message: 'Successfully registered and logged in.' },
    });
  } catch (e: any) {
    next(new ErrorHandling(500, undefined, e.message));
  }
}
