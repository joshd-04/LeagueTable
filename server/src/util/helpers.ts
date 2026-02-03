import { NextFunction, Request, Response } from 'express';
import { ErrorHandling } from './errorChecking';
import { requiredFields as rF } from '..';
import {
  AccountTypeInterface,
  IFixtureSchema,
  ILeagueSchema,
  IResultSchema,
  ITable,
  ITeamDetails,
  ITeamsSchema,
  ITeamStats,
} from './definitions';
import { Types } from 'mongoose';
import Fixture from '../models/fixtureModel';
import League from '../models/leagueModel';
import Result from '../models/resultModel';
import Team from '../models/teamModel';

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

export async function sortTeams(
  leagueId: string,
  teams: ITeamsSchema[],
  season?: number,
  asOfTheEndOfMathweek?: number,
) {
  const league = await League.findById(leagueId).populate({
    path: 'results',
  });
  if (league === null) return teams;

  const seasonOfInterest = season || league.currentSeason;

  const matchweekOfInterest = asOfTheEndOfMathweek || league.currentMatchweek;
  const allResults = (league.results as unknown as IResultSchema[]).filter(
    (result) => result.matchweek <= matchweekOfInterest,
  );

  const entries = await Promise.all(
    teams.map(async (team) => {
      console.log('💣', team);
      const teamStats = await calculateTeamStats(
        league,
        team,
        seasonOfInterest,
        matchweekOfInterest,
      );
      const teamId: Types.ObjectId = team._id as Types.ObjectId;

      return [teamId.toString(), teamStats] as const;
    }),
  );

  const teamStatsData: Record<string, ITeamStats> = Object.fromEntries(entries);

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
    const teamADetails = teamStatsData[teamA._id.toString()];
    const teamBDetails = teamStatsData[teamA._id.toString()];
    // 1. More points
    const pointsA = teamADetails.points;
    const pointsB = teamBDetails.points;

    if (pointsA !== pointsB) {
      return pointsB - pointsA;
    }
    // 2. Better goal difference
    const gdA = teamADetails.goalsFor - teamADetails.goalsAgainst;
    const gdB = teamBDetails.goalsFor - teamBDetails.goalsAgainst;

    if (gdA !== gdB) {
      return gdB - gdA;
    }

    // 3. Goals scored
    if (teamADetails.goalsFor !== teamBDetails.goalsFor) {
      return teamBDetails.goalsFor - teamADetails.goalsFor;
    }
    // this is temporary:
    // return teamB.goalsFor - teamA.goalsFor;

    // 4. Team who got most points in the H2H of this season
    // TODO: finish tiebreaker system
    // Taking teamA's perspective:
    const homeResult = allResults.find(
      (result) =>
        result.homeTeamId.equals(teamA._id) &&
        result.awayTeamId.equals(teamB._id),
    );
    const awayResult = allResults.find(
      (result) =>
        result.homeTeamId.equals(teamB._id) &&
        result.awayTeamId.equals(teamA._id),
    );

    // TODO: Make use of teamDetails for points and goals
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
    console.log(teamADetails.name, teamADetails);
    return teamADetails.name.localeCompare(teamBDetails.name);
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
              leagueId: league._id,
              season: league.currentSeason,
              division: table.division,
              matchweek: round + 1,
              homeTeamId: home._id,
              awayTeamId: away._id,
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
          homeTeamId: fixture.awayTeamId,
          awayTeamId: fixture.homeTeamId,
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

// Assumes teamNames are unique
// TODO: Make use of teamId instead
export async function findLeaguePosition(
  league: ILeagueSchema,
  division: number,
  teamName: string,
  season?: number,
  matchweek?: number,
) {
  const seasonOfInterest = season || league.currentSeason;

  const teams = await sortTeams(
    league._id.toString(),
    (
      league.tables.find(
        (table) =>
          table.division === division && table.season === seasonOfInterest,
      ) as ITable
    ).teams as ITeamsSchema[],
  );
  return teams.map((team) => team.name).indexOf(teamName) + 1;
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

/**
 *
 * Parameters that vary: season, matchweek
 */
export async function calculateTeamDetails(
  league: ILeagueSchema,
  teamId: Types.ObjectId,
  season?: number,
  asOfTheEndOfMathweek?: number,
): Promise<ITeamDetails | null> {
  console.log('HIT 1.0');
  const team = await Team.findById(teamId);
  console.log('HIT 1.1');
  if (!team) return null;

  const seasonOfInterest = season || league.currentSeason;
  const matchweekOfInterest = asOfTheEndOfMathweek || league.currentMatchweek;
  console.log('HIT 1.2');

  console.log(team);
  console.log('HIT 1.3');

  const teamStats = await calculateTeamStats(
    league,
    team,
    seasonOfInterest,
    matchweekOfInterest,
  );

  const position = await findLeaguePosition(
    league,
    team.division,
    team.name,
    seasonOfInterest,
    matchweekOfInterest,
  );
  console.log('HIT 1.4');

  return {
    teamId: teamId,
    name: team.name,
    division: team.division,
    leaguePosition: position,
    form: teamStats.form,
    matchesPlayed: teamStats.matchesPlayed,
    wins: teamStats.wins,
    draws: teamStats.draws,
    losses: teamStats.losses,
    goalsFor: teamStats.goalsFor,
    goalsAgainst: teamStats.goalsAgainst,
    points: teamStats.points,
  };
}

async function calculateTeamStats(
  league: ILeagueSchema,
  team: ITeamsSchema,
  season?: number,
  asOfTheEndOfMathweek?: number,
): Promise<ITeamStats> {
  console.log('💥💥', team);

  if (!league)
    return {
      name: '',
      leagueId: null,
      division: 0,
      form: '',
      matchesPlayed: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    };

  const seasonOfInterest = season || league.currentSeason;
  const matchweekOfInterest = asOfTheEndOfMathweek || league.currentMatchweek;

  // Get the results from the specified season upto the specified matchweek
  const homeResults = await Result.find({
    homeTeamId: team._id,
    season: seasonOfInterest,
    matchweek: { $lte: matchweekOfInterest },
  });
  const awayResults = await Result.find({
    awayTeamId: team._id,
    season: seasonOfInterest,
    matchweek: { $lte: matchweekOfInterest },
  });

  // Go through homeResults
  let matchesPlayed = 0;
  let wins = 0;
  let draws = 0;
  let losses = 0;
  let goalsFor = 0;
  let goalsAgainst = 0;
  let points = 0;

  homeResults.forEach((result) => {
    const gFor = result.basicOutcome.filter((goal) => goal === 'home').length;
    const gAgainst = result.basicOutcome.filter(
      (goal) => goal === 'away',
    ).length;

    if (gFor > gAgainst) {
      // win
      wins += 1;
      points += 3;
    } else if (gFor < gAgainst) {
      // loss
      losses += 1;
      points += 0;
    } else {
      // draw
      draws += 1;
      points += 1;
    }
    // increment rest of stats
    matchesPlayed += 1;
    goalsFor += gFor;
    goalsAgainst += gAgainst;
  });
  awayResults.forEach((result) => {
    const gFor = result.basicOutcome.filter((goal) => goal === 'away').length;
    const gAgainst = result.basicOutcome.filter(
      (goal) => goal === 'home',
    ).length;

    if (gFor > gAgainst) {
      // win
      wins += 1;
      points += 3;
    } else if (gFor < gAgainst) {
      // loss
      losses += 1;
      points += 0;
    } else {
      // draw
      draws += 1;
      points += 1;
    }
    // increment rest of stats
    matchesPlayed += 1;
    goalsFor += gFor;
    goalsAgainst += gAgainst;
  });

  return {
    name: team.name,
    leagueId: team.leagueId,
    division: team.division,
    form: '',
    matchesPlayed: matchesPlayed,
    wins: wins,
    draws: draws,
    losses: losses,
    goalsFor: goalsFor,
    goalsAgainst: goalsAgainst,
    points: points,
  };
}
