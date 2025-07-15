import { NextFunction, Request, Response } from 'express';
import League from '../../models/leagueModel';
import {
  IFixtureSchema,
  ILeagueSchema,
  IResultSchema,
  ITeamsSchema,
} from '../../util/definitions';
import { ErrorHandling } from '../../util/errorChecking';
import { sortTeams } from '../../util/helpers';

interface statsInterface {
  goalsScored: number;
  cleansheets: number;
  ownGoals?: number;
  hattricks?: number;
  soloGoals?: number;
}

export async function getTeamsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const leagueId = req.params.id;
    let league: ILeagueSchema | null;

    // Check if league exists
    try {
      league = await League.findById(leagueId).populate({
        path: 'tables.teams',
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

    // Get the teams from the division specified for THIS SEASON ONLY for now! (update this later when season rewind implemented)
    const divisionRequested = req.query.division || 1;

    if (+divisionRequested > league.divisionsCount) {
      return next(
        new ErrorHandling(400, {
          message: `This league does not have ${divisionRequested} divisions. Highest division is ${league.divisionsCount} divisions`,
        })
      );
    }

    let seasonRequested = league.currentSeason;

    if (league.leagueLevel === 'free' || req.query.season === undefined) {
      // do nothing
    } else {
      if (
        req.query.season !== undefined &&
        Number.isInteger(Number(req.query.season))
      ) {
        seasonRequested = +req.query.season;
      } else {
        // do nothing
      }
    }

    let teams = league.tables.filter(
      (t) => t.season === seasonRequested && t.division === +divisionRequested
    )[0].teams as ITeamsSchema[];
    teams = sortTeams(teams).map((team, i) => {
      return { position: i + 1, ...team.toObject() } as ITeamsSchema;
    });
    console.log(teams);

    res.status(200).json({ status: 'success', data: { teams: teams } });
  } catch (e: any) {
    console.error(e);
    return next(
      new ErrorHandling(
        500,
        undefined,
        `There was an error calculating the season summary statistics. ${e.message}`
      )
    );
  }
}
