import { NextFunction, Request, Response } from 'express';
import League from '../../../models/leagueModel';
import {
  IFixtureSchema,
  ILeagueSchema,
  IResultSchema,
  IUserSchema,
} from '../../../util/definitions';
import { ErrorHandling } from '../../../util/errorChecking';
import { shouldGrantAccessToFeature } from '../../../util/helpers';

export async function getResultsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    /* 
      query parameters:
      - limit: number (controls the number of results to return) [default: returns all results]
      - sort: 'matchweek' | anything else  [default: sorts by date of result (most recent first)]
      - matchweek: number
      
      - season: number (if not provided, just give the most recent season). if league is free level, then return error
    */
    const leagueId = req.params.id;
    let league: ILeagueSchema | null;

    const sort = req.query.sort;

    // Check if league exists
    try {
      league = await League.findById(leagueId).populate([
        {
          path: 'results',
        },
        { path: 'leagueOwner' },
      ]);
    } catch {
      return next(
        new ErrorHandling(404, {
          message: `League with ID '${leagueId}' not found`,
        }),
      );
    }

    if (!league) {
      return next(
        new ErrorHandling(404, {
          message: `League with ID '${leagueId}' not found`,
        }),
      );
    }
    let allResults = league.results as unknown as IResultSchema[];

    if (sort === 'matchweek') {
      allResults.sort((a, b) => b.matchweek - a.matchweek);
    } else {
      // sort by date
      allResults.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    }

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

    const requestedSeason = req.query.season;
    const accountType = (league.leagueOwner as unknown as IUserSchema)
      .accountType;

    const allowSeasonRewind = shouldGrantAccessToFeature(
      'pro',
      league.leagueLevel,
      accountType,
    );

    let seasonFilter = league.currentSeason;

    if (!!requestedSeason) {
      const isValidNum = !Number.isNaN(+requestedSeason);

      const inValidRange =
        isValidNum &&
        Number(requestedSeason) >= 0 &&
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
              message: `League owner must upgrade to PRO to view data for season ${requestedSeason}.`,
            }),
          );
        }
      } else if (!isValidNum) {
        return next(
          new ErrorHandling(400, {
            message: `Invalid season query given`,
          }),
        );
      } else if (!inValidRange) {
        return next(
          new ErrorHandling(400, {
            message: `Season query outside valid range`,
          }),
        );
      } else if (+requestedSeason === league.currentSeason) {
        seasonFilter = league.currentSeason;
      }
    } else {
      seasonFilter = league.currentSeason;
    }

    let results: IResultSchema[] = [];
    results = allResults.filter((result) => result.season === seasonFilter);

    // Matchweek query handling

    /* 
    IF the user has requested a specific matchweek,

        Find out what matchweek they want
        IF requested matchweek is not a number,
            RETURN error
        ELSE IF requested matchweek is not in valid range,
            RETURN error
        
        ELSE (requested matchweek is a number and is in the valid range)
            RETURN requested matchweek data
    
    ELSE
        RETURN all matchweek data
    */

    const requestedMatchweek = req.query.matchweek;
    let matchweekFilter: number | null = null;

    if (!!requestedMatchweek) {
      const isValidNum = !Number.isNaN(+requestedMatchweek);

      const inValidRange =
        isValidNum &&
        Number(requestedMatchweek) >= 1 &&
        Number(requestedMatchweek) <= league.finalMatchweek;

      if (isValidNum && inValidRange) {
        matchweekFilter = +requestedMatchweek;
      } else if (!isValidNum) {
        return next(
          new ErrorHandling(400, {
            message: `Invalid matchweek query given`,
          }),
        );
      } else if (!inValidRange) {
        return next(
          new ErrorHandling(400, {
            message: `Matchweek query outside valid range. 1-${league.finalMatchweek}.`,
          }),
        );
      }
    } else {
      matchweekFilter = null;
    }

    if (matchweekFilter !== null) {
      results = results.filter(
        (result) => result.matchweek === matchweekFilter,
      );
    }

    if (req.query.limit !== undefined && +req.query.limit > 0) {
      results = results.slice(0, +req.query.limit);
    }

    res.status(200).json({ status: 'success', data: { results: results } });
  } catch (e: any) {
    console.error(e);
    return next(
      new ErrorHandling(
        500,
        undefined,
        `There was an error fetching the results. ${e.message}`,
      ),
    );
  }
}
