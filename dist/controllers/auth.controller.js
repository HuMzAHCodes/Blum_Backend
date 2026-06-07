import prisma from "../lib/prisma.js";
import { BadRequestError } from "../lib/errors.js";
/**
 * ── Sync Firebase User to MySQL Database ──────────────────────
 * Receives the verified Firebase token, extracts profile data,
 * and upserts a corresponding User record in our MySQL database.
 */
export const syncUser = async (req, res, next) => {
    try {
        const firebaseUser = req.firebaseUser;
        if (!firebaseUser) {
            throw new BadRequestError("Missing user details from Firebase token");
        }
        const { uid, email, name, picture } = firebaseUser;
        if (!email) {
            throw new BadRequestError("User email address is required for profile sync");
        }
        // Upsert the user into the database
        // Reuses the Firebase uid as the primary key id
        const user = await prisma.user.upsert({
            where: { id: uid },
            update: {
                email,
                name: name || email.split("@")[0], // Fallback to email username if name is empty
                avatar: picture || null,
            },
            create: {
                id: uid,
                email,
                name: name || email.split("@")[0],
                avatar: picture || null,
                password: "FIREBASE_EXTERNAL_AUTH", // Placeholder since validation is handled by Firebase
            },
        });
        res.status(200).json({
            status: "success",
            message: "User profile synchronized successfully",
            data: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                role: user.role,
                createdAt: user.createdAt,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=auth.controller.js.map