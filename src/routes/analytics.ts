import express from 'express';

const router = express.Router();

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

export default router;
