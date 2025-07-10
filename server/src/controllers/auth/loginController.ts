import { NextFunction, Request, Response } from 'express';
import User from '../../models/userModel';
import { ErrorHandling } from '../../util/errorChecking';
import bcrypt from 'bcrypt';
import { generateJWTToken } from '../../util/helpers';

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
