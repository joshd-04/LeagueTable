export type AccountTypeInterface = 'free' | 'pro' | 'pro+';

export interface User {
  id: string;
  username: string;
  email: string;
  accountType: AccountTypeInterface;
}

export interface League {
  _id: string;
  leagueLevel: AccountTypeInterface;
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
  teamsCount: number;
  fixturesCount: number;
  leagueOwner: {
    accountType: AccountTypeInterface;
    username: string;
    _id: string;
  };
  leagueType: 'basic' | 'advanced';
  maxSeasonLimit: number | null;
  name: string;
  tables: Table[];
  engagement: {
    totalViews: number;
    viewsThisWeek?: number;
    followersCount?: number;
    favoritesCount?: number;
  };
}

export interface Table {
  division: number;
  name: string;
  numberOfTeams: number;
  numberOfTeamsToBePromoted: number;
  numberOfTeamsToBeRelegated: number;
  season: number;
  teams: Team[];
  _id: string;
}
export interface TeamDetails {
  teamId: string;
  name: string;
  division: number;
  leaguePosition: number;
  form: string;
  wins: number;
  draws: number;
  losses: number;
  matchesPlayed: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  _id: string;
}
export interface Fixture {
  division: number;
  season: number;
  matchweek: number;
  neutralGround: false;
  awayTeamId: string;
  homeTeamId: string;
  _id: string;
}

export interface Result {
  season: number;
  division: number;
  matchweek: number;
  awayTeamId: string;
  homeTeamId: string;
  neutralGround: boolean;
  basicOutcome: ('home' | 'away')[];
  detailedOutcome?: {
    scorer: string;
    assist: string | undefined;
    team: 'home' | 'away';
    isOwnGoal: boolean;
    _id: string;
  }[];
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
    data: { position: number; team: string; teamId: string; value: number }[];
  }[];
  topScorers: {
    division: number;
    data: {
      position: number;
      player: string;
      team: string;
      teamId: string;
      value: number;
    }[];
  }[];
  mostAssists: {
    division: number;
    data: {
      position: number;
      player: string;
      team: string;
      teamId: string;
      value: number;
    }[];
  }[];
  ownGoals: {
    division: number;
    data: {
      position: number;
      player: string;
      team: string;
      teamId: string;
      value: number;
    }[];
  }[];
}

export interface Team {
  name: string;
  leagueId: string;
  division: number;
  season: number;
  _id: string;
}

export interface TeamStats {
  name: string;
  leagueId: string | null;
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

export interface NotificationInterface {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string | (() => string);
  description?: string | (() => string);
  duration: number;
}
