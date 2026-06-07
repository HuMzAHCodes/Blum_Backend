import { PrismaClient } from "@prisma/client";

// ── Prisma singleton ──────────────────────────────────────────
// A single PrismaClient instance is reused across the app.
// Creating multiple instances causes connection pool exhaustion.

const createPrismaClient = (): PrismaClient => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
  });
};




const globalWithPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

const prisma: PrismaClient =
  globalWithPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV === "development") {
  globalWithPrisma.prisma = prisma;
}

export default prisma;
