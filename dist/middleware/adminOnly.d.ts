import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth.js";
/**
 * Restricts endpoint access to Admin accounts only.
 * Must be used after requireAuth middleware.
 */
export declare const adminOnly: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=adminOnly.d.ts.map