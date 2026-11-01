import mongoose from 'mongoose';
import { config } from './index';

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(config.mongodb.uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
  isConnected = false;
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
});
