import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/auth.js";
export declare const getCart: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const addItem: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateQuantity: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const removeItem: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const clearCart: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=cart.controller.d.ts.map