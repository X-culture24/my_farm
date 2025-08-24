"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// GET /api/weather
router.get('/', (req, res) => {
    res.json({ message: 'Get weather data endpoint' });
});
// GET /api/weather/forecast
router.get('/forecast', (req, res) => {
    res.json({ message: 'Get weather forecast endpoint' });
});
// GET /api/weather/current
router.get('/current', (req, res) => {
    res.json({ message: 'Get current weather endpoint' });
});
exports.default = router;
//# sourceMappingURL=weather.js.map