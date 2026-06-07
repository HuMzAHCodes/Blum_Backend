import { Request, Response, NextFunction } from "express";
import admin from "../lib/firebase.js";
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        name: string | null;
        avatar: string | null;
        role: "CUSTOMER" | "ADMIN";
        createdAt: Date;
        updatedAt: Date;
    };
    firebaseUser?: admin.auth.DecodedIdToken;
}
/**
 * ── Verify Firebase Token Middleware ─────────────────────────
 * Decodes the Bearer token from the Authorization header
 * and attaches the decoded Firebase user payload to req.firebaseUser.
 */
export declare const verifyToken: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * ── Require Authentication Middleware ─────────────────────────
 * Requires both a valid Firebase token and a corresponding user record
 * in the MySQL database. Attaches the database user object to req.user.
 */
export declare const requireAuth: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map