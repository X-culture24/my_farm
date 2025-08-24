import express from 'express';

const router = express.Router();

// GET /api/animal-products
router.get('/', (req, res) => {
  res.json({ message: 'Get animal products endpoint' });
});

// GET /api/animal-products/:id
router.get('/:id', (req, res) => {
  res.json({ message: `Get animal product ${req.params.id} endpoint` });
});

// POST /api/animal-products
router.post('/', (req, res) => {
  res.json({ message: 'Create animal product endpoint' });
});

// PUT /api/animal-products/:id
router.put('/:id', (req, res) => {
  res.json({ message: `Update animal product ${req.params.id} endpoint` });
});

// DELETE /api/animal-products/:id
router.delete('/:id', (req, res) => {
  res.json({ message: `Delete animal product ${req.params.id} endpoint` });
});

export default router;
