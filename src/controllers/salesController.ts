import { Request, Response } from 'express';
import { Sales } from '../models/Sales';
import { AnimalProduct } from '../models/AnimalProduct';
import { logger } from '../utils/logger';
import { io } from '../server';

export class SalesController {
  // Create a new sale
  static async createSale(req: Request, res: Response): Promise<void> {
    try {
      const { farmId, customer, items, orderDetails, payment, totals, notes } = req.body;

      // Validate farm access
      if (!req.user.farms.includes(farmId) && req.user.role !== 'admin') {
        res.status(403).json({
          success: false,
          message: 'Access denied to this farm'
        });
        return;
      }

      // Generate order number
      const orderNumber = await Sales.generateOrderNumber();

      // Create sale record
      const sale = new Sales({
        farm: farmId,
        customer,
        items,
        orderDetails: {
          ...orderDetails,
          orderNumber
        },
        payment,
        totals,
        notes
      });

      await sale.save();

      // Update inventory for each item
      for (const item of items) {
        if (item.productType === 'animal') {
          const product = await AnimalProduct.findById(item.product);
          if (product) {
            await product.updateInventoryAfterSale(item.quantity, item.unitPrice);
          }
        }
        // Add similar logic for farm products
      }

      // Emit real-time update
      io.to(`farm-${farmId}`).emit('sale-created', {
        saleId: sale._id,
        orderNumber: sale.orderDetails.orderNumber,
        total: sale.totals.total
      });

      logger.info(`Sale created: ${orderNumber} for farm ${farmId}`);

      res.status(201).json({
        success: true,
        message: 'Sale created successfully',
        data: sale
      });

    } catch (error) {
      logger.error('Error creating sale:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create sale',
        error: error.message
      });
    }
  }

  // Get all sales for a farm
  static async getFarmSales(req: Request, res: Response): Promise<void> {
    try {
      const { farmId } = req.params;
      const { page = 1, limit = 10, status, startDate, endDate, customerType } = req.query;

      // Validate farm access
      if (!req.user.farms.includes(farmId) && req.user.role !== 'admin') {
        res.status(403).json({
          success: false,
          message: 'Access denied to this farm'
        });
        return;
      }

      // Build query
      const query: any = { farm: farmId };
      
      if (status) query.status = status;
      if (customerType) query['customer.customerType'] = customerType;
      if (startDate || endDate) {
        query['orderDetails.orderDate'] = {};
        if (startDate) query['orderDetails.orderDate'].$gte = new Date(startDate as string);
        if (endDate) query['orderDetails.orderDate'].$lte = new Date(endDate as string);
      }

      // Execute query with pagination
      const sales = await Sales.find(query)
        .sort({ 'orderDetails.orderDate': -1 })
        .limit(Number(limit) * 1)
        .skip((Number(page) - 1) * Number(limit))
        .populate('items.product', 'name description');

      const total = await Sales.countDocuments(query);

      res.status(200).json({
        success: true,
        data: sales,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / Number(limit)),
          totalSales: total,
          hasNext: Number(page) * Number(limit) < total,
          hasPrev: Number(page) > 1
        }
      });

    } catch (error) {
      logger.error('Error fetching farm sales:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch sales',
        error: error.message
      });
    }
  }

  // Get sale by ID
  static async getSaleById(req: Request, res: Response): Promise<void> {
    try {
      const { saleId } = req.params;

      const sale = await Sales.findById(saleId)
        .populate('items.product', 'name description price')
        .populate('farm', 'name location');

      if (!sale) {
        res.status(404).json({
          success: false,
          message: 'Sale not found'
        });
        return;
      }

      // Validate farm access
      if (!req.user.farms.includes(sale.farm.toString()) && req.user.role !== 'admin') {
        res.status(403).json({
          success: false,
          message: 'Access denied to this sale'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: sale
      });

    } catch (error) {
      logger.error('Error fetching sale:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch sale',
        error: error.message
      });
    }
  }

  // Update sale status
  static async updateSaleStatus(req: Request, res: Response): Promise<void> {
    try {
      const { saleId } = req.params;
      const { status, notes } = req.body;

      const sale = await Sales.findById(saleId);

      if (!sale) {
        res.status(404).json({
          success: false,
          message: 'Sale not found'
        });
        return;
      }

      // Validate farm access
      if (!req.user.farms.includes(sale.farm.toString()) && req.user.role !== 'admin') {
        res.status(403).json({
          success: false,
          message: 'Access denied to this sale'
        });
        return;
      }

      // Update status
      await sale.updateStatus(status);
      
      if (notes) {
        sale.notes = notes;
        await sale.save();
      }

      // Emit real-time update
      io.to(`farm-${sale.farm}`).emit('sale-status-updated', {
        saleId: sale._id,
        orderNumber: sale.orderDetails.orderNumber,
        status: sale.status
      });

      logger.info(`Sale status updated: ${sale.orderDetails.orderNumber} to ${status}`);

      res.status(200).json({
        success: true,
        message: 'Sale status updated successfully',
        data: sale
      });

    } catch (error) {
      logger.error('Error updating sale status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update sale status',
        error: error.message
      });
    }
  }

  // Add payment to sale
  static async addPayment(req: Request, res: Response): Promise<void> {
    try {
      const { saleId } = req.params;
      const { amount, method, transactionId } = req.body;

      const sale = await Sales.findById(saleId);

      if (!sale) {
        res.status(404).json({
          success: false,
          message: 'Sale not found'
        });
        return;
      }

      // Validate farm access
      if (!req.user.farms.includes(sale.farm.toString()) && req.user.role !== 'admin') {
        res.status(403).json({
          success: false,
          message: 'Access denied to this sale'
        });
        return;
      }

      // Add payment
      await sale.addPayment(amount, method, transactionId);

      // Emit real-time update
      io.to(`farm-${sale.farm}`).emit('sale-payment-added', {
        saleId: sale._id,
        orderNumber: sale.orderDetails.orderNumber,
        paymentStatus: sale.payment.status,
        paidAmount: sale.payment.paidAmount
      });

      logger.info(`Payment added to sale: ${sale.orderDetails.orderNumber}`);

      res.status(200).json({
        success: true,
        message: 'Payment added successfully',
        data: sale
      });

    } catch (error) {
      logger.error('Error adding payment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add payment',
        error: error.message
      });
    }
  }

  // Get sales analytics
  static async getSalesAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const { farmId } = req.params;
      const { period = 'month' } = req.query;

      // Validate farm access
      if (!req.user.farms.includes(farmId) && req.user.role !== 'admin') {
        res.status(403).json({
          success: false,
          message: 'Access denied to this farm'
        });
        return;
      }

      const now = new Date();
      let startDate: Date;

      switch (period) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'quarter':
          startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      // Aggregate sales data
      const analytics = await Sales.aggregate([
        {
          $match: {
            farm: farmId,
            'orderDetails.orderDate': { $gte: startDate, $lte: now }
          }
        },
        {
          $group: {
            _id: null,
            totalSales: { $sum: 1 },
            totalRevenue: { $sum: '$totals.total' },
            averageOrderValue: { $avg: '$totals.total' },
            totalItems: { $sum: { $size: '$items' } }
          }
        }
      ]);

      // Get top selling products
      const topProducts = await Sales.aggregate([
        {
          $match: {
            farm: farmId,
            'orderDetails.orderDate': { $gte: startDate, $lte: now }
          }
        },
        {
          $unwind: '$items'
        },
        {
          $group: {
            _id: '$items.name',
            totalQuantity: { $sum: '$items.quantity' },
            totalRevenue: { $sum: '$items.totalPrice' }
          }
        },
        {
          $sort: { totalQuantity: -1 }
        },
        {
          $limit: 10
        }
      ]);

      // Get sales by status
      const salesByStatus = await Sales.aggregate([
        {
          $match: {
            farm: farmId,
            'orderDetails.orderDate': { $gte: startDate, $lte: now }
          }
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      res.status(200).json({
        success: true,
        data: {
          period,
          startDate,
          endDate: now,
          summary: analytics[0] || {
            totalSales: 0,
            totalRevenue: 0,
            averageOrderValue: 0,
            totalItems: 0
          },
          topProducts,
          salesByStatus
        }
      });

    } catch (error) {
      logger.error('Error fetching sales analytics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch sales analytics',
        error: error.message
      });
    }
  }

  // Cancel sale
  static async cancelSale(req: Request, res: Response): Promise<void> {
    try {
      const { saleId } = req.params;
      const { reason } = req.body;

      const sale = await Sales.findById(saleId);

      if (!sale) {
        res.status(404).json({
          success: false,
          message: 'Sale not found'
        });
        return;
      }

      // Validate farm access
      if (!req.user.farms.includes(sale.farm.toString()) && req.user.role !== 'admin') {
        res.status(403).json({
          success: false,
          message: 'Access denied to this sale'
        });
        return;
      }

      // Check if sale can be cancelled
      if (['delivered', 'shipped'].includes(sale.status)) {
        res.status(400).json({
          success: false,
          message: 'Cannot cancel sale that has been shipped or delivered'
        });
        return;
      }

      // Update status and add notes
      sale.status = 'cancelled';
      if (reason) {
        sale.notes = reason;
      }

      await sale.save();

      // Emit real-time update
      io.to(`farm-${sale.farm}`).emit('sale-cancelled', {
        saleId: sale._id,
        orderNumber: sale.orderDetails.orderNumber,
        reason
      });

      logger.info(`Sale cancelled: ${sale.orderDetails.orderNumber}`);

      res.status(200).json({
        success: true,
        message: 'Sale cancelled successfully',
        data: sale
      });

    } catch (error) {
      logger.error('Error cancelling sale:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to cancel sale',
        error: error.message
      });
    }
  }
}
