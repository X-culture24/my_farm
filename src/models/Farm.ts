import mongoose, { Document, Schema } from 'mongoose';

export interface IFarm extends Document {
  name: string;
  owner: mongoose.Types.ObjectId;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  size: {
    totalAcres: number;
    cultivatedAcres: number;
    pastureAcres: number;
  };
  soilType: string[];
  climateZone: string;
  waterSource: string[];
  infrastructure: {
    irrigation: boolean;
    greenhouses: boolean;
    storage: boolean;
    processing: boolean;
  };
  certifications: string[];
  status: 'active' | 'inactive' | 'maintenance';
  createdAt: Date;
  updatedAt: Date;
}

const farmSchema = new Schema<IFarm>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  owner: {
    type: Schema.Types.ObjectId,
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
farmSchema.virtual('cultivationPercentage').get(function() {
  if (this.size.totalAcres === 0) return 0;
  return Math.round((this.size.cultivatedAcres / this.size.totalAcres) * 100);
});

// Pre-save validation
farmSchema.pre('save', function(next) {
  if (this.size.cultivatedAcres + this.size.pastureAcres > this.size.totalAcres) {
    next(new Error('Cultivated and pasture acres cannot exceed total acres'));
  }
  next();
});

export const Farm = mongoose.model<IFarm>('Farm', farmSchema);
