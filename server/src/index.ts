import { ErrorHandling } from './util/errorChecking';
import express, { NextFunction, Request, Response } from 'express';
import {
  getMyAccountController,
  loginController,
  registrationController,
  signOutController,
} from './controllers/auth';
import { enforceRequiredFields, RequiredFields } from './util/helpers';
import connectDB from './util/db';
import {
  calculateSeasonStatsController,
  calculateSeasonSummaryController,
  editResultController,
  getAnnouncementController,
  getEngagementStats,
  getFixtureByIdController,
  getFixtureResultStatusByIdController,
  getFixturesController,
  getHeadToHeadController,
  getResultsController,
  getTeamsController,
  leagueCreationController,
  leagueFetcherController,
  myAssociatedLeaguesFetcherController,
  RegisterViewController,
  setAnnouncementController,
  startNextMatchweek,
  startNextSeasonController,
  tablesAddingController,
  teamsAddingController,
  turnFixtureIntoResult,
} from './controllers/league';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {
  favoriteLeagueController,
  followLeagueController,
  unfavoriteLeagueController,
  unfollowLeagueController,
} from './controllers/user';
import morgan from 'morgan';
import { getResultByIdController } from './controllers/league/result/getResultByIdController';
import { BACKEND_PORT, FRONTEND_URL } from './config';
import session from 'express-session';
import { sessionStore } from './util/sessionStore';
import { requireAuth } from './middleware/authRequired';
import dotenv from 'dotenv';
import sessionAbsoluteExpirationMiddleware from './middleware/sessionAbsoluteExpirationMiddleware';
import { visitorIdMiddleware } from './middleware/visitorIdMiddleware';

dotenv.config();

connectDB();

const app = express();

const port = BACKEND_PORT;

// This object contains the REQUIRED fields to be sent by the client. If any required fields are absent, the request is rejected.

export const requiredFields: RequiredFields = {
  '/api/register': ['username', 'email', 'password'],
  '/api/login': ['username', 'email', 'password'],
  '/api/leagues': ['name', 'leagueType', 'divisionsCount'],
  '/api/leagues/:id/tables': ['tables'],
  '/api/leagues/:id/teams': ['teams'],
  '/api/result': ['fixtureId', 'basicOutcome'],
  '/api/users/favorites': ['leagueId'],
  '/api/users/following': ['leagueId'],
  '/api/leagues/:id/announcement': ['text'],
};

// Middlewares
// Convert incoming data into json
app.use(
  cors({
    origin: FRONTEND_URL, // allow your frontend
    credentials: true,
  }),
);
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

// Session authentication
app.use(
  session({
    name: 'leaguex.sid',
    secret: process.env.SESSION_SECRET!, // strong random string
    resave: false,
    saveUninitialized: false,
    store: sessionStore as any,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 60 * 1000, // 30 minutes sliding window
    },
    rolling: true, // enables sliding expiration
  }),
);

app.use(sessionAbsoluteExpirationMiddleware);

app.options('*', cors());

// Routes
/* 
- If a route requires a user to be signed in/requires a JWT, the first handler should be the protectedRoute middleware

- If a route accepts JSON body data, enforce its required fields
*/

// Auth
app.post('/api/register', enforceRequiredFields, registrationController);
app.post('/api/login', enforceRequiredFields, loginController);
app.get('/api/signout', requireAuth, signOutController);
app.get('/api/me', requireAuth, getMyAccountController);

// League endpoints
app.post(
  '/api/leagues',
  requireAuth,
  enforceRequiredFields,
  leagueCreationController,
);

app.post(
  '/api/leagues/:leagueId/view',
  visitorIdMiddleware,
  RegisterViewController,
);

// Gets all league id's with minimal info that are associated with you e.g. yours or favorites etc
app.get(
  '/api/leagues/associated',
  requireAuth,
  myAssociatedLeaguesFetcherController,
);
app.get('/api/leagues/:id/announcement', getAnnouncementController);
app.patch(
  '/api/leagues/:id/announcement',
  requireAuth,
  enforceRequiredFields,
  setAnnouncementController,
);
app.get('/api/leagues/:id', leagueFetcherController);

app.post(
  '/api/leagues/:id/tables',
  requireAuth,
  enforceRequiredFields,
  tablesAddingController,
);

app.post(
  '/api/leagues/:id/teams',
  requireAuth,
  enforceRequiredFields,
  teamsAddingController,
);

app.post(
  '/api/leagues/:id/start-next-season',
  requireAuth,
  startNextSeasonController,
);

app.post(
  '/api/leagues/:id/start-next-matchweek',
  requireAuth,
  startNextMatchweek,
);

app.get('/api/leagues/:leagueId/fixtures/:fixtureId', getFixtureByIdController);
app.get('/api/leagues/:id/fixtures', getFixturesController);

app.get('/api/leagues/:leagueId/results/:resultId', getResultByIdController);
app.get('/api/leagues/:id/results', getResultsController);

app.get(
  '/api/leagues/:id/season-summary-stats',
  calculateSeasonSummaryController,
);

app.get('/api/leagues/:id/engagement-stats', getEngagementStats);

app.get('/api/leagues/:id/stats', calculateSeasonStatsController);
app.get('/api/leagues/:id/teams', getTeamsController);
app.get('/api/leagues/:id/headtohead/:teamA/:teamB', getHeadToHeadController);

app.get(
  '/api/leagues/:leagueId/fixture-result-status/:matchId',
  getFixtureResultStatusByIdController,
);

app.post(
  '/api/result',
  requireAuth,
  enforceRequiredFields,
  turnFixtureIntoResult,
);

app.patch(
  '/api/result',
  requireAuth,
  enforceRequiredFields,
  editResultController,
);

// User endpoints
app.patch(
  '/api/users/favorites',
  requireAuth,
  enforceRequiredFields,
  favoriteLeagueController,
);

app.delete(
  '/api/users/favorites',
  requireAuth,
  enforceRequiredFields,
  unfavoriteLeagueController,
);

app.patch(
  '/api/users/following',
  requireAuth,
  enforceRequiredFields,
  followLeagueController,
);

app.delete(
  '/api/users/following',
  requireAuth,
  enforceRequiredFields,
  unfollowLeagueController,
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
    next: NextFunction,
  ) => {
    if (error instanceof ErrorHandling) {
      res.status(error.statusCode).json(error.outputMessage());
    } else {
      res.status(500).json(error);
    }
  },
);

// Start the server
app.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
});
