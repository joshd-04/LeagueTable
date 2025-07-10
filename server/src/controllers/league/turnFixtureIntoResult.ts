import { NextFunction, Request, Response } from 'express';
import League from '../../models/leagueModel';
import {
  IFixtureSchema,
  ILeagueSchema,
  ITeamsSchema,
} from '../../util/definitions';
import { ErrorHandling } from '../../util/errorChecking';
import Team from '../../models/teamModel';
import { calculateTeamPoints, sortTeams } from '../../util/helpers';
import Fixture from '../../models/fixtureModel';
import Result from '../../models/resultModel';

export async function turnFixtureIntoResult(
  req: Request,
  res: Response,
  next: NextFunction
) {
  /*  Args: fixtureId, basicOutcome, detailedOutcome?
    
        Returns: 
  
        Note: there is a separate endpoint to add teams to the league
    */
  const userId = req.body.userId;
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
      fixture = await Fixture.findById(fixtureId).populate([
        { path: 'homeTeamDetails' },
        { path: 'awayTeamDetails' },
      ]);
    } catch {
      return next(
        new ErrorHandling(404, {
          message: `Fixture with ID '${fixtureId}' not found`,
        })
      );
    }
    if (!fixture) {
      return next(
        new ErrorHandling(404, {
          message: `Fixture with ID '${fixtureId}' not found`,
        })
      );
    }
    const homeDetails = fixture.homeTeamDetails as unknown as ITeamsSchema;
    const awayDetails = fixture.awayTeamDetails as unknown as ITeamsSchema;

    const leagueId = homeDetails.leagueId;
    let league: ILeagueSchema | null;

    // Check if league exists
    try {
      league = await League.findById(leagueId).populate([
        { path: 'tables.teams' },
        {
          path: 'fixtures',
          populate: [{ path: 'homeTeamDetails' }, { path: 'awayTeamDetails' }],
        },
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

    // Check that user owns this league
    if (league.leagueOwner._id.toString() !== userId) {
      return next(
        new ErrorHandling(403, {
          message: `You are not permitted to make edits to this league`,
        })
      );
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
        })
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
          message: `Property 'detailedOutcome' is required because this league is an 'advanced' league. Make sure the same number of goals are provided as the basicOutcome. Property 'detailedOutcome' must have a team: "home" | "away", scorer: str, assist?: str | undefined`,
        })
      );
    }

    const homeTeamPosition = sortTeams(
      league.tables[homeDetails.division - 1].teams as ITeamsSchema[]
    )
      .map((team) => team.name)
      .indexOf(homeDetails.name);

    const awayTeamPosition = sortTeams(
      league.tables[awayDetails.division - 1].teams as ITeamsSchema[]
    )
      .map((team) => team.name)
      .indexOf(awayDetails.name);

    const result = await Result.create({
      date: Date.now(),
      season: fixture.season,
      division: fixture.division,
      matchweek: fixture.matchweek,
      homeTeamDetails: {
        teamId: homeDetails._id,
        name: homeDetails.name,

        division: homeDetails.division,
        leaguePosition: homeTeamPosition,
        form: homeDetails.form,
        matchesPlayed: homeDetails.matchesPlayed,
        points: calculateTeamPoints(homeDetails),
      },
      awayTeamDetails: {
        teamId: awayDetails._id,
        name: awayDetails.name,
        division: awayDetails.division,
        leaguePosition: awayTeamPosition,
        form: awayDetails.form,
        matchesPlayed: awayDetails.matchesPlayed,
        points: calculateTeamPoints(awayDetails),
      },
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
      league.currentSeason === league.maxSeasonCount &&
      league.currentMatchweek === league.finalMatchweek &&
      league.fixtures.length === 0
    ) {
      // Update setup flag
      await League.findByIdAndUpdate(leagueId, {
        $set: { 'setup.leagueFinished': true },
      });
    }

    // Change the form of the away and the home team
    // -----, W----, WD---, WDL--, WDLW-, WDLWD, DLWDL

    let newHomeForm: string;
    let newAwayForm: string;
    const homeGoals = basicOutcome.reduce(
      (prev, val) => (val === 'home' ? prev + 1 : prev),
      0
    );
    const awayGoals = basicOutcome.reduce(
      (prev, val) => (val === 'away' ? prev + 1 : prev),
      0
    );

    const matchOutcome: 'home' | 'draw' | 'away' =
      homeGoals === awayGoals
        ? 'draw'
        : homeGoals > awayGoals
        ? 'home'
        : 'away';

    let newHomeFormArr = homeDetails.form.split('');
    const homeLetter =
      matchOutcome === 'home' ? 'W' : matchOutcome === 'away' ? 'L' : 'D';

    if (newHomeFormArr.includes('-')) {
      const index = newHomeFormArr.indexOf('-');
      newHomeFormArr.forEach((_x, i) => {
        if (i === index) newHomeFormArr[index] = homeLetter;
      });
      newHomeForm = newHomeFormArr.join('');
    } else {
      newHomeFormArr.push(homeLetter);
      newHomeForm = newHomeFormArr.slice(1).join('');
    }

    let newAwayFormArr = awayDetails.form.split('');
    const awayLetter =
      matchOutcome === 'home' ? 'L' : matchOutcome === 'away' ? 'W' : 'D';

    if (newAwayFormArr.includes('-')) {
      const index = newAwayFormArr.indexOf('-');
      newAwayFormArr.forEach((_x, i) => {
        if (i === index) newAwayFormArr[index] = awayLetter;
      });
      newAwayForm = newAwayFormArr.join('');
    } else {
      newAwayFormArr.push(awayLetter);
      newAwayForm = newAwayFormArr.splice(1).join('');
    }

    let newHomeMatchesPlayed = homeDetails.matchesPlayed;
    let newHomeWins: number = homeDetails.wins;
    let newHomeDraws: number = homeDetails.draws;
    let newHomeLosses: number = homeDetails.losses;
    let newHomeGoalsFor: number = homeDetails.goalsFor;
    let newHomeGoalsAgainst: number = homeDetails.goalsAgainst;

    let newAwayMatchesPlayed = awayDetails.matchesPlayed;
    let newAwayWins: number = awayDetails.wins;
    let newAwayDraws: number = awayDetails.draws;
    let newAwayLosses: number = awayDetails.losses;
    let newAwayGoalsFor: number = awayDetails.goalsFor;
    let newAwayGoalsAgainst: number = awayDetails.goalsAgainst;

    switch (matchOutcome) {
      case 'home':
        newHomeWins += 1;
        newAwayLosses += 1;
        break;

      case 'draw':
        newHomeDraws += 1;
        newAwayDraws += 1;
        break;

      case 'away':
        newAwayWins += 1;
        newHomeLosses += 1;
        break;
    }

    newHomeGoalsFor += homeGoals;
    newAwayGoalsAgainst += homeGoals;

    newHomeGoalsAgainst += awayGoals;
    newAwayGoalsFor += awayGoals;

    newHomeMatchesPlayed += 1;
    newAwayMatchesPlayed += 1;

    await Promise.all([
      Team.findByIdAndUpdate(homeDetails._id, {
        $set: {
          matchesPlayed: newHomeMatchesPlayed,
          wins: newHomeWins,
          draws: newHomeDraws,
          losses: newHomeLosses,
          goalsFor: newHomeGoalsFor,
          goalsAgainst: newHomeGoalsAgainst,
          form: newHomeForm,
        },
      }),
      Team.findByIdAndUpdate(awayDetails._id, {
        $set: {
          matchesPlayed: newAwayMatchesPlayed,
          wins: newAwayWins,
          draws: newAwayDraws,
          losses: newAwayLosses,
          goalsFor: newAwayGoalsFor,
          goalsAgainst: newAwayGoalsAgainst,
          form: newAwayForm,
        },
      }),
    ]);

    res.status(200).json({ status: 'success', data: { fixtures: result } });
  } catch (e: any) {
    console.error(e);
    return next(
      new ErrorHandling(
        500,
        undefined,
        `There was an error fetching the fixtures that are still to be played. ${e.message}`
      )
    );
  }
}
