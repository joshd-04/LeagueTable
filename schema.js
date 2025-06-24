// Users
const users = [
  {
    _id: '1322',
    username: 'rxre_',
    passwordHash: 'aushd12312',
    email: 'rxre@gmail.com',
    accountType: 'free',
    leaguesCreated: ['ASDA'],
  },
];

// League
const leagues = [
  {
    _id: 'ASDA',
    name: 'Super Universal League',
    leagueOwner: '1322',
    season: 1,
    tables: [
      {
        division: 1,
        name: 'Div 1',
        numTeams: 10,
        teams: [
          {
            name: 'rare',
            matchesPlayed: 3,
            wins: 2,
            draws: 0,
            losses: 1,
            goalsFor: 5,
            goalsAgainst: 2,
            form: 'WLW',
          },
          // ...
        ],
        teamsToBeRelegated: 3,
        teamsToBePromoted: 0,
      },
    ],
    fixtures: [
      {
        matchweek: 4,
        homeTeam: 'rare',
        awayTeam: 'itzsuper',
        neutralGround: false,
      },
    ],
    results: [
      {
        season: 1,
        matchweek: 1,
        homeTeam: 'rare',
        awayTeam: 'fcbarcelonafan',
        neutralGround: false,
        // e.g. 3-1 scoreline to rare

        // Without extra details
        outcome: ['home', 'away', 'home', 'home'],

        // With extra details
        outcome2: [
          {
            team: 'home',
            scorer: 'Salah',
            assist: 'Rodri',
          },
          {
            team: 'away',
            scorer: 'Dembele',
            assist: 'van Dijk',
          },
          {
            team: 'home',
            scorer: 'Salah',
            assist: null,
          },
          {
            team: 'home',
            scorer: 'Gakpo',
            assist: 'Salah',
          },
        ],
      },
    ],
  },
];
