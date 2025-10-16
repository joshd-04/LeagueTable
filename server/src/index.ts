import { ErrorHandling } from './util/errorChecking';
import express, { NextFunction, Request, Response } from 'express';
import {
  getMyAccountController,
  loginController,
  registrationController,
  signOutController,
} from './controllers/auth';
import {
  enforceRequiredFields,
  protectedRoute,
  RequiredFields,
} from './util/helpers';
import connectDB from './util/db';
import {
  calculateSeasonStatsController,
  calculateSeasonSummaryController,
  getAnnouncementController,
  getFixtureByIdController,
  getFixturesController,
  getHeadToHeadController,
  getResultsController,
  getTeamsController,
  leagueCreationController,
  leagueFetcherController,
  myAssociatedLeaguesFetcherController,
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
  favouriteLeagueController,
  followLeagueController,
  unfavouriteLeagueController,
  unfollowLeagueController,
} from './controllers/user';
import morgan from 'morgan';
import { getResultByIdController } from './controllers/league/getResultByIdController';
import { BACKEND_PORT, FRONTEND_URL } from './config';

connectDB();

const app = express();

const port = BACKEND_PORT;

// This object contains the REQUIRED fields to be sent by the client. If any required fields are absent, the request is rejected.

export const requiredFields: RequiredFields = {
  '/api/register': ['username', 'email', 'password'],
  '/api/login': ['username', 'email', 'password'],
  '/api/leagues': ['name', 'maxSeasonCount', 'leagueType', 'divisionsCount'],
  '/api/leagues/:id/tables': ['tables'],
  '/api/leagues/:id/teams': ['teams'],
  '/api/result': ['fixtureId', 'basicOutcome'],
  '/api/users/favourites': ['leagueId'],
  '/api/users/following': ['leagueId'],
  '/api/leagues/:id/announcement': ['text'],
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

// Routes
/* 
- If a route requires a user to be signed in/requires a JWT, the first handler should be the protectedRoute middleware

- If a route accepts JSON body data, enforce its required fields
*/
// Basic route
app.get('/', (req, res) => {
  res.send('Hello, TypeScript with Express!');
});

// Auth
app.post('/api/register', enforceRequiredFields, registrationController);
app.post('/api/login', enforceRequiredFields, loginController);
app.get('/api/signout', protectedRoute, signOutController);
app.get('/api/me', protectedRoute, getMyAccountController);

// League endpoints
app.post(
  '/api/leagues',
  protectedRoute,
  enforceRequiredFields,
  leagueCreationController
);

// Gets all league id's with minimal info that are associated with you e.g. yours or favourites etc
app.get(
  '/api/leagues/associated',
  protectedRoute,
  myAssociatedLeaguesFetcherController
);
app.get('/api/leagues/:id/announcement', getAnnouncementController);
app.patch(
  '/api/leagues/:id/announcement',
  protectedRoute,
  enforceRequiredFields,
  setAnnouncementController
);
app.get('/api/leagues/:id', leagueFetcherController);

app.post(
  '/api/leagues/:id/tables',
  protectedRoute,
  enforceRequiredFields,
  tablesAddingController
);

app.post(
  '/api/leagues/:id/teams',
  protectedRoute,
  enforceRequiredFields,
  teamsAddingController
);

app.post(
  '/api/leagues/:id/start-next-season',
  protectedRoute,
  startNextSeasonController
);

app.post(
  '/api/leagues/:id/start-next-matchweek',
  protectedRoute,
  startNextMatchweek
);

app.get('/api/leagues/:leagueId/fixtures/:fixtureId', getFixtureByIdController);
app.get('/api/leagues/:id/fixtures', getFixturesController);

app.get('/api/leagues/:leagueId/results/:resultId', getResultByIdController);
app.get('/api/leagues/:id/results', getResultsController);

app.get(
  '/api/leagues/:id/season-summary-stats',
  calculateSeasonSummaryController
);

app.get('/api/leagues/:id/stats', calculateSeasonStatsController);
app.get('/api/leagues/:id/teams', getTeamsController);
app.get('/api/leagues/:id/headtohead/:teamA/:teamB', getHeadToHeadController);

app.post(
  '/api/result',
  protectedRoute,
  enforceRequiredFields,
  turnFixtureIntoResult
);

// User endpoints
app.patch(
  '/api/users/favourites',
  protectedRoute,
  enforceRequiredFields,
  favouriteLeagueController
);

app.delete(
  '/api/users/favourites',
  protectedRoute,
  enforceRequiredFields,
  unfavouriteLeagueController
);

app.patch(
  '/api/users/following',
  protectedRoute,
  enforceRequiredFields,
  followLeagueController
);

app.delete(
  '/api/users/following',
  protectedRoute,
  enforceRequiredFields,
  unfollowLeagueController
);

/*
// use a token to stop people from going to random leagues to improve privacy

🔐 app.patch('/api/leagues/:id')
// Should only be allowed to change league name, and the maxSeasonCount
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
