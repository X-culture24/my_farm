import express from 'express';

const router = express.Router();

// GET /api/inventory
router.get('/', (req, res) => {
  res.json({ message: 'Get inventory endpoint' });
});

// GET /api/inventory/:id
router.get('/:id', (req, res) => {
  res.json({ message: `Get inventory item ${req.params.id} endpoint` });
});

// POST /api/inventory
router.post('/', (req, res) => {
  res.json({ message: 'Create inventory item endpoint' });
});

// PUT /api/inventory/:id
router.put('/:id', (req, res) => {
  res.json({ message: `Update inventory item ${req.params.id} endpoint` });
});

// DELETE /api/inventory/:id
router.delete('/:id', (req, res) => {
  res.json({ message: `Delete inventory item ${req.params.id} endpoint` });
});

export default router;
