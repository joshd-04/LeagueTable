import { NextFunction, Request, Response } from 'express';
import User from '../models/userModel';
import { ErrorHandling } from '../util/errorChecking';
import jwt from 'jsonwebtoken';
import { readDotenv } from '../util/helpers';

interface RegisterReqBody {
  email: string;
  username: string;
  passwordHash: string;
}

export async function registrationController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  /*  Args: email, username, passwordHash
    Returns: sanitized user object (username, email, accountType and leaguesCreated)

    Checks if username and email are unique, and creates a user record in the database
*/
  try {
    const { email, username, passwordHash }: RegisterReqBody = req.body;

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
      next(
        new ErrorHandling(409, {
          message: 'This username has already been taken',
        })
      );
      return;
    } else if (emailClashes > 0) {
      next(
        new ErrorHandling(409, {
          message: 'Account with this email already exists',
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
    });

    // Send success response
    res.status(201).json({
      status: 'success',
      data: {
        username: user.username,
        email: user.email,
        accountType: user.accountType,
        leaguesCreated: user.leaguesCreated,
      },
    });
  } catch (e: any) {
    next(new ErrorHandling(500, undefined, e.message));
  }
}

interface LoginReqBody {
  username: string | null;
  email: string | null;
  passwordHash: string;
}

export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  /*  Args: email, username, passwordHash
      Returns: sanitized user object (username, email, accountType and leaguesCreated) and jwt token

      Note: we don't want to send specific reasons why the login was rejected as this increases security risks
  */
  try {
    const { username, email, passwordHash }: LoginReqBody = req.body;
    // Username should be given. Or email should be given. Not neither. Not both.
    if (
      (username === null && email === null) ||
      (username !== null && email !== null)
    ) {
      next(
        new ErrorHandling(422, {
          message:
            'Either username or email must be provided to login. (One or the other).',
        })
      );
      return;
    }

    let user;
    if (username) user = await User.findOne({ username });
    else user = await User.findOne({ email });

    // If user does not exist
    if (user === null) {
      next(new ErrorHandling(401, { message: 'Invalid credentials' }));
      return;
    }

    // If correct password given
    if (user.passwordHash === passwordHash) {
      const formattedUser = {
        userId: user._id,
        username: user.username,
        email: user.email,
        accountType: user.accountType,
      };

      const SECRET_KEY = readDotenv('JWT_SECRET_KEY');
      if (!SECRET_KEY) {
        next(
          new ErrorHandling(
            500,
            undefined,
            'No JWT_SECRET_KEY environment variable found for JWT signature'
          )
        );
        return;
      }

      const token = jwt.sign(formattedUser, SECRET_KEY, { expiresIn: '7d' });
      res.status(200).json({ ...formattedUser, token });
    } else {
      next(new ErrorHandling(401, { message: 'Invalid credentials' }));
    }
  } catch (e: any) {
    next(new ErrorHandling(500, undefined, e.message));
  }
}
