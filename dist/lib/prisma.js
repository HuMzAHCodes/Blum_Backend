import { PrismaClient } from "@prisma/client";
// ── Prisma singleton ──────────────────────────────────────────
// A single PrismaClient instance is reused across the app.
// Creating multiple instances causes connection pool exhaustion.
const createPrismaClient = () => {
    return new PrismaClient({
        log: process.env.NODE_ENV === "development"
            ? ["query", "error", "warn"]
            : ["error"],
    });
};
const globalWithPrisma = globalThis;
const prisma = globalWithPrisma.prisma ?? createPrismaClient();
if (process.env.NODE_ENV === "development") {
    globalWithPrisma.prisma = prisma;
}
export default prisma;
//# sourceMappingURL=prisma.js.map