import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.js";
export declare const handleGetOrder: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const handleGetUserOrders: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=query.controller.d.ts.map