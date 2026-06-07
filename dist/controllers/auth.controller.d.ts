import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/auth.js";
/**
 * ── Sync Firebase User to MySQL Database ──────────────────────
 * Receives the verified Firebase token, extracts profile data,
 * and upserts a corresponding User record in our MySQL database.
 */
export declare const syncUser: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.controller.d.ts.map