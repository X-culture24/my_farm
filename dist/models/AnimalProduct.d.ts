import mongoose, { Document } from 'mongoose';
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
export declare const AnimalProduct: mongoose.Model<IAnimalProduct, {}, {}, {}, mongoose.Document<unknown, {}, IAnimalProduct, {}, {}> & IAnimalProduct & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=AnimalProduct.d.ts.map