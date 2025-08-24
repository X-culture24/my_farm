import express from 'express';

const router = express.Router();

// GET /api/farm-products
router.get('/', (req, res) => {
  res.json({ message: 'Get farm products endpoint' });
});

// GET /api/farm-products/:id
router.get('/:id', (req, res) => {
  res.json({ message: `Get farm product ${req.params.id} endpoint` });
});

// POST /api/farm-products
router.post('/', (req, res) => {
  res.json({ message: 'Create farm product endpoint' });
});

// PUT /api/farm-products/:id
router.put('/:id', (req, res) => {
  res.json({ message: `Update farm product ${req.params.id} endpoint` });
});

// DELETE /api/farm-products/:id
router.delete('/:id', (req, res) => {
  res.json({ message: `Delete farm product ${req.params.id} endpoint` });
});

export default router;
