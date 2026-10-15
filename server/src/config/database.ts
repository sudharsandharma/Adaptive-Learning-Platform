import mongoose from 'mongoose';
import { config } from './index';

let cachedPromise: Promise<typeof mongoose> | null = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (cachedPromise) {
    await cachedPromise;
    return mongoose.connection;
  }

  try {
    cachedPromise = mongoose.connect(config.mongodbUri);
    const conn = await cachedPromise;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn.connection;
  } catch (error) {
    cachedPromise = null;
    console.error(`Error connecting to MongoDB: ${error}`);
    if (process.env.VERCEL !== '1' && !process.env.NOW_REGION) {
      process.exit(1);
    }
    throw error;
  }
};

