"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const redis_1 = require("./config/redis");
const logger_1 = require("./utils/logger");
const errorHandler_1 = require("./middleware/errorHandler");
const auth_1 = require("./middleware/auth");
// Import routes
const auth_2 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const farms_1 = __importDefault(require("./routes/farms"));
const crops_1 = __importDefault(require("./routes/crops"));
const livestock_1 = __importDefault(require("./routes/livestock"));
const animalProducts_1 = __importDefault(require("./routes/animalProducts"));
const farmProducts_1 = __importDefault(require("./routes/farmProducts"));
const sales_1 = __importDefault(require("./routes/sales"));
const inventory_1 = __importDefault(require("./routes/inventory"));
const weather_1 = __importDefault(require("./routes/weather"));
const analytics_1 = __importDefault(require("./routes/analytics"));
const notifications_1 = __importDefault(require("./routes/notifications"));
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3001",
        methods: ["GET", "POST"]
    }
});
exports.io = io;
const PORT = process.env.PORT || 3000;
// Basic middleware only for testing
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, cors_1.default)({
    origin: "*",
    credentials: false
}));
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
app.use('/api/auth', auth_2.default);
app.use('/api/users', auth_1.authMiddleware, users_1.default);
app.use('/api/farms', auth_1.authMiddleware, farms_1.default);
app.use('/api/crops', auth_1.authMiddleware, crops_1.default);
app.use('/api/livestock', auth_1.authMiddleware, livestock_1.default);
app.use('/api/animal-products', auth_1.authMiddleware, animalProducts_1.default);
app.use('/api/farm-products', auth_1.authMiddleware, farmProducts_1.default);
app.use('/api/sales', auth_1.authMiddleware, sales_1.default);
app.use('/api/inventory', auth_1.authMiddleware, inventory_1.default);
app.use('/api/weather', auth_1.authMiddleware, weather_1.default);
app.use('/api/analytics', auth_1.authMiddleware, analytics_1.default);
app.use('/api/notifications', auth_1.authMiddleware, notifications_1.default);
// Socket.IO connection handling
io.on('connection', (socket) => {
    logger_1.logger.info(`Client connected: ${socket.id}`);
    socket.on('join-farm', (farmId) => {
        socket.join(`farm-${farmId}`);
        logger_1.logger.info(`Client ${socket.id} joined farm ${farmId}`);
    });
    socket.on('disconnect', () => {
        logger_1.logger.info(`Client disconnected: ${socket.id}`);
    });
});
// Error handling middleware
app.use(errorHandler_1.errorHandler);
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
        await (0, database_1.connectDB)();
        logger_1.logger.info('Connected to MongoDB');
        // Connect to Redis
        await (0, redis_1.connectRedis)();
        logger_1.logger.info('Connected to Redis');
        // Start server
        server.listen(PORT, () => {
            logger_1.logger.info(`Server running on port ${PORT}`);
            logger_1.logger.info(`Environment: ${process.env.NODE_ENV}`);
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
}
// Graceful shutdown
process.on('SIGTERM', () => {
    logger_1.logger.info('SIGTERM received, shutting down gracefully');
    server.close(() => {
        logger_1.logger.info('Process terminated');
        process.exit(0);
    });
});
process.on('SIGINT', () => {
    logger_1.logger.info('SIGINT received, shutting down gracefully');
    server.close(() => {
        logger_1.logger.info('Process terminated');
        process.exit(0);
    });
});
startServer();
//# sourceMappingURL=server.js.map