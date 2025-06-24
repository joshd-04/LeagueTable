import mongoose, { Model, Schema, Types } from 'mongoose';
import { ITeamsSchema } from '../util/definitions';

const teamSchema: Schema<ITeamsSchema> = new mongoose.Schema({
  name: { type: String, required: true },
  leagueId: { type: Schema.Types.ObjectId, ref: 'leagues', required: true },
  division: { type: Number, required: true },
  matchesPlayed: { type: Number, required: true },
  wins: { type: Number, required: true },
  draws: { type: Number, required: true },
  losses: { type: Number, required: true },
  goalsFor: { type: Number, required: true },
  goalsAgainst: { type: Number, required: true },
  form: { type: String, required: true },
});

const Team: Model<ITeamsSchema> = mongoose.model('teams', teamSchema);

export default Team;
