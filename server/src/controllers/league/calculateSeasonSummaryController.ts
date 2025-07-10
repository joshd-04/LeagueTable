import { NextFunction, Request, Response } from 'express';
import League from '../../models/leagueModel';
import {
  IFixtureSchema,
  ILeagueSchema,
  IResultSchema,
} from '../../util/definitions';
import { ErrorHandling } from '../../util/errorChecking';

interface statsInterface {
  goalsScored: number;
  cleansheets: number;
  ownGoals?: number;
  hattricks?: number;
  soloGoals?: number;
}

export async function calculateSeasonSummaryController(
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
        path: 'results',
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

    const stats: statsInterface = {
      goalsScored: -1,
      cleansheets: -1,
    };

    const allResults = league.results as unknown as IResultSchema[];
    const results = allResults.filter(
      (result) => result.season === league.currentSeason
    );
    // Get number of goals scored
    stats.goalsScored = results.reduce(
      (acc, cur) => acc + cur.basicOutcome.length,
      0
    );

    stats.cleansheets = results.reduce((acc, cur) => {
      let cs = 0;
      if (!cur.basicOutcome.includes('home')) cs += 1;
      if (!cur.basicOutcome.includes('away')) cs += 1;
      return acc + cs;
    }, 0);

    if (league.leagueType === 'advanced') {
      stats.ownGoals = results.reduce((acc, cur) => {
        const ownGoals =
          cur.detailedOutcome?.reduce((a, c) => (c.isOwnGoal ? a + 1 : a), 0) ||
          0;
        return acc + ownGoals;
      }, 0);

      stats.soloGoals = results.reduce((acc, cur) => {
        const soloGoals =
          cur.detailedOutcome?.reduce(
            (a, c) => (c.assist === undefined ? a + 1 : a),
            0
          ) || 0;
        return acc + soloGoals;
      }, 0);

      stats.hattricks = results.reduce((acc, cur) => {
        if (!cur.detailedOutcome) return acc;
        let hattricks = 0;

        const scorers = cur.detailedOutcome.map((goal) => goal.scorer);
        const scorersDict: { [key: string]: number } = {};
        scorers.forEach((scorer) => {
          if (Object.keys(scorersDict).includes(scorer)) {
            scorersDict[scorer] += 1;
          } else {
            scorersDict[scorer] = 1;
          }
        });
        Object.entries(scorersDict).forEach((value) => {
          const goals = value[1];
          hattricks += Math.floor(goals / 3);
        });
        return acc + hattricks;
      }, 0);
    }

    res
      .status(200)
      .json({ status: 'success', data: { seasonSummaryStats: stats } });
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
