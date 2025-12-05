import MongoStore from 'connect-mongo';
import { database_name } from '../config';

export const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGO_URI!,
  dbName: database_name,
  collectionName: 'sessions',
  ttl: 14 * 24 * 60 * 60, // fallback TTL (14 days)
});
