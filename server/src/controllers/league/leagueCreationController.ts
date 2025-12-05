import { NextFunction, Request, Response } from 'express';
import League from '../../models/leagueModel';
import { ErrorHandling } from '../../util/errorChecking';
import { Types } from 'mongoose';
import User from '../../models/userModel';
import { ILeagueSchema } from '../../util/definitions';

interface LeagueCreationReqBody {
  name: string;
  leagueOwner?: string;
  divisionsCount: number;
  leagueType: 'basic' | 'advanced';
}

export async function leagueCreationController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  /*  Args: name, maxSeasonLimit, leagueType, divisionsCount. tables: {
    division, name, numberOfTeams, numberOfTeamsToBeRelegated, numberOfTeamsToBePromoted
  }
      Returns: 

      Note: there is a separate endpoint to add tables (then teams) to the league
  */
  try {
    const userId = req.session.user?._id;

    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorHandling(404, { message: 'User not found.' }));
    }
    const accountType = user.accountType;

    const {
      name: nameUntrimmed,
      leagueType,
      divisionsCount,
    }: LeagueCreationReqBody = req.body;

    const name = nameUntrimmed.trim();

    const errors: {
      name?: string;
      leagueType?: string;
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
      errors.name = 'You already own a league with this name.';
    }

    // If the user has a free account, league can have max of 2 seasons
    const leagueLevel = accountType;
    let maxSeasonLimit: number | null;
    if (leagueLevel === 'free') {
      maxSeasonLimit = 2;
    } else {
      maxSeasonLimit = null;
    }

    // @ts-ignore
    if (leagueType !== 'basic' && leagueType !== 'advanced') {
      errors.leagueType =
        "Invalid league type. leagueType can only be 'basic' or 'advanced'";
    }

    if (leagueLevel === 'free' && leagueType === 'advanced') {
      errors.leagueType =
        'Advanced leagues are not available on the free tier.';
    }

    if (divisionsCount < 1) {
      errors.divisionsCount = 'Must be greater than 0.';
    }

    if (divisionsCount > 5) {
      errors.divisionsCount = 'Must be less than or equal to 5.';
    }

    // Handle errors
    if (Object.keys(errors).length !== 0) {
      next(
        new ErrorHandling(400, {
          errors: { ...errors },
        })
      );
      return;
    }

    let league: ILeagueSchema;
    if (accountType === 'pro') {
      league = await League.create({
        name: name,
        leagueLevel: leagueLevel,
        announcement: { text: '', date: new Date() },
        leagueOwner: userId,
        currentSeason: 0,
        currentMatchweek: 0,
        finalMatchweek: -1,
        maxSeasonLimit: maxSeasonLimit,
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
        leagueLevel: leagueLevel,
        leagueOwner: userId,
        currentSeason: 0,
        currentMatchweek: 0,
        finalMatchweek: -1,
        maxSeasonLimit: maxSeasonLimit,
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
      maxSeasonLimit: league.maxSeasonLimit,
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
