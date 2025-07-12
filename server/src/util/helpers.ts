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
    const token = req.cookies.token;

    if (!token) {
      next(
        new ErrorHandling(401, { message: 'Not authenticated. Please log in.' })
      );
      return;
    }
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
      next();
    } catch {
      next(
        new ErrorHandling(401, {
          message: 'Not authenticated. Please log in.',
        })
      );
      return;
    }
  } catch (e: any) {
    console.error(e);
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
  descending order: b-a

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
      return pointsB - pointsA;
    }
    // 2. Better goal difference
    const gdA = teamA.goalsFor - teamA.goalsAgainst;
    const gdB = teamB.goalsFor - teamB.goalsAgainst;

    if (gdA !== gdB) {
      return gdB - gdA;
    }

    // 3. Goals scored
    if (teamA.goalsFor !== teamB.goalsFor) {
      return teamB.goalsFor - teamA.goalsFor;
    }
    // this is temporary:
    return teamB.goalsFor - teamA.goalsFor;

    // 4. Team who got most points in the H2H of this season
    // TODO: finish tiebreaker system

    // 5. Team who scored most away goals in the H2H
  });

  return teams;
}

export async function generateFixtures(league: ILeagueSchema) {
  function shuffleArray<T>(array: T[]): T[] {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  const games: IFixtureSchema[] = [];

  league.tables
    .filter((table) => table.season === league.currentSeason)
    .forEach((table) => {
      let teams = [...(table.teams as ITeamsSchema[])];

      if (teams.length % 2 !== 0) {
        // Add dummy "bye" team if odd number
        teams.push({ _id: new Types.ObjectId(), name: 'BYE' } as ITeamsSchema);
      }

      const totalMatchweeks = (teams.length - 1) * 2;
      const half = teams.length / 2;

      let matchweeks: IFixtureSchema[][] = [];

      // First half of the season
      for (let round = 0; round < teams.length - 1; round++) {
        let roundFixtures: IFixtureSchema[] = [];

        for (let i = 0; i < half; i++) {
          const home = teams[i];
          const away = teams[teams.length - 1 - i];

          if (home.name !== 'BYE' && away.name !== 'BYE') {
            roundFixtures.push({
              _id: new Types.ObjectId(),
              season: league.currentSeason,
              division: table.division,
              matchweek: round + 1,
              homeTeamDetails: home._id,
              awayTeamDetails: away._id,
              neutralGround: false,
            } as IFixtureSchema);
          }
        }

        matchweeks.push(roundFixtures);

        // Rotate teams for next round (keep first team static)
        const staticTeam = teams[0];
        const rotated = [staticTeam, ...teams.slice(1).rotateRight(1)];
        teams = rotated;
      }

      // Second half of the season (reverse home/away)
      const secondHalf = matchweeks.map((roundFixtures, i) => {
        return roundFixtures.map((fixture) => ({
          ...fixture,
          _id: new Types.ObjectId(),
          matchweek: matchweeks.length + i + 1,
          homeTeamDetails: fixture.awayTeamDetails,
          awayTeamDetails: fixture.homeTeamDetails,
        }));
      });

      const allFixtures = [...matchweeks.flat(), ...secondHalf.flat()];

      // Optional: shuffle the entire matchweek order or games per week if needed
      // But DO NOT change pairings or matchweeks once scheduled.

      allFixtures.forEach((g) => games.push(new Fixture(g)));
    });

  await Fixture.insertMany(games);

  return games;
}

declare global {
  interface Array<T> {
    rotateRight(n?: number): T[];
  }
}

Array.prototype.rotateRight = function <T>(this: T[], n = 1): T[] {
  return this.slice(-n).concat(this.slice(0, -n));
};

export function generateJWTToken(payload: any, nextFn: NextFunction) {
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

/**
 *  Used to check if a team: ITeamsSchema | Types.ObjectId is a team under the ITeamsSchema interface.
 *
 *
 */
export function isTeam(doc: any): doc is ITeamsSchema {
  return doc && typeof doc === 'object' && 'name' in doc && 'division' in doc;
}
