import mongoose, { Model, Schema } from 'mongoose';
import { ILeagueSchema } from '../util/definitions';

const leagueSchema: Schema<ILeagueSchema> = new mongoose.Schema({
  name: { type: String, required: true },
  leagueLevel: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return ['free', 'pro', 'pro+'].includes(v);
      },
      message: "leagueLevel must be 'free' 'pro' or 'pro+'",
    },
  },
  // 'Standard' league features only:
  announcement: { text: { type: String }, date: { type: Date } },
  newsFeed: [
    {
      matchweek: { type: Number },
      news: [{ type: String }],
    },
  ],
  // Free league features:
  leagueOwner: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  currentSeason: { type: Number, required: true },
  currentMatchweek: { type: Number, required: true },
  finalMatchweek: { type: Number, required: true },
  maxSeasonLimit: {
    type: Number,
    validate: {
      validator: function (v) {
        return v === null || typeof v === 'number';
      },
      message: 'maxSeasonLimit must be a number or null',
    },
    // required: true, // field must exist
  },
  divisionsCount: { type: Number, required: true },
  leagueType: { type: String, required: true },
  tables: [
    {
      season: { type: Number, required: true },
      division: { type: Number, required: true },
      name: { type: String, required: true },
      numberOfTeams: { type: Number, required: true },
      teams: [{ type: Schema.Types.ObjectId, ref: 'teams', required: true }],
      numberOfTeamsToBeRelegated: { type: Number, required: true },
      numberOfTeamsToBePromoted: { type: Number, required: true },
    },
  ],
  fixtures: [{ type: Schema.Types.ObjectId, ref: 'fixtures', required: true }],
  results: [{ type: Schema.Types.ObjectId, ref: 'results', required: true }],
  setup: {
    tablesAdded: { type: Boolean },
    teamsAdded: { type: Boolean },
    leagueFinished: { type: Boolean },
  },
  engagement: {
    followersCount: { type: Number, default: 0 },
    favoritesCount: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 },
    viewsThisWeek: { type: Number, default: 0 },
    viewsThisWeekUpdatedAt: { type: Date },
  },
});

const League: Model<ILeagueSchema> = mongoose.model('leagues', leagueSchema);

export default League;
