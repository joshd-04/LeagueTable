import { NextFunction, Request, Response } from 'express';
import League from '../../models/leagueModel';
import {
  IFixtureSchema,
  ILeagueSchema,
  ITeamsSchema,
} from '../../util/definitions';
import { ErrorHandling } from '../../util/errorChecking';
import { Types } from 'mongoose';
import Team from '../../models/teamModel';
import { generateFixtures } from '../../util/helpers';

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
            'You have reached the maximum number of seasons of this league. Upgrade the league level to continue this league.',
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

    const finalMatchweek = fixtures.reduce((acc, fixture) => {
      return Math.max(fixture.matchweek, acc);
    }, 0);

    newLeague.finalMatchweek = finalMatchweek;

    newLeague.fixtures.push(...fixtures.map((f) => f._id as Types.ObjectId));

    newLeague.currentMatchweek = 1;

    // Replace old league with new league
    await League.replaceOne({ _id: leagueId }, newLeague);

    const updatedLeague = await League.findById(leagueId);

    res.status(200).json({ status: 'success', league: updatedLeague });
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
