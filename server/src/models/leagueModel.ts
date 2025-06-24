import mongoose, { Model, Schema } from 'mongoose';
import { ILeagueSchema } from '../util/definitions';

const leagueSchema: Schema<ILeagueSchema> = new mongoose.Schema({
  name: { type: String, required: true },
  leagueOwner: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  currentSeason: { type: Number, required: true },
  currentMatchweek: { type: Number, required: true },
  maxSeasonCount: { type: Number, required: true },
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
});

const League: Model<ILeagueSchema> = mongoose.model('leagues', leagueSchema);

export default League;
