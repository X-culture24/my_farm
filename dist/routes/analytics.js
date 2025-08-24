"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// GET /api/analytics
router.get('/', (req, res) => {
    res.json({ message: 'Get analytics data endpoint' });
});
// GET /api/analytics/sales
router.get('/sales', (req, res) => {
    res.json({ message: 'Get sales analytics endpoint' });
});
// GET /api/analytics/production
router.get('/production', (req, res) => {
    res.json({ message: 'Get production analytics endpoint' });
});
exports.default = router;
//# sourceMappingURL=analytics.js.map