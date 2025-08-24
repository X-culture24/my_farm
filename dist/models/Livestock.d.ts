import mongoose, { Document } from 'mongoose';
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
export declare const Livestock: mongoose.Model<ILivestock, {}, {}, {}, mongoose.Document<unknown, {}, ILivestock, {}, {}> & ILivestock & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Livestock.d.ts.map