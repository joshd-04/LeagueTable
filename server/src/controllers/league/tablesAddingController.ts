import { NextFunction, Request, Response } from 'express';
import League from '../../models/leagueModel';
import { ILeagueSchema } from '../../util/definitions';
import { ErrorHandling } from '../../util/errorChecking';

export async function tablesAddingController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  /*  Args: tables: [{
    division, name, numberOfTeams, numberOfTeamsToBeRelegated, numberOfTeamsToBePromoted
}]
      Returns: 

      Note: there is a separate endpoint to add tables (then teams) to the league
  */ try {
    const userId: string = req.body.userId;
    //  Make sure the user owns the specified league
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

    // Make sure the league doesnt already have the tables

    if (league.setup.tablesAdded) {
      return next(
        new ErrorHandling(403, {
          message: 'You have already added tables to this league',
        })
      );
    }

    const tables: {
      season?: number;
      division: number;
      name: string;
      numberOfTeams: number;
      numberOfTeamsToBeRelegated: number;
      numberOfTeamsToBePromoted: number;
    }[] = req.body.tables;

    const errors: {
      table?: string;
    } = {};

    if (tables.length !== league.divisionsCount) {
      return next(
        new ErrorHandling(400, {
          message: `This league has ${league.divisionsCount} tables, you gave: ${tables.length}`,
        })
      );
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

    if (Object.entries(errors).length > 0) {
      return next(
        new ErrorHandling(400, {
          message: errors.table,
        })
      );
    }

    // Add the missing season to the tables and leagueOwner properties
    tables.forEach((table) => {
      table.season = 0;
    });

    const newLeague = await League.findOneAndUpdate(
      { _id: leagueId },
      {
        $push: {
          tables: {
            $each: tables, // array of items to append
          },
        },
      },
      { new: true }
    );
    if (!newLeague) {
      return next(
        new ErrorHandling(
          500,
          undefined,
          'Something went wrong adding your tables to the league'
        )
      );
    }

    const teamsInLargestTable = Math.max(...tables.map((t) => t.numberOfTeams));
    // Update setup flag
    await League.findByIdAndUpdate(leagueId, {
      $set: {
        'setup.tablesAdded': true,
        finalMatchweek: (teamsInLargestTable - 1) * 2,
      },
    });
    // Update the finalMatchweek attribute as we now know how many teams there will be

    const sanitizedLeague = {
      name: newLeague.name,
      currentSeason: newLeague.currentSeason,
      maxSeasonCount: newLeague.maxSeasonCount,
      divisionsCount: newLeague.divisionsCount,
      leagueType: newLeague.leagueType,
      tables: newLeague.tables,
      fixtures: newLeague.fixtures,
      results: newLeague.results,
    };

    res
      .status(201)
      .json({ status: 'success', data: { league: sanitizedLeague } });
  } catch (e: any) {
    return next(
      new ErrorHandling(
        500,
        undefined,
        `An unexpected error occured whilst trying to add tables to the league. ${e.message}`
      )
    );
  }
}
