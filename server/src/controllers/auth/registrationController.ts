import { NextFunction, Request, Response } from 'express';
import User from '../../models/userModel';
import { ErrorHandling } from '../../util/errorChecking';
import bcrypt from 'bcrypt';
import validator from 'validator';

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
    const errors: { username?: string; email?: string; password?: string } = {};

    // Validation checks
    // Stage 1: ensure values are given (this should already be taken care of but this API needs to be ROBUST!)
    if (username.trim().length === 0) {
      errors.username = 'Username is required.';
    }
    if (email.trim().length === 0) {
      errors.email = 'Email is required.';
    }
    if (password.length === 0) {
      errors.password = 'Password is required.';
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

    // Stage 2: Ensure that correct formats given
    if (!validator.isEmail(email)) {
      errors.email = 'Invalid email provided';
    }
    if (password.length < 8) {
      errors.password = 'Password must be atleast 8 characters';
    }
    if ((password.match(/[a-z]/g) || []).length < 1) {
      errors.password = 'Password must include at least 1 lower case letter';
    }
    if ((password.match(/[A-Z]/g) || []).length < 1) {
      errors.password = 'Password must include at least 1 upper case letter';
    }
    if ((password.match(/[^a-z0-9]/gi) || []).length < 1) {
      errors.password = 'Password must include at least 1 symbol.';
    }

    if (/\s/.test(username)) {
      errors.username =
        'Username cannot contain spaces or other whitespace characters.';
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

    const passwordHash = await bcrypt.hash(password, 10);

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
      favoriteLeagues: [],
      followedLeagues: [],
    });

    // Create session
    const rememberMe = true;
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
    res.status(201).json({
      status: 'success',
      data: { message: 'Successfully registered and logged in.' },
    });
  } catch (e: any) {
    next(new ErrorHandling(500, undefined, e.message));
  }
}
