import mongoose from 'mongoose';
import { readDotenv } from './helpers';

const database_password = readDotenv('DB_PASSWORD');

const MONGO_URI = `mongodb+srv://leaguetableowner:${database_password}@cluster0.cea3t.mongodb.net/data`;

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

export default connectDB;
