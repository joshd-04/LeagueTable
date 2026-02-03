import { NextFunction, Request, Response } from 'express';
import League from '../../../models/leagueModel';
import {
  AccountTypeInterface,
  IFixtureSchema,
  ILeagueSchema,
  IUserSchema,
} from '../../../util/definitions';
import { ErrorHandling } from '../../../util/errorChecking';
import { meetsMinimumTierLevel } from '../../../util/helpers';
import Fixture from '../../../models/fixtureModel';
import Result from '../../../models/resultModel';

export async function turnFixtureIntoResult(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  /*  Args: fixtureId, basicOutcome, detailedOutcome?
    
        Returns: 
  
        Note: there is a separate endpoint to add teams to the league
    */
  const userId = req.session.user?._id;
  try {
    const fixtureId = req.body.fixtureId;
    const basicOutcome: ('home' | 'away')[] = req.body.basicOutcome;
    const detailedOutcome:
      | {
          team: 'home' | 'away';
          scorer: string;
          assist: string | null;
          isOwnGoal: boolean;
        }[]
      | null = req.body.detailedOutcome || null;

    // Check if fixture exists
    let fixture: IFixtureSchema | null;
    try {
      fixture = await Fixture.findById(fixtureId);
    } catch {
      return next(
        new ErrorHandling(404, {
          message: `Fixture with ID '${fixtureId}' not found`,
        }),
      );
    }
    if (!fixture) {
      return next(
        new ErrorHandling(404, {
          message: `Fixture with ID '${fixtureId}' not found`,
        }),
      );
    }
    const homeTeamId = fixture.homeTeamId;
    const awayTeamId = fixture.awayTeamId;

    const leagueId = fixture.leagueId;
    let league: ILeagueSchema | null;

    // Check if league exists
    try {
      league = await League.findById(leagueId).populate([
        { path: 'tables.teams' },
        {
          path: 'fixtures',
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

    // Check that user owns this league
    if (league.leagueOwner._id.toString() !== userId) {
      return next(
        new ErrorHandling(403, {
          message: `You are not permitted to make edits to this league`,
        }),
      );
    }

    // Safety check: make sure fixture is in the same season
    const isDifferentSeason = fixture.season !== league.currentSeason;
    if (isDifferentSeason) {
      return next(
        new ErrorHandling(403, {
          message: `This fixture is from a different season and cannot be updated.`,
        }),
      );
    }

    // Check if the fixture is NOT a future fixture
    const isFutureFixture = fixture.matchweek > league.currentMatchweek;

    if (isFutureFixture) {
      return next(
        new ErrorHandling(403, {
          message: `This fixture isn't released yet. Progress through the season to upload the result.`,
        }),
      );
    }

    // Based on the league type (basic/advanced), restrict access if the owner doesnt have correct account level
    const leagueOwner = league.leagueOwner as unknown as IUserSchema;

    let requiredLevel: AccountTypeInterface = 'pro+';
    switch (league.leagueType) {
      case 'basic':
        requiredLevel = 'free';
        break;
      case 'advanced':
        requiredLevel = 'pro';
        break;
      default:
        requiredLevel = 'pro+';
        break;
    }
    const isValid = meetsMinimumTierLevel(
      requiredLevel,
      leagueOwner.accountType,
    );
    if (!isValid) {
      switch (requiredLevel) {
        case 'free':
          return next(
            new ErrorHandling(403, {
              message: `You can manage this league with a free account. If you are seeing this error, something went wrong.`,
            }),
          );
        case 'pro':
          return next(
            new ErrorHandling(403, {
              message: `Pro required to manage this league. Renew your subscription to continue.`,
            }),
          );
        case 'pro+':
          return next(
            new ErrorHandling(403, {
              message: `Pro+ required to manage this league. Renew your subscription to continue.`,
            }),
          );
        default:
          return next(
            new ErrorHandling(403, {
              message: `We could not verify your account subscription tier.`,
            }),
          );
      }
    }

    // Check that basic outcome given in correct format
    let basicOutcomeFlag = false;
    if (!Array.isArray(basicOutcome)) {
      basicOutcomeFlag = true;
    } else {
      basicOutcome.forEach((element) => {
        if (element !== 'home' && element !== 'away') {
          basicOutcomeFlag = true;
        }
      });
    }

    if (basicOutcomeFlag) {
      return next(
        new ErrorHandling(400, {
          message: `Property 'basicOutcome' must be an array of "home" or "away"`,
        }),
      );
    }

    // Check that detailedOutcome provided if applicable
    let detailedOutcomeFlag = false;
    if (league.leagueType === 'advanced' && detailedOutcome === null) {
      detailedOutcomeFlag = true;
    } else if (league.leagueType === 'advanced') {
      if (!Array.isArray(detailedOutcome)) {
        detailedOutcomeFlag = true;
      } else {
        if (detailedOutcome.length !== basicOutcome.length) {
          detailedOutcomeFlag = true;
        }
        detailedOutcome.forEach((element, i) => {
          if (
            !(
              typeof element.team === 'string' &&
              typeof element.scorer === 'string' &&
              (typeof element.assist === 'string' ||
                element.assist === undefined) &&
              typeof element.isOwnGoal === 'boolean'
            )
          ) {
            detailedOutcomeFlag = true;
          }
          if (element.team !== 'home' && element.team !== 'away') {
            detailedOutcomeFlag = true;
          }
          if (element.team !== basicOutcome[i]) {
            detailedOutcomeFlag = true;
          }
        });
      }
    }

    if (detailedOutcomeFlag === true) {
      return next(
        new ErrorHandling(400, {
          message: `Property 'detailedOutcome' is required because this league is an 'advanced' league. Make sure the same number of goals are provided as the basicOutcome. Property 'detailedOutcome' must have a team: "home" | "away", scorer: str, assist?: str | undefined, isOwnGoal?: boolean | undefined`,
        }),
      );
    }

    const result = await Result.create({
      _id: fixtureId,
      date: Date.now(),
      leagueId: leagueId,
      season: fixture.season,
      division: fixture.division,
      matchweek: fixture.matchweek,
      homeTeamId: homeTeamId,
      awayTeamId: awayTeamId,
      neutralGround: fixture.neutralGround,
      kickoff: fixture.kickoff,
      basicOutcome: basicOutcome,
      detailedOutcome: detailedOutcome || undefined,
    });
    // Put result objectid in results array of the league

    await League.findByIdAndUpdate(leagueId, {
      $push: { results: result._id },
    });

    // Delete fixture from fixture list
    await Fixture.findByIdAndDelete(fixtureId);
    await League.findByIdAndUpdate(leagueId, {
      $pull: { fixtures: fixtureId },
    });

    // If that was the last fixture, and this is the last season, set the season finished flag to true
    if (
      league.currentSeason === league.maxSeasonLimit &&
      league.currentMatchweek === league.finalMatchweek &&
      league.fixtures.length === 0
    ) {
      // Update setup flag
      await League.findByIdAndUpdate(leagueId, {
        $set: { 'setup.leagueFinished': true },
      });
    }

    // // Change the form of the away and the home team
    // // -----, W----, WD---, WDL--, WDLW-, WDLWD, DLWDL

    // let newHomeForm: string;
    // let newAwayForm: string;
    // const homeGoals = basicOutcome.reduce(
    //   (prev, val) => (val === 'home' ? prev + 1 : prev),
    //   0,
    // );
    // const awayGoals = basicOutcome.reduce(
    //   (prev, val) => (val === 'away' ? prev + 1 : prev),
    //   0,
    // );

    // const matchOutcome: 'home' | 'draw' | 'away' =
    //   homeGoals === awayGoals
    //     ? 'draw'
    //     : homeGoals > awayGoals
    //       ? 'home'
    //       : 'away';

    // let newHomeFormArr = homeDetails.form.split('');
    // const homeLetter =
    //   matchOutcome === 'home' ? 'W' : matchOutcome === 'away' ? 'L' : 'D';

    // if (newHomeFormArr.includes('-')) {
    //   const index = newHomeFormArr.indexOf('-');
    //   newHomeFormArr.forEach((_x, i) => {
    //     if (i === index) newHomeFormArr[index] = homeLetter;
    //   });
    //   newHomeForm = newHomeFormArr.join('');
    // } else {
    //   newHomeFormArr.push(homeLetter);
    //   newHomeForm = newHomeFormArr.slice(1).join('');
    // }

    // let newAwayFormArr = awayDetails.form.split('');
    // const awayLetter =
    //   matchOutcome === 'home' ? 'L' : matchOutcome === 'away' ? 'W' : 'D';

    // if (newAwayFormArr.includes('-')) {
    //   const index = newAwayFormArr.indexOf('-');
    //   newAwayFormArr.forEach((_x, i) => {
    //     if (i === index) newAwayFormArr[index] = awayLetter;
    //   });
    //   newAwayForm = newAwayFormArr.join('');
    // } else {
    //   newAwayFormArr.push(awayLetter);
    //   newAwayForm = newAwayFormArr.splice(1).join('');
    // }

    res.status(200).json({ status: 'success', data: { result: result } });
  } catch (e: any) {
    console.error(e);
    return next(
      new ErrorHandling(
        500,
        undefined,
        `There was an error turning the fixture into a result. ${e.message}`,
      ),
    );
  }
}
