import { Router } from 'express';
import { SalesController } from '../controllers/salesController';
import { authMiddleware, roleMiddleware } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Create a new sale
router.post('/', SalesController.createSale);

// Get all sales for a specific farm
router.get('/farm/:farmId', SalesController.getFarmSales);

// Get sale by ID
router.get('/:saleId', SalesController.getSaleById);

// Update sale status
router.patch('/:saleId/status', SalesController.updateSaleStatus);

// Add payment to sale
router.post('/:saleId/payment', SalesController.addPayment);

// Get sales analytics for a farm
router.get('/farm/:farmId/analytics', SalesController.getSalesAnalytics);

// Cancel sale
router.patch('/:saleId/cancel', SalesController.cancelSale);

export default router;
