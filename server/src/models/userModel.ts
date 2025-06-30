import mongoose, { Model, Schema } from 'mongoose';
import { IUserSchema } from '../util/definitions';

const userSchema: Schema<IUserSchema> = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  accountType: { type: String, required: true },
  leaguesCreated: [
    { type: Schema.Types.ObjectId, ref: 'leagues', required: true },
  ],
  favouriteLeagues: [
    { type: Schema.Types.ObjectId, ref: 'leagues', required: true },
  ],
  followedLeagues: [
    { type: Schema.Types.ObjectId, ref: 'leagues', required: true },
  ],
});

const User: Model<IUserSchema> = mongoose.model('users', userSchema);

export default User;
