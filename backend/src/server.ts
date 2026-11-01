import express from 'express';
import http from 'http';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { config } from './config';
import { connectDB } from './config/database';
import apiRoutes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';
import { initSocketIO } from './sockets/socketHandler';

const app = express();
const server = http.createServer(app);

// Initialize Real-Time Socket.IO
initSocketIO(server);

// Security & Utility Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: [config.cors.frontendUrl, config.cors.adminUrl, 'http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  })
);

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (config.env === 'development') {
  app.use(morgan('dev'));
}

// Serve uploaded images statically
app.use('/uploads', express.static(path.resolve(config.upload.dir)));

// Global API rate limiting
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date(), service: 'mango-papaya-store-api' });
});

// Mount Main API Routes
app.use('/api', apiRoutes);

// 404 Fallback
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Cannot ${req.method} ${req.originalUrl}` });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    server.listen(config.port, () => {
      console.log(`🚀 Fresh Mango & Papaya Store API running on port ${config.port} in [${config.env}] mode`);
      console.log(`📡 Real-Time Socket.IO initialized`);
      console.log(`🛒 Ready for customer & admin traffic`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export { app, server };
