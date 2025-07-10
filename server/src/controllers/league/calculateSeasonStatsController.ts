import { NextFunction, Request, Response } from 'express';
import League from '../../models/leagueModel';
import {
  IFixtureSchema,
  ILeagueSchema,
  IResultSchema,
} from '../../util/definitions';
import { ErrorHandling } from '../../util/errorChecking';

interface statsInterface {
  topScorers?: {
    division: number;
    data: {
      position?: number;
      player: string;
      team: string;
      value: number;
    }[];
  }[];
  mostAssists?: {
    division: number;
    data: {
      position?: number;
      player: string;
      team: string;
      value: number;
    }[];
  }[];
  cleansheets: {
    division: number;
    data: {
      position?: number;
      team: string;
      value: number;
    }[];
  }[];
}

export async function calculateSeasonStatsController(
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
      cleansheets: [],
    };

    for (let i = 0; i < league.divisionsCount; i++) {
      stats.cleansheets.push({ division: i + 1, data: [] });
    }

    if (league.leagueType === 'advanced') {
      stats.topScorers = [];
      stats.mostAssists = [];
      for (let i = 0; i < league.divisionsCount; i++) {
        stats.topScorers.push({ division: i + 1, data: [] });
        stats.mostAssists.push({ division: i + 1, data: [] });
      }
    }

    // Get this season's results
    const allResults = league.results as unknown as IResultSchema[];
    const results = allResults.filter(
      (result) => result.season === league.currentSeason
    );

    // Process results by divison
    stats.cleansheets.forEach((div) => {
      const division = div.division;

      const resultsForThisDivision = results.filter(
        (res) => res.division === division
      );
      // calculate cleansheets
      resultsForThisDivision.forEach((result) => {
        // Cleansheets
        if (!result.basicOutcome.includes('home')) {
          // away team kept a cleansheet
          const team = result.awayTeamDetails.name;
          const isInList = stats.cleansheets[division - 1].data.some(
            (x) => x.team === team
          );
          if (!isInList) {
            stats.cleansheets[division - 1].data.push({ team: team, value: 1 });
          } else {
            const index = stats.cleansheets[division - 1].data.findIndex(
              (div) => div.team === team
            );
            stats.cleansheets[division - 1].data[index].value += 1;
          }
        }
        if (!result.basicOutcome.includes('away')) {
          // home team kept a cleansheet
          const team = result.homeTeamDetails.name;
          const isInList = stats.cleansheets[division - 1].data.some(
            (x) => x.team === team
          );
          if (!isInList) {
            stats.cleansheets[division - 1].data.push({ team: team, value: 1 });
          } else {
            const index = stats.cleansheets[division - 1].data.findIndex(
              (div) => div.team === team
            );
            stats.cleansheets[division - 1].data[index].value += 1;
          }
        }
        if (league.leagueType !== 'advanced') return;
        result.detailedOutcome?.forEach((goal) => {
          if (stats.topScorers !== undefined && !goal.isOwnGoal) {
            let team: string;
            if (goal.team === 'home') {
              team = result.homeTeamDetails.name;
            } else {
              team = result.awayTeamDetails.name;
            }
            const isInList = stats.topScorers[division - 1].data.some(
              (x) => x.player === goal.scorer && x.team === team
            );
            if (!isInList) {
              stats.topScorers[division - 1].data.push({
                team: team,
                player: goal.scorer,
                value: 1,
              });
            } else {
              const index = stats.topScorers[division - 1].data.findIndex(
                (div) => div.team === team && div.player === goal.scorer
              );
              stats.topScorers[division - 1].data[index].value += 1;
            }
          }
          if (stats.mostAssists !== undefined && goal.assist !== undefined) {
            let team: string;
            if (goal.team === 'home') {
              team = result.homeTeamDetails.name;
            } else {
              team = result.awayTeamDetails.name;
            }
            const isInList = stats.mostAssists[division - 1].data.some(
              (x) => x.player === goal.assist && x.team === team
            );
            if (!isInList) {
              stats.mostAssists[division - 1].data.push({
                team: team,
                player: goal.assist,
                value: 1,
              });
            } else {
              const index = stats.mostAssists[division - 1].data.findIndex(
                (div) => div.team === team && div.player === goal.assist
              );
              stats.mostAssists[division - 1].data[index].value += 1;
            }
          }
        });
      });
    });

    // Sort the data
    stats.cleansheets.forEach((division) => {
      division.data.sort((a, b) => {
        return b.value - a.value;
      });
      division.data.forEach((datapoint, i) => {
        datapoint.position = i + 1;
      });
    });
    stats.topScorers?.forEach((division) => {
      division.data.sort((a, b) => {
        return b.value - a.value;
      });
      division.data.forEach((datapoint, i) => {
        datapoint.position = i + 1;
      });
    });
    stats.mostAssists?.forEach((division) => {
      division.data.sort((a, b) => {
        return b.value - a.value;
      });
      division.data.forEach((datapoint, i) => {
        datapoint.position = i + 1;
      });
    });

    res.status(200).json({ status: 'success', data: { stats: stats } });
  } catch (e: any) {
    console.error(e);
    return next(
      new ErrorHandling(
        500,
        undefined,
        `There was an error calculating the season statistics. ${e.message}`
      )
    );
  }
}
