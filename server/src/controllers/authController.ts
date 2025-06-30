import { NextFunction, Request, Response } from 'express';
import User from '../models/userModel';
import { ErrorHandling } from '../util/errorChecking';
import jwt from 'jsonwebtoken';
import { readDotenv } from '../util/helpers';
import bcrypt from 'bcrypt';
import { IUserSchema } from '../util/definitions';

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
      data: { message: 'Successfully logged in' },
    });
  } catch (e: any) {
    next(new ErrorHandling(500, undefined, e.message));
  }
}

interface LoginReqBody {
  username: string | null;
  email: string | null;
  password: string;
}

export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  /*  Args: email, username, password
      Returns: sanitized user object (username, email, accountType and leaguesCreated) and jwt token

      Note: we don't want to send specific reasons why the login was rejected as this increases security risks
  */
  try {
    const { username, email, password }: LoginReqBody = req.body;
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
    const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
    if (passwordsMatch) {
      const userId: any = user._id;

      const token = generateJWTToken({ userId: userId }, next);
      res.cookie('token', token, {
        path: '/',
        httpOnly: true,
        // secure: true, // true in production (HTTPS)
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      res.status(200).json({
        status: 'success',
        data: { message: 'Successfully logged in' },
      });
    } else {
      next(new ErrorHandling(401, { message: 'Invalid credentials' }));
    }
  } catch (e: any) {
    next(new ErrorHandling(500, undefined, e.message));
  }
}

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

export async function getMyAccountController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.body.userId;
    const user: IUserSchema | null = await User.findById(userId);

    if (!user) {
      next(new ErrorHandling(404, { message: "User doesn't exist" }));
      return;
    }
    res.status(200).json({
      status: 'success',
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        accountType: user.accountType,
      },
    });
  } catch (e: any) {
    next(new ErrorHandling(500, undefined, e.message));
  }
}

function generateJWTToken(payload: any, nextFn: NextFunction) {
  const SECRET_KEY = readDotenv('JWT_SECRET_KEY');
  if (!SECRET_KEY) {
    nextFn(
      new ErrorHandling(
        500,
        undefined,
        'No JWT_SECRET_KEY environment variable found for JWT signature'
      )
    );
    return;
  }

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });
  return token;
}
