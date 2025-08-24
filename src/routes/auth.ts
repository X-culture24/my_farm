import express from 'express';
import { authRateLimiterMiddleware } from '../middleware/rateLimiter';
import { authMiddleware } from '../middleware/auth';
import { AuthController } from '../controllers/authController';

const router = express.Router();

// POST /api/auth/register
router.post('/register', AuthController.register);

// POST /api/auth/login
router.post('/login', AuthController.login);

// POST /api/auth/logout
router.post('/logout', AuthController.logout);

// GET /api/auth/profile
router.get('/profile', authMiddleware, AuthController.getProfile);

export default router;
