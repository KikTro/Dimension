import { PrismaClient } from "../../../node_modules/@prisma/client";
import path from "path";
import fs from "fs";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Robust path resolution for shared SQLite database
let dbPath = path.resolve(process.cwd(), "prisma", "dimension.db");
if (!fs.existsSync(dbPath)) {
  dbPath = path.resolve(process.cwd(), "..", "prisma", "dimension.db");
}
if (!fs.existsSync(dbPath)) {
  dbPath = "/Users/kiktro/Documents/Dimension/prisma/dimension.db";
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: `file:${dbPath}`,
      },
    },
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
