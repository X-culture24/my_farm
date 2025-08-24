"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
// POST /api/auth/register
router.post('/register', authController_1.AuthController.register);
// POST /api/auth/login
router.post('/login', authController_1.AuthController.login);
// POST /api/auth/logout
router.post('/logout', authController_1.AuthController.logout);
// GET /api/auth/profile
router.get('/profile', auth_1.authMiddleware, authController_1.AuthController.getProfile);
exports.default = router;
//# sourceMappingURL=auth.js.map