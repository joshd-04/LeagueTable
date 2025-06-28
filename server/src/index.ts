import { ErrorHandling } from './util/errorChecking';
import express, { NextFunction, Request, Response } from 'express';
import {
  loginController,
  registrationController,
} from './controllers/authController';
import {
  enforceRequiredFields,
  protectedRoute,
  RequiredFields,
} from './util/helpers';
import connectDB from './util/db';
import {
  getFixturesStillToBePlayed,
  leagueCreationController,
  leagueFetcherController,
  myAssociatedLeaguesFetcherController,
  startNextMatchweek,
  startNextSeasonController,
  teamsAddingController,
  turnFixtureIntoResult,
} from './controllers/leagueController';
import cors from 'cors';

connectDB();

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3001', // allow your frontend
  })
);

// app.use(cors());

const port = 3000;

// This object contains the REQUIRED fields to be sent by the client. If any required fields are absent, the request is rejected.

export const requiredFields: RequiredFields = {
  '/api/register': ['username', 'email', 'password'],
  '/api/login': ['username', 'email', 'password'],
  '/api/leagues': ['name', 'maxSeasonCount', 'leagueType', 'tables'],
  '/api/leagues/:id/teams': ['teams'],
  '/api/result': ['fixtureId', 'basicOutcome'],
};

// Middlewares
// Convert incoming data into json
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
app.get('/api/leagues/:id', leagueFetcherController);

app.post(
  '/api/leagues/:id/teams',
  protectedRoute,
  enforceRequiredFields,
  teamsAddingController
);

app.get(
  '/api/leagues/:id/startNextSeason',
  protectedRoute,
  startNextSeasonController
);

app.get(
  '/api/leagues/:id/startNextMatchweek',
  protectedRoute,
  startNextMatchweek
);

app.get('/api/leagues/:id/fixturesStillToBePlayed', getFixturesStillToBePlayed);

app.post(
  '/api/result',
  protectedRoute,
  enforceRequiredFields,
  turnFixtureIntoResult
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
