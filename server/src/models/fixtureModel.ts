import mongoose, { Model, Schema } from 'mongoose';
import { IFixtureSchema } from '../util/definitions';

const fixtureSchema: Schema<IFixtureSchema> = new mongoose.Schema({
  leagueId: { type: Schema.Types.ObjectId, ref: 'leagues', required: true },
  season: { type: Number, required: true },
  division: { type: Number, required: true },
  matchweek: { type: Number, required: true },
  homeTeamId: { type: Schema.Types.ObjectId, ref: 'teams', required: true },
  awayTeamId: { type: Schema.Types.ObjectId, ref: 'teams', required: true },
  neutralGround: { type: Boolean, required: true },
  kickoff: { type: Date },
});

const Fixture: Model<IFixtureSchema> = mongoose.model(
  'fixtures',
  fixtureSchema,
);

export default Fixture;
