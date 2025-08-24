"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectRedis = exports.getRedisClient = exports.connectRedis = void 0;
const redis_1 = require("redis");
const logger_1 = require("../utils/logger");
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
let redisClient;
const connectRedis = async () => {
    try {
        redisClient = (0, redis_1.createClient)({
            url: REDIS_URL,
            socket: {
                reconnectStrategy: (retries) => {
                    if (retries > 10) {
                        logger_1.logger.error('Redis max reconnection attempts reached');
                        return new Error('Max reconnection attempts reached');
                    }
                    return Math.min(retries * 100, 3000);
                }
            }
        });
        redisClient.on('error', (err) => {
            logger_1.logger.error('Redis Client Error:', err);
        });
        redisClient.on('connect', () => {
            logger_1.logger.info('Redis Client Connected');
        });
        redisClient.on('ready', () => {
            logger_1.logger.info('Redis Client Ready');
        });
        redisClient.on('end', () => {
            logger_1.logger.warn('Redis Client Disconnected');
        });
        await redisClient.connect();
        // Test connection
        await redisClient.ping();
        logger_1.logger.info('Redis connection established successfully');
    }
    catch (error) {
        logger_1.logger.error('Failed to connect to Redis:', error);
        throw error;
    }
};
exports.connectRedis = connectRedis;
const getRedisClient = () => {
    if (!redisClient) {
        throw new Error('Redis client not initialized. Call connectRedis() first.');
    }
    return redisClient;
};
exports.getRedisClient = getRedisClient;
const disconnectRedis = async () => {
    try {
        if (redisClient) {
            await redisClient.quit();
            logger_1.logger.info('Redis connection closed');
        }
    }
    catch (error) {
        logger_1.logger.error('Error closing Redis connection:', error);
    }
};
exports.disconnectRedis = disconnectRedis;
// Graceful shutdown
process.on('SIGTERM', async () => {
    await (0, exports.disconnectRedis)();
});
process.on('SIGINT', async () => {
    await (0, exports.disconnectRedis)();
});
exports.default = exports.getRedisClient;
//# sourceMappingURL=redis.js.map