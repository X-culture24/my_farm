import mongoose, { Document } from 'mongoose';
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
export declare const Farm: mongoose.Model<IFarm, {}, {}, {}, mongoose.Document<unknown, {}, IFarm, {}, {}> & IFarm & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Farm.d.ts.map