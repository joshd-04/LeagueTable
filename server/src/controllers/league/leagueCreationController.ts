import { NextFunction, Request, Response } from 'express';
import League from '../../models/leagueModel';
import { ErrorHandling } from '../../util/errorChecking';
import { Types } from 'mongoose';
import User from '../../models/userModel';
interface LeagueCreationReqBody {
  name: string;
  leagueOwner?: string;
  maxSeasonCount: number;
  divisionsCount: number;
  leagueType: 'basic' | 'advanced';
}

export async function leagueCreationController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  /*  Args: name, maxSeasonCount, leagueType, divisionsCount. tables: {
    division, name, numberOfTeams, numberOfTeamsToBeRelegated, numberOfTeamsToBePromoted
  }
      Returns: 

      Note: there is a separate endpoint to add tables (then teams) to the league
  */
  try {
    const userId: string = req.body.userId;

    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorHandling(404, { message: 'User not found.' }));
    }
    const accountType = user.accountType;

    const {
      name,
      maxSeasonCount,
      leagueType,
      divisionsCount,
    }: LeagueCreationReqBody = req.body;

    const errors: {
      name?: string;
      leagueType?: string;
      maxSeasonCount?: string;
      divisionsCount?: string;
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

    if (divisionsCount < 1) {
      errors.divisionsCount = 'must be greater than 0';
    }
    if (maxSeasonCount < 1) {
      errors.maxSeasonCount = 'must be greater than 0';
    }
    if (divisionsCount > 5) {
      errors.divisionsCount = 'must be less than 5';
    }

    if (Object.keys(errors).length > 0) {
      return next(new ErrorHandling(400, errors));
    }
    let league;
    if (accountType === 'pro') {
      league = await League.create({
        name: name,
        leagueLevel: 'standard',
        announcement: { text: '', date: new Date() },
        leagueOwner: userId,
        currentSeason: 0,
        currentMatchweek: 0,
        finalMatchweek: -1,
        maxSeasonCount: maxSeasonCount,
        divisionsCount: divisionsCount,
        leagueType: leagueType,
        tables: [],
        fixtures: [],
        results: [],
        setup: {
          tablesAdded: false,
          teamsAdded: false,
          leagueFinished: false,
        },
      });
    } else {
      league = await League.create({
        name: name,
        leagueLevel: 'free',
        leagueOwner: userId,
        currentSeason: 0,
        currentMatchweek: 0,
        finalMatchweek: -1,
        maxSeasonCount: maxSeasonCount,
        divisionsCount: divisionsCount,
        leagueType: leagueType,
        tables: [],
        fixtures: [],
        results: [],
        setup: {
          tablesAdded: false,
          teamsAdded: false,
          leagueFinished: false,
        },
      });
    }

    // Add the league to the user's created league list
    await User.findByIdAndUpdate(userId, {
      $push: { leaguesCreated: league._id },
    });

    // Return sanitized league

    const sanitizedLeague = {
      _id: league._id,
      name: league.name,
      currentSeason: league.currentSeason,
      currentMatchweek: league.currentMatchweek,
      maxSeasonCount: league.maxSeasonCount,
      divisionsCount: league.divisionsCount,
      leagueType: league.leagueType,
      tables: league.tables,
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
