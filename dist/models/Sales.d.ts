import mongoose, { Document } from 'mongoose';
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
export declare const Sales: ISalesModel;
//# sourceMappingURL=Sales.d.ts.map