import { NextFunction, Request, Response } from 'express';
import League from '../../models/leagueModel';
import {
  IFixtureSchema,
  ILeagueSchema,
  IResultSchema,
  IUserSchema,
} from '../../util/definitions';
import { ErrorHandling } from '../../util/errorChecking';
import {
  meetsMinimumTierLevel,
  shouldGrantAccessToFeature,
} from '../../util/helpers';

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
  ownGoals?: {
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
    /* 
      query parameters:
      
      - season: number (if not provided, just give the most recent season). if league is free level, then return error
    */
    const leagueId = req.params.id;
    let league: ILeagueSchema | null;

    // Check if league exists
    try {
      league = await League.findById(leagueId).populate([
        {
          path: 'results',
          populate: [{ path: 'homeTeamDetails' }, { path: 'awayTeamDetails' }],
        },
        { path: 'leagueOwner', select: 'username accountType' },
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

    const stats: statsInterface = {
      cleansheets: [],
    };

    for (let i = 0; i < league.divisionsCount; i++) {
      stats.cleansheets.push({ division: i + 1, data: [] });
    }

    /* 
    For top scorers, top assisters and own goals:
    1. League type must be 'advanced'
    2. The league level must be atleast pro
    3. The league owner must still be a pro user
    
    If the league type is advanced and the league level is pro, but the user is no longer a pro user, do not give them pro data.
    */

    const requestedSeason = req.query.season;
    const accountType = (league.leagueOwner as unknown as IUserSchema)
      .accountType;

    const allowSeasonRewind = shouldGrantAccessToFeature(
      'pro',
      league.leagueLevel,
      accountType
    );

    if (
      league.leagueType === 'advanced' &&
      meetsMinimumTierLevel('pro', league.leagueLevel) &&
      meetsMinimumTierLevel('pro', accountType)
    ) {
      stats.topScorers = [];
      stats.mostAssists = [];
      stats.ownGoals = [];
      for (let i = 0; i < league.divisionsCount; i++) {
        stats.topScorers.push({ division: i + 1, data: [] });
        stats.mostAssists.push({ division: i + 1, data: [] });
        stats.ownGoals.push({ division: i + 1, data: [] });
      }
    } else if (
      league.leagueType === 'advanced' &&
      meetsMinimumTierLevel('pro', league.leagueLevel)
    ) {
      stats.topScorers = [];
      stats.mostAssists = [];
      stats.ownGoals = [];
    }

    // Get this season's results
    const allResults = league.results as unknown as IResultSchema[];
    let results: IResultSchema[] = [];

    // if (!allowSeasonRewind || requestedSeason === undefined) {
    //   // Get this seasons results
    //   results = allResults.filter(
    //     (result) => result.season === league.currentSeason
    //   );
    // } else {
    //   if (
    //     requestedSeason !== undefined &&
    //     Number.isInteger(Number(requestedSeason))
    //   ) {
    //     results = allResults.filter(
    //       (result) => result.season === Number(requestedSeason)
    //     );
    //   } else {
    //     results = allResults.filter(
    //       (result) => result.season === league.currentSeason
    //     );
    //   }
    // }

    /*
    IF the user has requested a specific season,

        Find out what season they want
        IF requested season is not a number,
            RETURN error
        ELSE IF requested season is not in valid range,
            RETURN error
        ELSE IF requested season is current season,
            RETURN current season's data
        ELSE (requested season is a number, is in the valid range and is not the current season)
            DETERMINE if the season rewind is allowed
            IF season rewind allowed,
                RETURN requested season's data
            ELSE
                RETURN error
    
    ELSE
        RETURN current season's data
    */
    let seasonFilter = league.currentSeason;

    if (requestedSeason !== undefined) {
      const isValidNum = !Number.isNaN(+requestedSeason);
      console.log(requestedSeason, isValidNum);
      const inValidRange =
        isValidNum &&
        Number(requestedSeason) >= 1 &&
        Number(requestedSeason) <= league.currentSeason;

      if (
        isValidNum &&
        inValidRange &&
        +requestedSeason !== league.currentSeason
      ) {
        if (allowSeasonRewind) {
          seasonFilter = +requestedSeason;
        } else {
          return next(
            new ErrorHandling(403, {
              message: `Upgrade to PRO to view data for season ${requestedSeason}.`,
            })
          );
        }
      } else if (!isValidNum) {
        return next(
          new ErrorHandling(400, {
            message: `Invalid season query given`,
          })
        );
      } else if (!inValidRange) {
        return next(
          new ErrorHandling(400, {
            message: `Season query outside valid range`,
          })
        );
      } else if (+requestedSeason === league.currentSeason) {
        seasonFilter = league.currentSeason;
      }
    } else {
      seasonFilter = league.currentSeason;
    }

    results = allResults.filter((result) => result.season === seasonFilter);

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
        // advanced leagues are pro leagues, ensure the account is atleast pro
        if (
          league.leagueType !== 'advanced' ||
          !meetsMinimumTierLevel('pro', accountType)
        )
          return;
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
          if (stats.ownGoals !== undefined && goal.isOwnGoal) {
            let team: string;

            // If an own goal is scored in favour of the home team, the own goal was scored by the away team
            if (goal.team === 'home') {
              team = result.awayTeamDetails.name;
            } else {
              team = result.homeTeamDetails.name;
            }
            const isInList = stats.ownGoals[division - 1].data.some(
              (x) => x.player === goal.scorer && x.team === team
            );
            if (!isInList) {
              stats.ownGoals[division - 1].data.push({
                team: team,
                player: goal.scorer,
                value: 1,
              });
            } else {
              const index = stats.ownGoals[division - 1].data.findIndex(
                (div) => div.team === team && div.player === goal.scorer
              );
              stats.ownGoals[division - 1].data[index].value += 1;
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

    stats.ownGoals?.forEach((division) => {
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
