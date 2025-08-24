"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// GET /api/users
router.get('/', (req, res) => {
    res.json({ message: 'Get users endpoint' });
});
// GET /api/users/:id
router.get('/:id', (req, res) => {
    res.json({ message: `Get user ${req.params.id} endpoint` });
});
// POST /api/users
router.post('/', (req, res) => {
    res.json({ message: 'Create user endpoint' });
});
// PUT /api/users/:id
router.put('/:id', (req, res) => {
    res.json({ message: `Update user ${req.params.id} endpoint` });
});
// DELETE /api/users/:id
router.delete('/:id', (req, res) => {
    res.json({ message: `Delete user ${req.params.id} endpoint` });
});
exports.default = router;
//# sourceMappingURL=users.js.map