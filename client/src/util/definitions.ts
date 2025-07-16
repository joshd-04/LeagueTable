export interface User {
  id: string;
  username: string;
  email: string;
  accountType: 'free' | 'pro';
}

export interface League {
  _id: string;
  leagueLevel: 'free' | 'standard';
  announcement?: { text: string; date: Date };
  newsFeed?: { season: number; matchweek: number; news: string[] };
  setup: {
    tablesAdded: boolean;
    teamsAdded: boolean;
    leagueFinished: boolean;
  };
  currentMatchweek: number;
  currentSeason: number;
  finalMatchweek: number;
  divisionsCount: number;
  fixtures: string[];
  leagueOwner: {
    accountType: 'free' | 'pro';
    email: string;
    favouriteLeagues: string[];
    followedLeagues: string[];
    leaguesCreated: string[];
    username: string;
    _id: string;
  };
  leagueType: 'basic' | 'advanced';
  maxSeasonCount: number;
  name: string;
  results: string[];
  tables: {
    division: number;
    name: string;
    numberOfTeams: number;
    numberOfTeamsToBePromoted: number;
    numberOfTeamsToBeRelegated: number;
    season: number;
    teams: Team[];
    _id: string;
  }[];
}

export interface Fixture {
  division: number;
  season: number;
  matchweek: number;
  neutralGround: false;
  awayTeamDetails: {
    position: number;
    division: number;
    draws: number;
    form: string;
    goalsAgainst: number;
    goalsFor: number;
    leagueId: string;
    losses: number;
    matchesPlayed: number;
    name: string;
    wins: number;
    _id: string;
  };
  homeTeamDetails: {
    position: number;
    division: number;
    draws: number;
    form: string;
    goalsAgainst: number;
    goalsFor: number;
    leagueId: string;
    losses: number;
    matchesPlayed: number;
    name: string;
    wins: number;
    _id: string;
  };
  _id: string;
}

export interface Result {
  season: number;
  division: number;
  matchweek: number;
  neutralGround: boolean;
  basicOutcome: ('home' | 'away')[];
  detailedOutcome?: {
    scorer: string;
    assist: string | undefined;
    team: 'home' | 'away';
    isOwnGoal: boolean;
    _id: string;
  }[];
  homeTeamDetails: {
    division: number;
    form: string;
    leaguePosition: number;
    matchesPlayed: number;
    name: string;
    points: number;
    teamId: string;
  };
  awayTeamDetails: {
    division: number;
    form: string;
    leaguePosition: number;
    matchesPlayed: number;
    name: string;
    points: number;
    teamId: string;
  };
  _id: string;
}

export interface SeasonSummaryStatsInterface {
  goalsScored: number;
  cleansheets: number;
  ownGoals?: number;
  hattricks?: number;
  soloGoals?: number;
}

export interface SeasonStats {
  cleansheets: {
    division: number;
    data: { position: number; team: string; value: number }[];
  }[];
  topScorers: {
    division: number;
    data: { position: number; player: string; team: string; value: number }[];
  }[];
  mostAssists: {
    division: number;
    data: { position: number; player: string; team: string; value: number }[];
  }[];
}

export interface Team {
  position?: number;
  division: number;
  draws: number;
  form: string;
  goalsAgainst: number;
  goalsFor: number;
  leagueId: string;
  losses: number;
  matchesPlayed: number;
  name: string;
  wins: number;
  _id: string;
}
