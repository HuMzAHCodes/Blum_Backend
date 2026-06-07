import { Request, Response, NextFunction } from "express";
/**
 * ── Global Express Error Handler Middleware ───────────────────
 * Intercepts all errors thrown in routes or controllers,
 * formats them consistently, and sends the response.
 */
export declare const errorHandler: (error: Error, req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=errorHandler.d.ts.map