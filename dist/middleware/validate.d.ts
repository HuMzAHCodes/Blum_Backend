import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
/**
 * ── Request Validation Middleware ────────────────────────────
 * Validates request data (body, query, and params) using Zod.
 * Returns formatted validation errors directly to the client.
 */
export declare const validate: (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=validate.d.ts.map