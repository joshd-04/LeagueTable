import { NextFunction, Request, Response } from 'express';
import League from '../../models/leagueModel';
import { LeagueViewReceipt } from '../../models/leagueViewReceiptModel';
import { ErrorHandling } from '../../util/errorChecking';

function resolveIdentity(req: Request) {
  if (req.session.user?._id) return `user:${req.session.user?._id}`;
  if (req.visitorId) return `visitor:${req.visitorId}`;
  return null;
}

// function getStartOfISOWeek(date = new Date()) {
//   const d = new Date(date);
//   const day = d.getDay() || 7;
//   if (day !== 1) d.setDate(d.getDate() - day + 1);
//   d.setHours(0, 0, 0, 0);
//   return d;
// }

export async function RegisterViewController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { leagueId } = req.params;
  const identity = resolveIdentity(req);

  if (!identity) {
    return next(
      new ErrorHandling(400, {
        message: `Unable to increment view count for league ${leagueId} .`,
      })
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  try {
    await LeagueViewReceipt.create({
      leagueId,
      identity,
      date: today,
    });
  } catch (err: any) {
    if (err.code === 11000) {
      // already viewed todayreturn next(
      return next(
        new ErrorHandling(400, {
          message: `View has already been registered for league ${leagueId} recently.`,
        })
      );
    }
    return next(
      new ErrorHandling(400, {
        message: `Something went wrong registering the view.`,
      })
    );
  }

  const now = new Date();
  // const startOfWeek = getStartOfISOWeek(now);

  const league = await League.findById(leagueId, {
    'engagement.viewsThisWeekUpdatedAt': 1,
  });

  if (!league)
    return next(
      new ErrorHandling(500, {
        message: `Something went wrong registering the view.`,
      })
    );

  const withinOneWeek =
    league?.engagement?.viewsThisWeekUpdatedAt &&
    Date.now() - league.engagement.viewsThisWeekUpdatedAt.getTime() <=
      1000 * 60 * 60 * 24 * 7;

  // console.log(withinOneWeek);
  // console.log(
  //   Date.now() - league.engagement.viewsThisWeekUpdatedAt.getTime() <=
  //     1000 * 60 * 60 * 24 * 7
  // );

  const update: any = {
    $inc: {
      'engagement.totalViews': 1,
    },
  };

  if (withinOneWeek) {
    update.$inc['engagement.viewsThisWeek'] = 1;
  } else {
    update.$set = {
      'engagement.viewsThisWeek': 1,
      'engagement.viewsThisWeekUpdatedAt': now,
    };
  }

  await League.findByIdAndUpdate(leagueId, update);

  res.status(204).json({
    status: 'success',
    data: { message: 'Successfully registered view!' },
  });
}
