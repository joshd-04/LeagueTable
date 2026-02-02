import { NextFunction, Request, Response } from 'express';
import { ErrorHandling } from './errorChecking';
import jwt from 'jsonwebtoken';
import { requiredFields as rF } from '..';
import {
  AccountTypeInterface,
  IFixtureSchema,
  ILeagueSchema,
  IResultSchema,
  ITable,
  ITeamsSchema,
} from './definitions';
import { Types } from 'mongoose';
import Fixture from '../models/fixtureModel';
import League from '../models/leagueModel';
import Result from '../models/resultModel';

export type RequiredFields = { [key: string]: string[] };

export function enforceRequiredFields(
  req: Request,
  res: Response,
  next: NextFunction,
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

export async function calculateTeamPoints(
  team: ITeamsSchema,
  asOfTheEndOfMathweek?: number,
  season?: number,
) {
  const league = await League.findById(team.leagueId);
  if (!league) return 0;

  if (!asOfTheEndOfMathweek || !season) return team.wins * 3 + team.draws * 1;

  const seasonOfInterest = season || league.currentSeason;
  const matchweekOfInterest = asOfTheEndOfMathweek || league.currentMatchweek;

  const homeResults = await Result.find({
    'homeTeamDetails.teamId': team._id,
    season: seasonOfInterest,
    matchweek: { $lte: matchweekOfInterest },
  });
  const awayResults = await Result.find({
    'awayTeamDetails.teamId': team._id,
    season: seasonOfInterest,
    matchweek: { $lte: matchweekOfInterest },
  });

  const points =
    homeResults.reduce((points, result) => {
      const homeGoals = result.basicOutcome.filter(
        (goal) => goal === 'home',
      ).length;
      const awayGoals = result.basicOutcome.filter(
        (goal) => goal === 'away',
      ).length;

      if (homeGoals > awayGoals) return points + 3;
      if (homeGoals === awayGoals) return points + 1;
      return points;
    }, 0) +
    awayResults.reduce((points, result) => {
      const homeGoals = result.basicOutcome.filter(
        (goal) => goal === 'home',
      ).length;
      const awayGoals = result.basicOutcome.filter(
        (goal) => goal === 'away',
      ).length;

      if (homeGoals < awayGoals) return points + 3;
      if (homeGoals === awayGoals) return points + 1;
      return points;
    }, 0);

  return points;
}

export async function sortTeams(leagueId: string, teams: ITeamsSchema[]) {
  const league = await League.findById(leagueId).populate({
    path: 'results',
    populate: [{ path: 'homeTeamDetails' }, { path: 'awayTeamDetails' }],
  });
  if (league === null) return teams;
  const allResults = league.results as unknown as IResultSchema[];

  const entries = await Promise.all(
    teams.map(async (team) => {
      const points = await calculateTeamPoints(team);
      const teamId: Types.ObjectId = team._id as Types.ObjectId;
      return [teamId.toString(), points] as const;
    }),
  );

  const teamPoints: Record<string, number> = Object.fromEntries(entries);

  /* compareFn: positive = swap, negative = dont swap, equal = equal
  descending order: b-a

  Favor teams with:
  1. More points
  2. Better goal difference
  3. Goals scored
  4. Team who got most points in the H2H of this season
  5. Team who scored most away goals in the H2H
  */
  teams.sort((teamA, teamB) => {
    // 1. More points
    const pointsA = teamPoints[teamA._id as string];
    const pointsB = teamPoints[teamB._id as string];

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
    // return teamB.goalsFor - teamA.goalsFor;

    // 4. Team who got most points in the H2H of this season
    // TODO: finish tiebreaker system
    // Taking teamA's perspective:
    const homeResult = allResults.find(
      (result) =>
        result.homeTeamDetails.name === teamA.name &&
        result.awayTeamDetails.name === teamB.name,
    );
    const awayResult = allResults.find(
      (result) =>
        result.homeTeamDetails.name === teamB.name &&
        result.awayTeamDetails.name === teamA.name,
    );
    let teamAPoints = 0;
    let teamBPoints = 0;
    let teamAGoals = 0;
    let teamBGoals = 0;

    if (homeResult) {
      const teamAGoalsResult = homeResult.basicOutcome.reduce(
        (acc, goal) => (goal === 'home' ? acc + 1 : acc),
        0,
      );
      const teamBGoalsResult = homeResult.basicOutcome.reduce(
        (acc, goal) => (goal === 'away' ? acc + 1 : acc),
        0,
      );
      teamAGoals += teamAGoalsResult;
      teamBGoals += teamBGoalsResult;
      if (teamAGoalsResult > teamBGoalsResult) {
        teamAPoints += 3;
      } else if (teamAGoalsResult < teamBGoalsResult) {
        teamBPoints += 3;
      } else {
        teamAPoints += 1;
        teamBPoints += 1;
      }
    }
    if (awayResult) {
      const teamBGoalsResult = awayResult.basicOutcome.reduce(
        (acc, goal) => (goal === 'home' ? acc + 1 : acc),
        0,
      );
      const teamAGoalsResult = awayResult.basicOutcome.reduce(
        (acc, goal) => (goal === 'away' ? acc + 1 : acc),
        0,
      );
      teamAGoals += teamAGoalsResult;
      teamBGoals += teamBGoalsResult;
      if (teamAGoalsResult > teamBGoalsResult) {
        teamAPoints += 3;
      } else if (teamAGoalsResult < teamBGoalsResult) {
        teamBPoints += 3;
      } else {
        teamAPoints += 1;
        teamBPoints += 1;
      }
    }
    if (teamBPoints !== teamAPoints) {
      return teamBPoints - teamAPoints;
    }

    // 5. Team who scored most away goals in the H2H
    if (teamBGoals !== teamAGoals) {
      return teamBGoals - teamAGoals;
    }

    // Otherwise just return alphabetical order because the chances of getting here is very unlikely
    return teamA.name.localeCompare(teamB.name);
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

export async function findLeaguePosition(
  league: ILeagueSchema,
  division: number,
  season: number,
  teamName: string,
) {
  const teams = await sortTeams(
    String(league._id),
    (
      league.tables.find(
        (table) => table.division === division && table.season === season,
      ) as ITable
    ).teams as ITeamsSchema[],
  );
  return teams.map((team) => team.name).indexOf(teamName) + 1;
}

/**
 *  Used to check if a team: ITeamsSchema | Types.ObjectId is a team under the ITeamsSchema interface.
 *
 *
 */
export function isTeam(doc: any): doc is ITeamsSchema {
  return doc && typeof doc === 'object' && 'name' in doc && 'division' in doc;
}

/**
 * Helper function that returns true if the level meets the required tier level.
 * A level represents 'free', 'pro' or 'pro+'.
 * Useful if you need to determine access for account-dependent features.
 * Account-dependent feature: availability is determined by the user’s subscription and provides read-only or additive insights without modifying league state.
 */
export function meetsMinimumTierLevel(
  requiredLevel: AccountTypeInterface,
  level: AccountTypeInterface,
) {
  if (requiredLevel === 'free') return true;
  if (requiredLevel === 'pro') {
    if (level === 'pro' || level === 'pro+') return true;
    return false;
  }
  if (requiredLevel === 'pro+') {
    if (level === 'pro+') return true;
    return false;
  }
  return false;
}
/**
 * Helper function that returns true if the league level & account level meet the required level for the feature.
 * A level represents 'free', 'pro' or 'pro+'.
 * Useful if you need to determine access for league-dependent features.
 * League-dependent feature: availability is determined by the league’s tier at creation and affects league state or structure.
 */
export function shouldGrantAccessToFeature(
  featureLevel: AccountTypeInterface,
  leagueLevel: AccountTypeInterface,
  accountType: AccountTypeInterface,
) {
  return (
    meetsMinimumTierLevel(featureLevel, accountType) &&
    meetsMinimumTierLevel(featureLevel, leagueLevel)
  );
}
