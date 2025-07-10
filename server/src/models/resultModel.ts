import mongoose, { Model, Schema } from 'mongoose';
import { IResultSchema } from '../util/definitions';

const resultSchema: Schema<IResultSchema> = new mongoose.Schema({
  date: { type: Date, required: true, default: Date.now },
  season: { type: Number, required: true },
  division: { type: Number, required: true },
  matchweek: { type: Number, required: true },
  homeTeamDetails: {
    teamId: { type: Schema.Types.ObjectId, ref: 'teams', required: true },
    name: { type: String, required: true },
    division: { type: Number, required: true },
    leaguePosition: { type: Number, required: true },
    form: { type: String, required: true },
    matchesPlayed: { type: Number, required: true },
    points: { type: Number, required: true },
  },
  awayTeamDetails: {
    teamId: { type: Schema.Types.ObjectId, ref: 'teams', required: true },
    name: { type: String, required: true },
    division: { type: Number, required: true },
    leaguePosition: { type: Number, required: true },
    form: { type: String, required: true },
    matchesPlayed: { type: Number, required: true },
    points: { type: Number, required: true },
  },
  neutralGround: { type: Boolean, required: true },
  kickoff: { type: Date },
  basicOutcome: [{ type: String, required: true }],
  detailedOutcome: [
    {
      team: { type: String, required: true },
      scorer: { type: String, required: true },
      assist: { type: String },
    },
  ],
});

const Result: Model<IResultSchema> = mongoose.model('results', resultSchema);

export default Result;
