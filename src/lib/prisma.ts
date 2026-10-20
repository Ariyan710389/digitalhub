import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Ensure Supabase connection pooler uses transaction mode (port 6543) with pgbouncer flags
let databaseUrl = process.env.DATABASE_URL || "";
if (databaseUrl.includes(".pooler.supabase.com:5432")) {
  databaseUrl = databaseUrl.replace(":5432", ":6543");
  if (!databaseUrl.includes("pgbouncer=true")) {
    databaseUrl += databaseUrl.includes("?")
      ? "&pgbouncer=true&connection_limit=3"
      : "?pgbouncer=true&connection_limit=3";
  }
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: databaseUrl ? { db: { url: databaseUrl } } : undefined,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
