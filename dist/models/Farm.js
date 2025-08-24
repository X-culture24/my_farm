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
exports.Farm = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const farmSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    location: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        coordinates: {
            latitude: {
                type: Number,
                required: true,
                min: -90,
                max: 90
            },
            longitude: {
                type: Number,
                required: true,
                min: -180,
                max: 180
            }
        }
    },
    size: {
        totalAcres: {
            type: Number,
            required: true,
            min: 0
        },
        cultivatedAcres: {
            type: Number,
            required: true,
            min: 0
        },
        pastureAcres: {
            type: Number,
            required: true,
            min: 0
        }
    },
    soilType: [{
            type: String,
            enum: ['clay', 'loam', 'sandy', 'silt', 'peat', 'chalk', 'other']
        }],
    climateZone: {
        type: String,
        required: true
    },
    waterSource: [{
            type: String,
            enum: ['rainfall', 'irrigation', 'well', 'river', 'lake', 'other']
        }],
    infrastructure: {
        irrigation: {
            type: Boolean,
            default: false
        },
        greenhouses: {
            type: Boolean,
            default: false
        },
        storage: {
            type: Boolean,
            default: false
        },
        processing: {
            type: Boolean,
            default: false
        }
    },
    certifications: [{
            type: String,
            enum: ['organic', 'fair-trade', 'rainforest-alliance', 'usda', 'eu-organic', 'other']
        }],
    status: {
        type: String,
        enum: ['active', 'inactive', 'maintenance'],
        default: 'active'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// Indexes
farmSchema.index({ owner: 1 });
farmSchema.index({ 'location.coordinates': '2dsphere' });
farmSchema.index({ status: 1 });
farmSchema.index({ name: 'text', 'location.city': 'text', 'location.state': 'text' });
// Virtual for total cultivated area percentage
farmSchema.virtual('cultivationPercentage').get(function () {
    if (this.size.totalAcres === 0)
        return 0;
    return Math.round((this.size.cultivatedAcres / this.size.totalAcres) * 100);
});
// Pre-save validation
farmSchema.pre('save', function (next) {
    if (this.size.cultivatedAcres + this.size.pastureAcres > this.size.totalAcres) {
        next(new Error('Cultivated and pasture acres cannot exceed total acres'));
    }
    next();
});
exports.Farm = mongoose_1.default.model('Farm', farmSchema);
//# sourceMappingURL=Farm.js.map