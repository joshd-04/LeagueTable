import mongoose from 'mongoose';

const LeagueViewReceiptSchema = new mongoose.Schema({
  leagueId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  identity: {
    type: String,
    required: true,
    index: true,
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24, // auto-delete after 24h
  },
});

LeagueViewReceiptSchema.index(
  { leagueId: 1, identity: 1, date: 1 },
  { unique: true }
);

export const LeagueViewReceipt = mongoose.model(
  'LeagueViewReceipt',
  LeagueViewReceiptSchema
);
