import "server-only";

import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { PrismaClient } from "./generated/prisma/client";

neonConfig.webSocketConstructor = ws;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to use Prisma.");
}

const globalForPrisma = globalThis as unknown as {
  portfolioPrisma?: PrismaClient;
};

const adapter = new PrismaNeon({ connectionString: databaseUrl });

export const prisma =
  globalForPrisma.portfolioPrisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.portfolioPrisma = prisma;
}
