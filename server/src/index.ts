import { ErrorHandling } from './util/errorChecking';
import express, { NextFunction, Request, Response } from 'express';

import {
  enforceRequiredFields,
  protectedRoute,
  RequiredFields,
} from './util/helpers';
import connectDB from './util/db';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { BACKEND_PORT, FRONTEND_URL } from './config';
import { subscribeController } from './controllers/waitlist';
import { RateLimiterMemory } from 'rate-limiter-flexible';

connectDB();

const app = express();

const port = BACKEND_PORT;

// This object contains the REQUIRED fields to be sent by the client. If any required fields are absent, the request is rejected.

export const requiredFields: RequiredFields = {
  '/api/waitlist': ['email'],
};

// Middlewares
// Convert incoming data into json
app.use(
  cors({
    origin: FRONTEND_URL, // allow your frontend
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.options('*', cors());

const opts = {
  points: 3, // 3 points
  duration: 60, // Per 60 seconds
};

const rateLimiter = new RateLimiterMemory(opts);

const rateLimit =
  (limiter: RateLimiterMemory) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rateLimiterRes = await limiter.consume(req.ip || 'unknown');
      next();
    } catch {
      next(
        new ErrorHandling(429, {
          email: 'Too many requests.',
        })
      );
      return;
    }
  };

// Routes
/* 
- If a route requires a user to be signed in/requires a JWT, the first handler should be the protectedRoute middleware

- If a route accepts JSON body data, enforce its required fields
*/

app.post(
  '/api/waitlist',
  rateLimit(rateLimiter),
  enforceRequiredFields,
  subscribeController
);

/*
// use a token to stop people from going to random leagues to improve privacy

🔐 app.patch('/api/leagues/:id')
// Should only be allowed to change league name, and the maxSeasonLimit
🔐 app.delete('/api/leagues')

app.get('/api/leagues/:uniqueToken/table/:seasonNumber')

app.get('/api/leagues/:uniqueToken/fixtures?limit&matchweek')
app.get('/api/leagues/:uniqueToken/results?seasonNumber&limit&matchweek')

app.get('/api/leagues/:uniqueToken/fixtures/:id')
app.get('/api/leagues/:uniqueToken/results/:id')


*/

// Error handler
app.use(
  (
    error: ErrorHandling | Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (error instanceof ErrorHandling) {
      res.status(error.statusCode).json(error.outputMessage());
    } else {
      res.status(500).json(error);
    }
  }
);

// Start the server
app.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
});
