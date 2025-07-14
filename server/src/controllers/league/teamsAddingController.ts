import { NextFunction, Request, Response } from 'express';
import League from '../../models/leagueModel';
import { ILeagueSchema } from '../../util/definitions';
import { ErrorHandling } from '../../util/errorChecking';
import { Types } from 'mongoose';
import Team from '../../models/teamModel';

// Need to check if tables have been added first
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
  // Make sure the league has tables

  if (!league.setup.tablesAdded) {
    return next(
      new ErrorHandling(403, {
        message: 'You must add tables to this league first.',
      })
    );
  }

  // Make sure the league doesn't already have the teams
  if (league.setup.teamsAdded) {
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
      pointer += table.numberOfTeams;

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
        'Something went wrong adding your teams to the league'
      )
    );
  }

  // Update setup flag
  await League.findByIdAndUpdate(leagueId, {
    $set: { 'setup.teamsAdded': true },
  });

  const sanitizedLeague = {
    name: newLeague.name,
    currentSeason: newLeague.currentSeason,
    maxSeasonCount: newLeague.maxSeasonCount,
    divisionsCount: newLeague.divisionsCount,
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
