import express from 'express';

const router = express.Router();

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

export default router;
