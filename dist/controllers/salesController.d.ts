import { Request, Response } from 'express';
export declare class SalesController {
    static createSale(req: Request, res: Response): Promise<void>;
    static getFarmSales(req: Request, res: Response): Promise<void>;
    static getSaleById(req: Request, res: Response): Promise<void>;
    static updateSaleStatus(req: Request, res: Response): Promise<void>;
    static addPayment(req: Request, res: Response): Promise<void>;
    static getSalesAnalytics(req: Request, res: Response): Promise<void>;
    static cancelSale(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=salesController.d.ts.map