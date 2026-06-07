import { ForbiddenError } from "../lib/errors.js";
/**
 * Restricts endpoint access to Admin accounts only.
 * Must be used after requireAuth middleware.
 */
export const adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== "ADMIN") {
        return next(new ForbiddenError("Access denied: Admin privileges required"));
    }
    next();
};
//# sourceMappingURL=adminOnly.js.map