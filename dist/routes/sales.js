"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const salesController_1 = require("../controllers/salesController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Apply authentication middleware to all routes
router.use(auth_1.authMiddleware);
// Create a new sale
router.post('/', salesController_1.SalesController.createSale);
// Get all sales for a specific farm
router.get('/farm/:farmId', salesController_1.SalesController.getFarmSales);
// Get sale by ID
router.get('/:saleId', salesController_1.SalesController.getSaleById);
// Update sale status
router.patch('/:saleId/status', salesController_1.SalesController.updateSaleStatus);
// Add payment to sale
router.post('/:saleId/payment', salesController_1.SalesController.addPayment);
// Get sales analytics for a farm
router.get('/farm/:farmId/analytics', salesController_1.SalesController.getSalesAnalytics);
// Cancel sale
router.patch('/:saleId/cancel', salesController_1.SalesController.cancelSale);
exports.default = router;
//# sourceMappingURL=sales.js.map