import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}
export declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const optionalAuthMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const roleMiddleware: (roles: string[]) => (req: Request, res: Response, next: NextFunction) => void;
export declare const farmAccessMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const generateToken: (userId: string) => string;
export declare const verifyToken: (token: string) => any;
//# sourceMappingURL=auth.d.ts.map