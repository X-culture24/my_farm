"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
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
exports.default = router;
//# sourceMappingURL=inventory.js.map