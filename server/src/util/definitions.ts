import { Document, Types } from 'mongoose';

export interface ILeagueSchema extends Document {
  name: string;
  leagueOwner: Types.ObjectId;
  currentSeason: number;
  currentMatchweek: number;
  maxSeasonCount: number;
  divisionsCount: number;
  leagueType: 'basic' | 'advanced';
  tables: ITable[];
  fixtures: Types.ObjectId[];
  results: Types.ObjectId[];
  setup: {
    tablesAdded: boolean;
    teamsAdded: boolean;
    leagueFinished: boolean;
  };
}

export interface ITable {
  season: number;
  division: number;
  name: string;
  numberOfTeams: number;
  teams: Types.ObjectId[] | ITeamsSchema[];
  numberOfTeamsToBeRelegated: number;
  numberOfTeamsToBePromoted: number;
}

export interface ITeamDetails {
  teamId: Types.ObjectId;
  division: number;
  leaguePosition: number;
  form: string;
  matchesPlayed: string;
  points: number;
}

type team = 'home' | 'away';

export interface IFixtureSchema extends Document {
  season: number;
  division: number;
  matchweek: number;
  homeTeamDetails: Types.ObjectId;
  awayTeamDetails: Types.ObjectId;
  neutralGround: boolean;
  kickoff?: Date;
}

export interface IResultSchema extends Document {
  season: number;
  name: string;
  division: number;
  matchweek: number;
  homeTeamDetails: ITeamDetails;
  awayTeamDetails: ITeamDetails;
  neutralGround: boolean;
  kickoff?: Date;
  basicOutcome: team[];
  detailedOutcome?: { team: team; scorer: string; assist?: string }[];
}

export interface ITeamsSchema extends Document {
  name: string;
  leagueId: Types.ObjectId;
  division: number;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  form: string;
}

export interface IUserSchema extends Document {
  username: string;
  email: string;
  passwordHash: string;
  accountType: 'free' | 'pro';
  leaguesCreated: [];
  favouriteLeagues: [];
  followedLeagues: [];
}
