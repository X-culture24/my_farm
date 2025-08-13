import mongoose, { Document, Schema } from 'mongoose';

export interface ILivestock extends Document {
  farm: mongoose.Types.ObjectId;
  animalType: 'cattle' | 'pigs' | 'sheep' | 'goats' | 'poultry' | 'horses' | 'other';
  breed: string;
  tagNumber: string;
  gender: 'male' | 'female';
  dateOfBirth: Date;
  weight: {
    current: number;
    unit: 'kg' | 'lbs';
    lastUpdated: Date;
  };
  health: {
    status: 'healthy' | 'sick' | 'injured' | 'quarantine';
    vaccinations: Array<{
      name: string;
      date: Date;
      nextDue: Date;
      administeredBy: string;
    }>;
    medicalHistory: Array<{
      date: Date;
      condition: string;
      treatment: string;
      veterinarian: string;
      notes: string;
    }>;
    lastHealthCheck: Date;
  };
  breeding: {
    status: 'not-breeding' | 'pregnant' | 'lactating' | 'dry';
    pregnancyDate?: Date;
    expectedCalvingDate?: Date;
    lastBreedingDate?: Date;
    sire?: string;
  };
  location: {
    pasture: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  feeding: {
    diet: string;
    dailyRation: number;
    unit: 'kg' | 'lbs';
    lastFed: Date;
  };
  production: {
    milkProduction?: {
      dailyAverage: number;
      unit: 'liters' | 'gallons';
      lastMilking: Date;
    };
    eggProduction?: {
      dailyAverage: number;
      lastCollection: Date;
    };
  };
  status: 'active' | 'sold' | 'deceased' | 'transferred';
  purchaseInfo?: {
    date: Date;
    price: number;
    seller: string;
    source: string;
  };
  saleInfo?: {
    date: Date;
    price: number;
    buyer: string;
    destination: string;
  };
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const livestockSchema = new Schema<ILivestock>({
  farm: {
    type: Schema.Types.ObjectId,
    ref: 'Farm',
    required: true
  },
  animalType: {
    type: String,
    enum: ['cattle', 'pigs', 'sheep', 'goats', 'poultry', 'horses', 'other'],
    required: true
  },
  breed: {
    type: String,
    required: true,
    trim: true
  },
  tagNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  weight: {
    current: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      enum: ['kg', 'lbs'],
      default: 'kg'
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  health: {
    status: {
      type: String,
      enum: ['healthy', 'sick', 'injured', 'quarantine'],
      default: 'healthy'
    },
    vaccinations: [{
      name: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        required: true
      },
      nextDue: {
        type: Date,
        required: true
      },
      administeredBy: {
        type: String,
        required: true
      }
    }],
    medicalHistory: [{
      date: {
        type: Date,
        required: true
      },
      condition: {
        type: String,
        required: true
      },
      treatment: {
        type: String,
        required: true
      },
      veterinarian: {
        type: String,
        required: true
      },
      notes: String
    }],
    lastHealthCheck: {
      type: Date,
      default: Date.now
    }
  },
  breeding: {
    status: {
      type: String,
      enum: ['not-breeding', 'pregnant', 'lactating', 'dry'],
      default: 'not-breeding'
    },
    pregnancyDate: Date,
    expectedCalvingDate: Date,
    lastBreedingDate: Date,
    sire: String
  },
  location: {
    pasture: {
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
  feeding: {
    diet: {
      type: String,
      required: true
    },
    dailyRation: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      enum: ['kg', 'lbs'],
      default: 'kg'
    },
    lastFed: {
      type: Date,
      default: Date.now
    }
  },
  production: {
    milkProduction: {
      dailyAverage: {
        type: Number,
        min: 0
      },
      unit: {
        type: String,
        enum: ['liters', 'gallons']
      },
      lastMilking: Date
    },
    eggProduction: {
      dailyAverage: {
        type: Number,
        min: 0
      },
      lastCollection: Date
    }
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'deceased', 'transferred'],
    default: 'active'
  },
  purchaseInfo: {
    date: Date,
    price: {
      type: Number,
      min: 0
    },
    seller: String,
    source: String
  },
  saleInfo: {
    date: Date,
    price: {
      type: Number,
      min: 0
    },
    buyer: String,
    destination: String
  },
  notes: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
livestockSchema.index({ farm: 1 });
livestockSchema.index({ tagNumber: 1 }, { unique: true });
livestockSchema.index({ animalType: 1 });
livestockSchema.index({ status: 1 });
livestockSchema.index({ 'health.status': 1 });
livestockSchema.index({ 'breeding.status': 1 });
livestockSchema.index({ 'location.coordinates': '2dsphere' });

// Virtual for age
livestockSchema.virtual('age').get(function() {
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Virtual for weight in kg
livestockSchema.virtual('weightInKg').get(function() {
  if (this.weight.unit === 'kg') return this.weight.current;
  return this.weight.current * 0.453592; // Convert lbs to kg
});

// Pre-save validation
livestockSchema.pre('save', function(next) {
  if (this.dateOfBirth > new Date()) {
    next(new Error('Date of birth cannot be in the future'));
  }
  
  if (this.breeding.status === 'pregnant' && !this.breeding.pregnancyDate) {
    next(new Error('Pregnancy date is required when breeding status is pregnant'));
  }
  
  next();
});

export const Livestock = mongoose.model<ILivestock>('Livestock', livestockSchema);
