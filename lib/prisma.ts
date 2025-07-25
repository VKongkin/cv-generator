import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"],
    // The connection URL is set via DATABASE_PRISMA_DATABASE_URL in the environment
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
