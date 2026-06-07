import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.js";
export declare const handleGetAllOrders: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const handleUpdateOrderStatus: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=orders.controller.d.ts.map