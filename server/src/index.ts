import express from 'express';
import cors from 'cors';
import { config } from './config';
import { connectDB } from './config/database';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/authRoutes';
import studentRoutes from './routes/studentRoutes';
import assessmentRoutes from './routes/assessmentRoutes';
import topicRoutes from './routes/topicRoutes';
import resourceRoutes from './routes/resourceRoutes';
import learningPathRoutes from './routes/learningPathRoutes';
import progressRoutes from './routes/progressRoutes';
import recommendationRoutes from './routes/recommendationRoutes';
import aiRoutes from './routes/aiRoutes';

const app = express();

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.endsWith('.vercel.app') ||
      (process.env.CLIENT_URL && origin === process.env.CLIENT_URL)
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Health check (does not require DB connection)
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    isVercel: process.env.VERCEL === '1'
  });
});

// Ensure DB connection for API requests
app.use(async (req, res, next) => {
  if (process.env.VERCEL === '1' && (!config.mongodbUri || config.mongodbUri.includes('127.0.0.1'))) {
    return res.status(503).json({
      success: false,
      error: 'MongoDB is not configured on Vercel. Please add MONGODB_URI (e.g. MongoDB Atlas connection string) to your Vercel Project Environment Variables.'
    });
  }

  try {
    await connectDB();
    next();
  } catch (error: any) {
    console.error('Database connection failed:', error?.message);
    res.status(503).json({
      success: false,
      error: `Database connection failed: ${error?.message || 'Unable to reach MongoDB'}. Check MONGODB_URI in Vercel.`
    });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/learning-path', learningPathRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/ai', aiRoutes);

// Error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(config.port, () => {
      console.log(`\n🚀 NOMAD server running on port ${config.port} in ${config.nodeEnv} mode`);
      console.log(`📡 API: http://localhost:${config.port}/api`);
      console.log(`💚 Health: http://localhost:${config.port}/api/health\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Only listen directly when not running in Vercel serverless environment
if (process.env.VERCEL !== '1' && !process.env.NOW_REGION) {
  startServer();
}

export default app;
// @ts-ignore CommonJS export compatibility
module.exports = app;
// @ts-ignore
module.exports.default = app;

