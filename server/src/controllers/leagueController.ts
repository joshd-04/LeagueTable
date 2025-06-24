import { NextFunction, Request, Response } from 'express';
import League from '../models/leagueModel';
import {
  IFixtureSchema,
  ILeagueSchema,
  IResultSchema,
  ITeamDetails,
  ITeamsSchema,
} from '../util/definitions';
import { ErrorHandling } from '../util/errorChecking';
import { Document, Types } from 'mongoose';
import Team from '../models/teamModel';
import {
  calculateTeamPoints,
  generateFixtures,
  sortTeams,
} from '../util/helpers';
import Fixture from '../models/fixtureModel';
import Result from '../models/resultModel';

interface LeagueCreationReqBody {
  name: string;
  leagueOwner?: string;
  maxSeasonCount: number;
  leagueType: 'basic' | 'advanced';
  tables: {
    season?: number;
    division: number;
    name: string;
    numberOfTeams: number;
    numberOfTeamsToBeRelegated: number;
    numberOfTeamsToBePromoted: number;
  }[];
}

export async function leagueCreationController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  /*  Args: name, maxSeasonCount, leagueType, tables: {
    division, name, numberOfTeams, numberOfTeamsToBeRelegated, numberOfTeamsToBePromoted
  }
      Returns: 

      Note: there is a separate endpoint to add teams to the league
  */
  try {
    const userId: string = req.body.userId;
    const accountType: 'free' | 'pro' = req.body.accountType;
    const { name, maxSeasonCount, leagueType, tables }: LeagueCreationReqBody =
      req.body;

    const errors: {
      name?: string;
      leagueType?: string;
      maxSeasonCount?: string;
      table?: string;
    } = {};

    // Make sure the user does not already have a league with the same name

    const names = await League.aggregate([
      {
        $match: {
          $and: [{ leagueOwner: new Types.ObjectId(userId) }, { name: name }],
        },
      },
    ]);
    if (names.length > 0) {
      errors.name = `You already have a league named '${name}'`;
    }

    // If the user has a free account, league can have max of 2 seasons
    if (accountType === 'free' && maxSeasonCount > 2) {
      errors.maxSeasonCount =
        'Leagues created by free accounts have a 2 season limit';
    }

    // @ts-ignore
    if (leagueType !== 'basic' && leagueType !== 'advanced') {
      errors.leagueType = "leagueType can only be 'basic' or 'advanced'";
    }

    // Ensure each table provided follows the correct structure

    const isTable: boolean =
      Array.isArray(tables) &&
      tables !== null &&
      tables.length !== 0 &&
      tables.reduce((prev, cur) => {
        if (prev === false) {
          return false;
        }
        if (
          typeof cur.division !== 'number' ||
          typeof cur.name !== 'string' ||
          typeof cur.numberOfTeams !== 'number' ||
          typeof cur.numberOfTeamsToBePromoted !== 'number' ||
          typeof cur.numberOfTeamsToBeRelegated !== 'number'
        ) {
          return false;
        }
        return true;
      }, true);

    if (!isTable) {
      errors.table =
        'Ensure that EACH TABLE you have provided the following required fields: division (integer), name (string), numberOfTeams  (integer), numberOfTeamsToBePromoted (integer), numberOfTeamsToBeRelegated (integer)';
    }

    // Make sure that the promotion/relegation division maths adds up correctly
    tables.forEach((table, i) => {
      if (!errors.table) {
        if (
          table.numberOfTeamsToBePromoted > 0.5 * table.numberOfTeams ||
          table.numberOfTeamsToBeRelegated > 0.5 * table.numberOfTeams
        ) {
          errors.table =
            'You cannot promote or relegate more than half the teams in the table.';
        }
        if (i === 0) {
          table.numberOfTeamsToBePromoted = 0;
        } else if (i === tables.length) {
          table.numberOfTeamsToBeRelegated = 0;
        }
        if (i > 0) {
          const previousTable = tables[i - 1];
          if (
            table.numberOfTeamsToBePromoted !==
            previousTable.numberOfTeamsToBeRelegated
          ) {
            errors.table =
              'The relegation / promotion numbers do not match between related leagues';
          }
        }
      }
    });

    if (Object.keys(errors).length > 0) {
      return next(new ErrorHandling(400, errors));
    }

    // Add the missing season to the tables and leagueOwner properties
    tables.forEach((table) => {
      table.season = 0;
    });

    const league = await League.create({
      name: name,
      leagueOwner: userId,
      currentSeason: 0,
      currentMatchweek: 0,
      maxSeasonCount: maxSeasonCount,
      leagueType: leagueType,
      tables: tables,
      fixtures: [],
      results: [],
    });

    const sanitizedLeague = {
      _id: league._id,
      name: league.name,
      currentSeason: league.currentSeason,
      currentMatchweek: league.currentMatchweek,
      maxSeasonCount: league.maxSeasonCount,
      leagueType: league.leagueType,
      tables: tables,
      fixtures: league.fixtures,
      results: league.results,
    };

    res.status(201).json({
      status: 'success',
      data: {
        league: sanitizedLeague,
      },
    });
  } catch (e: any) {
    return next(
      new ErrorHandling(
        500,
        undefined,
        `An unexpected error occured whilst trying to create a new league. ${e.message}`
      )
    );
  }
}

export async function leagueFetcherController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const leagueId = req.params.id;
    if (leagueId.length === 0) {
      return next(
        new ErrorHandling(400, { message: `League ID must be provided` })
      );
    }
    let league;
    try {
      league = await League.findById(leagueId).populate([
        { path: 'tables.teams' },
        { path: 'leagueOwner' },
        {
          path: 'fixtures',
          populate: [{ path: 'homeTeamDetails' }, { path: 'awayTeamDetails' }],
        },
      ]);
    } catch (error) {
      console.log(error);
      return next(
        new ErrorHandling(404, {
          message: `League with ID '${leagueId}' not found`,
        })
      );
    }
    if (!league) {
      return next(
        new ErrorHandling(404, {
          message: `League with ID '${leagueId}' not found`,
        })
      );
    }

    res.status(200).json({
      league: {
        _id: league._id,
        name: league.name,
        leagueOwner: league.leagueOwner,
        currentSeason: league.currentSeason,
        currentMatchweek: league.currentMatchweek,
        maxSeasonCount: league.maxSeasonCount,
        leagueType: league.leagueType,
        tables: league.tables,
        fixtures: league.fixtures,
        results: league.results,
      },
    });
  } catch (e: any) {
    next(new ErrorHandling(500, undefined, `Unexpected error ${e.message}`));
  }
}

export async function teamsAddingController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  /*  Args: teams: string[]
  Returns: 

  
  */
  const userId: string = req.body.userId;
  // Make sure the user owns the specified league
  const leagueId = req.params.id;
  let league: ILeagueSchema | null;
  try {
    league = await League.findById(leagueId);
  } catch {
    return next(
      new ErrorHandling(404, {
        message: `League with ID '${leagueId}' not found`,
      })
    );
  }

  if (!league) {
    return next(
      new ErrorHandling(404, {
        message: `League with ID '${leagueId}' not found`,
      })
    );
  }

  if (league.leagueOwner.toString() !== userId) {
    return next(
      new ErrorHandling(403, {
        message: `You are not permitted to make edits to this league`,
      })
    );
  }

  // Make sure the league doesn't already have the teams
  const numberOfTeams = (
    await League.aggregate([
      { $match: { _id: new Types.ObjectId(leagueId) } },
      { $unwind: '$tables' },
      {
        $group: {
          _id: '$_id',
          totalTeams: { $sum: { $size: '$tables.teams' } },
        },
      },
    ])
  )[0].totalTeams;

  if (numberOfTeams > 0) {
    return next(
      new ErrorHandling(403, {
        message: 'You have already added teams to this league',
      })
    );
  }

  const teamsList: string[] = req.body.teams;
  // Make sure the data contains unique teamnames only
  if (teamsList.length !== Array.from(new Set(teamsList)).length) {
    return next(
      new ErrorHandling(400, {
        message: 'Team names must be unique',
      })
    );
  }
  // Make sure the data is in a processable format
  const expectedTeamsCount = league.tables.reduce((acc, table) => {
    return (acc += table.numberOfTeams);
  }, 0);

  if (teamsList.length !== expectedTeamsCount) {
    return next(
      new ErrorHandling(400, {
        message: `Expected ${expectedTeamsCount} teams to be given in a single array. Got ${teamsList.length} teams.`,
      })
    );
  }

  // Add the teams to the tables
  let pointer = 0;
  const newTables = [...league.tables];
  let errorHasOccured = false;

  await Promise.all(
    league.tables.map(async (table, i) => {
      const teamsForThisDivision = teamsList.slice(
        pointer,
        pointer + table.numberOfTeams
      );

      const createdTeams = await Promise.all(
        teamsForThisDivision.map(async (teamName) => {
          const team = await Team.create({
            name: teamName,
            leagueId: leagueId,
            division: i + 1,
            matchesPlayed: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            form: '-----',
          });

          if (!team._id) {
            throw new ErrorHandling(500, undefined, 'Failed to create team');
          }

          return new Types.ObjectId(team._id.toString());
        })
      );

      // @ts-ignore
      newTables[i].teams.push(...createdTeams);
      pointer += table.numberOfTeams;
    })
  );

  if (errorHasOccured) {
    return next(
      new ErrorHandling(
        500,
        undefined,
        'Something went wrong adding your teams to the league'
      )
    );
  }

  // Update the tables field in the document to the newer version with the updated teams

  const newLeague = await League.findByIdAndUpdate(leagueId, {
    tables: newTables,
    new: true,
  });

  if (!newLeague) {
    return next(
      new ErrorHandling(
        500,
        undefined,
        'Something went wrong adding your teams to the leaguessss'
      )
    );
  }

  const sanitizedLeague = {
    name: newLeague.name,
    currentSeason: newLeague.currentSeason,
    maxSeasonCount: newLeague.maxSeasonCount,
    leagueType: newLeague.leagueType,
    tables: newTables,
    fixtures: newLeague.fixtures,
    results: newLeague.results,
  };

  // Add the teams to the league
  res
    .status(201)
    .json({ status: 'success', data: { league: sanitizedLeague } });
}

export async function startNextSeasonController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  /* 
    1. Ensure the league exists and the user is the owner
    2. Ensure that their league doesn't exceed the max season count
    3. Handle season 0->1
    4. Handle season n->n+1
    5. Generate fixtures
  */
  try {
    const userId: string = req.body.userId;
    // 1. Ensure the league exists and the user is the owner
    // Make sure the user owns the specified league
    const leagueId = req.params.id;
    let league: ILeagueSchema | null;
    try {
      league = await League.findById(leagueId).populate('tables.teams');
    } catch {
      return next(
        new ErrorHandling(404, {
          message: `League with ID '${leagueId}' not found`,
        })
      );
    }

    if (!league) {
      return next(
        new ErrorHandling(404, {
          message: `League with ID '${leagueId}' not found`,
        })
      );
    }

    if (league.leagueOwner.toString() !== userId) {
      return next(
        new ErrorHandling(403, {
          message: `You are not permitted to make edits to this league`,
        })
      );
    }

    // Make sure the league has teams
    const numberOfTeams = (
      await League.aggregate([
        { $match: { _id: new Types.ObjectId(leagueId) } },
        { $unwind: '$tables' },
        {
          $group: {
            _id: '$_id',
            totalTeams: { $sum: { $size: '$tables.teams' } },
          },
        },
      ])
    )[0].totalTeams;
    if (numberOfTeams === 0) {
      return next(
        new ErrorHandling(403, {
          message: 'You must add teams to this league first.',
        })
      );
    }

    if (league.fixtures.length > 0) {
      return next(
        new ErrorHandling(403, {
          message: 'The season is not over yet.',
        })
      );
    }

    // 2. Ensure that their league doesn't exceed the max season count
    if (league.currentSeason === league.maxSeasonCount) {
      return next(
        new ErrorHandling(403, {
          message:
            'You have reached the maximum number of seasons of this league.',
        })
      );
    }

    // 3. Handle season 0->1
    const newLeague = league;
    newLeague.currentMatchweek = 0;
    if (newLeague.currentSeason === 0) {
      newLeague.currentSeason = 1;
      newLeague.tables = newLeague.tables.map((table) => {
        return { ...table, season: 1 };
      });
    }
    // 4. Handle season n->n+1
    else {
      newLeague.currentSeason += 1;

      /*
      // Each array is a division
      const nextSeasonTeams: string[][] = [];

      // Handle promotion/relegation
      // a. Get this seasons ordered tables
      // b. Find the teams to be relegated
      // c. Add these team names to
      league.tables
        .filter((table) => {
          table.season === league.currentSeason;
        })
        .map((table) => {
          // @ts-ignore
          table.teams = sortTeams(table.teams) as ITeamsSchema[];
          const promoted = table.teams.slice(
            0,
            table.numberOfTeamsToBePromoted
          ).map(team => team.name)
          const relegated = table.teams.slice(
            table.numberOfTeams - table.numberOfTeamsToBeRelegated
          ).map(team => team.name)
        });*/

      // Set up new tables

      const newTables = await Promise.all(
        newLeague.tables
          .filter((table) => table.season === newLeague.currentSeason - 1)
          .map(async (table) => {
            const updatedTeams = await Promise.all(
              table.teams.map(async (team: ITeamsSchema | Types.ObjectId) => {
                if (team instanceof Types.ObjectId) {
                  throw new ErrorHandling(
                    500,
                    undefined,
                    'Team must be of instance ITeamSchema during starting of league season, did you forget to populate table.teams?'
                  );
                }

                // Convert team to plain object and create a new team with reset stats
                const updatedTeam = {
                  ...team.toObject(),
                  _id: new Types.ObjectId(), // Generate a new unique ObjectId
                  division: team.division,
                  leagueId: leagueId,
                  matchesPlayed: 0,
                  wins: 0,
                  draws: 0,
                  losses: 0,
                  goalsFor: 0,
                  goalsAgainst: 0,
                  form: '-----',
                } as ITeamsSchema;

                // Insert the updated team into the database
                const t = await Team.create(updatedTeam);
                return t._id; // Return the new team's ObjectId
              })
            );

            return {
              season: table.season + 1,
              division: table.division,
              name: table.name,
              numberOfTeams: table.numberOfTeams,
              teams: updatedTeams, // Use the resolved array of new team ObjectIds
              numberOfTeamsToBeRelegated: table.numberOfTeamsToBeRelegated,
              numberOfTeamsToBePromoted: table.numberOfTeamsToBePromoted,
            };
          })
      );

      // @ts-ignore
      newLeague.tables.push(...newTables);
    }

    // Generate the fixtures
    const fixtures: IFixtureSchema[] = (await generateFixtures(
      newLeague
    )) as IFixtureSchema[];

    newLeague.fixtures.push(...fixtures.map((f) => f._id as Types.ObjectId));

    newLeague.currentMatchweek = 1;

    // Replace old league with new league
    await League.replaceOne({ _id: leagueId }, newLeague);

    const updatedLeague = await League.findById(leagueId);

    res.status(200).send({ status: 'success', league: updatedLeague });
  } catch (e: any) {
    console.error(e);
    return next(
      new ErrorHandling(
        500,
        undefined,
        `There was an error starting the season. ${e.message}`
      )
    );
  }
}

export async function startNextMatchweek(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId: string = req.body.userId;
    // Make sure the user owns the specified league
    const leagueId = req.params.id;
    let league: ILeagueSchema | null;

    try {
      league = await League.findById(leagueId).populate({
        path: 'fixtures',
        populate: [{ path: 'homeTeamDetails' }, { path: 'awayTeamDetails' }],
      });
    } catch {
      return next(
        new ErrorHandling(404, {
          message: `League with ID '${leagueId}' not found`,
        })
      );
    }

    if (!league) {
      return next(
        new ErrorHandling(404, {
          message: `League with ID '${leagueId}' not found`,
        })
      );
    }

    if (userId !== league.leagueOwner.toString()) {
      return next(
        new ErrorHandling(403, {
          message: `You are not permitted to make edits to this league`,
        })
      );
    }

    const maximumMatchweek = league.tables.reduce(
      (prev, table) => Math.max(table.numberOfTeams, prev),
      0
    );

    if (league.currentMatchweek >= maximumMatchweek) {
      return next(
        new ErrorHandling(403, {
          message: `The season is over. Start a new one to continue.`,
        })
      );
    }

    if (league.currentSeason === 0) {
      return next(
        new ErrorHandling(403, {
          message: `The season has not started, start the season before continuing.`,
        })
      );
    }

    league.currentMatchweek += 1;

    const allFixtures = league.fixtures as unknown as IFixtureSchema[];

    const fixturesNowLeft = allFixtures.filter(
      (fixture) => fixture.matchweek <= league.currentMatchweek
    );

    await League.findByIdAndUpdate(leagueId, {
      currentMatchweek: league.currentMatchweek,
    });

    res
      .status(200)
      .json({ status: 'success', data: { fixtures: fixturesNowLeft } });
  } catch (e: any) {
    console.error(e);
    return next(
      new ErrorHandling(
        500,
        undefined,
        `There was an error starting the next matchweek. ${e.message}`
      )
    );
  }
}

export async function getFixturesStillToBePlayed(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const leagueId = req.params.id;
    let league: ILeagueSchema | null;

    try {
      league = await League.findById(leagueId).populate({
        path: 'fixtures',
        populate: [{ path: 'homeTeamDetails' }, { path: 'awayTeamDetails' }],
      });
    } catch {
      return next(
        new ErrorHandling(404, {
          message: `League with ID '${leagueId}' not found`,
        })
      );
    }

    if (!league) {
      return next(
        new ErrorHandling(404, {
          message: `League with ID '${leagueId}' not found`,
        })
      );
    }
    const allFixtures = league.fixtures as unknown as IFixtureSchema[];

    const fixturesStillToBePlayed = allFixtures.filter((fixture) => {
      return fixture.matchweek <= league.currentMatchweek;
    });

    res
      .status(200)
      .json({ status: 'success', data: { fixtures: fixturesStillToBePlayed } });
  } catch (e: any) {
    console.error(e);
    return next(
      new ErrorHandling(
        500,
        undefined,
        `There was an error fetching the fixtures that are still to be played. ${e.message}`
      )
    );
  }
}

export async function turnFixtureIntoResult(
  req: Request,
  res: Response,
  next: NextFunction
) {
  /*  Args: fixtureId, basicOutcome, detailedOutcome?
    
        Returns: 
  
        Note: there is a separate endpoint to add teams to the league
    */

  try {
    const fixtureId = req.body.fixtureId;
    const basicOutcome: ('home' | 'away')[] = req.body.basicOutcome;
    const detailedOutcome:
      | {
          team: 'home' | 'away';
          scorer: string;
          assist?: string;
        }[]
      | null = req.body.detailedOutcome || null;

    // Check if fixture exists
    let fixture: IFixtureSchema | null;
    try {
      fixture = await Fixture.findById(fixtureId).populate([
        { path: 'homeTeamDetails' },
        { path: 'awayTeamDetails' },
      ]);
    } catch {
      return next(
        new ErrorHandling(404, {
          message: `Fixture with ID '${fixtureId}' not found`,
        })
      );
    }
    if (!fixture) {
      return next(
        new ErrorHandling(404, {
          message: `Fixture with ID '${fixtureId}' not found`,
        })
      );
    }
    const homeDetails = fixture.homeTeamDetails as unknown as ITeamsSchema;
    const awayDetails = fixture.awayTeamDetails as unknown as ITeamsSchema;

    const leagueId = homeDetails.leagueId;
    let league: ILeagueSchema | null;

    // Check if league exists
    try {
      league = await League.findById(leagueId).populate([
        { path: 'tables.teams' },
        {
          path: 'fixtures',
          populate: [{ path: 'homeTeamDetails' }, { path: 'awayTeamDetails' }],
        },
      ]);
    } catch {
      return next(
        new ErrorHandling(404, {
          message: `League with ID '${leagueId}' not found`,
        })
      );
    }

    if (!league) {
      return next(
        new ErrorHandling(404, {
          message: `League with ID '${leagueId}' not found`,
        })
      );
    }

    // Check that basic outcome given in correct format
    let basicOutcomeFlag = false;
    if (!Array.isArray(basicOutcome)) {
      basicOutcomeFlag = true;
    } else {
      basicOutcome.forEach((element) => {
        if (element !== 'home' && element !== 'away') {
          basicOutcomeFlag = true;
        }
      });
    }

    if (basicOutcomeFlag) {
      return next(
        new ErrorHandling(400, {
          message: `Property 'basicOutcome' must be an array of "home" or "away"`,
        })
      );
    }

    // Check that detailedOutcome provided if applicable
    let detailedOutcomeFlag = false;
    if (league.leagueType === 'advanced' && detailedOutcome === null) {
      detailedOutcomeFlag = true;
    } else if (league.leagueType === 'advanced') {
      if (!Array.isArray(detailedOutcome)) {
        detailedOutcomeFlag = true;
      } else {
        interface goal {
          team: 'home' | 'away';
          scorer: string;
          assist?: string;
        }
        detailedOutcome.forEach((element) => {
          if (
            !(
              typeof element.team === 'string' &&
              typeof element.scorer === 'string' &&
              (typeof element.assist === 'string' ||
                typeof element.assist === 'undefined')
            )
          ) {
            detailedOutcomeFlag = true;
          }
        });
      }
    }

    if (detailedOutcomeFlag === true) {
      return next(
        new ErrorHandling(400, {
          message: `Property 'detailedOutcome' is required because this league is an 'advanced' league. Property 'detailedOutcome' must have a team: str, scorer: str, assist?: str | undefined`,
        })
      );
    }

    const homeTeamPosition = sortTeams(
      league.tables[homeDetails.division - 1].teams as ITeamsSchema[]
    )
      .map((team) => team.name)
      .indexOf(homeDetails.name);

    const awayTeamPosition = sortTeams(
      league.tables[awayDetails.division - 1].teams as ITeamsSchema[]
    )
      .map((team) => team.name)
      .indexOf(awayDetails.name);

    const result = await Result.create({
      season: fixture.season,
      division: fixture.division,
      matchweek: fixture.matchweek,
      homeTeamDetails: {
        teamId: homeDetails._id,
        name: homeDetails.name,

        division: homeDetails.division,
        leaguePosition: homeTeamPosition,
        form: homeDetails.form,
        matchesPlayed: homeDetails.matchesPlayed,
        points: calculateTeamPoints(homeDetails),
      },
      awayTeamDetails: {
        teamId: awayDetails._id,
        name: awayDetails.name,
        division: awayDetails.division,
        leaguePosition: awayTeamPosition,
        form: awayDetails.form,
        matchesPlayed: awayDetails.matchesPlayed,
        points: calculateTeamPoints(awayDetails),
      },
      neutralGround: fixture.neutralGround,
      kickoff: fixture.kickoff,
      basicOutcome: basicOutcome,
      detailedOutcome: detailedOutcome || undefined,
    });

    // Delete fixture from fixture list
    console.log(fixtureId, leagueId);
    await Fixture.findByIdAndDelete(fixtureId);
    await League.findByIdAndUpdate(leagueId, {
      $pull: { fixtures: fixtureId },
    });
    console.log(696969);

    // Change the form of the away and the home team
    const homeGoals = basicOutcome.reduce(
      (prev, val) => (val === 'home' ? prev + 1 : prev),
      0
    );
    const awayGoals = basicOutcome.reduce(
      (prev, val) => (val === 'away' ? prev + 1 : prev),
      0
    );

    const matchOutcome: 'home' | 'draw' | 'away' =
      homeGoals === awayGoals
        ? 'draw'
        : homeGoals > awayGoals
        ? 'home'
        : 'away';

    let newHomeFormArr = homeDetails.form.split('');
    newHomeFormArr.push(
      matchOutcome === 'home' ? 'W' : matchOutcome === 'away' ? 'L' : 'D'
    );
    let newAwayFormArr = awayDetails.form.split('');
    newAwayFormArr.push(
      matchOutcome === 'home' ? 'L' : matchOutcome === 'away' ? 'W' : 'D'
    );

    const newHomeForm = newHomeFormArr.slice(1).join('');
    const newAwayForm = newAwayFormArr.slice(1).join('');

    await Promise.all([
      Team.findByIdAndUpdate(homeDetails._id, { form: newHomeForm }),
      Team.findByIdAndUpdate(awayDetails._id, { form: newAwayForm }),
    ]);

    res.status(200).json({ status: 'success', data: { fixtures: result } });
  } catch (e: any) {
    console.error(e);
    return next(
      new ErrorHandling(
        500,
        undefined,
        `There was an error fetching the fixtures that are still to be played. ${e.message}`
      )
    );
  }
}
