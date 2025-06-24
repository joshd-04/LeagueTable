import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import { ErrorHandling } from './errorChecking';
import jwt from 'jsonwebtoken';
import { requiredFields as rF } from '..';
import { IFixtureSchema, ILeagueSchema, ITeamsSchema } from './definitions';
import { Types } from 'mongoose';
import Fixture from '../models/fixtureModel';
import { isDeepStrictEqual } from 'util';

export type RequiredFields = { [key: string]: string[] };

export function enforceRequiredFields(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const requiredFields = rF;
  if (!req.body) return;
  const path: string = req.route.path;

  if (!Object.keys(requiredFields).includes(path)) return next();

  const fields = requiredFields[path];

  const missingFields = fields.filter((field) => req.body[field] === undefined);

  if (missingFields.length > 0) {
    const messages = new Map();
    missingFields.forEach((field) => {
      messages.set(field, `${field} is a required field`);
    });

    next(new ErrorHandling(400, Object.fromEntries(messages.entries())));
  } else next();
}

export function readDotenv(variableName: string) {
  dotenv.config();

  return process.env[variableName];
}

export function protectedRoute(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Unauthorized: No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
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

    try {
      const payload = jwt.verify(token, SECRET_KEY);
      if (typeof payload === 'string') throw new Error();
      const iat = payload.iat;
      const exp = payload.exp;

      if (!iat || !exp) throw new Error();

      const expiresIn = new Date(exp * 1000);

      if (expiresIn < new Date()) {
        next(
          new ErrorHandling(401, {
            message: 'Your session has expired. Please log in again.',
          })
        );
        return;
      }

      // Put user's id on the req.body for convenience for later use
      req.body.userId = payload.userId;
      req.body.accountType = payload.accountType;
      next();
    } catch {
      next(
        new ErrorHandling(401, {
          message: 'Unexpected JWT token format recieved.',
        })
      );
      return;
    }
  } catch (e: any) {
    return next(
      new ErrorHandling(
        500,
        undefined,
        'Unexpected error occured during the verification of your JWT Token.'
      )
    );
  }
}

export function calculateTeamPoints(team: ITeamsSchema) {
  return team.wins * 3 + team.draws * 1;
}

export function sortTeams(teams: ITeamsSchema[]) {
  /* compareFn: positive = swap, negative = dont swap, equal = equal

  Favour teams with:
  1. More points
  2. Better goal difference
  3. Goals scored
  4. Team who got most points in the H2H of this season
  5. Team who scored most away goals in the H2H
  */
  teams.sort((teamA, teamB) => {
    // 1. More points
    const pointsA = calculateTeamPoints(teamA);
    const pointsB = calculateTeamPoints(teamB);

    if (pointsA !== pointsB) {
      return pointsA - pointsB;
    }
    // 2. Better goal difference
    const gdA = teamA.goalsFor - teamA.goalsAgainst;
    const gdB = teamB.goalsFor - teamB.goalsAgainst;

    if (gdA !== gdB) {
      return gdA - gdB;
    }

    // 3. Goals scored
    if (teamA.goalsFor !== teamB.goalsFor) {
      return teamA.goalsFor - teamB.goalsFor;
    }
    // this is temporary:
    return teamA.goalsFor - teamB.goalsFor;

    // 4. Team who got most points in the H2H of this season
    // TODO: finish tiebreaker system

    // 5. Team who scored most away goals in the H2H
  });

  return teams;
}

export async function generateFixtures(league: ILeagueSchema) {
  function shuffleArray<T>(array: T[]): T[] {
    let shuffled = [...array]; // Create a copy to avoid mutation
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
    }
    return shuffled;
  }
  // Get fixtures into one 1d array
  const games: IFixtureSchema[] = [];

  league.tables
    .filter((table) => table.season === league.currentSeason)
    .forEach((table) => {
      const teamsList = table.teams as ITeamsSchema[];

      // each array is a matchweek
      let fixtures: IFixtureSchema[] = [];

      for (let i = 0; i < teamsList.length; i++) {
        for (let j = 0; j < teamsList.length; j++) {
          if (i == j) {
            continue;
          }
          const fixture: IFixtureSchema = {
            _id: new Types.ObjectId(),
            season: league.currentSeason,
            division: table.division,
            matchweek: 0,
            homeTeamDetails: teamsList[i]._id,
            awayTeamDetails: teamsList[j]._id,
            neutralGround: false,
          } as IFixtureSchema;

          fixtures.push(fixture);
        }
      }

      fixtures = shuffleArray(fixtures);

      let matchweeks: { matchweek: number; games: IFixtureSchema[] }[] = [];
      for (let i = 0; i < (teamsList.length - 1) * 2; i++) {
        matchweeks.push({ matchweek: i + 1, games: [] });
      }

      matchweeks.forEach((matchweek) => {
        if (matchweek.games.length === teamsList.length / 2) return;

        const remainingFixtures = [...fixtures]; // Create a copy of the fixtures array

        remainingFixtures.forEach((match) => {
          if (matchweek.games.length === teamsList.length / 2) return;

          // Check if any team in the current fixture is already playing in this matchweek
          const isTeamPlaying = matchweek.games.some(
            (game) =>
              game.homeTeamDetails.equals(match.homeTeamDetails) ||
              game.awayTeamDetails.equals(match.homeTeamDetails) ||
              game.awayTeamDetails.equals(match.awayTeamDetails) ||
              game.homeTeamDetails.equals(match.awayTeamDetails)
          );

          if (isTeamPlaying) return;

          // Add the match to the matchweek
          matchweek.games.push(match);

          // Remove the match from the original fixtures array
          const index = fixtures.indexOf(match);
          if (index > -1) {
            fixtures.splice(index, 1);
          }
        });
      });

      matchweeks = shuffleArray(matchweeks);
      matchweeks.forEach((mw, i) => {
        mw.matchweek = i + 1;
        mw.games.forEach((g) => {
          g.matchweek = mw.matchweek;
        });
      });

      matchweeks.forEach((mw) => games.push(...mw.games));
    });

  await Fixture.insertMany(games);

  return games;
}
