import mongoose from 'mongoose';
import { database_name } from '../config';

const database_password = process.env.DB_PASSWORD;

const MONGO_URI = `mongodb+srv://leaguetableowner:${database_password}@cluster0.cea3t.mongodb.net/${database_name}`;

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
