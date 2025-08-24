import express from 'express';

const router = express.Router();

// GET /api/farms
router.get('/', (req, res) => {
  res.json({ message: 'Get farms endpoint' });
});

// GET /api/farms/:id
router.get('/:id', (req, res) => {
  res.json({ message: `Get farm ${req.params.id} endpoint` });
});

// POST /api/farms
router.post('/', (req, res) => {
  res.json({ message: 'Create farm endpoint' });
});

// PUT /api/farms/:id
router.put('/:id', (req, res) => {
  res.json({ message: `Update farm ${req.params.id} endpoint` });
});

// DELETE /api/farms/:id
router.delete('/:id', (req, res) => {
  res.json({ message: `Delete farm ${req.params.id} endpoint` });
});

export default router;
