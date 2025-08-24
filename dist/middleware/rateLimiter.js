"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = exports.authRateLimiterMiddleware = exports.rateLimiterMiddleware = void 0;
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
// Rate limiter for general API requests
const rateLimiter = new rate_limiter_flexible_1.RateLimiterMemory({
    points: 100, // Number of requests
    duration: 60, // Per 60 seconds
});
// Rate limiter for authentication requests
const authRateLimiter = new rate_limiter_flexible_1.RateLimiterMemory({
    points: 5, // Number of requests
    duration: 300, // Per 5 minutes
});
const rateLimiterMiddleware = async (req, res, next) => {
    try {
        await rateLimiter.consume(req.ip || 'unknown');
        next();
    }
    catch (rejRes) {
        const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
        res.set('Retry-After', String(secs));
        res.status(429).json({
            success: false,
            error: 'Too many requests, please try again later.'
        });
    }
};
exports.rateLimiterMiddleware = rateLimiterMiddleware;
exports.rateLimiter = exports.rateLimiterMiddleware;
const authRateLimiterMiddleware = async (req, res, next) => {
    try {
        await authRateLimiter.consume(req.ip || 'unknown');
        next();
    }
    catch (rejRes) {
        const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
        res.set('Retry-After', String(secs));
        res.status(429).json({
            success: false,
            error: 'Too many authentication attempts, please try again later.'
        });
    }
};
exports.authRateLimiterMiddleware = authRateLimiterMiddleware;
//# sourceMappingURL=rateLimiter.js.map