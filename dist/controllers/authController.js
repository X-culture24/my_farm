"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const logger_1 = require("../utils/logger");
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
class AuthController {
    // Register new user
    static async register(req, res) {
        try {
            const { username, email, password, firstName, lastName, role } = req.body;
            // Check if user already exists
            const existingUser = await User_1.User.findOne({
                $or: [{ email }, { username }]
            });
            if (existingUser) {
                res.status(400).json({
                    success: false,
                    message: 'User with this email or username already exists'
                });
                return;
            }
            // Create new user
            const user = new User_1.User({
                username,
                email,
                password,
                firstName,
                lastName,
                role: role || 'worker'
            });
            await user.save();
            // Generate JWT token
            const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
            // Remove password from response
            const userResponse = {
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                isActive: user.isActive,
                createdAt: user.createdAt
            };
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    user: userResponse,
                    token
                }
            });
        }
        catch (error) {
            logger_1.logger.error('Error registering user:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to register user',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    // Login user
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            // Find user by email
            const user = await User_1.User.findOne({ email }).select('+password');
            if (!user) {
                res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
                return;
            }
            // Check password
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
                return;
            }
            // Update last login
            user.lastLogin = new Date();
            await user.save();
            // Generate JWT token
            const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
            // Remove password from response
            const userResponse = {
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                isActive: user.isActive,
                lastLogin: user.lastLogin
            };
            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    user: userResponse,
                    token
                }
            });
        }
        catch (error) {
            logger_1.logger.error('Error logging in user:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to login',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    // Logout user
    static async logout(req, res) {
        try {
            // In a real app, you might want to blacklist the token
            res.status(200).json({
                success: true,
                message: 'Logout successful'
            });
        }
        catch (error) {
            logger_1.logger.error('Error logging out user:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to logout',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    // Get current user profile
    static async getProfile(req, res) {
        try {
            const userId = req.user?.userId;
            const user = await User_1.User.findById(userId);
            if (!user) {
                res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
                return;
            }
            const userResponse = {
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                isActive: user.isActive,
                lastLogin: user.lastLogin,
                createdAt: user.createdAt
            };
            res.status(200).json({
                success: true,
                data: userResponse
            });
        }
        catch (error) {
            logger_1.logger.error('Error getting user profile:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get profile',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map