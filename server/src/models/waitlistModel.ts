import mongoose, { Model, Schema } from 'mongoose';
import { IWaitlistSchema } from '../util/definitions';

const waitlistSchema: Schema<IWaitlistSchema> = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  createdAt: { type: Date, required: true },
  status: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return ['subscribed', 'unsubscribed'].includes(v);
      },
      message: "status must be 'subscribed' or 'unsubscribed'",
    },
  },
  brevoContactId: { type: String },
  unsubscribedAt: { type: Date },
});

const Waitlist: Model<IWaitlistSchema> = mongoose.model(
  'waitlist',
  waitlistSchema
);

export default Waitlist;
