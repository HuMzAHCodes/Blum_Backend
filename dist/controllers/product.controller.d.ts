import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/auth.js";
export declare const getProducts: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getProductDetail: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const createProduct: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateProduct: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteProduct: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=product.controller.d.ts.map