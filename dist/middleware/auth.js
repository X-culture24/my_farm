"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = exports.farmAccessMiddleware = exports.roleMiddleware = exports.optionalAuthMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const logger_1 = require("../utils/logger");
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Check if user still exists
        const user = await User_1.User.findById(decoded.userId).select('-password');
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Token is valid but user no longer exists.'
            });
            return;
        }
        // Check if user is active
        if (!user.isActive) {
            res.status(401).json({
                success: false,
                message: 'User account is deactivated.'
            });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        logger_1.logger.error('Authentication error:', error);
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({
                success: false,
                message: 'Invalid token.'
            });
        }
        else if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(401).json({
                success: false,
                message: 'Token expired.'
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: 'Internal server error during authentication.'
            });
        }
    }
};
exports.authMiddleware = authMiddleware;
const optionalAuthMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (token) {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            const user = await User_1.User.findById(decoded.userId).select('-password');
            if (user && user.isActive) {
                req.user = user;
            }
        }
        next();
    }
    catch (error) {
        // For optional auth, we just continue without setting req.user
        next();
    }
};
exports.optionalAuthMiddleware = optionalAuthMiddleware;
const roleMiddleware = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Authentication required.'
            });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: 'Access denied. Insufficient permissions.'
            });
            return;
        }
        next();
    };
};
exports.roleMiddleware = roleMiddleware;
const farmAccessMiddleware = async (req, res, next) => {
    try {
        const farmId = req.params.farmId || req.body.farmId;
        if (!farmId) {
            res.status(400).json({
                success: false,
                message: 'Farm ID is required.'
            });
            return;
        }
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Authentication required.'
            });
            return;
        }
        // Check if user owns the farm or has access to it
        const hasAccess = req.user.farms.includes(farmId) || req.user.role === 'admin';
        if (!hasAccess) {
            res.status(403).json({
                success: false,
                message: 'Access denied. You do not have permission to access this farm.'
            });
            return;
        }
        next();
    }
    catch (error) {
        logger_1.logger.error('Farm access middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during farm access validation.'
        });
    }
};
exports.farmAccessMiddleware = farmAccessMiddleware;
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (error) {
        throw error;
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=auth.js.map