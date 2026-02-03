import { Document, Types } from 'mongoose';

export type AccountTypeInterface = 'free' | 'pro' | 'pro+';

export interface ILeagueSchema extends Document {
  _id: Types.ObjectId;
  name: string;
  leagueLevel: AccountTypeInterface;
  announcement?: {
    date: Date;
    text: string;
  };
  newsFeed?: { season: number; matchweek: number; news: string[] };
  leagueOwner: Types.ObjectId;
  currentSeason: number;
  currentMatchweek: number;
  finalMatchweek: number;
  maxSeasonLimit: number | null;
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
  engagement: {
    followersCount: number;
    favoritesCount: number;
    totalViews: number;
    viewsThisWeek: number;
    viewsThisWeekUpdatedAt: Date;
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
  name: string;
  division: number;
  leaguePosition: number;
  form: string;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

type team = 'home' | 'away';

export interface IFixtureSchema extends Document {
  _id: Types.ObjectId;
  leagueId: Types.ObjectId;
  season: number;
  division: number;
  matchweek: number;
  // homeTeamDetails: Types.ObjectId | ITeamsSchema;
  // awayTeamDetails: Types.ObjectId | ITeamsSchema;
  homeTeamId: Types.ObjectId;
  awayTeamId: Types.ObjectId;
  neutralGround: boolean;
  kickoff?: Date;
}

export interface IResultSchema extends Document {
  _id: Types.ObjectId;
  date: Date;
  leagueId: Types.ObjectId;
  season: number;
  name: string;
  division: number;
  matchweek: number;
  // homeTeamDetails: ITeamDetails;
  // awayTeamDetails: ITeamDetails;
  homeTeamId: Types.ObjectId;
  awayTeamId: Types.ObjectId;
  neutralGround: boolean;
  kickoff?: Date;
  basicOutcome: team[];
  detailedOutcome?: {
    team: team;
    scorer: string;
    assist?: string;
    isOwnGoal: boolean;
  }[];
}

export interface ITeamsSchema extends Document {
  _id: Types.ObjectId;
  // position?: number;
  name: string;
  leagueId: Types.ObjectId;
  division: number;
  season: number;
  // matchesPlayed: number;
  // wins: number;
  // draws: number;
  // losses: number;
  // goalsFor: number;
  // goalsAgainst: number;
  // form: string;
}

export interface ITeamStats {
  name: string;
  leagueId: Types.ObjectId | null;
  division: number;
  form: string;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export interface IUserSchema extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  passwordHash: string;
  accountType: AccountTypeInterface;
  leaguesCreated: [];
  favoriteLeagues: [];
  followedLeagues: [];
}
