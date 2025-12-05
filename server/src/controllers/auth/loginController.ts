import { NextFunction, Request, Response } from 'express';
import User from '../../models/userModel';
import { ErrorHandling } from '../../util/errorChecking';
import bcrypt from 'bcrypt';
import { generateJWTToken, readDotenv } from '../../util/helpers';
import jwt from 'jsonwebtoken';

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
  /*  Args: email, username, password
      Returns: sanitized user object (username, email, accountType and leaguesCreated) and jwt token

      Note: we don't want to send specific reasons why the login was rejected as this increases security risks
  */
  try {
    const {
      username,
      email,
      password,
      rememberMe = false,
    }: LoginReqBody = req.body;
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

      const jwtOptions: jwt.SignOptions = {
        expiresIn: rememberMe ? '14d' : '30m',
      };

      const token = generateJWTToken(
        { userId: userId, rememberMe: rememberMe },
        jwtOptions,
        next
      );
      res.cookie('token', token, {
        path: '/',
        httpOnly: true,
        secure: readDotenv('ENVIRONMENT') === 'PRODUCTION', // true in production (HTTPS)
        sameSite: 'lax',
        maxAge: rememberMe ? 14 * 24 * 60 * 60 * 1000 : 30 * 60 * 1000, // 14 days or 30min
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
