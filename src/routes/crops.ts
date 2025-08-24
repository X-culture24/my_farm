import express from 'express';

const router = express.Router();

// GET /api/crops
router.get('/', (req, res) => {
  res.json({ message: 'Get crops endpoint' });
});

// GET /api/crops/:id
router.get('/:id', (req, res) => {
  res.json({ message: `Get crop ${req.params.id} endpoint` });
});

// POST /api/crops
router.post('/', (req, res) => {
  res.json({ message: 'Create crop endpoint' });
});

// PUT /api/crops/:id
router.put('/:id', (req, res) => {
  res.json({ message: `Update crop ${req.params.id} endpoint` });
});

// DELETE /api/crops/:id
router.delete('/:id', (req, res) => {
  res.json({ message: `Delete crop ${req.params.id} endpoint` });
});

export default router;
