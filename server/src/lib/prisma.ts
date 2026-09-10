import { PrismaClient } from "@prisma/client";

// ts-node-dev hot-reloads src/index.ts on every save. Without this guard,
// every reload would create a brand new PrismaClient (and a brand new pool
// of DB connections) without ever closing the old one, which exhausts
// Postgres's connection limit within a few minutes of local development.
// Caching the client on `globalThis` in development means the same
// instance survives across reloads.

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
