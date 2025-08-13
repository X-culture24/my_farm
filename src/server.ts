import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { connectRedis } from './config/redis';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { authMiddleware } from './middleware/auth';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import farmRoutes from './routes/farms';
import cropRoutes from './routes/crops';
import livestockRoutes from './routes/livestock';
import animalProductRoutes from './routes/animalProducts';
import farmProductRoutes from './routes/farmProducts';
import salesRoutes from './routes/sales';
import inventoryRoutes from './routes/inventory';
import weatherRoutes from './routes/weather';
import analyticsRoutes from './routes/analytics';
import notificationRoutes from './routes/notifications';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3001",
  credentials: true
}));
app.use(compression());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(rateLimiter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/farms', authMiddleware, farmRoutes);
app.use('/api/crops', authMiddleware, cropRoutes);
app.use('/api/livestock', authMiddleware, livestockRoutes);
app.use('/api/animal-products', authMiddleware, animalProductRoutes);
app.use('/api/farm-products', authMiddleware, farmProductRoutes);
app.use('/api/sales', authMiddleware, salesRoutes);
app.use('/api/inventory', authMiddleware, inventoryRoutes);
app.use('/api/weather', authMiddleware, weatherRoutes);
app.use('/api/analytics', authMiddleware, analyticsRoutes);
app.use('/api/notifications', authMiddleware, notificationRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);
  
  socket.on('join-farm', (farmId) => {
    socket.join(`farm-${farmId}`);
    logger.info(`Client ${socket.id} joined farm ${farmId}`);
  });
  
  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Start server
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();
    logger.info('Connected to MongoDB');
    
    // Connect to Redis
    await connectRedis();
    logger.info('Connected to Redis');
    
    // Start server
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

startServer();

export { app, io };
