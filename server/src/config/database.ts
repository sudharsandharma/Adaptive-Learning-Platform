import mongoose from 'mongoose';
import { config } from './index';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongodbUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error}`);
    // Retry logic could go here, but for now we'll just exit
    process.exit(1);
  }
};
