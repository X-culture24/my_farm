import express from 'express';

const router = express.Router();

// GET /api/notifications
router.get('/', (req, res) => {
  res.json({ message: 'Get notifications endpoint' });
});

// GET /api/notifications/:id
router.get('/:id', (req, res) => {
  res.json({ message: `Get notification ${req.params.id} endpoint` });
});

// POST /api/notifications
router.post('/', (req, res) => {
  res.json({ message: 'Create notification endpoint' });
});

// PUT /api/notifications/:id/read
router.put('/:id/read', (req, res) => {
  res.json({ message: `Mark notification ${req.params.id} as read endpoint` });
});

// DELETE /api/notifications/:id
router.delete('/:id', (req, res) => {
  res.json({ message: `Delete notification ${req.params.id} endpoint` });
});

export default router;
