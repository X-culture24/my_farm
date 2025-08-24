import mongoose, { Document, Schema } from 'mongoose';

export interface ISales extends Document {
  farm: mongoose.Types.ObjectId;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    customerType: 'individual' | 'business' | 'wholesale' | 'retail';
  };
  items: Array<{
    productType: 'farm' | 'animal';
    product: mongoose.Types.ObjectId;
    name: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    totalPrice: number;
    discount: number;
    notes: string;
  }>;
  orderDetails: {
    orderNumber: string;
    orderDate: Date;
    deliveryDate?: Date;
    deliveryMethod: 'pickup' | 'delivery' | 'shipping';
    deliveryAddress?: string;
    deliveryNotes?: string;
  };
  payment: {
    method: 'cash' | 'credit_card' | 'bank_transfer' | 'check' | 'digital_wallet';
    status: 'pending' | 'paid' | 'partial' | 'failed' | 'refunded';
    amount: number;
    currency: string;
    paidAmount: number;
    dueAmount: number;
    paymentDate?: Date;
    transactionId?: string;
  };
  totals: {
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    total: number;
  };
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  notes: string;
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
  addPayment(amount: number, method: string, transactionId?: string): Promise<ISales>;
  updateStatus(newStatus: string): Promise<ISales>;
}

export interface ISalesModel extends mongoose.Model<ISales> {
  generateOrderNumber(): string;
}

const salesSchema = new Schema<ISales>({
  farm: {
    type: Schema.Types.ObjectId,
    ref: 'Farm',
    required: true
  },
  customer: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true
    },
    customerType: {
      type: String,
      enum: ['individual', 'business', 'wholesale', 'retail'],
      default: 'individual'
    }
  },
  items: [{
    productType: {
      type: String,
      enum: ['farm', 'animal'],
      required: true
    },
    product: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'items.productType'
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      required: true
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    discount: {
      type: Number,
      default: 0,
      min: 0
    },
    notes: String
  }],
  orderDetails: {
    orderNumber: {
      type: String,
      required: true,
      unique: true
    },
    orderDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    deliveryDate: Date,
    deliveryMethod: {
      type: String,
      enum: ['pickup', 'delivery', 'shipping'],
      default: 'pickup'
    },
    deliveryAddress: String,
    deliveryNotes: String
  },
  payment: {
    method: {
      type: String,
      enum: ['cash', 'credit_card', 'bank_transfer', 'check', 'digital_wallet'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'partial', 'failed', 'refunded'],
      default: 'pending'
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    paidAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    dueAmount: {
      type: Number,
      required: true,
      min: 0
    },
    paymentDate: Date,
    transactionId: String
  },
  totals: {
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    tax: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    shipping: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    discount: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  notes: String,
  attachments: [String]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
salesSchema.index({ farm: 1 });
salesSchema.index({ 'orderDetails.orderNumber': 1 }, { unique: true });
salesSchema.index({ 'customer.email': 1 });
salesSchema.index({ 'orderDetails.orderDate': 1 });
salesSchema.index({ status: 1 });
salesSchema.index({ 'payment.status': 1 });
salesSchema.index({ 'customer.customerType': 1 });

// Virtual for profit calculation
salesSchema.virtual('profit').get(function() {
  // This would need to be calculated based on cost prices from products
  return this.totals.total - this.totals.subtotal; // Simplified calculation
});

// Virtual for days since order
salesSchema.virtual('daysSinceOrder').get(function() {
  const today = new Date();
  const orderDate = new Date(this.orderDetails.orderDate);
  const diffTime = today.getTime() - orderDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Pre-save validation
salesSchema.pre('save', function(next) {
  // Calculate totals
  let subtotal = 0;
  let totalDiscount = 0;
  
  this.items.forEach(item => {
    subtotal += item.totalPrice;
    totalDiscount += item.discount;
  });
  
  this.totals.subtotal = subtotal;
  this.totals.discount = totalDiscount;
  this.totals.total = subtotal + this.totals.tax + this.totals.shipping - totalDiscount;
  
  // Update payment due amount
  this.payment.dueAmount = this.totals.total - this.payment.paidAmount;
  
  // Validate payment amounts
  if (this.payment.paidAmount > this.totals.total) {
    next(new Error('Paid amount cannot exceed total amount'));
  }
  
  next();
});

// Method to add payment
salesSchema.methods.addPayment = function(amount: number, method: string, transactionId?: string) {
  this.payment.paidAmount += amount;
  this.payment.paymentDate = new Date();
  this.payment.transactionId = transactionId;
  
  if (this.payment.paidAmount >= this.totals.total) {
    this.payment.status = 'paid';
    this.status = 'confirmed';
  } else if (this.payment.paidAmount > 0) {
    this.payment.status = 'partial';
  }
  
  return this.save();
};

// Method to update status
salesSchema.methods.updateStatus = function(newStatus: string) {
  this.status = newStatus;
  
  if (newStatus === 'delivered') {
    this.orderDetails.deliveryDate = new Date();
  }
  
  return this.save();
};

// Static method to generate order number
salesSchema.statics.generateOrderNumber = function() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `ORD${year}${month}${day}${random}`;
};

export const Sales = mongoose.model<ISales, ISalesModel>('Sales', salesSchema);
