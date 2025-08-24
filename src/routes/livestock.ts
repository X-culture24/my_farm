import express from 'express';

const router = express.Router();

// GET /api/livestock
router.get('/', (req, res) => {
  res.json({ message: 'Get livestock endpoint' });
});

// GET /api/livestock/:id
router.get('/:id', (req, res) => {
  res.json({ message: `Get livestock ${req.params.id} endpoint` });
});

// POST /api/livestock
router.post('/', (req, res) => {
  res.json({ message: 'Create livestock endpoint' });
});

// PUT /api/livestock/:id
router.put('/:id', (req, res) => {
  res.json({ message: `Update livestock ${req.params.id} endpoint` });
});

// DELETE /api/livestock/:id
router.delete('/:id', (req, res) => {
  res.json({ message: `Delete livestock ${req.params.id} endpoint` });
});

export default router;
