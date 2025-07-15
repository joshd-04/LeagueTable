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
import { generateFixtures, sortTeams } from '../../util/helpers';

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

      // 1. Gather previous season's tables (do not mutate them)
      const prevSeason = newLeague.currentSeason - 1;
      const prevSeasonTables = newLeague.tables.filter(
        (table) => table.season === prevSeason
      );

      // 2. Sort teams in each division
      const sortedTeamsByDivision: ITeamsSchema[][] = prevSeasonTables.map(
        (table) => sortTeams(table.teams as ITeamsSchema[])
      );

      const divisionsCount = prevSeasonTables.length;
      const newTeamsByDivision: ITeamsSchema[][] = Array.from(
        { length: divisionsCount },
        () => []
      );

      // 3. Promotion and relegation logic
      for (let div = 0; div < divisionsCount; div++) {
        const table = prevSeasonTables[div];
        const teams = sortedTeamsByDivision[div];
        const numPromote = table.numberOfTeamsToBePromoted;
        const numRelegate = table.numberOfTeamsToBeRelegated;

        // Start with teams that are neither promoted nor relegated
        let stayingTeams = teams.slice(numPromote, teams.length - numRelegate);

        // Add relegated teams from above (if not top division)
        if (div > 0) {
          const aboveTable = prevSeasonTables[div - 1];
          const aboveTeams = sortedTeamsByDivision[div - 1];
          const relegatedFromAbove = aboveTeams.slice(
            aboveTeams.length - aboveTable.numberOfTeamsToBeRelegated
          );
          stayingTeams = [...relegatedFromAbove, ...stayingTeams];
        }

        // Add promoted teams from below (if not bottom division)
        if (div < divisionsCount - 1) {
          const belowTable = prevSeasonTables[div + 1];
          const belowTeams = sortedTeamsByDivision[div + 1];
          const promotedFromBelow = belowTeams.slice(
            0,
            belowTable.numberOfTeamsToBePromoted
          );
          stayingTeams = [...stayingTeams, ...promotedFromBelow];
        }

        newTeamsByDivision[div] = stayingTeams;
      }

      // 4. Create new tables for the new season, resetting team stats
      const newTables = await Promise.all(
        newTeamsByDivision.map(async (teams, divIdx) => {
          const prevTable = prevSeasonTables[divIdx];
          const updatedTeams = await Promise.all(
            teams.map(async (team) => {
              const updatedTeam = {
                ...team.toObject(),
                _id: new Types.ObjectId(),
                division: prevTable.division,
                leagueId: leagueId,
                matchesPlayed: 0,
                wins: 0,
                draws: 0,
                losses: 0,
                goalsFor: 0,
                goalsAgainst: 0,
                form: '-----',
              } as ITeamsSchema;
              const t = await Team.create(updatedTeam);
              return t._id as Types.ObjectId;
            })
          );
          return {
            season: newLeague.currentSeason,
            division: prevTable.division,
            name: prevTable.name,
            numberOfTeams: prevTable.numberOfTeams,
            teams: updatedTeams as Types.ObjectId[],
            numberOfTeamsToBeRelegated: prevTable.numberOfTeamsToBeRelegated,
            numberOfTeamsToBePromoted: prevTable.numberOfTeamsToBePromoted,
          };
        })
      );

      // 5. Append new tables for the new season (do not overwrite previous tables)
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
