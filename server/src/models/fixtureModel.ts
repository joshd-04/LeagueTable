import mongoose, { Model, Schema } from 'mongoose';
import { IFixtureSchema } from '../util/definitions';

const fixtureSchema: Schema<IFixtureSchema> = new mongoose.Schema({
  season: { type: Number, required: true },
  division: { type: Number, required: true },
  matchweek: { type: Number, required: true },
  homeTeamDetails: {
    type: Schema.Types.ObjectId,
    ref: 'teams',
    required: true,
  },

  awayTeamDetails: {
    type: Schema.Types.ObjectId,
    ref: 'teams',
    required: true,
  },
  neutralGround: { type: Boolean, required: true },
  kickoff: { type: Date },
});

const Fixture: Model<IFixtureSchema> = mongoose.model(
  'fixtures',
  fixtureSchema
);

export default Fixture;
