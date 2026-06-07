import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/auth.js";
export declare const getWishlist: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const addItem: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const removeItem: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=wishlist.controller.d.ts.map