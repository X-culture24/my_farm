"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimalProduct = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const animalProductSchema = new mongoose_1.Schema({
    farm: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Farm',
        required: true
    },
    livestock: {
        type: mongoose_1.Schema.Types.ObjectId,
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
animalProductSchema.virtual('totalInventory').get(function () {
    return this.inventory.available + this.inventory.reserved;
});
// Virtual for profit margin
animalProductSchema.virtual('profitMargin').get(function () {
    if (this.pricing.costPrice === 0)
        return 0;
    return ((this.pricing.sellingPrice - this.pricing.costPrice) / this.pricing.costPrice) * 100;
});
// Virtual for days until expiry
animalProductSchema.virtual('daysUntilExpiry').get(function () {
    const today = new Date();
    const expiry = new Date(this.production.expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});
// Virtual for stock status
animalProductSchema.virtual('stockStatus').get(function () {
    if (this.inventory.available <= this.inventory.reorderPoint)
        return 'low';
    if (this.inventory.available <= this.inventory.minimumStock)
        return 'critical';
    return 'healthy';
});
// Pre-save validation
animalProductSchema.pre('save', function (next) {
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
animalProductSchema.methods.updateInventoryAfterSale = function (quantity, price) {
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
exports.AnimalProduct = mongoose_1.default.model('AnimalProduct', animalProductSchema);
//# sourceMappingURL=AnimalProduct.js.map