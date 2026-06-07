import admin from "../lib/firebase.js";
import prisma from "../lib/prisma.js";
import { UnauthorizedError } from "../lib/errors.js";
/**
 * ── Verify Firebase Token Middleware ─────────────────────────
 * Decodes the Bearer token from the Authorization header
 * and attaches the decoded Firebase user payload to req.firebaseUser.
 */
export const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedError("Access denied: No token provided");
        }
        const token = authHeader.split(" ")[1];
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.firebaseUser = decodedToken;
        next();
    }
    catch (error) {
        console.error("[Auth Middleware] Firebase token verification failed:", error);
        next(new UnauthorizedError("Access denied: Invalid or expired token"));
    }
};
/**
 * ── Require Authentication Middleware ─────────────────────────
 * Requires both a valid Firebase token and a corresponding user record
 * in the MySQL database. Attaches the database user object to req.user.
 */
export const requireAuth = async (req, res, next) => {
    // First run token verification
    await verifyToken(req, res, async (authError) => {
        if (authError) {
            return next(authError);
        }
        try {
            const firebaseUid = req.firebaseUser?.uid;
            if (!firebaseUid) {
                throw new UnauthorizedError("Access denied: Missing user identity");
            }
            // Query for the user record in MySQL
            const dbUser = await prisma.user.findUnique({
                where: { id: firebaseUid },
            });
            if (!dbUser) {
                throw new UnauthorizedError("Access denied: User profile not synced. Please register or login again.");
            }
            req.user = dbUser;
            next();
        }
        catch (error) {
            next(error);
        }
    });
};
/**
 * ── Optional Authentication Middleware ─────────────────────────
 * Attempts to verify a token if present, but does not block request if missing or invalid.
 */
export const optionalAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next();
    }
    await verifyToken(req, res, async (authError) => {
        if (authError) {
            return next(); // Proceed without req.user
        }
        try {
            const firebaseUid = req.firebaseUser?.uid;
            if (firebaseUid) {
                const dbUser = await prisma.user.findUnique({
                    where: { id: firebaseUid },
                });
                if (dbUser) {
                    req.user = dbUser;
                }
            }
        }
        catch (error) {
            // Proceed without req.user on database failure
        }
        next();
    });
};
//# sourceMappingURL=auth.js.map