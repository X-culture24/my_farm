import mongoose, { Document, Schema } from 'mongoose';

export interface IAnimalProduct extends Document {
  updateInventoryAfterSale(quantity: number, price: number): Promise<IAnimalProduct>;
  farm: mongoose.Types.ObjectId;
  livestock?: mongoose.Types.ObjectId;
  productType: 'milk' | 'eggs' | 'meat' | 'wool' | 'honey' | 'cheese' | 'yogurt' | 'butter' | 'other';
  name: string;
  description: string;
  quantity: {
    amount: number;
    unit: 'kg' | 'lbs' | 'liters' | 'gallons' | 'pieces' | 'dozens';
  };
  quality: {
    grade: 'A' | 'B' | 'C' | 'premium' | 'standard' | 'economy';
    certification: string[];
    inspectionDate: Date;
    inspector: string;
  };
  production: {
    date: Date;
    batchNumber: string;
    processingMethod: string;
    expiryDate: Date;
    storageConditions: string;
  };
  pricing: {
    costPrice: number;
    sellingPrice: number;
    currency: string;
    marketPrice: number;
    lastUpdated: Date;
  };
  inventory: {
    available: number;
    reserved: number;
    sold: number;
    minimumStock: number;
    reorderPoint: number;
  };
  sales: {
    totalSold: number;
    totalRevenue: number;
    averagePrice: number;
    lastSaleDate?: Date;
  };
  status: 'available' | 'reserved' | 'sold' | 'expired' | 'recalled';
  images: string[];
  tags: string[];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const animalProductSchema = new Schema<IAnimalProduct>({
  farm: {
    type: Schema.Types.ObjectId,
    ref: 'Farm',
    required: true
  },
  livestock: {
    type: Schema.Types.ObjectId,
    ref: 'Livestock'
  },
  productType: {
    type: String,
    enum: ['milk', 'eggs', 'meat', 'wool', 'honey', 'cheese', 'yogurt', 'butter', 'other'],
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  quantity: {
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      enum: ['kg', 'lbs', 'liters', 'gallons', 'pieces', 'dozens'],
      required: true
    }
  },
  quality: {
    grade: {
      type: String,
      enum: ['A', 'B', 'C', 'premium', 'standard', 'economy'],
      default: 'standard'
    },
    certification: [{
      type: String,
      enum: ['organic', 'free-range', 'grass-fed', 'hormone-free', 'antibiotic-free', 'gmo-free']
    }],
    inspectionDate: {
      type: Date,
      default: Date.now
    },
    inspector: {
      type: String,
      required: true
    }
  },
  production: {
    date: {
      type: Date,
      required: true
    },
    batchNumber: {
      type: String,
      required: true,
      unique: true
    },
    processingMethod: {
      type: String,
      required: true
    },
    expiryDate: {
      type: Date,
      required: true
    },
    storageConditions: {
      type: String,
      required: true
    }
  },
  pricing: {
    costPrice: {
      type: Number,
      required: true,
      min: 0
    },
    sellingPrice: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    marketPrice: {
      type: Number,
      min: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  inventory: {
    available: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    reserved: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    sold: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    minimumStock: {
      type: Number,
      required: true,
      min: 0,
      default: 10
    },
    reorderPoint: {
      type: Number,
      required: true,
      min: 0,
      default: 5
    }
  },
  sales: {
    totalSold: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    totalRevenue: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    averagePrice: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    lastSaleDate: Date
  },
  status: {
    type: String,
    enum: ['available', 'reserved', 'sold', 'expired', 'recalled'],
    default: 'available'
  },
  images: [String],
  tags: [String],
  notes: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
animalProductSchema.index({ farm: 1 });
animalProductSchema.index({ livestock: 1 });
animalProductSchema.index({ productType: 1 });
animalProductSchema.index({ status: 1 });
animalProductSchema.index({ batchNumber: 1 }, { unique: true });
animalProductSchema.index({ 'production.expiryDate': 1 });
animalProductSchema.index({ 'inventory.available': 1 });
animalProductSchema.index({ name: 'text', description: 'text' });

// Virtual for total inventory
animalProductSchema.virtual('totalInventory').get(function() {
  return this.inventory.available + this.inventory.reserved;
});

// Virtual for profit margin
animalProductSchema.virtual('profitMargin').get(function() {
  if (this.pricing.costPrice === 0) return 0;
  return ((this.pricing.sellingPrice - this.pricing.costPrice) / this.pricing.costPrice) * 100;
});

// Virtual for days until expiry
animalProductSchema.virtual('daysUntilExpiry').get(function() {
  const today = new Date();
  const expiry = new Date(this.production.expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for stock status
animalProductSchema.virtual('stockStatus').get(function() {
  if (this.inventory.available <= this.inventory.reorderPoint) return 'low';
  if (this.inventory.available <= this.inventory.minimumStock) return 'critical';
  return 'healthy';
});

// Pre-save validation
animalProductSchema.pre('save', function(next) {
  if (this.production.date > new Date()) {
    next(new Error('Production date cannot be in the future'));
  }
  
  if (this.production.expiryDate <= this.production.date) {
    next(new Error('Expiry date must be after production date'));
  }
  
  if (this.pricing.sellingPrice < this.pricing.costPrice) {
    next(new Error('Selling price cannot be less than cost price'));
  }
  
  next();
});

// Method to update inventory after sale
animalProductSchema.methods.updateInventoryAfterSale = function(quantity: number, price: number) {
  if (this.inventory.available < quantity) {
    throw new Error('Insufficient inventory');
  }
  
  this.inventory.available -= quantity;
  this.inventory.sold += quantity;
  this.sales.totalSold += quantity;
  this.sales.totalRevenue += quantity * price;
  this.sales.averagePrice = this.sales.totalRevenue / this.sales.totalSold;
  this.sales.lastSaleDate = new Date();
  
  if (this.inventory.available === 0) {
    this.status = 'sold';
  }
  
  return this.save();
};

export const AnimalProduct = mongoose.model<IAnimalProduct>('AnimalProduct', animalProductSchema);
